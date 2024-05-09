const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/mentorship");

app.use(bodyParser.json());
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
