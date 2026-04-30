import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                      cookies: {
                              get(name: string) {
                                        return cookieStore.get(name)?.value;
                                                },
                                                        set(name: string, value: string, options: Record<string, unknown>) {
                                                                  try {
                                                                              cookieStore.set({ name, value, ...options });
                                                                                        } catch {
                                                                                                    // The `set` method was called from a Server Component.
                                                                                                              }
                                                                                                                      },
                                                                                                                              remove(name: string, options: Record<string, unknown>) {
                                                                                                                                        try {
                                                                                                                                                    cookieStore.set({ name, value: '', ...options });
                                                                                                                                                              } catch {
                                                                                                                                                                          // The `delete` method was called from a Server Component.
                                                                                                                                                                                    }
                                                                                                                                                                                            },
                                                                                                                                                                                                  },
                                                                                                                                                                                                      }
                                                                                                                                                                                                        );
                                                                                                                                                                                                        }
                                                                                                                                                                                                        
                                                                                                                                                                                                        export async function getUser() {
                                                                                                                                                                                                          const supabase = createClient();
                                                                                                                                                                                                            const { data: { user } } = await supabase.auth.getUser();
                                                                                                                                                                                                              return user;
                                                                                                                                                                                                              }
                                                                                                                                                                                                              
                                                                                                                                                                                                              export async function getSubscription(userId: string) {
                                                                                                                                                                                                                const supabase = createClient();
                                                                                                                                                                                                                  const { data } = await supabase
                                                                                                                                                                                                                      .from('subscriptions')
                                                                                                                                                                                                                          .select('*')
                                                                                                                                                                                                                              .eq('user_id', userId)
                                                                                                                                                                                                                                  .single();
                                                                                                                                                                                                                                    return data;
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                    export async function isSubscriptionActive(userId: string): Promise<boolean> {
                                                                                                                                                                                                                                      const subscription = await getSubscription(userId);
                                                                                                                                                                                                                                        return subscription?.status === 'active' || subscription?.status === 'trialing';
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                        

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
