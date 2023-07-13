const readConn = require('../dbconnection').readPool;
const writeConn = require('../dbconnection').writePool;
const util = require('../utility/util');


module.exports.readQuery = async (query, data) => {
    try {
        // To execute query
        const [result] = await readConn.query(query, data);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.writeQuery = async (query, data) => {
    try {
        // To execute query
        const [result] = await writeConn.query(query, data);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}