/* ============================================================
   RegenX x Eric Favre - Stripe Checkout (serverless)
   /api/stripe/checkout
   Cree une session Stripe Checkout (mode "payment") a partir
   du panier envoye par cart.js. La saveur choisie (variant) est
   transmise dans le nom de la ligne ET en metadata, afin
   d'apparaitre dans la commande Stripe pour la preparation.

   IMPORTANT (a configurer par le proprietaire du projet) :
   - Variable d'environnement Vercel : STRIPE_SECRET_KEY
   - (optionnel) PUBLIC_URL pour les URLs de retour
   Aucune cle secrete n'est ecrite en clair dans ce fichier.
   ============================================================ */
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body =
      typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const items = Array.isArray(body.items) ? body.items : [];

    if (!items.length) {
      return res.status(400).json({ error: 'Panier vide.' });
    }

    // Construction des line_items a partir des priceId Stripe
    const line_items = items.map(function (it) {
      if (!it.priceId) {
        throw new Error('priceId manquant pour un article');
      }
      return {
        price: it.priceId,
        quantity: Math.max(1, parseInt(it.quantity, 10) || 1)
      };
    });

    // Recap des saveurs pour la metadata (visible dans le dashboard Stripe)
    const flavorSummary = items
      .map(function (it) {
        var qty = Math.max(1, parseInt(it.quantity, 10) || 1);
        var label = it.name || it.productId || 'Produit';
        return it.variant
          ? label + ' (' + it.variant + ') x' + qty
          : label + ' x' + qty;
      })
      .join(' | ');

    // Origine pour construire les URLs de retour
    const origin =
      process.env.PUBLIC_URL ||
      (req.headers && req.headers.origin) ||
      'https://' + (req.headers && req.headers.host ? req.headers.host : '');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: line_items,
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'CH', 'DE', 'ES', 'IT', 'NL', 'PT', 'GB']
      },
      custom_fields: [
        {
          key: 'prenom',
          label: { type: 'custom', custom: 'Prenom' },
          type: 'text'
        },
        {
          key: 'nom',
          label: { type: 'custom', custom: 'Nom' },
          type: 'text'
        }
      ],
      metadata: {
        flavors: flavorSummary.slice(0, 490),
        source: 'regenx-boutique'
      },
      success_url: origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/cancel.html'
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Erreur lors de la creation du paiement.' });
  }
};
