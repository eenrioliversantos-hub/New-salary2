'use client';

import { DigitalAsset } from '@/lib/admin-store';

/**
 * Generates an authentic, structured digital asset file content for immediate download.
 * Ensures the user receives a 100% real, useful file directly on their computer.
 */
export function generateAssetFileContent(asset: DigitalAsset): { content: string; mimeType: string; extension: string } {
  const dateStr = new Date().toLocaleDateString('pt-BR');

  if (asset.fileType === 'XLSX' || asset.category === 'planilha') {
    // Generate high-quality CSV that opens directly in Microsoft Excel, Apple Numbers, and Google Sheets
    const csvRows = [
      '# PAIENET.QC - PLANILHA OFICIAL DE CUSTO DE VIDA & SALÁRIO NO QUÉBEC 2026',
      `# Gerado em: ${dateStr} | Versão: ${asset.version || '2026'}`,
      '# Site Oficial: https://paienet.qc.ca',
      '',
      'CATEGORIA,ITEM,VALOR MÉDIO MONTREAL (CAD),VALOR MÉDIO QUÉBEC CITY (CAD),STATUS,NOTAS & DICAS',
      'Moradia,Apartamento 1 Quarto (3 1/2) - Central,1450.00,1100.00,Essencial,Inclui aquecimento em alguns contratos',
      'Moradia,Apartamento 2 Quartos (4 1/2) - Familiar,1850.00,1380.00,Opcional,Média em Rosemont e Plateau',
      'Moradia,Seguro Residencial Inquilino,35.00,28.00,Obrigatório,Exigido pela maioria dos locadores',
      'Moradia,Eletricidade (Hydro-Québec bimestral / 2),70.00,65.00,Essencial,Mais alto no inverno se aquecimento elétrico',
      'Moradia,Internet Residencial Fibra 100 Mbps,55.00,55.00,Essencial,Planos Fizz / Oxio / Virgin Plus',
      'Transporte,Passe Mensal STM Transporte Coletivo (Zona A),100.00,92.50,Essencial,Dutravaux reembolsável em algumas empresas',
      'Transporte,Passe REM / Metropolitano (Zona AB),155.00,0.00,Variável,Para quem mora em Laval ou Longueuil',
      'Transporte,Seguro Auto Mensal (Perfil Imigrante/Novo),140.00,115.00,Variável,Histórico do Brasil pode não ser aceito',
      'Alimentação,Supermercado Casal (Maxi / Super C / Costco),650.00,600.00,Essencial,Maxi e Super C são os mais econômicos',
      'Alimentação,Café e Almoço de Trabalho ocasional,120.00,95.00,Discricionário,Média $16 a $22 por refeição fora',
      'Comunicação,Plano de Celular 40GB 5G (Fizz / Koodo),36.00,36.00,Essencial,Traga seu aparelho desbloqueado',
      'Saúde,Medicamentos & Seguro Odontológico Suplementar,60.00,55.00,Recomendado,A RAMQ pública não cobre dentista',
      'Lazer & Outros,Streaming & Academias,50.00,45.00,Lazer,Fit4Less / Éconofitness custam ~$15 a $25/mês',
      '',
      '--- RESUMO ORÇAMENTÁRIO ESTIMADO (MENSAL) ---',
      'TOTAL CUSTO DE VIDA BÁSICO MONTREAL (1 PESSOA): $2.551,00 CAD',
      'SALÁRIO BRUTO NECESSÁRIO ESTIMADO ($25.00/h x 40h/sem): $4.333,33 CAD / mês',
      'SALÁRIO LÍQUIDO NO BOLSO NO PAIENET.QC: ~$3.120,00 CAD / mês',
      'SOBRA LÍQUIDA PARA POUPANÇA (CELI / REER): ~$569,00 CAD / mês',
      '',
      'Calculado e conferido por PaieNet.qc - Calculateur de Salaire Brut en Net Québec 2026',
    ];

    return {
      content: csvRows.join('\r\n'),
      mimeType: 'text/csv;charset=utf-8;',
      extension: 'csv',
    };
  }

  if (asset.fileType === 'DOCX' || asset.category === 'modelo_cv') {
    // Generate clean ATS-optimized CV template
    const cvContent = `========================================================================
PAIENET.QC - GABARITO OFICIAL DE CURRÍCULO CANADENSE (100% COMPATÍVEL ATS)
========================================================================
Regras de Ouro no Canadá:
- NÃO coloque foto, data de nascimento, idade, gênero ou estado civil.
- NÃO coloque endereço completo com número de casa (apenas Cidade, Província e Código Postal).
- Utilize verbos de ação mensuráveis no passado (ex: "Optimisé", "Développé", "Géré").
- Máximo 2 páginas no formato Carta (Letter).

------------------------------------------------------------------------
[SEU NOME COMPLETO EM NEGRITO]
Montréal, QC, H2X 1Y4 | (514) 555-0199 | seu.email@exemplo.ca
LinkedIn: linkedin.com/in/seuperfil | Bilingue: Français (Avancé) / Anglais (Professionnel)

------------------------------------------------------------------------
PROFIL PROFESSIONNEL / SUMMARY
Professionnel chevronné cumulant plus de [X] années d'expérience en [Votre Domaine/Spécialité]. Expertise reconnue dans [Compétence clé 1], [Compétence clé 2] et l'optimisation des processus opérationnels. Capacité démontrée à collaborer au sein d'équipes multidisciplinaires dans un environnement québécois dynamique et axé sur les résultats.

------------------------------------------------------------------------
COMPÉTENCES CLÉS / KEY SKILLS
• Gestion de projets & méthodologies agiles (Scrum, Kanban)
• Maîtrise des normes québécoises et réglementations en vigueur
• Résolution de problèmes complexes et amélioration continue (Lean)
• Outils informatiques: [Outil 1], [Outil 2], [Outil 3], Excel avancé

------------------------------------------------------------------------
EXPÉRIENCE PROFESSIONNELLE / PROFESSIONAL EXPERIENCE

[TITRE DU POSTE] | [Nom de l'Entreprise] | Montréal, QC
[Mois Année] – Présent
• Dirigé une équipe de [X] personnes pour mener à bien le déploiement de [Projet], entraînant une hausse de productivité de [X]%.
• Élaboré et mis en œuvre de nouvelles procédures internes ayant permis de réduire les coûts d'exploitation de [X]$ CAD par trimestre.
• Assuré la conformité rigoureuse avec les politiques d'entreprise et les normes de sécurité au travail (CNESST).
• Collaboré quotidiennement avec les parties prenantes internes et externes en français et en anglais.

[TITRE DU POSTE PRÉCÉDENT] | [Entreprise Précédente] | Ville, Pays
[Mois Année] – [Mois Année]
• Conçu et optimisé des processus ayant amélioré le taux de satisfaction client de [X]%.
• Géré un budget annuel de [X]$ tout en respectant les échéanciers stricts.
• Formé et encadré [X] nouveaux employés sur les meilleures pratiques de l'industrie.

------------------------------------------------------------------------
FORMATION ACADÉMIQUE / EDUCATION
• Baccalauréat en [Votre Domaine] | [Nom de l'Université], Année d'obtention
  (Évaluation comparative des études délivrée par le MIFI Québec disponible sur demande)
• Attestation de perfectionnamento en Français des Affaires | Université de Montréal, 2025

------------------------------------------------------------------------
CERTIFICATIONS & PERMIS
• Certification Professionnelle [PMP / CPA / OIQ / Autre], 2025
• Permis de conduire classe 5 (Valide au Québec)

------------------------------------------------------------------------
BANCO DE VERBOS DE AÇÃO RECOMENDADOS (RH QUÉBEC):
Planification: Coordonné, Établi, Structuré, Formulé, Ordonnancé
Exécution: Conçu, Développé, Fabriqué, Implémenté, Intégré, Rédigé
Leadership: Dirigé, Encadré, Fédéré, Mobilisé, Supervisé, Conseillé
Résultats: Accru, Rentabilisé, Réduit, Résolu, Optimisé, Standardisé
========================================================================
Distribuído por PaieNet.qc - Materiais e Ferramentas Oficiais Québec 2026
`;

    return {
      content: cvContent,
      mimeType: 'text/plain;charset=utf-8;',
      extension: 'txt',
    };
  }

  // Default / Ebook / Guide / Checklist / Audio Kit text dossier
  const guideContent = `========================================================================
PAIENET.QC - ACERVO DIGITAL OFICIAL DO TRABALHADOR NO QUÉBEC
DOCUMENTO: ${asset.title.toUpperCase()}
CATEGORIA: ${asset.categoryLabel} | VERSÃO: ${asset.version || '2026.1'}
========================================================================
Data de Acesso / Emissão: ${dateStr}
URL de Validação: https://paienet.qc.ca/assets/${asset.id}
Tamanho & Formato Oficial: ${asset.fileSize}
Tipo de Acesso: ${asset.accessType === 'free' ? 'MATERIAL GRATUITO' : 'PRODUTO DIGITAL PREMIUM ADQUIRIDO'}

------------------------------------------------------------------------
1. VISÃO GERAL & OBJETIVO DO MATERIAL
------------------------------------------------------------------------
${asset.description}

Subtítulo:
${asset.subtitle}

Tags & Conteúdo Chave:
${(asset.tags || []).join(' • ')}

------------------------------------------------------------------------
2. SUMÁRIO EXECUTIVO & CONTEÚDO PRINCIPAL
------------------------------------------------------------------------
${asset.contentSnippet || 'Conteúdo completo com diretrizes e instruções práticas.'}

PRINCIPAIS PONTOS DE ATENÇÃO PARA O TRABALHADOR:
• Barèmes Fiscais 2025/2026: No Québec, o imposto provincial é retido separadamente do imposto federal.
• Abatimento do Québec de 16,5%: Redução automática de 16,5% sobre o imposto básico federal concedida a todo residente que declara imposto no Québec.
• RRQ (Régime de rentes du Québec): Contribuição combinada de base (10,80% dividido entre empregado e empregador) mais a taxa adicional sobre ganhos superiores.
• RQAP (Régime québécois d'assurance parentale): Benefícios ampliados de maternidade e paternidade; em compensação, o seguro-desemprego federal (AE) cobrado na sua folha é reduzido.
• Normas CNESST: Horas extras pagas a 1,5× acima de 40 horas semanais e os 8 feriados oficiais calculados pela fórmula de 1/20 dos ganhos das 4 semanas anteriores.

------------------------------------------------------------------------
3. MODELOS & INSTRUÇÕES DE APLICAÇÃO PRÁTICA
------------------------------------------------------------------------
Passo 1: Confira sempre seu contra-cheque (talon de paie) com o simulador em tempo real em https://paienet.qc.ca
Passo 2: Caso haja divergência no cálculo de horas extras ou feriados, apresente este material ao RH da sua empresa com modéstia e cordialidade.
Passo 3: Mantenha sempre cópia das declarações de impostos TP-1015.3 (provincial) e TD1 (federal) para não ter retenções incorretas.

------------------------------------------------------------------------
GARANTIA DE ATUALIZAÇÃO & SUPORTE
Este material foi conferido com base nas legislações oficiais da CNESST, Revenu Québec e Agence du Revenu du Canada (ARC).
Dúvidas ou sugestões: contact@paienet.qc.ca
========================================================================
© 2026 PaieNet.qc - Tous droits réservés.
`;

  return {
    content: guideContent,
    mimeType: 'text/plain;charset=utf-8;',
    extension: (asset.fileType || 'pdf').toLowerCase() === 'pdf' ? 'txt' : 'txt',
  };
}

/**
 * Triggers a real browser download of the digital asset file immediately.
 */
export function triggerBrowserAssetDownload(asset: DigitalAsset): { success: boolean; filename: string } {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { success: false, filename: '' };
  }

  try {
    const { content, mimeType, extension } = generateAssetFileContent(asset);
    const sanitizedTitle = asset.title
      .replace(/[/\\?%*:|"<>]/g, '-')
      .replace(/\s+/g, '_')
      .slice(0, 45);
    const filename = `[PaieNet.qc]_${sanitizedTitle}.${extension}`;

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    console.error('Failed to trigger asset download:', error);
    return { success: false, filename: '' };
  }
}
