const dao 			        =   require('./alert.dao');
const token 				=   require('../../../utility/token');
const util 					=	require('../../../utility/util');

module.exports.getAlert = async (data) => {
    try {
        const alerts = await dao.getAlerts(data);
        if (alerts) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(alerts)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch(e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
