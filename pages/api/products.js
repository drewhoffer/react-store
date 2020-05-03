import products from '../../static/products.json';
import connectDB from '../../utils/connectDb';
import Product from '../../models/Product';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
    const { page, size, sort } = req.query;
    const pageNum = Number(page);
    const pageSize = Number(size);
    let products = [];
    const totalDocs = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocs / pageSize); //means no remainders will be left out 
    //we want to get page one if the sort has changed
    if (pageNum === 1) {
        if(sort ==="low"){
            products = await Product.find()
            .sort({price: "asc"})
            .limit(pageSize)
        }else if (sort === "high"){
            products = await Product.find()
            .sort({price: "desc"})
            .limit(pageSize)
        }else{
            products = await Product.find()
            .sort({name: "asc"})
            .limit(pageSize);
        }
    } else {
        const skips = pageSize * (pageNum - 1);
        if(sort ==="low"){
            products = await Product.find()
            .skip(skips)
            .sort({price: "asc"})
            .limit(pageSize)
        }else if (sort === "high"){
            products = await Product.find()
            .skip(skips)
            .sort({price: "desc"})
            .limit(pageSize)
        }else{
            products = await Product.find()
            .skip(skips)
            .sort({name: "asc"})
            .limit(pageSize);
        }
    }
    res.status(200).json({products, totalPages, sort, page});
}