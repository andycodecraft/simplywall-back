const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.checkoutStripe = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price: req.body.priceId, // Pass the price ID from the frontend
          quantity: 1,
        },
      ],
      mode: 'subscription', // Use 'payment' for one-time purchases
      success_url: `http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5000/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
