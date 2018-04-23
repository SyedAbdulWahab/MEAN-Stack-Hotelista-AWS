var AWS = require("aws-sdk");
var awsConfig = {
    "region": "us-west-2",
    "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
    "accessKeyId": "AKIAJDMWJ3P63NDAYSWA", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();
let readSingleRoomByTitle = function (title) {
    var params = {
        TableName: "Room",
        Key: {
            "title": title
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("room::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("room::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
        }
    })
}


module.exports = readSingleRoomByTitle