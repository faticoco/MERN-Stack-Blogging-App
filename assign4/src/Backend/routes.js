const express = require("express");
const router = express.Router();
const { Blog, Users, Comment, Rating } = require("../Backend/schema");
const jwt = require("jsonwebtoken");
const requireAdmin = require("./requireAdmin");

require("dotenv").config();
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
};

router.use(cors(corsOptions));

//retrieving list of all blogs
router.get("/Blogs/getall", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Read blogs with pagination
router.get("/Blogs/pages/:page", async (req, res) => {
  const { page } = req.params;
  const blogsPerPage = 5;

  try {
    const skipBlogs = (page - 1) * blogsPerPage;

    const blogs = await Blog.find().skip(skipBlogs).limit(blogsPerPage);

    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Blog users
router.post("/BlogUsers/register", async (req, res) => {
  console.log("registering user");
  const { username, email, password } = req.body;
  const oldUser = await Users.findOne({ email: email });
  if (oldUser) {
    console.log("User already exists");
    res.status(400).json({ error: "User already exists" });
  } else {
    console.log("New user created");

    try {
      const newUser = new Users({ username, email, password });

      const payload = {
        username: username,
        email: email,
        password: password,
      };
      //token is being generated to be used later for login
      const token = jwt.sign(payload, process.env.SECRET);
      newUser.token = token;
      await newUser.save();
      res.status(200).json({
        username: username,
        email: email,
        password: password,
        token: token,
        _id: newUser._id,
      });
    } catch (err) {
      console.log("error", err);
    }
  }
});

//login
router.post("/BlogUsers/login", async (req, res) => {
  console.log("Signing in user");
  const { email, password } = req.body;
  console.log("email is", email);
  const user = await Users.findOne({ email: email });
  if (user) {
    //admin path or user path is decided by sending isadmin
    if (password == "admin") {
      if (user.username == "admin") {
        const token = jwt.sign(
          {
            username: user.username,
            email: user.email,
            password: user.password,
            isAdmin: true,
          },
          process.env.SECRET
        );
        console.log("Admin found");
        res.status(200).json({
          token: token,
          password: password,
          username: user.username,
          email: user.email,
          password: user.password,
          id: user._id,
          isAdmin: true,
        });
      }
    } else {
      console.log("Normal User found");
      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
          password: user.password,
          isAdmin: false,
        },
        process.env.SECRET
      );
      if (user.status == true) {
        res.status(200).json({
          token: token,
          username: user.username,
          email: user.email,
          isAdmin: false,
        });
      } else {
        res.json({ err: "Cannot login: User disabled" });
      }
    }
  } else {
    res.json({ err: "No user found" });
  }
});

//To get one specific user
router.get("/BlogUsers", async (req, res) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token.split(" ")[1], process.env.SECRET, (err, decodedToken) => {
      console.log("token generated ", decodedToken);
      if (err) {
        res.json({ msg: "Invalid token" });
      } else {
        res.json({
          username: decodedToken.username,
          email: decodedToken.email,
          password: decodedToken.password,
        });
      }
    });
  } else {
    res.status(401).json({ err: "No token found" });
  }
});

//update profile user
router.put("/BlogUsers/update", async (req, res) => {
  const { emailoriginal, username, email, password } = req.body;
  console.log(emailoriginal);
  console.log(email);
  const user = await Users.findOne({ email: emailoriginal });
  if (user) {
    //old values are updated with new ones and saved
    user.username = username;
    user.email = email;
    user.password = password;
    await user.save();

    const newToken = jwt.sign(
      { username: user.username, email: user.email, password: user.password },
      process.env.SECRET
    );

    res.json({
      username: user.username,
      email: user.email,
      password: user.password,
      token: newToken,
    });
  } else {
    res.json({ err: "no user found" });
  }
});

//Blogs
//create blog
router.post("/Blog", async (req, res) => {
  const { heading, text, link, creatoremail, creatorusername } = req.body;
  try {
    const newBlog = new Blog({
      heading: heading,
      text: text,
      link: link,
      creatoremail: creatoremail,
      creatorusername: creatorusername,
      creationDate: Date.now(),
    });
    //new blog is created and saved
    console.log(newBlog);
    await newBlog.save();
    res.status(200).json({ newBlog });
  } catch (err) {
    console.log("error", err);
  }
});

//read a specific blog
router.get("/Blog/:id", async (req, res) => {
  console.log("getting blog");
  const { id } = req.params;
  try {
    const get = await Blog.findById(id);
    res.status(200).json({
      link: get.link,
      heading: get.heading,
      text: get.text,
      creatorusername: get.creatorusername,
    });
  } catch (err) {
    console.log("error", err);
  }
});

//delete a blog
router.delete("/Blog/:id", async (req, res) => {
  console.log("deleting blog");
  const { id } = req.params;
  const { creatoremail, creatorusername } = req.body;

  try {
    const blog_del = await Blog.findById(id);
    //checking if the blog that is to be deleted is from the user that is trying to delete ie by the owner only
    if (
      blog_del.creatoremail == creatoremail &&
      blog_del.creatorusername == creatorusername
    ) {
      const del = await Blog.findByIdAndDelete(id);
      res.status(200).json({ del });
    } else {
      res.status(400).json({ msg: "Cannot delete" });
    }
  } catch (err) {
    console.log("error", err);
  }
});

// Update a blog
router.put("/Blog/:id", async (req, res) => {
  console.log("updating blog");
  const { id } = req.params;
  const { heading, text, link, creatoremail, creatorusername } = req.body;

  try {
    const blog = await Blog.findById(id);
    //checking if teh update request is sent by the owner of te blog
    if (
      blog &&
      blog.creatoremail === creatoremail &&
      blog.creatorusername === creatorusername
    ) {
      blog.heading = heading;
      blog.text = text;
      blog.link = link;

      await blog.save();
      console.log("blog updated successfully");
      res.json({ "updated blog ": blog });
    } else {
      res.status(404).json({ err: "access denied" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

//create Comment
router.post("/Comment", async (req, res) => {
  const { comment, Userid, Blogid } = req.body;
  try {
    const newComment = new Comment({
      Comment: comment,
      Blogid: Blogid,
      Userid: Userid,
    });
    //sending notification to the user on whose post a comment is being added
    const UserCommenting = await Users.findById(Userid);
    const BlogAuthor = await Blog.findById(Blogid);
    const author = BlogAuthor.creatoremail;
    const UserTosendNotification = await Users.findOne({ email: author });

    if (UserTosendNotification && UserCommenting) {
      console.log(newComment.Comment);
      const notificationMessage = `${UserCommenting.username} commented ${comment} on your post ${BlogAuthor.heading}`;
      UserTosendNotification.notifications.push(notificationMessage);
      await UserTosendNotification.save();
    }

    await newComment.save();
    res.status(200).json({ "New comment": newComment });
  } catch (err) {
    console.log("error", err);
  }
});

router.get("/getComments/:Blogid", async (req, res) => {
  const { Blogid } = req.params;
  try {
    const comments = await Comment.find({ Blogid: Blogid });
    var users = []; // Initialize the array

    // Use Promise.all to wait for all promises to resolve
    await Promise.all(
      comments.map(async (element) => {
        users.push(await Users.findById(element.Userid));
      })
    );

    res.status(200).json({ comments, users });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Give rating
router.post("/Rating", async (req, res) => {
  const { rating, Userid, Blogid } = req.body;
  try {
    const alreadyRated = await Rating.findOne({
      Blogid: Blogid,
      Userid: Userid,
    });
    if (alreadyRated) {
      res.json({ err: "already rated" });
    } else {
      const newRating = new Rating({
        rating: rating,
        Blogid: Blogid,
        Userid: Userid,
      });
      console.log(newRating);
      await newRating.save();
      const blog = await Blog.findById(Blogid);
      //calculating average rating

      const ratings = await Rating.find({});
      const filteredRatings = ratings.filter(
        (rating) => rating.Blogid == Blogid
      );
      var totalrating = 0;
      console.log(filteredRatings);
      filteredRatings.forEach((element) => {
        totalrating += element.rating;
      });

      const avgrating = totalrating / filteredRatings.length;
      blog.averageRating = avgrating;
      await blog.save();
      res.status(200).json({ "New Rating": newRating });
    }
  } catch (err) {
    console.log("error", err);
  }
});

//read all blogs by sorting
router.get("/Blogs/sortbyusername", async (req, res) => {
  try {
    //sorting is done in ascending order on basis of creator username
    const totalBlogs = await Blog.find({}).sort({ creatorusername: 1 });

    res.json({
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//read all blogs by filtering by username
router.get("/Blog/filterbyusername/:name", async (req, res) => {
  const { name } = req.params;
  try {
    //name is sent in the request on basis if which filteration is being done
    //all blogs which have the requested creator are retrieved
    const totalBlogs = await Blog.find({ creatorusername: name });
    res.json({
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//read all blogs by filtering by blog post heading
router.get("/Blog/filterbytitle/:heading", async (req, res) => {
  const { heading } = req.params;
  try {
    //all blogs which have the requested heading/title are retrieved
    const totalBlogs = await Blog.find({ heading: heading });
    res.json({
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// User interaction module
// Route to allow a user to follow another blogger
router.post("/BlogUsers/follow/:email", async (req, res) => {
  const { email } = req.params;
  const { user_email } = req.body;

  try {
    const followerUser = await Users.findOne({ email: user_email });
    const followedUser = await Users.findOne({ email });
    console.log(followerUser);
    if (!followerUser || !followedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    //adding the user that sent the follow request to the following of the user getting followed
    if (!followedUser.following.includes(email)) {
      followedUser.following.push(user_email);
      await followedUser.save();

      // Sending notification to the followed user
      const notificationMessage = `${followerUser.username} started following you`;
      followedUser.notifications.push(notificationMessage);
      await followedUser.save();
    }

    res.json({ message: "User followed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
// Route to display a user's feed with posts from followed bloggers
router.get("/BlogUsers/feed/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //showing the posts/ blogs of the followed users on the users feed
    const blogs = await Blog.find({ creatoremail: { $in: user.following } });

    res.json({
      blogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Search functionality
//read all blogs by searching by username or heading
router.get("/Blog/search/:name", async (req, res) => {
  const { name } = req.params;
  try {
    //search by blog
    const totalBlogs = await Blog.find({ creatorusername: name });
    if (totalBlogs.length > 0) {
      res.json({
        totalBlogs,
      });
    } else {
      const totalBlogs = await Blog.find({ heading: name });
      res.json({
        totalBlogs,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//read all blogs by searching by blog post heading
router.get("/Blog/searchheading/:heading", async (req, res) => {
  const { heading } = req.params;
  try {
    const totalBlogs = await Blog.find({ heading: heading });
    res.json({
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Admin operations
//view all users
router.get("/BlogUsers/getall", async (req, res) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      console.log("token generated ", decodedToken);
      if (err) {
        res.json({ msg: "No token generated" });
      } else {
        console.log("here" + decodedToken.username + decodedToken.password);
        if (
          decodedToken.username == "admin" &&
          decodedToken.password == "admin"
        ) {
          const users = await Users.find({});
          if (users) {
            res.json(users);
          } else res.json({ err: "No data found" });
        }
      }
    });
  } else {
    res.json({ err: "No user found" });
  }
});

//disable a user
router.put(
  "/BlogUsers/disable/:disableemail",
  requireAdmin,
  async (req, res) => {
    const { disableemail } = req.params;
    const { password, username } = req.body;
    console.log(password);
    //admin operation is checked
    if (username === "admin" && password === "admin") {
      //if its admin then the user withh the requested email is disabled
      const user = await Users.findOne({ email: disableemail });
      if (user) {
        //user status is set for able or disable
        if (user.status) {
          user.status = false;
        } else {
          user.status = true;
        }
        user.save();
        console.log(user);
        res.json({
          user,
        });
      } else res.json({ err: "No user found" });
    } else {
      res.json({ err: "Access Denied" });
    }
  }
);

//get a specific blog
router.get("/Blog/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (blog) {
    res.json(blog);
  } else {
    res.json({ msg: "Blog does not exist" });
  }
});
//disable specific blog
router.put("/Blog/disable/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  const { password, username } = req.body;
  //admin operation is checked
  if (username == "admin" && password == "admin") {
    if (blog) {
      if (blog.status == true) {
        blog.status = false;
      } else {
        blog.status = true;
      }
      await blog.save();
      res.json(blog);
    } else {
      console.log("Blog does not exist");
    }
  }
});

//get notifications

router.get("/BlogUsers/notifications/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Assuming userId is the _id of the user
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const notifications = user.notifications;

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
