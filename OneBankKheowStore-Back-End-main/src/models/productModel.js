const db = require('../config/db');


// All query in this file (SQL)
const Product = {
    searchProducts: (filters, callback) => {
        let sql = "SELECT * FROM Product WHERE 1=1";
        let params = [];

        // Dynamic filtering
        if (filters.name) {
            sql += " AND productName LIKE ?";
            params.push(`%${filters.name}%`);
        }

        if (filters.brand) {
            sql += " AND productBrand LIKE ?";
            params.push(`%${filters.brand}%`);
        }

        if (filters.category) {
            sql += " AND productCategory LIKE ?";
            params.push(`%${filters.category}%`);
        }

        db.query(sql, params, callback);
    },

    // Earn (admin) 
    // GET all products
        getAllProducts: (callback) => {
        const sql = "SELECT * FROM Product";
        db.query(sql, callback);
    },
 
    // GET product by ID
    getProductById: (productID, callback) => {
        const sql = "SELECT * FROM Product WHERE productID = ?";
        db.query(sql, [productID], callback);
    },
 
    // POST create new product
    createProduct: (productData, callback) => {
        const sql = `
            INSERT INTO Product (productID, adminID, productName, productAmount, productImage, productBrand, productDetail)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const { productID, adminID, productName, productAmount, productImage, productBrand, productDetail } = productData;
        db.query(sql, [productID, adminID, productName, productAmount, productImage, productBrand, productDetail], callback);
    },
 
    // PUT update product by ID
    updateProduct: (productID, productData, callback) => {
        const sql = `
            UPDATE Product
            SET productName = ?, productAmount = ?, productImage = ?, productBrand = ?, productDetail = ?
            WHERE productID = ?
        `;
        const { productName, productAmount, productImage, productBrand, productDetail } = productData;
        db.query(sql, [productName, productAmount, productImage, productBrand, productDetail, productID], callback);
    },
 
    // DELETE product by ID
    deleteProduct: (productID, callback) => {
        const sql = "DELETE FROM Product WHERE productID = ?";
        db.query(sql, [productID], callback);
    },

    // GET recommended (random) products
    getRecommendedProducts: (limit, callback) => {
        const sql = "SELECT * FROM Product ORDER BY RAND() LIMIT ?";
        db.query(sql, [limit], callback);
    }
};

module.exports = Product;
