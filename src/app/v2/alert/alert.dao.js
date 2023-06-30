const readConn = require('../../../dbconnection').readPool;
const writeConn = require('../../../dbconnection').writePool;
const util = require('../../../utility/util');

module.exports.getAlerts  = async(data) => {
    try {
        // Write your query here
        /* const sql = "SELECT * FROM mst_alert where deleted=0 ORDER BY id DESC"; */
        // To execute query
        /* const [result] = await readConn.query(sql, [data.userid]); */
        // return result
        return [{"version": 2}];
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
