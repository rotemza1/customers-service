var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var DB;
var customersCollection;
// Connection URL 
var url = 'mongodb://mongodb:27017/company';

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    DB = db;
    customersCollection = db.collection('customers');
});

exports.addCustomer = function(customer, callback) {
    customersCollection.insert(customer, callback);
}

exports.deleteCustomer = function(customerId, callback) {
    customersCollection.remove({
        id: customerId
    }, callback);
}

exports.getCustomer = function(customerId, callback) {
    findCustomer(customerId, callback);
}

exports.updateCustomer = function(customerId, customer, callback) {
    customersCollection.update({
        id: customerId
    }, {
        $set: customer
    }, callback);
}

exports.updateCustomerToken = function(customerId, action, callback) {
    findCustomer(customerId, function(err, customer) {
        if (err) {
            callback(err);
        } else if (!customer) {
            console.log("customer with id " + customerId + " was not found");
            callback("customer with id " + customerId + " was not found");
        } else {
            var tokens = modifyTokens(customer.creditCardTokens, action);
            customersCollection.update({
                id: customerId
            }, {
                $set: {
                    creditCardTokens: tokens
                }
            }, callback);
        }
    });
}

var modifyTokens = function(tokens, action) {
    var modifyAction = action.action;
    var token = action.token;
    var index = tokens.indexOf(token);

    if (modifyAction == "remove") {
        if (index > -1) {
            tokens.splice(index, 1);
        }
    } else if (modifyAction == "add") {
        if (index == -1) {
            tokens.push(token);
        }
    }
    return tokens;
}

var findCustomer = function(customerId, callback) {
    customersCollection.findOne({
        id: customerId
    }, callback);
}