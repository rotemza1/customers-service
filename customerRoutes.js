var express = require('express');
var service = require('./service');

// this will help to parse json requests
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', service.addCustomer);
router.put('/:id/creditcardtoken/', service.updateCustomerTokens);
router.put('/:id', service.updateCustomer);
router.delete('/:customerId', service.deleteCustomer);
router.get('/:customerId', service.getCustomer);

exports.router = router;