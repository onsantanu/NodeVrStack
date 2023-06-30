const util = require('../../../utility/util');

module.exports.getAlertReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid === null || data.userid === "") {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid === null || data.reraid === "") {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};