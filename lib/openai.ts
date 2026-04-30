import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export const REGENX_SYSTEM_PROMPT = `Tu es RegenX Coach, un coach personnel IA expert en fitness, nutrition, récupération et bien-être.

Ton rôle:
- Créer des programmes d'entraînement personnalisés
- Proposer des plans nutritionnels adaptés
- Recommander des stratégies de récupération
- Conseiller sur les compléments alimentaires et le CBD
- Motiver et accompagner l'utilisateur vers ses objectifs

Principes:
- Communication en français par défaut (s'adapter à la langue de l'utilisateur)
- Toujours tenir compte du niveau et des objectifs de l'utilisateur
- Être encourageant et bienveillant
- Donner des conseils concrets et actionnables
- Rappeler de consulter un médecin pour les questions médicales
- Pour les non-abonnés: mentionner les bénéfices du plan Premium 99€/mois

Tu peux générer:
- Des programmes sportifs détaillés (exercices, séries, répétitions, repos)
- Des plans nutritionnels avec macros et recettes
- Des recommandations de supplémentation
- Des protocoles de récupération
- Des analyses de progression
`;

export async function generateWorkoutPlan(userProfile: {
    fitnessLevel: string;
    goals: string[];
    availableDays: number;
    equipment: string[];
    duration: number;
}) {
    const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: REGENX_SYSTEM_PROMPT },
            {
                      role: 'user',
                      content: `Génère un programme d'entraînement complet pour:
                      - Niveau: ${userProfile.fitnessLevel}
                      - Objectifs: ${userProfile.goals.join(', ')}
                      - Jours disponibles/semaine: ${userProfile.availableDays}
                      - Équipement: ${userProfile.equipment.join(', ') || 'sans équipement'}
                      - Durée par séance: ${userProfile.duration} minutes

                      Format JSON avec: name, description, sessions (tableau avec day, name, exercises)`,
            },
                ],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
    });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function generateNutritionPlan(userProfile: {
    weight: number;
    height: number;
    age: number;
    goal: string;
    dietType: string;
}) {
    const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: REGENX_SYSTEM_PROMPT },
            {
                      role: 'user',
                      content: `Génère un plan nutritionnel pour:
                      - Poids: ${userProfile.weight}kg, Taille: ${userProfile.height}cm, Âge: ${userProfile.age} ans
                      - Objectif: ${userProfile.goal}
                      - Type d'alimentation: ${userProfile.dietType}

                      Inclure: calories, macros, repas type, compléments recommandés, protocoles CBD. Format JSON.`,
            },
                ],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
    });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function chatWithCoach(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    userContext?: Record<string, unknown>
  ) {
    const systemMessage = userContext
      ? `${REGENX_SYSTEM_PROMPT}\n\nContexte utilisateur: ${JSON.stringify(userContext)}`
          : REGENX_SYSTEM_PROMPT;

  const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
                ...messages,
              ],
        stream: true,
        max_tokens: 1000,
        temperature: 0.7,
  });

  return stream;
}
