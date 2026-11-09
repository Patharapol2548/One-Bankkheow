const Product = require('../models/productModel');
const axios = require('axios');

// ------------------------------------------------------
// Product/Service Search and Details
// ------------------------------------------------------

// ------------------------------------------------------
// Test Case: 1
// Testing search with NO criteria (return all)
// method: GET
// URL: http://localhost:3100/products/search
// ------------------------------------------------------
// Test Case: 2
// Testing search with MULTIPLE criteria (name + brand + category)
// method: GET
// URL: http://localhost:3100/products/search?name=Pen&brand=Double&category=Stationery
// ------------------------------------------------------

const searchProducts = (req, res) => {
    const filters = {
        name: req.query.name,
        brand: req.query.brand,
        category: req.query.category,
    };

    Product.searchProducts(filters, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 1, message: err.message });
        }

        return res.json({
            error: 0,
            count: results.length,
            data: results
        });
    });
};

// ------------------------------------------------------
// Test Case: 3
// Testing get product detail (public)
// method: GET
// URL: http://localhost:3100/products/P00002
// ------------------------------------------------------

// Test Case: 4
// Testing get product detail NOT FOUND
// method: GET
// URL: http://localhost:3100/products/P99999
// ------------------------------------------------------

const getProductDetail = (req, res) => {
    const { productID } = req.params;

    Product.getProductById(productID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 1, message: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 1, message: 'Product not found.' });
        }

        return res.json({
            error: 0,
            data: results[0]
        });
    });
};

// ------------------------------------------------------
// Product/Service management web service for administrators and 
// all routes require Authorization header with token
// ------------------------------------------------------

// ------------------------------------------------------
// Test Case: 1
// GET all products
// method: GET
// URL: http://localhost:3100/products/admin/
// headers: Authorization: supersecret
// ------------------------------------------------------
 
const getAllProducts = (req, res) => {
    Product.getAllProducts((err, results) => {
        if (err) throw err;
        return res.status(200).json({ error: 0, data: results });
    });
};

// ------------------------------------------------------
// Test Case: 2
// GET product by ID
// method: GET
// URL: http://localhost:3100/products/admin/:productID
// headers: Authorization: supersecret
// ------------------------------------------------------
 
const getProductById = (req, res) => {
    const { productID } = req.params;
 
    Product.getProductById(productID, (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).json({ error: 1, message: 'Product not found.' });
        }
        return res.status(200).json({ error: 0, data: results[0] });
    });
};
 
// ------------------------------------------------------
// Test Case: 3
// POST create new product
// method: POST
// URL: http://localhost:3100/products/admin/
// headers: Authorization: supersecret
// body: raw JSON
// {
//    "productID": "P00011",
//    "adminID": "A001",
//    "productName": "Test Product",
//    "productAmount": 100,
//    "productImage": "https://example.com/image.jpg",
//    "productBrand": "BrandX",
//    "productDetail": "Some detail"
// }
// ------------------------------------------------------
 
const createProduct = (req, res) => {
    const { productID, adminID, productName, productAmount, productImage, productBrand, productDetail } = req.body;
 
    if (!productID || !adminID || !productName || productAmount === undefined || !productImage) {
        return res.status(400).json({ error: 1, message: 'productID, adminID, productName, productAmount and productImage are required.' });
    }
 
    const productData = { productID, adminID, productName, productAmount, productImage, productBrand, productDetail };
 
    Product.createProduct(productData, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 1, message: 'Product ID already exists.' });
            }
            throw err;
        }
        return res.status(201).json({ error: 0, message: 'Product created successfully.', productID });
    });
};
 
// ------------------------------------------------------
// Test Case: 4
// PUT update product
// method: PUT
// URL: http://localhost:3100/products/admin/:productID
// headers: Authorization: supersecret
// body: raw JSON
// {
//    "productName": "Updated Name",
//    "productAmount": 200,
//    "productImage": "https://example.com/newimage.jpg",
//    "productBrand": "NewBrand",
//    "productDetail": "Updated detail"
// }
// ------------------------------------------------------
 
const updateProduct = (req, res) => {
    const { productID } = req.params;
    const { productName, productAmount, productImage, productBrand, productDetail } = req.body;
 
    if (!productName || productAmount === undefined || !productImage) {
        return res.status(400).json({ error: 1, message: 'productName, productAmount and productImage are required.' });
    }
 
    const productData = { productName, productAmount, productImage, productBrand, productDetail };
 
    Product.updateProduct(productID, productData, (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 1, message: 'Product not found.' });
        }
        return res.status(200).json({ error: 0, message: 'Product updated successfully.' });
    });
};
 
// ------------------------------------------------------
// Test Case: 5
// DELETE product
// method: DELETE
// URL: http://localhost:3100/products/admin/:productID
// headers: Authorization: supersecret
// ------------------------------------------------------
 
const deleteProduct = (req, res) => {
    const { productID } = req.params;
 
    Product.deleteProduct(productID, (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 1, message: 'Product not found.' });
        }
        return res.status(200).json({ error: 0, message: 'Product deleted successfully.' });
    });
};

// ------------------------------------------------------
// Recommended Products (Random)
// method: GET
// URL: http://localhost:3100/products/recommend
// Optional query: ?limit=10 (default 10, max 50)
// ------------------------------------------------------

const getRecommendedProducts = (req, res) => {
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 50) limit = 50;
    if (limit < 1) limit = 1;

    Product.getRecommendedProducts(limit, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 1, message: err.message });
        }

        return res.json({
            error: 0,
            count: results.length,
            data: results
        });
    });
};

// ------------------------------------------------------
// Public WebService: Get exchange rate (THB to CNY)
// method: GET
// URL: http://localhost:3100/products/exchange-rate
// ------------------------------------------------------
const getExchangeRate = async (req, res) => {
    try {
        const apiKey = process.env.EXCHANGE_RATE_KEY;
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/THB`;

        const response = await axios.get(url);
        const cnyRate = response.data.conversion_rates.CNY;
        const priceInCNY = (20 * cnyRate).toFixed(2);

        res.json({
            error: 0,
            base: 'THB',
            target: 'CNY',
            rate: cnyRate,
            priceTHB: 20,
            priceCNY: priceInCNY
        });
    } catch (err) {
        console.error("Exchange Rate API Error:", err.message);
        res.status(500).json({ error: 1, message: "Could not fetch exchange rate" });
    }
};

module.exports = { searchProducts, getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductDetail, getRecommendedProducts, getExchangeRate };
