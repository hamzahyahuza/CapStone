// ---------------------------
// index.js (server)
// ---------------------------

// 1. Import dependencies
import express from "express";   // Web framework
import path from "path";         // Helps work with file paths
import { fileURLToPath } from "url"; // Needed to use __dirname in ES modules

// 2. Setup app
const app = express();
const port = 3000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. Middlewares
app.use(express.static("public"));              // Serve static files (CSS, JS, images)
app.set("view engine", "ejs");                  // Set EJS as template engine
app.use(express.json());                        // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));// Parse form data

// ---------------------------
// Fake "database"
// ---------------------------
// Just an array for now. In real apps, you'd use MongoDB/Postgres.
let posts = [
  { id: 1, title: "First Post", content: "Welcome to my blog!", createdAt: new Date() },
  { id: 2, title: "Second Post", content: "Learning EJS is fun!", createdAt: new Date() }
];

// ---------------------------
// Routes
// ---------------------------

// GET / → homepage with posts
app.get("/", (req, res) => {
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);
  res.render("index", { posts: sortedPosts });
});

// POST /posts → add a new post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  if (title && content) {
    const newPost = {
      id: posts.length + 1, // Simple ID (incremental)
      title,
      content,
      createdAt: new Date() // Save timestamp
    };

    posts.push(newPost);
    res.json({ message: "Post added successfully!", post: newPost });
  } else {
    res.status(400).json({ message: "Title and content are required." });
  }
});

// PATCH /posts/:id → update a post
app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  let post = posts.find(p => p.id == id);
  if (post) {
    if (title) post.title = title;
    if (content) post.content = content;
    res.json({ message: "Post updated successfully!", post });
  } else {
    res.status(404).json({ message: "Post not found." });
  }
});

// DELETE /posts/:id → delete a post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  const index = posts.findIndex(p => p.id == id);

  if (index !== -1) {
    posts.splice(index, 1);
    res.json({ message: "Post deleted successfully!" });
  } else {
    res.status(404).json({ message: "Post not found." });
  }
});

// ---------------------------
// Start server
// ---------------------------
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
