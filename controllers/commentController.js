
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// Create a comment
export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId
    });

    // Add comment to post's comments
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id }
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username name avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author of the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove comment from post's comments
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
