const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = 3000;

mongoose.connect(
  "mongodb+srv://chowdary93:Chowdary143@cluster0.karwxgg.mongodb.net/mentorship"
);
app.get("/", (req, res) => {
  res.send("Welcome to the Mentorship API!");
});

app.use(bodyParser.json());
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
