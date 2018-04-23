var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-west-2",
    "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
    "accessKeyId": "AKIAJDMWJ3P63NDAYSWA",
    "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    writeSingleUser: function (User) {

        // var input = {
        //     "email_id": "example-1@gmail.com", "created_by": "clientUser", "created_on": new Date().toString(),
        //     "updated_by": "clientUser", "updated_on": new Date().toString(), "is_deleted": false
        // };

        var returnVal = 0;

        var params = {
            TableName: "User",
            Item: User
        };

        //return doesnt work bcoz of async
        docClient.put(params, function (err, data) {

            if (err) {
                console.log("users::save::error - " + JSON.stringify(err, null, 2));
                returnVal = err.message;
            } else {
                console.log("users::save::success");
                returnVal = 0;
            }
        });

        return returnVal;
        
    }
}