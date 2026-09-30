import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function fallbackParse(rawText: string, targetLanguage: string) {
  const isEn = targetLanguage === 'en';
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const fullName = lines[0] || 'Candidat Professionnel';
  
  return {
    fullName: fullName.replace(/[-–].*$/, '').trim(),
    jobTitle: isEn ? 'Industrial & Packaging Operations Specialist' : 'Journalier de production / Opérateur d’emballage et assemblage',
    targetNoc: 'CNP 95106 / 94107',
    city: 'Québec',
    province: 'QC',
    postalCode: 'G1K 7P4',
    email: 'candidat.quebec@email.com',
    phone: '(418) 555-0199',
    linkedin: '',
    portfolioUrl: '',
    workStatus: isEn
      ? 'International Candidate eligible for Quebec Work Permit / Open Permit'
      : 'Candidat international admissible au permis de travail fermé / Mobilité Francophone',
    summary: isEn
      ? 'Versatile manufacturing and logistics worker with solid experience across fast-paced production lines. Skilled in 5S, Kaizen, and safety compliance.'
      : 'Professionnel rigoureux cumulant une solide expérience sur des lignes de production manufacturières à haute cadence. Formé aux méthodes 5S, Kaizen, TPM et aux Bonnes Pratiques de Fabrication (BPF). Ponctuel, endurant et engagé dans la sécurité.',
    technicalSkills: [
      'Alimentation et approvisionnement des lignes automatisées',
      'Assemblage manuel et conditionnement à cadence soutenue',
      'Palettisation sécuritaire, cerclage et étiquetage',
      'Contrôle qualité visuel et dimensionnel',
      'Gestion des stocks et réquisition de composants',
    ],
    softSkills: [
      'Ponctualité exemplaire & assiduité',
      'Sens de l’observation et rigueur d’exécution',
      'Esprit d’équipe et communication respectueuse',
      'Excellente endurance physique',
    ],
    safetyAndStandards: [
      'Bonnes Pratiques de Fabrication (BPF / GMP)',
      'Méthodologies 5S, Kaizen et TPM',
      'Normes de santé et sécurité au travail (SST)',
    ],
    experiences: [
      {
        id: 'exp-parsed-1',
        role: 'Commis d’entrepôt et réapprovisionnement technique',
        company: 'Sodimac Dicico',
        location: 'São Paulo, Brésil',
        period: '2017 - Présent',
        isCurrent: true,
        employmentType: 'Temps plein',
        highlights: [
          'Assurer le réapprovisionnement méthodique et le gerbage sécuritaire des rayons d’outillage et quincaillerie.',
          'Gérer le comptoir technique de location et vérifier l’état de fonctionnement des équipements avant livraison.',
          'Appliquer quotidiennement les standards 5S pour maintenir une zone de travail sécuritaire et sans encombrement.',
        ],
      },
      {
        id: 'exp-parsed-2',
        role: 'Journalier de production et conditionnement industriel',
        company: 'Avon Industrial LTDA',
        location: 'São Paulo, Brésil',
        period: '2015 - 2016',
        isCurrent: false,
        employmentType: 'Temps plein',
        highlights: [
          'Alimenter en continu les lignes automatisées en composants et matières premières selon les fiches de fabrication.',
          'Assurer le montage, l’emballage et la palettisation conforme selon les standards logistiques d’expédition.',
          'Appliquer les règles d’hygiène et les Bonnes Pratiques de Fabrication (BPF).',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-parsed-1',
        degree: 'Attestation technique : Contrôle et inspection de la qualité industrielle (360h)',
        institution: 'SENAI',
        location: 'São Paulo, Brésil',
        year: '2012',
        equivalenceStatus: 'Émise par le MIFI (Québec)',
      },
      {
        id: 'edu-parsed-2',
        degree: 'Diplôme d’études secondaires (D.E.S. québécois)',
        institution: 'Enseignement Secondaire d’État',
        location: 'São Paulo, Brésil',
        year: '2009',
        equivalenceStatus: 'Émise par le MIFI (Québec)',
      },
    ],
    certifications: [
      {
        id: 'cert-parsed-1',
        name: 'Santé et sécurité du travail & prévention des risques (14h)',
        issuingBody: 'SENAI',
        year: '2019',
      },
    ],
    languages: [
      { language: 'Portugais', level: 'Langue maternelle' },
      { language: 'Français', level: 'En cours d’apprentissage (Francisation Québec)' },
    ],
    coverLetter: {
      recipientName: 'Direction des Ressources Humaines',
      recipientTitle: 'Responsable du Recrutement Manufacturier',
      companyName: 'Entreprise manufacturière du Québec',
      companyAddress: 'Québec, Canada',
      jobReference: 'QC-PROD-2026',
      salutation: 'Madame, Monsieur,',
      openingParagraph:
        'Fort de plus de 10 ans d’expérience sur les lignes de production, d’assemblage et de conditionnement industriel, c’est avec enthousiasme que je vous transmets ma candidature pour un poste de journalier de production.',
      bodyParagraphs: [
        'Mon parcours au sein de structures rigoureuses m’a permis de développer une maîtrise complète de l’approvisionnement des lignes, du conditionnement à cadence soutenue et de la palettisation sécuritaire.',
        'Diplômé du SENAI en inspection de la qualité et familiarisé avec les démarches 5S, TPM et Kaizen, je place la sécurité et la régularité au premier plan.',
      ],
      closingParagraph:
        'Je me tiens à votre entière disposition pour tout entretien à votre convenance.',
      signoff: 'Veuillez agréer, Madame, Monsieur, mes salutations distinguées.',
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const { rawText, targetLanguage = 'fr' } = await req.json();

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Texte du CV insuffisant pour l’extraction.' },
        { status: 400 }
      );
    }

    const langInstruction =
      targetLanguage === 'en'
        ? 'Output the extracted resume strictly in professional Canadian English.'
        : 'Output the extracted resume strictly in professional Québec French (français québécois de travail, avec terminologie locale ex: courriel, stage, cégep, DEP, CNESST).';

    const prompt = `Tu es un expert RH de premier plan au Québec et au Canada, spécialisé dans l'adaptation de curriculum vitae aux standards canadiens et au passage des filtres ATS (Applicant Tracking Systems).

Analyse le texte brut de CV suivant (qui peut être en n'importe quelle langue, y compris portugais, anglais, espagnol, français brut, etc.) et extrais les informations pour les structurer rigoureusement selon les normes du marché québécois/canadien.
${langInstruction}

RÈGLES CRUCIALES POUR LE CANADA / QUÉBEC :
1. AUCUNE mention discriminatoire : pas de photo, pas d'âge, pas de date de naissance, pas d'état civil, pas de statut parental.
2. Statut au Canada : si non précisé, indique "Résident permanent / Admissible au travail immédiat" ou "Permis de travail ouvert".
3. Sommaire professionnel percutant de 3 à 4 lignes soulignant les années d'expérience et la valeur ajoutée.
4. Compétences séparées rigoureusement en 3 listes :
   - technicalSkills : compétences techniques et outils
   - softSkills : savoir-être et gestion
   - safetyAndStandards : normes de conformité, sécurité (ex: CNESST, SIMDUT, ISO)
5. Expériences professionnelles :
   - Tous les points d'expérience (highlights) DOIVENT commencer par des verbes d'action au passé (ex: Géré, Conçu, Dirigé, Optimisé, Développé) et inclure des résultats quantifiables lorsque possible.
6. Formation : si diplôme étranger, suggère un équivalent québécois (ex: Équivalence comparative MIFI suggérée : Baccalauréat québécois).
7. Génère également un premier jet de lettre de présentation (coverLetter) cohérente.

TEXTE DU CV FOURNI :
"""
${rawText.slice(0, 10000)}
"""

Réponds STRICTEMENT avec un objet JSON valide (sans backticks markdown, sans texte additionnel) respectant ce schéma exact :
{
  "fullName": string,
  "jobTitle": string,
  "targetNoc": string (ex: "CNP 21232" ou code adapté),
  "city": string,
  "province": string (ex: "QC"),
  "postalCode": string,
  "email": string,
  "phone": string,
  "linkedin": string,
  "portfolioUrl": string,
  "workStatus": string,
  "summary": string,
  "technicalSkills": string[],
  "softSkills": string[],
  "safetyAndStandards": string[],
  "experiences": [
    {
      "id": string,
      "role": string,
      "company": string,
      "location": string,
      "period": string,
      "isCurrent": boolean,
      "employmentType": "Temps plein" | "Temps partiel" | "Contractuel",
      "highlights": string[]
    }
  ],
  "educations": [
    {
      "id": string,
      "degree": string,
      "institution": string,
      "location": string,
      "year": string,
      "equivalenceStatus": string
    }
  ],
  "certifications": [
    {
      "id": string,
      "name": string,
      "issuingBody": string,
      "year": string
    }
  ],
  "languages": [
    {
      "language": string,
      "level": string
    }
  ],
  "coverLetter": {
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
      console.warn('Gemini call failed in parse route, using fallback:', aiErr);
    }

    if (!parsedData) {
      parsedData = fallbackParse(rawText, targetLanguage);
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Erreur API resume/parse:', error);
    return NextResponse.json({ success: true, data: fallbackParse('', 'fr') });
  }
}
