import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.enum(['support', 'billing', 'privacy', 'partnership', 'other']),
  message: z.string().min(20).max(2000),
  gdpr: z.boolean().refine((v) => v === true),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    console.log('[Contact Form]', {
      name: data.name,
      email: data.email,
      subject: data.subject,
      timestamp: new Date().toISOString(),
    });

    // TODO: Intégrer un service email (Resend, SendGrid)
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'RegenX <noreply@regenx.app>',
    //   to: ['support@regenx.app'],
    //   subject: `[Contact] ${data.subject} - ${data.name}`,
    //   html: `<p>De: ${data.name} (${data.email})</p><p>${data.message}</p>`,
    // });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[Contact API Error]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
