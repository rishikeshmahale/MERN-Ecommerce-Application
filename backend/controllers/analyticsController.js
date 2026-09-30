const Order = require("../model/Order.js");
const Product = require("../model/Product.js");
const User = require("../model/User.js");


const getAdminStats = async (req, res) => {
    try{

        const totalOrders = await Order.countDocuments({});
        const totalProducts= await Product.countDocuments({});
        const totalUsers = await User.countDocuments({ role : "user"});

        const orders = await Order.find({});

        if(!orders){
            return res.status(404).json({message : "No orders found"});
        }

        const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

        return res.status(200).json({ totalOrders, totalProducts, totalUsers, totalRevenue })

    }catch(error){
        return res.status(500).json({message : error.message});
    }
}


module.exports = { getAdminStats };


