var express = require('express');
var app = express()
var customerRoutes = require('./customerRoutes');

app.use("/customer", customerRoutes.router);

var port = 3333;
app.listen(port);
console.log("web app started on port " + port);