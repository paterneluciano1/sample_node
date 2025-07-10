const express = require('express');
const bodyParser = require('body-parser');
const { FedaPay, Webhook } = require('fedapay');
const env = require('../config');

const router = express.Router();

/**
 * Get data from form and create a transaction before redirect
 * to the fedapay secured interface for payment.
 */
router.post('/',bodyParser.raw({ type: 'application/json' }),  async function(req, res) {

    /**
     * Set the ApiKey and the environment.
     */
    const data = req.body;

    const sig = req.headers['x-fedapay-signature']; // Signature envoyée par FedaPay

    FedaPay.setApiKey(env.apiKeys);

    FedaPay.setEnvironment(env.environment);

    let event;
  
    try {
        // Validation de la signature et construction de l'événement

        event = await Webhook.constructEvent(data, sig, apiKeys);

        console.log("Event validé :", event);

    } catch (error) {

        console.error('Erreur lors de la validation de l’événement :', error.response ? error.response.data : error.message);

        return res.status(400).json({ error: `Webhook Error: ${error.message}` });
    }
  
    if (!event) {

        return res.status(400).json({ error: 'Aucun événement détecté' });
    }

    // Gestion des différents types d'événements
    try {

        switch (event.name) {

            case 'transaction.created':

                console.log('Transaction créée :', event.data);

                // Ajoutez ici un traitement spécifique si nécessaire

                break;
  
            case 'transaction.approved':

                console.log('Transaction approuvée :', event.data);

                // Ajoutez ici un traitement spécifique si nécessaire

                break;
  
            case 'transaction.canceled':

                console.log('Transaction annulée :', event.data);

                // Ajoutez ici un traitement spécifique si nécessaire

                break;
  
            default:

                console.log(`Type d'événement non géré : ${event.name}`);

                break;
        }

        // Répondre pour confirmer la réception de l'événement (UNE SEULE FOIS)

        res.json({ received: true });

    } catch (error) {

        console.error('Erreur lors du traitement de l’événement :', error.message);

        return res.status(500).json({ error: 'Erreur interne lors du traitement de l’événement' });
    }
});


module.exports = router;
