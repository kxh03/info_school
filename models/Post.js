
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: Object,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
