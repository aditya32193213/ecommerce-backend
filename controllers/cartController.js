import Cart from "../models/cartModel.js";

//Add all the products 
export const addToCart = async(req ,res)=>{
    const {productId, quantity} = req.body;
    const cartItem= new Cart({productId, quantity});
    await cartItem.save();
    res.status(201).json({message:"Product added to cart"});
};

//Get All cart items
export const getCartItems =async (req, res)=>{
    const items =await Cart.find().populate("productId");
    res.json(items);

};