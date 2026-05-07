import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "Conditions Générales d'Utilisation | RegenX",
  description: "CGU de RegenX - Conditions générales d'utilisation de la plateforme.",
};

const LAST_UPDATED = '1er mai 2026';
const COMPANY = 'RegenX SAS';
const EMAIL = 'legal@regenx.app';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo RengenX.png" alt="RegenX" width={28} height={28} className="rounded-lg object-contain" />
            <span className="font-black text-lg">RegenX</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black mb-2">{"Conditions Générales d'Utilisation"}</h1>
        <p className="text-slate-400 mb-12">Dernière mise à jour : {LAST_UPDATED}</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Présentation du service</h2>
            <p>
              RegenX est une plateforme SaaS de coaching fitness et nutritionnel assisté par intelligence artificielle, éditée par <strong>{COMPANY}</strong>, immatriculée en France.
              {"L'accès au service est proposé via le site web"} <strong>regenx.app</strong>{" et l'application mobile disponible sur iOS et Android."}
            </p>
            <p className="mt-3">
              {"En créant un compte ou en utilisant le service, vous acceptez sans réserve les présentes CGU."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">{"2. Conditions d'accès"}</h2>
            <p>{"Pour utiliser RegenX, vous devez :"}</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-slate-400">
              <li>{"Avoir au moins 16 ans (ou l'âge légal de majorité numérique dans votre pays)"}</li>
              <li>{"Fournir des informations exactes lors de l'inscription"}</li>
              <li>{"Disposer d'un accès internet fonctionnel"}</li>
              <li>{"Ne pas utiliser le service à des fins illicites"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Avertissement médical</h2>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 text-sm">
              <strong>Important :</strong>{" RegenX fournit des informations générales à titre informatif uniquement. Les programmes générés par notre IA ne constituent pas des conseils médicaux professionnels. Consultez un médecin avant de débuter tout programme, notamment si vous souffrez d'une condition médicale préexistante."}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Abonnements et paiements</h2>
            <ul className="list-disc list-inside space-y-1 mt-2 text-slate-400">
              <li>{"Les paiements sont traités de manière sécurisée via Stripe"}</li>
              <li>{"Les prix sont indiqués TTC en euros"}</li>
              <li>{"L'abonnement est renouvelé automatiquement à chaque échéance"}</li>
              <li>{"Vous pouvez annuler à tout moment depuis votre espace compte"}</li>
            </ul>
            <p className="mt-3">
              <strong>{"Droit de rétractation (EU) :"}</strong>{" Conformément à la directive 2011/83/UE, vous disposez d'un délai de 14 jours à compter de la souscription pour exercer votre droit de rétractation."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Propriété intellectuelle</h2>
            <p>
              {"L'ensemble des éléments composant RegenX (code source, design, algorithmes IA, logos) est la propriété exclusive de"}
              {COMPANY}{" et est protégé par le droit de la propriété intellectuelle applicable en France et dans l'Union Européenne."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Comportement interdit</h2>
            <ul className="list-disc list-inside space-y-1 mt-2 text-slate-400">
              <li>{"Tenter de contourner, pirater ou altérer le service"}</li>
              <li>{"Utiliser des robots ou scripts automatisés non autorisés"}</li>
              <li>{"Revendre ou sous-licencier le service sans autorisation"}</li>
              <li>{"Usurper l'identité d'une autre personne"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Disponibilité du service</h2>
            <p>
              {"RegenX s'efforce d'assurer une disponibilité maximale (objectif : 99,5 % mensuel) mais ne peut garantir un accès ininterrompu. Le service est fourni « en l'état »."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Résiliation</h2>
            <p>
              {"Vous pouvez supprimer votre compte à tout moment depuis les paramètres. Cette suppression entraîne l'effacement de vos données dans un délai de 30 jours, conformément au RGPD."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Limitation de responsabilité</h2>
            <p>
              {"Dans les limites permises par la loi, la responsabilité de RegenX ne saurait excéder le montant payé au cours des 12 derniers mois. RegenX n'est pas responsable des dommages indirects."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Droit applicable et litiges</h2>
            <p>
              {"Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux compétents de Paris sont seuls compétents."}
            </p>
            <p className="mt-3">
              {"Règlement en ligne des litiges (UE) :"}{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">
                ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact</h2>
            <p>
              {"Pour toute question relative aux présentes CGU :"}{' '}
              <a href={`mailto:${EMAIL}`} className="text-emerald-400 hover:text-emerald-300 underline">
                {EMAIL}
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-white transition">{"Politique de confidentialité"}</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
          <Link href="/" className="hover:text-white transition">{"Retour à l'accueil"}</Link>
        </div>
      </div>
    </main>
  );
}
