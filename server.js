const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/webhook-youcan', async (req, res) => {
    const order = req.body;
    
    try {
        const response = await axios.post('api.printful.com', {
            recipient: {
                name: `${order.customer.first_name} ${order.customer.last_name}`,
                address1: order.address.address1,
                city: order.address.city,
                country_code: order.address.country_code,
                zip: order.address.zip
            },
            items: order.items.map(item => ({
                sync_variant_id: item.sku, 
                quantity: item.quantity
            }))
        }, {
            headers: { 'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}` }
        });
        res.status(200).send('Succès');
    } catch (error) {
        res.status(500).send('Erreur');
    }
});

app.listen(process.env.PORT || 3000);
