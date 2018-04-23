var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-west-2",
    "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
    "accessKeyId": "AKIAJDMWJ3P63NDAYSWA", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let removeSingleUser = function (email) {

    var params = {
        TableName: "users",
        Key: {
            "email": email
        }
    };
    docClient.delete(params, function (err, data) {

        if (err) {
            console.log("users::delete::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::delete::success");
        }
    });
}

// removeSingleUser();

module.exports = removeSingleUser;