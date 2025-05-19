import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/category";
dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
