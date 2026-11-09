const db = require('../config/db');

const User = {
    // Get user profile by cID
    getUserProfile: (cID, callback) => {
        const sql = "SELECT * FROM Customer WHERE cID = ?";
        db.query(sql, [cID], callback);
    },

    // Update user profile
    updateUserProfile: (cID, data, callback) => {
        const sql = `
            UPDATE Customer 
            SET phoneNo = ?, cAddress = ?, cFirstName = ?, cLastName = ?, cGender = ?, cBirthDate = ?, cPicture = ? 
            WHERE cID = ?
        `;
        const values = [
            data.phoneNo,
            data.cAddress,
            data.cFirstName,
            data.cLastName,
            data.cGender,
            data.cBirthDate,
            data.cPicture,
            cID
        ];
        db.query(sql, values, callback);
    }
};

module.exports = User;
