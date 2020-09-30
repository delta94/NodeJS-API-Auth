const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const { MONGO_URL } = require("./config");
const accessToken = require("./routes/accessToken");

// Middlewares
app.use(express.json());

// Connect to DB
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/user", accessToken);

app.listen(3000, () => console.log("Server is running"));
