const db = require('../config/db');

const Auth = {
    findAdmin: (userName, password, callback) => {
        const sql = "SELECT * FROM AdminLoginInfo WHERE userName = ? AND password = ?";
        db.query(sql, [userName, password], callback);
    },

    findCustomer: (cEmail, cPassword, callback) => {
        const sql = "SELECT cID, cEmail, cPassword FROM Customer WHERE cEmail = ? AND cPassword = ?";
        db.query(sql, [cEmail, cPassword], callback);
    }
};

module.exports = Auth;