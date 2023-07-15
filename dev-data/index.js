const stripe = require('stripe')('sk_test_51NTseVBs4LhvVl6aCYGmwWHgJsNs0eMWvCiJECWecJJJz8TRSlFD4gCRBX4G9E4D1xNhvzyfsXXPntmDh6BD9nd900qkEfRqS0');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1NU9LVBs4LhvVl6aZH1xd2Al',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));