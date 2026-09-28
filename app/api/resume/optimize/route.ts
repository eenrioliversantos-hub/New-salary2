import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text?.trim() || '';
    const cleanJson = outputText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Erreur API resume/optimize:', error);
    return NextResponse.json(
      { error: error?.message || 'Échec de l’optimisation du CV pour cette offre.' },
      { status: 500 }
    );
  }
}
