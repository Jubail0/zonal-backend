import { Product } from "../schema/productSchema.js";
import { Section } from "../schema/sectionSchema.js";
import { catchAsyncError } from "../Middlewares/catchAsyncError.js";



// Get All Sections Data
// const calculateData = async(sections) => {

//     const sectionDetails = await Promise.all(
//         sections.map(async(section) => {
//             const productInSection = await Product.find({
//                 section_Id : section._id
//             }).lean();

//             const numOfProducts = productInSection.length;
//             const totalQuantity = productInSection.reduce((sum,product) => sum + product.quantity, 0);

//             return {
//                 section_id : section._id,
//                 section_name : section.name,
//                 numOfProducts,
//                 totalQuantity
//             }
//         })
 
//     )

//     return sectionDetails;
// }

// export const getAllSections =  catchAsyncError(async(req,res,next) => {

//     const sections = await Section.find({}).lean();
//     // Get all Data
//     const sectionDetails = await calculateData(sections)
//     const numOfSections = sections.length;
//     res.status(200).json({sectionDetails, numOfSections})
// })

// Test//
export const getAllSections =  catchAsyncError(async(req,res,next) => {
 const sectionDetails = await Section.aggregate([
    {
      $lookup: {
        from: "products", // The target collection
        localField: '_id', // The field in the "sections" collection to match
        foreignField: 'section_Id', // The field in the "products" collection to match
        as: 'productsInSection', // The alias for the merged data in the output
      },
    },
    {
      $addFields: {
        section_id: '$_id',
        section_name: '$name',
        numOfProducts: {
          $reduce: {
            input: '$productsInSection',
            initialValue: 0,
            in: { $add: ['$$value', 1] }
          }
        },
        totalQuantity: { $sum: '$productsInSection.quantity' },
      },
    },
  ]);

  res.status(200).json({ sectionDetails });
})
// Test//

// Create Section
export const createSection =  catchAsyncError(async(req,res,next) => {
    const sectionName = req.body.name;
 
    const newSection = await Section.create({
        name:sectionName.toLowerCase()
    })
    await newSection.save()
    res.status(200).json({success:true, message:"New Section created Successfully"})
})

// Change Section Name
export const changeSectionName = catchAsyncError(async(req,res,next) => {
    const sectionId = req.params.id;
    const newSectionName = req.body.name;
    
    await Section.findByIdAndUpdate({_id:sectionId},{name:newSectionName});

    res.status(200).json({success:true,message:"Name updated Successfully"})
    
})

// Delete Section and its all product
export const removeSection = catchAsyncError(async(req,res,next) => {
    const sectionId = req.params.id;
    
    await Product.deleteMany({section_Id:sectionId});
    await Section.findByIdAndDelete({_id:sectionId});

    res.status(200).json({success:true,message:"Deleted Successfully"})
    
})
