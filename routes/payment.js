const express = require('express');

const { FedaPay, Transaction } = require('fedapay');

const env = require('../config');

const router = express.Router();

/**
 * Get data from form and create a transaction before redirect
 * to the fedapay secured interface for payment.
 */
router.post('/', async function(req, res) {

    /**
     * Set the ApiKey and the environment.
     */
    FedaPay.setApiKey(env.apiKeys);
    FedaPay.setEnvironment(env.environment);

    try {

    const data = req.body;
    const transaction = await Transaction.create({
        description: 'Achat de vêtements',
        amount: data.amount,
        callback_url: `http://nodesample.fedapay.com/callback`,
        currency: {
            iso: 'XOF'
        },
        customer: {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            phone_number: {
                number: data.number,
                country: 'BJ'
            }
        }
    });

    console.log("Paiement validé avec succès: ", transaction);

    const token = await transaction.generateToken();

    return res.redirect(token.url);

} catch (error) {

    console.error('Erreur lors du paiement  de la transaction :', error.response ? error.response.data : error.message);

    return res.status(400).json({ error: `Transaction Error: ${error.message}` });
}
});


module.exports = router;
