const User = require('../models/userModel');

// ------------------------------------------------------
// GET user profile
// method: GET
// URL: http://localhost:3100/user/profile/:cID
// headers: Authorization: customer-secret
// ------------------------------------------------------
const getProfile = (req, res) => {
    const { cID } = req.params;

    User.getUserProfile(cID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 1, message: err.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 1, message: 'User not found.' });
        }

        return res.json({
            error: 0,
            data: results[0]
        });
    });
};

// ------------------------------------------------------
// PUT update user profile
// method: PUT
// URL: http://localhost:3100/user/profile/:cID
// body: raw JSON
// headers: Authorization: customer-secret
// {
//     "phoneNo": "0811234567",
//     "cAddress": "123 New Road, Bangkok   ",
//     "cFirstName": "Somchai",
//     "cLastName": "Saetang",
//     "cGender": "Male",
//     "cBirthDate": "2000-01-01",
//     "cPicture": "c1.jpg"
// }
// ------------------------------------------------------
const updateProfile = (req, res) => {
    const { cID } = req.params;
    const { phoneNo, cAddress, cFirstName, cLastName, cGender, cBirthDate, cPicture } = req.body;

    // Validate required fields (can adjust based on requirements)
    if (!phoneNo || !cAddress || !cFirstName || !cLastName || !cGender || !cPicture) {
        return res.status(400).json({ error: 1, message: 'All fields are required to update profile.' });
    }

    const updateData = { phoneNo, cAddress, cFirstName, cLastName, cGender, cBirthDate, cPicture };

    User.updateUserProfile(cID, updateData, (err, results) => { 
        if (err) {
            return res.status(500).json({ error: 1, message: err.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 1, message: 'User not found.' });
        }

        return res.json({
            error: 0,
            message: 'User profile updated successfully.'
        });
    });
};

module.exports = { getProfile, updateProfile };
