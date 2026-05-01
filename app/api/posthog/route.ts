import { PostHog } from 'posthog-node';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Route proxy PostHog pour éviter les bloqueurs de pub (adblockers)
// cf. https://posthog.com/docs/advanced/proxy/nextjs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const client = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_KEY!,
      { host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com' }
    );

    if (user) {
      client.identify({
        distinctId: user.id,
        properties: {
          email: user.email,
          created_at: user.created_at,
        },
      });
    }

    // Capturer l'événement reçu du client
    if (body.event && body.distinctId) {
      client.capture({
        distinctId: body.distinctId || user?.id || 'anonymous',
        event: body.event,
        properties: body.properties || {},
      });
    }

    await client.shutdown();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'PostHog error' }, { status: 500 });
  }
}
