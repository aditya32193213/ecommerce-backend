import Favorite from "../models/favoriteModel.js";

// Add Products to the favourites
export const addToFavorites = async (req, res)=>{
    const {productId} =req.body;
    const favItem =new Favorite({ productId });
    await favItem.save();
    res.status(201).json({message:"Product Added to the favorite"})
};

//Get all favorite items                      
export const getFavorites =async (req, res) =>{
    const favorites= await Favorite.find().populate("productId");
    res.json(favorites);
}  

