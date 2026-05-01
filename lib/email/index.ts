import { Resend } from 'resend';

// ─── Client ──────────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'RegenX <noreply@regenx.app>';
const SUPPORT_EMAIL = 'support@regenx.app';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://regenx.app';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SendEmailResult {
  success: boolean;
  error?: string;
}

// ─── Base HTML template ───────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RegenX</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="display:inline-table;">
                <tr>
                  <td style="background:#10b981;border-radius:12px;width:40px;height:40px;text-align:center;vertical-align:middle;">
                    <span style="color:white;font-weight:900;font-size:20px;">R</span>
                  </td>
                  <td style="padding-left:10px;color:white;font-size:22px;font-weight:900;vertical-align:middle;">RegenX</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;text-align:center;color:#475569;font-size:12px;line-height:1.6;">
              <p style="margin:0 0 8px;">© ${new Date().getFullYear()} RegenX SAS · Hébergé en EU · Conforme RGPD</p>
              <p style="margin:0;">
                <a href="${APP_URL}/privacy" style="color:#10b981;text-decoration:none;">Confidentialité</a>
                &nbsp;·&nbsp;
                <a href="${APP_URL}/terms" style="color:#10b981;text-decoration:none;">CGU</a>
                &nbsp;·&nbsp;
                <a href="${APP_URL}/contact" style="color:#10b981;text-decoration:none;">Contact</a>
              </p>
              <p style="margin:8px 0 0;color:#334155;font-size:11px;">
                Vous recevez cet email car vous avez créé un compte RegenX.
                <a href="${APP_URL}/dashboard/settings" style="color:#64748b;text-decoration:underline;">
                  Gérer mes préférences email
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Email: Bienvenue ─────────────────────────────────────────────────────────

export async function sendWelcomeEmail(params: {
  to: string;
  firstName: string;
}): Promise<SendEmailResult> {
  const { to, firstName } = params;

  const html = baseTemplate(`
    <h1 style="color:white;font-size:26px;font-weight:900;margin:0 0 8px;">
      Bienvenue sur RegenX, ${firstName} ! 🎉
    </h1>
    <p style="color:#94a3b8;font-size:16px;margin:0 0 24px;line-height:1.6;">
      Ton compte est activé. Il est temps de construire le physique dont tu rêves.
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
      ${[
        ['🏋️', 'Génère ton programme', 'Notre IA crée un plan sur mesure selon tes objectifs et ton niveau.'],
        ['🥗', 'Planifie ta nutrition', 'Menus hebdomadaires avec macros calculés pour toi.'],
        ['📈', 'Suis ta progression', 'Visualise tes gains semaine après semaine.'],
      ].map(([icon, title, desc]) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:24px;width:44px;vertical-align:top;">${icon}</td>
                <td style="padding-left:12px;vertical-align:top;">
                  <p style="color:white;font-weight:700;font-size:15px;margin:0 0 2px;">${title}</p>
                  <p style="color:#94a3b8;font-size:13px;margin:0;">${desc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `).join('')}
    </table>

    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px;">
      <tr>
        <td align="center">
          <a href="${APP_URL}/dashboard"
            style="display:inline-block;background:#10b981;color:white;font-weight:700;font-size:16px;
            text-decoration:none;padding:14px 36px;border-radius:10px;">
            Commencer mon programme →
          </a>
        </td>
      </tr>
    </table>

    <p style="color:#475569;font-size:13px;margin:0;line-height:1.6;text-align:center;">
      Une question ? Réponds à cet email ou écris-nous à
      <a href="mailto:${SUPPORT_EMAIL}" style="color:#10b981;">${SUPPORT_EMAIL}</a>
    </p>
  `);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Bienvenue sur RegenX, ${firstName} ! Ton coach IA t'attend 🚀`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('[Email:Welcome]', error);
    return { success: false, error: String(error) };
  }
}

// ─── Email: Confirmation de contact ───────────────────────────────────────────

export async function sendContactConfirmation(params: {
  to: string;
  name: string;
  subject: string;
  message: string;
}): Promise<SendEmailResult> {
  const { to, name, subject, message } = params;

  const subjectLabels: Record<string, string> = {
    support: 'Support technique',
    billing: 'Facturation / abonnement',
    privacy: 'Protection des données (RGPD)',
    partnership: 'Partenariat / presse',
    other: 'Autre',
  };

  const html = baseTemplate(`
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 8px;">
      Message reçu, ${name} ✅
    </h1>
    <p style="color:#94a3b8;font-size:15px;margin:0 0 24px;line-height:1.6;">
      Nous avons bien reçu votre message et vous répondrons sous 24h (jours ouvrés).
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:16px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em;">Sujet</p>
          <p style="color:white;font-weight:600;font-size:14px;margin:0 0 12px;">${subjectLabels[subject] ?? subject}</p>
          <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em;">Votre message</p>
          <p style="color:#cbd5e1;font-size:14px;margin:0;line-height:1.6;">${message.substring(0, 300)}${message.length > 300 ? '...' : ''}</p>
        </td>
      </tr>
    </table>

    <p style="color:#475569;font-size:13px;margin:0 0 16px;line-height:1.6;">
      Notre équipe examinera votre demande et vous contactera à l'adresse <strong style="color:#94a3b8;">${to}</strong>.
    </p>
    <p style="color:#475569;font-size:13px;margin:0;line-height:1.6;">
      En attendant, consultez notre
      <a href="${APP_URL}/dashboard" style="color:#10b981;">espace membre</a>
      ou notre
      <a href="${APP_URL}/contact" style="color:#10b981;">page de contact</a>
      pour toute urgence.
    </p>
  `);

  // Also send internal notification to support team
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: SUPPORT_EMAIL,
      replyTo: to,
      subject: `[Contact RegenX] ${subjectLabels[subject] ?? subject} - ${name}`,
      html: `<p><strong>De:</strong> ${name} (${to})</p>
             <p><strong>Sujet:</strong> ${subjectLabels[subject] ?? subject}</p>
             <p><strong>Message:</strong></p>
             <blockquote>${message}</blockquote>`,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Nous avons bien reçu votre message — RegenX',
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('[Email:Contact]', error);
    return { success: false, error: String(error) };
  }
}

// ─── Email: Réinitialisation mot de passe ─────────────────────────────────────

export async function sendPasswordResetEmail(params: {
  to: string;
  firstName: string;
  resetUrl: string;
}): Promise<SendEmailResult> {
  const { to, firstName, resetUrl } = params;

  const html = baseTemplate(`
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 8px;">
      Réinitialiser ton mot de passe
    </h1>
    <p style="color:#94a3b8;font-size:15px;margin:0 0 24px;line-height:1.6;">
      Bonjour ${firstName},<br/>
      Tu as demandé la réinitialisation de ton mot de passe RegenX.
      Clique sur le bouton ci-dessous dans les <strong style="color:white;">60 minutes</strong> :
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="${resetUrl}"
            style="display:inline-block;background:#10b981;color:white;font-weight:700;font-size:16px;
            text-decoration:none;padding:14px 36px;border-radius:10px;">
            Réinitialiser mon mot de passe
          </a>
        </td>
      </tr>
    </table>

    <p style="color:#475569;font-size:13px;margin:0 0 12px;line-height:1.6;">
      Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :<br/>
      <a href="${resetUrl}" style="color:#10b981;word-break:break-all;">${resetUrl}</a>
    </p>
    <p style="color:#475569;font-size:13px;margin:0;line-height:1.6;">
      Si tu n'as pas demandé cette réinitialisation, ignore cet email.
      Ton mot de passe restera inchangé.
    </p>
  `);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Réinitialisation de ton mot de passe RegenX',
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('[Email:PasswordReset]', error);
    return { success: false, error: String(error) };
  }
}

// ─── Email: Confirmation d'abonnement ─────────────────────────────────────────

export async function sendSubscriptionEmail(params: {
  to: string;
  firstName: string;
  plan: 'pro' | 'team';
  nextBillingDate: string;
  amount: string;
}): Promise<SendEmailResult> {
  const { to, firstName, plan, nextBillingDate, amount } = params;

  const planLabel = plan === 'pro' ? 'Pro' : 'Équipe';
  const planEmoji = plan === 'pro' ? '⚡' : '🤝';

  const html = baseTemplate(`
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 8px;">
      Abonnement ${planLabel} activé ${planEmoji}
    </h1>
    <p style="color:#94a3b8;font-size:15px;margin:0 0 24px;line-height:1.6;">
      Merci ${firstName} ! Ton abonnement <strong style="color:white;">${planLabel}</strong>
      est maintenant actif. Profite de toutes les fonctionnalités sans limite.
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px;">
          ${[
            ['Plan', planLabel],
            ['Montant', amount + ' / mois TTC'],
            ['Prochaine facturation', nextBillingDate],
            ['Paiement', 'Stripe · Sécurisé PCI-DSS'],
          ].map(([label, value]) => `
            <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:12px;">
              <tr>
                <td style="color:#64748b;font-size:13px;width:50%;">${label}</td>
                <td style="color:white;font-size:13px;font-weight:600;text-align:right;">${value}</td>
              </tr>
            </table>
          `).join('')}
        </td>
      </tr>
    </table>

    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="${APP_URL}/dashboard"
            style="display:inline-block;background:#10b981;color:white;font-weight:700;font-size:16px;
            text-decoration:none;padding:14px 36px;border-radius:10px;">
            Accéder au tableau de bord →
          </a>
        </td>
      </tr>
    </table>

    <p style="color:#475569;font-size:12px;margin:0;line-height:1.6;text-align:center;">
      Gérez votre abonnement depuis
      <a href="${APP_URL}/dashboard/billing" style="color:#10b981;">Paramètres → Abonnement</a>.
      Annulation sans frais, sans engagement.
    </p>
  `);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${planEmoji} Ton abonnement RegenX ${planLabel} est actif !`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('[Email:Subscription]', error);
    return { success: false, error: String(error) };
  }
}

// ─── Email: Annulation d'abonnement ───────────────────────────────────────────

export async function sendCancellationEmail(params: {
  to: string;
  firstName: string;
  endDate: string;
}): Promise<SendEmailResult> {
  const { to, firstName, endDate } = params;

  const html = baseTemplate(`
    <h1 style="color:white;font-size:24px;font-weight:900;margin:0 0 8px;">
      Abonnement annulé
    </h1>
    <p style="color:#94a3b8;font-size:15px;margin:0 0 24px;line-height:1.6;">
      Bonjour ${firstName}, ton abonnement a bien été annulé.
      Tu garderas accès à toutes les fonctionnalités Pro jusqu'au
      <strong style="color:white;">${endDate}</strong>.
    </p>

    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:10px;padding:16px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="color:#fbbf24;font-size:14px;margin:0;line-height:1.6;">
            💡 <strong>Tu peux réactiver ton abonnement à tout moment</strong>
            depuis ton espace compte, sans perdre tes données de progression.
          </p>
        </td>
      </tr>
    </table>

    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="${APP_URL}/dashboard/billing"
            style="display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
            color:white;font-weight:600;font-size:15px;text-decoration:none;padding:12px 28px;border-radius:10px;">
            Réactiver mon abonnement
          </a>
        </td>
      </tr>
    </table>

    <p style="color:#475569;font-size:13px;margin:0;line-height:1.6;text-align:center;">
      Des questions ? Écris-nous à
      <a href="mailto:${SUPPORT_EMAIL}" style="color:#10b981;">${SUPPORT_EMAIL}</a>
    </p>
  `);

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Ton abonnement RegenX a été annulé',
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('[Email:Cancellation]', error);
    return { success: false, error: String(error) };
  }
}
