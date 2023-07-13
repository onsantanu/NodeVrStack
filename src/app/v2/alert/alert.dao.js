const execute = require('../../../database/queryExecute');
const util = require('../../../utility/util');

module.exports.getAlerts  = async(data) => {
    try {
        // Write your query here
         const sql = 'SELECT * FROM mst_alert where deleted=0 ORDER BY id DESC';
        // To execute query
         return await execute.readQuery(sql, [data.userid]);
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
