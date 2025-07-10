const express = require('express');
const { FedaPay, Transaction } = require('fedapay');
const env = require('../config');

const router = express.Router();

/**
 * Callback route.
*/
router.get('/', async function(req, res) {

    let status = '';

    /**
     * Check if the parameters status and id are defined then 
     * display by status value an alert in the view
     */
    if(typeof req.query.status !== 'undefined' && typeof req.query.id !== 'undefined') {

        // Set the ApiKey and the environment.
        FedaPay.setApiKey(env.apiKeys);
        FedaPay.setEnvironment(env.environment);

        try {
            const transaction = await Transaction.retrieve(req.query.id);
            status = transaction.status === 'approved' ? 'success' : 'failed';
        } catch (error) {
            status = "failed";
        }
    }

    res.redirect(`/home?status=${status}`);
});

module.exports = router;
