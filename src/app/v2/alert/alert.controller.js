const express       = require('express');
const router        = express.Router();
const validator     = require('../../../utility/validator');
const model         = require('./alert.model');
const validate      = require('./alert.validation');
const util          = require('../../../utility/util');


router.post('/getAlerts', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getAlertReq(reqData)) {
        const resp = await model.getAlert(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;