var express = require('express');
var app = express();

var mongoose   = require('mongoose');
var connectionString = 'mongodb://root:admin@ds155087.mlab.com:55087/wam-fall-2016';
mongoose.connect(connectionString);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directives to host static content
app.use(express.static(__dirname + '/public'));



//require("./assignment/app.js")(app);
require("./project/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);