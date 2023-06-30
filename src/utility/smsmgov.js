const axios = require("axios");
const crypto = require("crypto");
const querystring = require("querystring");

class SMSmgov {
    constructor() {
        this.URL = "";
        this.username = ""; //username of the department
        this.password = ""; //password of the department
        this.senderid = ""; //senderid of the deparment
        this.deptSecureKey = ""; //departsecure key for encryption of message...
        this.encryptedPassword = crypto.createHash('sha1').update(this.password).digest('hex');
    }


    async sendSMS(message, mobileno, smsMsgservicetype, msgTemplateid) {
        let resReturn = {};
        //console.log(message);
        //console.log(mobileno);
        const strKey = this.username.trim() + this.senderid.trim() + message.trim() + this.deptSecureKey.trim();
        const hasKey = crypto.createHash('sha512').update(strKey).digest('hex');
        const data = {
            username: this.username.trim(),
            password: this.encryptedPassword.trim(),
            senderid: this.senderid.trim(),
            content: message.trim(),
            smsservicetype: smsMsgservicetype,
            mobileno: mobileno.trim(),
            key: hasKey.trim(),
            templateid: msgTemplateid
        };

        // console.log('data:'+querystring.stringify(data))

        await axios.post(this.URL, querystring.stringify(data), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'UserAgent': "Mozilla/4.0 (compatible; MSIE 5.0; Windows 98; DigExt)"
            }
        })
            .then((res) => {
                // console.log(`Status: ${res.status}`);
                // console.log('Body: ', res.data);
                resReturn = {
                    status: res.status,
                    body: res.data
                }
            }).catch((err) => {
                console.error(err);
            });
        return resReturn;
    }


    //call method and pass value to otp sms
    async sendOTPsms(messageTemplate, mobileno) {
        // let message = 'Your OTP for Registration with RERA Bihar is ' + otpValue + '. - Bihar Government';
        // console.log(messageTemplate);
        // let otpTemplateid = '1307166141559427866';
        let otpTemplateid = messageTemplate.split('|')[1];
        let message = messageTemplate.split('|')[0];
        let smsMsgservicetype = 'otpmsg';
        if (message.toLowerCase().indexOf('otp') <= -1) {
            smsMsgservicetype = 'singlemsg';
        }
        // console.log('smsMsgservicetype >>>>>>>>>>> ', smsMsgservicetype)
        // let otpTemplateid = '1307161787693394069';
        let resReturn = await this.sendSMS(message, mobileno, smsMsgservicetype, otpTemplateid);
        return resReturn;
    }

}

module.exports = SMSmgov;
