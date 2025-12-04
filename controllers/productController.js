// import Products from "../models/productModel.js";

// //Get all products 
// export const getAllProducts=async (req,res)=>{
//     try{
//         const products= await Products.find();
//         res.json(products);
//     }
//     catch(err){
//         res.status(500).json({message:err.message});
//     }
// };


// //Get Products by Category 
// export const getProductsbyCategory =async (req, res)=>{
//     try{
//         const category= req.params.category;
//         const products =await Products.finds({category});
//         res.json(products);
//     }
//     catch (err){
//         res.status(500).json({message: err.message})
//     }
// }










// src/controllers/productController.js
import Product from "../models/productModel.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  const products = await Product.find().lean();
  res.status(200).json(products);
};

// @desc    Get products by category
// @route   GET /api/products/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  const products = await Product.find({ category }).lean();

  if (!products.length) {
    return res.status(404).json({ message: "No products found for this category" });
  }

  res.status(200).json(products);
};
