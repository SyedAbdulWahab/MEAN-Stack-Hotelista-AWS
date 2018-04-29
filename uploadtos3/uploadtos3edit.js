alert("waiting");
setTimeout(function(){
    //do what you need here

    var image = document.getElementById('img');
    var uploadBtn = document.getElementById('uploadBtn');
    var msg = document.getElementById('msg');

    uploadBtn.addEventListener('click', function () {
        alert('upload clicked!');
        var file = image.files[0];
        if (file) {
            AWS.config.update({
                "accessKeyId": "AKIAJLU35VQHTE5QKA4Q",
                "secretAccessKey": "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",
                "region": "us-west-2"
            });
            var s3 = new AWS.S3();
            var params = {
                Bucket: 'ql-cf-templates-1519363680-b85b8fd649cbf407-us-west-2',
                Key: file.name,
                ContentType: file.type,
                Body: file,
                ACL: 'public-read'
            };
            s3.putObject(params, function (err, res) {
                if (err) {
                    msg.innerHTML = ("Error uploading data: ", err);
                }
            });
        } else {
            msg.innerHTML = 'Nothing to upload.';
        }
    }, false);
}, 3000);
alert("executing");