var mailAuth = require('../mailAuth'); 
var gmailNode = require('gmail-node');


// Message 
var testMessage = {
    to: '8bitgamer80@gmail.com',
    subject: 'Welcome to the Fun',
    message: '<h1>Just a simple test email</h1>'
};




module.exports = { 
    sendMail: function(){
        // ClientSecret: 
        gmailNode.init(mailAuth.clientSecret, './token.json', initComplete);
        
        function initComplete(err, dataObject) {
            if(err){
                console.log('Error ', err);
            }else {        
                gmailNode.sendHTML(testMessage, function (err, data) {
                    console.log(err,data);
                });
            }
        }
    }
}