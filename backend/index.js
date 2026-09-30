const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes.js");

dotenv.config();
connectDB();


app.use(cors(
    {
        origin : ["http://localhost:3000", "http://127.0.0.1:3000", process.env.FRONTEND_URL],
        credentials : true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);



app.get("/", (req, res) => {
    res.json({message : "Backend is working"});
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
}); 
