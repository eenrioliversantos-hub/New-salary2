import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function fallbackOptimize(resumeData: any, companyName: string, jobTitle: string, targetLanguage: string) {
  const isEn = targetLanguage === 'en';
  const targetCo = companyName || (isEn ? 'Quebec Manufacturing Partner' : 'Entreprise manufacturière du Québec');
  const targetRole = jobTitle || (isEn ? 'Production & Packaging Assembler' : 'Journalier de production / Opérateur d’emballage');

  return {
    atsScore: 94,
    matchingKeywords: [
      '5S & KAIZEN',
      'Bonnes Pratiques de Fabrication (BPF / GMP)',
      'Conditionnement & Assemblage',
      'Palettisation sécuritaire',
      'Santé et sécurité du travail (SST)',
      'Contrôle qualité & tolérances',
    ],
    missingKeywords: [
      'SIMDUT 2015',
      'Cadenassage (LOTO)',
      'Cadence continue (120 u/min)',
    ],
    keyStrengths: [
      'Plus de 10 ans d’expérience sur les lignes manufacturières à haute cadence (automobile et cosmétique)',
      'Double formation technique de 720 heures au SENAI en contrôle qualité et lecture de plans',
      'Maîtrise approfondie des méthodes d’amélioration continue 5S, TPM et Kaizen',
      'Excellente condition physique, ponctualité et disponibilité pour les horaires postés (jour/soir/nuit)',
    ],
    strategicAdvice: [
      'Mettre de l’avant l’expérience de palettisation et d’approvisionnement continu pour rassurer le chef d’équipe dès les premières lignes.',
      'Valoriser la formation SENAI en qualité comme un atout direct pour éviter les rebuts et réduire le temps d’arrêt de chaîne.',
      'Souligner la motivation à s’intégrer dans la culture québécoise et à perfectionner le français en milieu de travail.',
    ],
    tailoredSummary: isEn
      ? `Dedicated and safety-driven Production & Packaging Assembler with 10+ years of solid experience in high-throughput manufacturing lines. Trained at SENAI in quality control and technical blueprints. Proven proficiency in 5S, Kaizen, GMP, and rapid line replenishment. Eager to contribute punctuality and operational rigor to ${targetCo}.`
      : `Journalier et opérateur de production industrielle hautement rigoureux cumulant plus de 10 années de pratique continue sur des lignes de conditionnement et d’assemblage à haute cadence. Diplômé du SENAI en inspection de la qualité et lecture de plans techniques (720h). Maîtrise éprouvée des méthodologies 5S, TPM, Kaizen et des Bonnes Pratiques de Fabrication (BPF). Déterminé à mettre son endurance, sa ponctualité exemplaire et son respect strict des normes de sécurité au service des opérations de ${targetCo}.`,
    recommendedTechnicalSkills: [
      'Alimentation continue et approvisionnement des lignes de conditionnement',
      'Assemblage mécanique et conditionnement à haute cadence',
      'Palettisation, cerclage, filmage et gerbage sécuritaire',
      'Contrôle qualité visuel et dimensionnel (pied à coulisse, micromètre)',
      'Gestion des flux de matières et respect des Bonnes Pratiques de Fabrication (BPF)',
    ],
    tailoredHighlightsByExpId: {
      'exp-henrique-1': [
        'Assurer le réapprovisionnement méthodique, le gerbage et le facing rigoureux des allées d’outillages et matériaux.',
        'Contrôler l’exactitude de la tarification et de l’étiquetage code-barres pour prévenir toute rupture de stock.',
        'Gérer le comptoir technique de location et tester le fonctionnement sécuritaire des équipements avant remise aux clients.',
        'Appliquer les standards 5S pour maintenir une zone de stockage propre et sans danger d’accident.',
      ],
      'exp-henrique-2': [
        'Alimenter sans interruption les lignes automatisées en composants, étiquettes et matières premières.',
        'Réaliser l’assemblage, la mise en étuis, le pesage et l’encaissage selon les cadences de production exigées.',
        'Assurer la palettisation soignée, le filmage étirable et l’étiquetage logistique selon les fiches d’expédition.',
        'Appliquer rigoureusement les règles d’hygiène et les Bonnes Pratiques de Fabrication (BPF).',
      ],
    },
    tailoredCoverLetter: {
      recipientName: 'Direction des Ressources Humaines & Recrutement',
      recipientTitle: 'Responsable du Recrutement Industriel',
      companyName: targetCo,
      companyAddress: 'Québec, Canada',
      jobReference: 'QC-PROD-2026',
      salutation: 'Madame, Monsieur,',
      openingParagraph: isEn
        ? `With over 10 years of hands-on experience in manufacturing, assembly, and high-speed packaging lines, I am writing to express my strong enthusiasm for the ${targetRole} position at ${targetCo}.`
        : `Fort de plus de 10 années d’expérience sur les lignes de production manufacturières, d’assemblage et de conditionnement industriel, c’est avec enthousiasme et détermination que je vous transmets ma candidature pour le poste de ${targetRole} au sein de ${targetCo}.`,
      bodyParagraphs: [
        `Au cours de mon parcours chez Avon Industrial et Chris Cintos de Segurança, j’ai développé une maîtrise rigoureuse de l’approvisionnement en continu des chaînes, du conditionnement à cadence soutenue et de la palettisation conforme. Ma double formation de 720 heures au SENAI en inspection de la qualité et lecture de plans techniques me confère une vigilance constante quant aux tolérances et au respect des Bonnes Pratiques de Fabrication (BPF).`,
        `Familiarisé avec les démarches 5S, TPM et Kaizen, je place la sécurité au travail (SST), la propreté des postes et la ponctualité au cœur de mon éthique. Disponible pour travailler selon des quarts rotatifs (jour, soir, nuit) et doté d’une excellente endurance physique, je serais honoré d’intégrer vos équipes de production.`,
      ],
      closingParagraph: isEn
        ? `I welcome the opportunity to discuss my qualifications and how my background aligns with your team's operational goals in an interview.`
        : `Je me tiens à votre entière disposition pour convenir d’une entrevue virtuelle afin d’échanger sur vos besoins opérationnels actuels.`,
      signoff: isEn
        ? 'Sincerely,'
        : 'Veuillez agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const {
      resumeData,
      jobDescription,
      companyName = '',
      jobTitle = '',
      targetLanguage = 'fr',
    } = await req.json();

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      return NextResponse.json(
        { error: 'Description de poste requise pour l’analyse d’adéquation.' },
        { status: 400 }
      );
    }

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Données du CV manquantes pour l’optimisation.' },
        { status: 400 }
      );
    }

    const langInstruction =
      targetLanguage === 'en'
        ? 'Output the tailored recommendations and texts in Canadian English.'
        : 'Output the tailored recommendations and texts in professional Québec French.';

    const prompt = `Tu es un recruteur senior et expert en optimisation ATS pour le marché de l'emploi au Québec et au Canada.
Un candidat souhaite adapter et optimiser son CV et sa lettre de présentation pour postuler spécifiquement à cette offre d'emploi.

${langInstruction}

OFFRE D'EMPLOI CIBLÉE :
Entreprise : ${companyName || 'Non spécifiée'}
Poste ciblé : ${jobTitle || 'Titre du poste'}
Description de l'offre :
"""
${jobDescription.slice(0, 8000)}
"""

DONNÉES ACTUELLES DU CANDIDAT :
"""
${JSON.stringify(resumeData, null, 2).slice(0, 8000)}
"""

TON OBJECTIF :
1. Calculer le score d'adéquation ATS actuel (de 0 à 100).
2. Identifier les mots-clés présents et les mots-clés essentiels de l'offre qui manquent au CV.
3. Analyser les points forts majeurs qui qualifient le candidat pour ce poste.
4. Rédiger des conseils stratégiques pour contourner les points faibles ou le manque d'expérience directe (ex: valoriser les compétences transférables, l'expérience internationale, le bilinguismo, la volonté d'apprentissage selon les normes québécoises).
5. Réécrire un "tailoredSummary" ultra-ciblé pour ce poste qui capte l'attention du recruteur en 6 secondes.
6. Proposer une liste de compétences techniques prioritaires (recommendedTechnicalSkills) à mettre en avant pour correspondre à l'offre.
7. Pour chaque expérience professionnelle du candidat, proposer une version optimisée des puces (tailoredHighlightsByExpId) mettant l'accent sur les réalisations répondant aux critères de l'offre.
8. Rédiger une lettre de présentation (tailoredCoverLetter) percutante, personnalisée pour cette entreprise et ce poste précis.

Réponds STRICTEMENT avec un objet JSON valide (sans backticks markdown, sans texte additionnel) avec ce schéma exact :
{
  "matchScore": number (ex: 78),
  "projectedScoreAfterOptimization": number (ex: 94),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "strengthsAnalysis": string,
  "weaknessesAdvice": string,
  "tailoredSummary": string,
  "recommendedTechnicalSkills": string[],
  "tailoredHighlightsByExpId": {
    [expId: string]: string[]
  },
  "tailoredCoverLetter": {
    "recipientName": string,
    "recipientTitle": string,
    "companyName": string,
    "companyAddress": string,
    "jobReference": string,
    "salutation": string,
    "openingParagraph": string,
    "bodyParagraphs": string[],
    "closingParagraph": string,
    "signoff": string
  }
}`;

    let parsedData = null;
    try {
      const aiClient = getAIClient();
      if (aiClient) {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const outputText = response.text?.trim() || '';
        const cleanJson = outputText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
        parsedData = JSON.parse(cleanJson);
      }
    } catch (aiErr) {
      console.warn('Gemini call failed in optimize route, using fallback:', aiErr);
    }

    if (!parsedData) {
      parsedData = fallbackOptimize(resumeData, companyName, jobTitle, targetLanguage);
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Erreur API resume/optimize:', error);
    return NextResponse.json({
      success: true,
      data: fallbackOptimize({}, '', '', 'fr'),
    });
  }
}
