var db = require('./db');

exports.addCustomer = function(req, res) {
    var customer = req.body;
    var isCustomerValid = validateCustomer(customer);
    if (isCustomerValid) {
        customer = createCustomer(customer);
        db.addCustomer(customer, function(err, result) {
            if (err) {
                console.error("failed to add customer");
                res.status(500).send("failed to add customer");
            } else {
                console.log("customer " + customer.id + " was added");
                res.status(201).send({id:customer.id});
            }
        });
    } else {
        console.error("customer input is invalid")
        res.status(500).send("customer input is invalid");
    }
}

exports.updateCustomer = function(req, res) {
    var customerId = req.params.id;
    var updateFields = req.body;
    if (!customerId) {
        console.error("customer id was not provided");
        res.status(500).send("customer id was not provided");
    } else if (!updateFields) {
        console.error("customer update informarion was not provided");
        res.status(500).send("customer update informarion was not provided");
    } else {
        updateFields = getUpdateFields(updateFields);
        db.updateCustomer(customerId, updateFields, function(err, result) {
            if (err) {
                console.error("failed to update customer");
                res.status(500).send("failed to update customer");
            } else {
                console.log("customer " + customerId + " was updated");
                res.status(200).send("customer was updated");
            }
        })
    }
}

exports.updateCustomerTokens = function(req, res) {
    var customerId = req.params.id;
    var action = req.body.action;
    var token = req.body.token;

    if (!customerId) {
        console.error("customer id was not provided");
        res.status(500).send("customer id was not provided");
    } else if (!action) {
        console.error("update action was not provided");
        res.status(500).send("update action was not provided");
    } else if (!((action == "add") || (action == "remove"))) {
        console.error("action need to be add or remove");
        res.status(500).send("action need to be add or remove");
    } else if (!token) {
        console.error("update token was not provided");
        res.status(500).send("update token was not provided");
    } else {
        db.updateCustomerToken(customerId, req.body, function(err, result) {
            if (err) {
                console.error("failed to update customer token");
                res.status(500).send("failed to update customer token");
            } else {
                console.log("token for customer " + customerId + " was updated");
                res.status(200).send("customer token was updated");
            }
        })

    }
}

exports.deleteCustomer = function(req, res) {
    var customerId = req.params.customerId;

    db.deleteCustomer(customerId, function(err, result) {
        if (err) {
            console.error("failed to delete customer");
            res.status(500).send("failed to delete customer");
        } else {
            console.log("customer with id " + customerId + " was deleted");
            res.status(200).send("customer with id " + customerId + " was deleted");
        }
    });
}

exports.getCustomer = function(req, res) {
    var customerId = req.params.customerId;

    db.getCustomer(customerId, function(err, customer) {
        if (err) {
            console.error("failed to get customer");
            res.status(500).send("failed to get customer");
        } else if (!customer) {
            console.error("customer with id " + customerId + " was not found");
            res.status(500).send("customer with id " + customerId + " was not found");
        } else {
            console.log("found customer " + customerId)
            res.status(200).send(customer);
        }
    });
}

var createCustomer = function(customer) {
    var newCustomer = {};
    var id = randomId();
    newCustomer.id = id;
    newCustomer.name = customer.name;
    newCustomer.email = customer.email;
    newCustomer.address = customer.address;
    newCustomer.creditCardTokens = customer.creditCardTokens;
    return newCustomer;
}

var getUpdateFields = function(customer) {
    var updateFields = {};
    if (customer.name) {
        updateFields.name = customer.name;
    }
    if (customer.email) {
        updateFields.email = customer.email;
    }
    if (customer.address) {
        updateFields.address = customer.address;
    }
    if (customer.creditCardTokens) {
        if (Array.isArray(customer.creditCardTokens)) {
            updateFields.creditCardTokens = customer.creditCardTokens;
        }
    }
    return updateFields;
}

var validateCustomer = function(customer) {
    if (!customer.name) {
        return false;
    }
    if (!customer.email) {
        return false;
    }
    if (!customer.address) {
        return false;
    }
    if (!customer.creditCardTokens) {
        return false;
    }
    if (!Array.isArray(customer.creditCardTokens)) {
        return false;
    }

    return true;
}

var randomId = function() {
    var timestamp = new Date().getTime();
    return "customer_" + timestamp;
}