function createDatabaseConnection() {
    var mysql = require('mysql');
    return mysql.createPool({
        connectionLimit: 10,
        host: 'synbotdb.c9iqm406mb34.us-east-1.rds.amazonaws.com',
        port: '3306',
        user: 'admin',
        password: 'VSCode123456',
        database: 'draftdiscordbot',
    });
}

module.exports = {
    createDatabaseConnection: createDatabaseConnection,
};