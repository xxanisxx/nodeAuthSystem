import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

// app config
const app = express();
const port = 3000;

// databse
const posts = [
  { username: "anis", contnet: "post1" },
  { username: "ons", contnet: "post2" },
];

// middleware
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// routes
app.get("/posts", authenticateToken, (req, res) => {
  const userPost = posts.filter((post) => post.username === req.user.name);
  res.json({ userPost });
});

// appp listen
app.listen(port, () => console.log(`[+] Server Start on Port ${port}`));
