var image = document.getElementById('img');
var uploadBtn = document.getElementById('uploadBtn');
var msg = document.getElementById('msg');

uploadBtn.addEventListener('click', function () {
    alert('upload clicked!');
    var file = image.files[0];
    if (file) {            
        AWS.config.update({
            "accessKeyId": "AKIAJDMWJ3P63NDAYSWA",
            "secretAccessKey": "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",
            "region": "us-west-2"
        });
        var s3 = new AWS.S3();
        var params = {
            Bucket: 'mean-hotelista',
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