
import Post from '../models/Post.js';
import Club from '../models/Club.js';
import User from '../models/User.js';

// Get all posts with proper filtering for visibility and approval status
export const getPosts = async (req, res) => {
  try {
    const query = {};
    
    // If user is not authenticated, only show public and approved posts
    if (!req.user) {
      query.visibility = 'public';
      query.approvalStatus = 'approved';
      query.status = 'published';
    } else {
      // If user is authenticated, they can see all public posts that are approved
      // Or their own posts regardless of approval status
      // Or posts from clubs where they are an admin (they can see pending posts for approval)
      const userClubs = await Club.find({ admins: req.user.id });
      const adminClubIds = userClubs.map(club => club._id);
      
      query.$or = [
        { visibility: 'public', approvalStatus: 'approved', status: 'published' },
        { author: req.user.id },
        { club: { $in: adminClubIds } }
      ];
    }
    
    const posts = await Post.find(query)
      .populate('author', 'username fullName avatar')
      .populate('club', 'name')
      .sort({ createdAt: -1 });
      
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get post by ID with visibility check
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullName avatar')
      .populate('club', 'name admins');
      
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if post should be visible to the user
    if (post.visibility === 'private' && !req.user) {
      return res.status(403).json({ message: 'You need to login to view this post' });
    }
    
    if (post.approvalStatus !== 'approved') {
      // Allow author and club admins to see unapproved posts
      if (!req.user || (req.user.id !== post.author._id.toString() && 
          !post.club.admins.includes(req.user.id))) {
        return res.status(403).json({ message: 'This post is awaiting approval' });
      }
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new post (needs approval if not an admin)
export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, club, status, tags, visibility } = req.body;
    
    // Verify the user is a member of the club
    const clubRecord = await Club.findById(club);
    if (!clubRecord) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    if (!clubRecord.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'You must be a member of this club to create a post' });
    }
    
    // Check if user is an admin of the club - if so, auto-approve
    const isAdmin = clubRecord.admins.includes(req.user.id);
    
    const newPost = new Post({
      title,
      content,
      excerpt,
      coverImage,
      author: req.user.id,
      club,
      status,
      tags,
      visibility,
      approvalStatus: isAdmin ? 'approved' : 'pending'
    });
    
    const post = await newPost.save();
    
    res.json({
      post,
      message: isAdmin 
        ? 'Post created successfully' 
        : 'Post submitted for approval by club admins'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a post (reset approval status if content is changed)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is authorized to update the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    const { title, content, excerpt, coverImage, status, tags, visibility } = req.body;
    
    // Get club to check if user is admin
    const club = await Club.findById(post.club);
    const isAdmin = club.admins.includes(req.user.id);
    
    // Content changes reset approval status for non-admins
    const contentChanged = 
      title !== post.title || 
      JSON.stringify(content) !== JSON.stringify(post.content) || 
      excerpt !== post.excerpt;
    
    const updateData = {
      title,
      content,
      excerpt,
      coverImage,
      status,
      tags,
      visibility,
      updatedAt: Date.now()
    };
    
    // If content changed and user is not admin, reset approval status
    if (contentChanged && !isAdmin) {
      updateData.approvalStatus = 'pending';
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );
    
    res.json({
      post: updatedPost,
      message: contentChanged && !isAdmin 
        ? 'Post updated and submitted for approval' 
        : 'Post updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve or reject a post (admin only)
export const approvePost = async (req, res) => {
  try {
    const { approvalStatus } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is a club admin
    const club = await Club.findById(post.club);
    if (!club.admins.includes(req.user.id)) {
      return res.status(403).json({ message: 'Only club admins can approve posts' });
    }
    
    post.approvalStatus = approvalStatus;
    await post.save();
    
    res.json({ 
      message: `Post ${approvalStatus === 'approved' ? 'approved' : 'rejected'}`,
      post
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending posts for approval (admin only)
export const getPendingPosts = async (req, res) => {
  try {
    // Get clubs where user is admin
    const clubs = await Club.find({ admins: req.user.id });
    const clubIds = clubs.map(club => club._id);
    
    // Find all pending posts for these clubs
    const pendingPosts = await Post.find({ 
      club: { $in: clubIds },
      approvalStatus: 'pending'
    })
    .populate('author', 'username fullName avatar')
    .populate('club', 'name')
    .sort({ createdAt: -1 });
    
    res.json(pendingPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.json({ message: 'Post liked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Post not liked yet' });
    }

    post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
    await post.save();

    res.json({ message: 'Post unliked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is authorized to delete the post
    // Either the author or a club admin can delete
    const club = await Club.findById(post.club);
    const isAuthor = post.author.toString() === req.user.id;
    const isClubAdmin = club.admins.includes(req.user.id);
    
    if (!isAuthor && !isClubAdmin) {
      return res.status(403).json({ message: 'User not authorized to delete this post' });
    }
    
    await post.deleteOne();
    
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
