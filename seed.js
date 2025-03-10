
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Club from './models/Club.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Club.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('All existing data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
};

// Create sample users
const createUsers = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      username: 'johndoe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Computer Science student at University of Tirana',
      university: 'University of Tirana',
      role: 'student'
    },
    {
      username: 'janesmith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'Professor at Polytechnic University of Tirana',
      university: 'Polytechnic University of Tirana',
      role: 'teacher'
    },
    {
      username: 'markwilson',
      email: 'mark.wilson@example.com',
      password: hashedPassword,
      firstName: 'Mark',
      lastName: 'Wilson',
      bio: 'Engineering student passionate about robotics',
      university: 'Epoka University',
      role: 'student'
    }
  ];
  
  try {
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    return createdUsers;
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

// Create sample clubs
const createClubs = async (users) => {
  const clubs = [
    {
      name: 'Coding Club',
      description: 'A club for coding enthusiasts to collaborate on projects, learn new programming languages, and share knowledge about the latest tech trends. We organize weekly coding sessions, hackathons, and invite industry professionals for talks.',
      university: 'University of Tirana',
      admins: [users[0]._id],
      members: [users[0]._id, users[1]._id],
      coverImage: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?auto=format&fit=crop&q=80'
    },
    {
      name: 'Robotics Lab',
      description: 'The Robotics Lab focuses on building and programming robots for various applications. Members work on projects ranging from simple automated systems to complex AI-driven robots. We participate in national and international robotics competitions.',
      university: 'Polytechnic University of Tirana',
      admins: [users[1]._id],
      members: [users[1]._id, users[2]._id],
      coverImage: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80'
    },
    {
      name: 'Debate Society',
      description: 'The Debate Society is a platform for students to develop their public speaking and critical thinking skills. We organize regular debates on current affairs, social issues, and academic topics. All students interested in improving their rhetoric abilities are welcome.',
      university: 'Epoka University',
      admins: [users[2]._id],
      members: [users[0]._id, users[2]._id],
      coverImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80'
    }
  ];
  
  try {
    const createdClubs = await Club.insertMany(clubs);
    console.log(`${createdClubs.length} clubs created`);
    return createdClubs;
  } catch (error) {
    console.error('Error creating clubs:', error);
    process.exit(1);
  }
};

// Create sample posts
const createPosts = async (users, clubs) => {
  const posts = [
    {
      title: 'Welcome to the Coding Club!',
      content: { 
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Hello everyone! We are excited to launch our club\'s online platform. Here we will share updates about our meetings, projects, and events.'
            }
          }
        ]
      },
      excerpt: 'Welcome to our new online platform for the Coding Club.',
      author: users[0]._id,
      club: clubs[0]._id,
      tags: ['welcome', 'introduction'],
      status: 'published',
      approvalStatus: 'approved',
      visibility: 'public'
    },
    {
      title: 'Upcoming Hackathon',
      content: { 
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'We are organizing a 24-hour hackathon next month. The theme will be "Tech for Social Good". Start forming your teams!'
            }
          }
        ]
      },
      excerpt: 'Join our upcoming 24-hour hackathon focused on Tech for Social Good.',
      author: users[0]._id,
      club: clubs[0]._id,
      tags: ['hackathon', 'event'],
      status: 'published',
      approvalStatus: 'approved',
      visibility: 'public'
    },
    {
      title: 'Robot Building Workshop',
      content: { 
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Join us this Saturday for a hands-on workshop where we will build a simple line-following robot. All materials will be provided.'
            }
          }
        ]
      },
      excerpt: 'Learn to build a line-following robot in our weekend workshop.',
      author: users[1]._id,
      club: clubs[1]._id,
      tags: ['workshop', 'robotics'],
      status: 'published',
      approvalStatus: 'approved',
      visibility: 'public'
    }
  ];
  
  try {
    const createdPosts = await Post.insertMany(posts);
    console.log(`${createdPosts.length} posts created`);
    return createdPosts;
  } catch (error) {
    console.error('Error creating posts:', error);
    process.exit(1);
  }
};

// Create sample comments
const createComments = async (users, posts) => {
  const comments = [
    {
      content: 'This is great news! Looking forward to the first meeting.',
      author: users[1]._id,
      post: posts[0]._id
    },
    {
      content: 'Cannot wait for the hackathon! Who wants to team up?',
      author: users[2]._id,
      post: posts[1]._id
    },
    {
      content: 'Will beginners be able to follow along in the workshop?',
      author: users[0]._id,
      post: posts[2]._id
    }
  ];
  
  try {
    const createdComments = await Comment.insertMany(comments);
    console.log(`${createdComments.length} comments created`);
    return createdComments;
  } catch (error) {
    console.error('Error creating comments:', error);
    process.exit(1);
  }
};

// Run the seeding process
const seedDatabase = async () => {
  try {
    //await clearData();
    const users = await createUsers();
    const clubs = await createClubs(users);
    const posts = await createPosts(users, clubs);
    await createComments(users, posts);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
