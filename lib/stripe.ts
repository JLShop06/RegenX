import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
    typescript: true,
    });

    export const STRIPE_PLANS = {
      premium: {
          priceId: process.env.STRIPE_PRICE_ID!,
              name: 'RegenX Premium',
                  price: 9900, // in cents = 99€
                      currency: 'eur',
                          interval: 'month' as Stripe.Price.Recurring.Interval,
                              features: [
                                      'IA Coach illimitée',
                                            'Programmes sport personnalisés',
                                                  'Nutrition & récupération',
                                                        'CBD & compléments',
                                                              'Accès web + mobile',
                                                                    'Suivi de progression',
],
  },
  };

  export async function createOrRetrieveCustomer({
    email,
      userId,
        name,
        }: {
          email: string;
            userId: string;
              name?: string;
              }): Promise<string> {
                // Search for existing customer
                  const customers = await stripe.customers.list({ email, limit: 1 });

                      if (customers.data.length > 0) {
                          return customers.data[0].id;
                            }

                                // Create new customer
                                  const customer = await stripe.customers.create({
                                      email,
                                          name,
                                              metadata: { supabase_user_id: userId },
                                                });

                                                    return customer.id;
                                                    }

                                                    export async function createCheckoutSession({
                                                      customerId,
                                                        priceId,
                                                          userId,
                                                            successUrl,
                                                              cancelUrl,
                                                              }: {
                                                                customerId: string;
                                                                  priceId: string;
                                                                    userId: string;
                                                                      successUrl: string;
                                                                        cancelUrl: string;
                                                                        }): Promise<string> {
                                                                          const session = await stripe.checkout.sessions.create({
                                                                              customer: customerId,
                                                                                  payment_method_types: ['card'],
                                                                                      billing_address_collection: 'auto',
                                                                                          line_items: [
                                                                                                  {
                                                                                                          price: priceId,
                                                                                                                  quantity: 1,
                                                                                                                        },
],
    mode: 'subscription',
        allow_promotion_codes: true,
            subscription_data: {
                  metadata: { supabase_user_id: userId },
                      },
                          success_url: successUrl,
                              cancel_url: cancelUrl,
                                  locale: 'fr',
                                      currency: 'eur',
                                        });

                                          return session.url!;
                                          }

                                          export async function createBillingPortalSession({
                                            customerId,
                                              returnUrl,
                                              }: {
                                                customerId: string;
                                                  returnUrl: string;
                                                  }): Promise<string> {
                                                    const session = await stripe.billingPortal.sessions.create({
                                                        customer: customerId,
                                                            return_url: returnUrl,
                                                              });
                                                                return session.url;
                                                                }
                                                                
