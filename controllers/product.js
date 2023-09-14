import { catchAsyncError } from "../Middlewares/catchAsyncError.js";
import ErrorHandler from "../newErrorHandler.js";
import { Product } from "../schema/productSchema.js";
import { Section } from "../schema/sectionSchema.js";

export const getProducts = catchAsyncError(async(req,res,next) => {
    const sectionId =req.params.id;
    let page = parseInt(req.query.p) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const searchQuery = req.query.s || "";
  
    let query = {section_Id:sectionId};

    if(searchQuery) {
        query = {
            ...query,
           size: searchQuery.toUpperCase()
        }
    page = 1
}

    const skip = (page - 1) * limit;
    const query_products = await Product.find(query).skip(skip).limit(limit).lean();

    const allProducts = await Product.find({section_Id:sectionId}).lean();
    const totalProducts = allProducts.length;
    const totalPages = Math.ceil(totalProducts/limit);
    let hasLastPage = totalPages > 1 ? true : false ;

    const totalQuantity = allProducts.reduce((sum,product) => sum + product.quantity, 0);
    // 
    const section = await Section.findById({_id:sectionId});

    res.status(200).json({
      success:true, 
      products:query_products, 
      page,
      totalPages,
      hasLastPage,
      totalProducts,
      totalQuantity,
      section_name:section.name
    })

})

export const createProduct = catchAsyncError(async(req,res,next) => {
    const {size,quantity} = req.body;
    const sectionId = req.params.id;
    
    const product = await Product.find({section_Id:sectionId});

    if (product.some(pro => pro.size.toLowerCase() === size.toLowerCase())) {
        return next(new ErrorHandler("Size already exists!", 422));
    }

    const newProduct = await Product.create({
        section_Id:sectionId,
        size:size.toUpperCase(),
        quantity
    });

    await newProduct.save();
    res.status(200).json({success:true, message:"New Product added successfully"})

})

export const updateProduct = catchAsyncError(async(req,res,next) => {
    const {size,quantity,sectionId} = req.body;
    const productId = req.params.id;

    const product = await Product.find({section_Id:sectionId});

    if (product.some(pro => pro.size.toLowerCase() === size.toLowerCase())) {
        return next(new ErrorHandler("Size already exists!", 422));
    }

    await Product.findByIdAndUpdate({_id:productId},
        {
            size:size?.toUpperCase(),
            quantity
        });
    

    res.status(200).json({success:true, message:"Updated successfully"})

})

export const deleteProduct = catchAsyncError(async(req,res,next) => {
    const productId = req.params.id;
    await Product.findByIdAndDelete({_id:productId});

    res.status(200).json({success:true, message:"Product deleted successfully"})

})


export const printOut = catchAsyncError(async(req,res,next) => {
    const {sectionId} = req.params;
    const {from, to} = req.body.sizes;

    const products = await Product.find({section_Id:sectionId});
    const firstProductIndex = products.findIndex((p)=> p.size.toLowerCase() === from.toLowerCase() );
    const lastProductIndex = products.findIndex((p)=> p.size.toLowerCase() === to.toLowerCase() );

    if(firstProductIndex === -1 || lastProductIndex === -1) return next(
    new ErrorHandler("Product not available"))

    if(firstProductIndex > lastProductIndex || firstProductIndex === lastProductIndex) return next(
    new ErrorHandler("Invalid Input,  first input cannot be equal or less than last input"))

    const updatedProducts = products.slice(firstProductIndex,(lastProductIndex + 1));
    res.status(200).json({updatedProducts})
})

// export const multipleSize = catchAsyncError(async(req,res,next) => {
    
//     const startingSize = 18;
//     const endSize = 293;
//     let products = [];
//     const id ="64f99f9a4213ed37184ad44a"

//     for(let i = startingSize; i<=endSize; i++) {
//         products.push({section_Id:id,size:`C${i}`, quantity:0})
//     }

//     await Product.insertMany(products);
//     res.status(200).json(products)
    
// })




