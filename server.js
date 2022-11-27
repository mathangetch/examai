var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = require("./routes/index");
const fileUpload = require("express-fileupload")
const limiter= require("./middleware/rate_limiter")



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
app.use(fileUpload());
app.use('/api',limiter)


router.get("/", function (req, res) {
    res.json({ "error": false, "message": "Hello World" });
});




app.use('/api', router);

app.listen(3000);
console.log("Listening to PORT 3000");