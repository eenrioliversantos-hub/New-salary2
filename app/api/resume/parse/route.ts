import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text?.trim() || '';
    // Nettoyer si des blocs de code sont retournés
    const cleanJson = outputText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Erreur API resume/parse:', error);
    return NextResponse.json(
      { error: error?.message || 'Échec de l’extraction et de la conversion du CV.' },
      { status: 500 }
    );
  }
}
