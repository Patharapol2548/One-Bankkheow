const db = require('../config/db');

const Log = {
    updateLastLogin: (userName, callback) => {
        const sql = "UPDATE AdminLoginInfo SET loginLog = NOW() WHERE userName = ?";
        db.query(sql, [userName], callback);
    }
};

module.exports = Log;