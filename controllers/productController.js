import Products from "../models/productModel.js";

//Get all products 
export const getAllProducts=async (req,res)=>{
    try{
        const products= await Products.find();
        res.json(products);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};


//Get Products by Category 
export const getProductsbyCategory =async (req, res)=>{
    try{
        const category= req.params.category;
        const products =await Products.finds({category});
        res.json(products);
    }
    catch (err){
        res.status(500).json({message: err.message})
    }
}

