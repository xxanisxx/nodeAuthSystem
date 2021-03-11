import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

// app config
const app = express();
const port = 3000;

// databse
const users = [];
const posts = [
  { username: "anis", contnet: "post1" },
  { username: "ons", contnet: "post2" },
];

// middleware
app.use(express.json());

// routes
app.get("/posts", authenticateToken, (req, res) => {
  const userPost = posts.filter((post) => post.username === req.user.name);
  res.json(userPost);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users/register", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashPassword };
    users.push(user);
    res.status(201).send(user);
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (!user) return res.status(400).send("User not Found");
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// appp listen
app.listen(port, () => console.log(`[+] Server Start on Port ${port}`));
