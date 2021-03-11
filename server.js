import express from "express";
import bcrypt from "bcrypt";

// app config
const app = express();
const port = 3000;

// databse
const users = [];

// middleware
app.use(express.json());

// routes
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
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

// appp listen
app.listen(port, () => console.log(`[+] Server Start on Port ${port}`));
