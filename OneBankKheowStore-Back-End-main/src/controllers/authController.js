const Auth = require('../models/authModel');
const Log = require('../models/logModel');

// ------------------------------------------------------
// Test Case: 1
// Testing Admin Authentication login succesful
// method: post
// URL: http://localhost:3100/auth/admin/login
// body: raw JSON
// {
//    "userName": "admin01",
//    "password": "admin123"
// }
// ------------------------------------------------------

// ------------------------------------------------------
// Test Case: 2
// Testing Admin Authentication login invalid
// method: post
// URL: http://localhost:3100/auth/admin/login
// body: raw JSON
// {
//    "userName": "user01",
//    "password": "admin123"
// }
// ------------------------------------------------------

const adminLogin = (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    Auth.findAdmin(userName, password, (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(401).json({ error: 1, message: 'Invalid username or password' });
        }
        
        // Update Log
        const currentLoginTime = new Date();

        Log.updateLastLogin(userName, (err) => {
            if(err) throw err;

            // Admin found, return the token for middleware check and allow admin to manage the product.
            const token = 'supersecret';
            return res.send({error: 0, message: 'Login successful.', token: token, LoginTime: currentLoginTime});
        });
    });
};

// ------------------------------------------------------
// Testing customer Authentication login succesful
// method: post
// URL: http://localhost:3100/auth/customer/login
// body: raw JSON
// {
//    "cEmail": "mali@email.com",
//    "cPassword": "pwd002"
// }
// ------------------------------------------------------

const customerLogin = (req, res) => {
    const { cEmail, cPassword } = req.body;

    if (!cEmail || !cPassword) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    Auth.findCustomer(cEmail, cPassword, (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(401).json({ error: 1, message: 'Invalid username or password' });
        }
        const token = 'customer-secret';
        const customer = results[0];
        return res.send({error: 0, message: 'Login successful.', token: token, cID: customer.cID, cEmail: customer.cEmail});
    });
};

module.exports = { adminLogin, customerLogin };
