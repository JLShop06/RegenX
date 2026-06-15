import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json({ error: 'Panier vide.' }, { status: 400 });
    }

    const line_items = items.map((it: any) => {
      if (!it.priceId) throw new Error('priceId manquant pour un article');
      return {
        price: it.priceId,
        quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
      };
    });

    const flavorSummary = items
      .map((it: any) => {
        const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
        const label = it.name || it.productId || 'Produit';
        return it.variant ? `${label} (${it.variant}) x${qty}` : `${label} x${qty}`;
      })
      .join(' | ');

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get('origin') ||
      `https://${req.headers.get('host') ?? 'regenx.eu'}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'CH', 'DE', 'ES', 'IT', 'NL', 'PT', 'GB'],
      },
      custom_fields: [
        { key: 'prenom', label: { type: 'custom', custom: 'Prenom' }, type: 'text' },
        { key: 'nom', label: { type: 'custom', custom: 'Nom' }, type: 'text' },
      ],
      metadata: { flavors: flavorSummary.slice(0, 490), source: 'regenx-boutique' },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel.html`,
      locale: 'fr',
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Shop checkout error:', err?.message || err);
    return NextResponse.json({ error: 'Erreur lors de la creation du paiement.' }, { status: 500 });
  }
}
