import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());




mongoose.connect(process.env.MONGO_URI, { dbName: "n8n" })
  .then(() => console.log("✅ Connected to n8n DB"))
  .catch(err => console.log(err));


const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  flavor: String,
  imagelink: String
});

const Food = mongoose.model("food", foodSchema, "food");

const orderSchema = new mongoose.Schema({
  userName: String,
  foodName: String,
  flavor: String,
  price: Number,
  orderedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("order", orderSchema, "orders");

app.get("/food", async (req, res) => {
  const data = await Food.find();
  res.json(data);
});

app.post("/order", async (req, res) => {
  const { userName, foodName, flavor, price } = req.body;
  const newOrder = new Order({ userName, foodName, flavor, price });
  await newOrder.save();
  res.json({ message: "Order placed successfully!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
