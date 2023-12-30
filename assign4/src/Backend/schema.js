const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: String,
  following: [{ type: String, ref: "BlogUsers" }],
  status: {
    type: Boolean,
    default: true,
  },
  notifications: [{ type: String, ref: "BlogUsers" }],
});

const Users = mongoose.model("BlogUsers", Userschema);

const Blogschema = new mongoose.Schema({
  link: String,
  heading: String,
  text: String,
  creatoremail: String,
  creatorusername: String,
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const Blog = mongoose.model("Blog", Blogschema);

const CommentsSchema = new mongoose.Schema({
  Comment: String,
  Blogid: String,
  Userid: String,
  PostedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = mongoose.model("Comment", CommentsSchema);

const RatingsSchema = new mongoose.Schema({
  rating: Number,
  Blogid: String,
  Userid: String,
  PostedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Rating = mongoose.model("Rating", RatingsSchema);
module.exports = { Blog, Users, Comment, Rating };
