import { ResumeData } from './ResumeBuilder';

export type CareerLevel = 'premier_emploi' | 'etudiant' | 'junior' | 'intermediaire' | 'senior';

export type CareerSector =
  | 'tech'
  | 'sante'
  | 'industrie'
  | 'construction'
  | 'admin'
  | 'finance'
  | 'commerce'
  | 'transport';

export interface FullPreset {
  id: string;
  nocCode: string;
  titleFr: string;
  titleEn: string;
  category: string;
  level: CareerLevel;
  sector: CareerSector;
  badge: string;
  highlightsFr: string;
  data: ResumeData;
}

export const RICH_PRESETS_CATALOG: FullPreset[] = [
  // 0. CANDIDAT ADAPTÉ : JOURNALIER DE PRODUCTION / CONDITIONNEMENT (BRÉSIL -> QUÉBEC)
  {
    id: 'henrique-production-quebec',
    nocCode: '95106',
    titleFr: 'Journalier / Opérateur de production & emballage (Henrique Santos)',
    titleEn: 'Production & Packaging Assembler / Machine Operator (Canada Standard)',
    category: 'Manufacturier, Machinerie & CNESST',
    level: 'intermediaire',
    sector: 'industrie',
    badge: '⭐ Profil Réel Adapté Québec',
    highlightsFr: 'Profil adapté selon les normes québécoises : 5S, Kaizen, BPF, palettisation, SENAI qualité & suppression des critères discriminatoires.',
    data: {
      fullName: 'Henrique de Oliveira Santos',
      jobTitle: 'Journalier de production / Opérateur d’emballage et d’approvisionnement',
      targetNoc: 'CNP 95106 / 94107 (TEER 4 & 5 - Opérations manufacturières)',
      city: 'São Paulo (Candidat Québec / Mobilité Francophone)',
      province: 'QC',
      postalCode: 'G1K 7P4',
      email: 'henriqueoliveira248@gmail.com',
      phone: '+55 (11) 96507-2483',
      linkedin: '',
      portfolioUrl: '',
      workStatus: 'Candidat international admissible au permis de travail fermé / Mobilité Francophone / Journées Québec',
      summary:
        'Opérateur et journalier de production industrielle d’expérience cumulant plus de 10 années de pratique continue en milieu manufacturier et logistique à haute cadence (secteurs cosmétique, automobile et distribution technique). Diplômé du SENAI en inspection de la qualité et lecture de plans techniques (720 heures de formation spécialisée). Maîtrise rigoureuse des Bonnes Pratiques de Fabrication (BPF / GMP), des méthodologies 5S, TPM et Kaizen, ainsi que des règles de sécurité en milieu industriel. Reconnu pour sa ponctualité exemplaire, son endurance physique, sa minutie et sa forte capacité d’adaptation aux horaires postés.',
      technicalSkills: [
        'Alimentation continue et approvisionnement des lignes de conditionnement',
        'Assemblage mécanique et manuel de sous-ensembles et composants',
        'Conditionnement, mise en boîte, pesée et étiquetage à haute cadence',
        'Palettisation, cerclage, filmage et gerbage sécuritaire des palettes',
        'Contrôle de la qualité visuel et dimensionnel (pied à coulisse, micromètre)',
        'Lecture et interprétation de plans et dessins techniques industriels',
        'Gestion des stocks, réquisition de composants et saisie de rapports de production',
      ],
      softSkills: [
        'Ponctualité exemplaire & assiduité irréprochable',
        'Sens du détail, vigilance constante et rigueur d’exécution',
        'Esprit d’équipe, entraide et respect des consignes hiérarchiques',
        'Excellente condition et endurance physique (travail debout prolongé)',
        'Grande facilité d’apprentissage sur nouveaux équipements et polyvalence',
      ],
      safetyAndStandards: [
        'Bonnes Pratiques de Fabrication (BPF / GMP industrielles)',
        'Méthodologies d’amélioration continue : 5S, Kaizen et TPM',
        'Santé et sécurité du travail (SST), ergonomie posturale et port des EPI',
        'Tri sélectif, gestion sécuritaire et écologique des matières résiduelles',
      ],
      experiences: [
        {
          id: 'exp-henrique-1',
          role: 'Commis principal à l’approvisionnement et service technique',
          company: 'Sodimac Dicico (Groupe Falabella)',
          location: 'São Paulo, Brésil',
          period: '06/2017 - Présent',
          isCurrent: true,
          employmentType: 'Temps plein',
          highlights: [
            'Assurer le réapprovisionnement méthodique, le gerbage et le facing rigoureux des allées d’outillages et matériaux de construction.',
            'Contrôler l’exactitude de la tarification, l’étiquetage code-barres et la rotation des stocks pour prévenir toute rupture en rayon.',
            'Gérer le comptoir technique de location et de vente d’outillage spécialisé, incluant l’inspection visuelle et le test de fonctionnement avant mise à disposition.',
            'Appliquer rigoureusement les préceptes 5S pour maintenir une zone de circulation et de stockage sans risque d’accident et conforme aux normes SST.',
          ],
        },
        {
          id: 'exp-henrique-2',
          role: 'Journalier de production et conditionnement industriel',
          company: 'Avon Industrial LTDA (Secteur Cosmétique)',
          location: 'São Paulo, Brésil',
          period: '01/2015 - 11/2016',
          isCurrent: false,
          employmentType: 'Temps plein',
          highlights: [
            'Alimenter sans interruption les lignes de conditionnement automatisées en flacons, étiquettes, bouchons et matières premières.',
            'Réaliser l’assemblage, la mise en étuis, le pesage et l’encaissage de produits cosmétiques en respectant scrupuleusement les cadences requises.',
            'Assurer la palettisation soignée, le filmage étirable et l’étiquetage logistique des palettes finies conformément aux fiches de spécification d’expédition.',
            'Prendre en charge la réquisition, le décompte et le retour en magasin des reliquats de production, ainsi que l’évacuation des matières résiduelles selon les protocoles de tri sélectif.',
            'Maintenir un niveau d’hygiène irréprochable et appliquer les Bonnes Pratiques de Fabrication (BPF) tout au long du cycle.',
          ],
        },
        {
          id: 'exp-henrique-3',
          role: 'Aide-opérateur et assembleur de composants de sécurité',
          company: 'Chris Cintos de Segurança LTDA (Secteur Automobile)',
          location: 'São Paulo, Brésil',
          period: '03/2011 - 02/2013',
          isCurrent: false,
          employmentType: 'Temps plein',
          highlights: [
            'Préparer et acheminer les sous-ensembles métalliques et sangles techniques vers les postes d’assemblage de ceintures de sécurité automobile.',
            'Effectuer le montage minutieux, le contrôle visuel des pièces assemblées et le conditionnement protecteur contre les rayures et chocs.',
            'Participer au contrôle qualité de premier niveau en vérifiant la conformité par rapport aux fiches d’instructions de travail du poste.',
            'Prendre part aux réunions de quart et appliquer les standards Kaizen et TPM pour optimiser les flux de pièces et réduire les gaspillages de temps.',
            'Entretenir les aires de travail et les outillages manuels dans un état de propreté constant (méthode 5S).',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-henrique-1',
          degree: 'Diplôme d’études secondaires (DES - Équivalence comparative québécoise)',
          institution: 'Enseignement Secondaire d’État',
          location: 'São Paulo, Brésil',
          year: '2009',
          equivalenceStatus: 'Émise par le MIFI (Québec)',
        },
        {
          id: 'edu-henrique-2',
          degree: 'Attestation technique : Contrôle et inspection de la qualité en milieu manufacturier (360 h)',
          institution: 'SENAI (Service National d’Apprentissage Industriel)',
          location: 'São Paulo, Brésil',
          year: '2012',
          equivalenceStatus: 'Émise par le MIFI (Québec)',
        },
        {
          id: 'edu-henrique-3',
          degree: 'Attestation technique : Lecture et interprétation de dessin technique mécanique (360 h)',
          institution: 'SENAI (Service National d’Apprentissage Industriel)',
          location: 'São Paulo, Brésil',
          year: '2011',
          equivalenceStatus: 'Émise par le MIFI (Québec)',
        },
      ],
      certifications: [
        {
          id: 'cert-henrique-1',
          name: 'Santé et sécurité du travail & prévention des risques industriels (14 heures)',
          issuingBody: 'SENAI',
          year: '2019',
        },
        {
          id: 'cert-henrique-2',
          name: 'Perfectionnement aux méthodologies industrielles : TPM, 5S et KAIZEN',
          issuingBody: 'Formation continue en industrie',
          year: 'Acquis',
        },
      ],
      languages: [
        { language: 'Portugais', level: 'Langue maternelle' },
        { language: 'Français', level: 'Notions de base en progression (Motivé à la francisation Québec)' },
        { language: 'Anglais', level: 'Notions de travail de base' },
      ],
      coverLetter: {
        recipientName: 'Direction des Ressources Humaines & Équipe Recrutement',
        recipientTitle: 'Responsable de la Sélection Industrielle & Opérations',
        companyName: 'Entreprise manufacturière du Québec',
        companyAddress: 'Québec, Canada',
        jobReference: 'QC-PROD-2026',
        salutation: 'Madame, Monsieur,',
        openingParagraph:
          'Fort d’une trajectoire de plus de 10 ans sur des lignes de production manufacturières, d’assemblage et de conditionnement industriel, c’est avec enthousiasme et détermination que je vous soumets ma candidature pour un poste de journalier de production ou d’opérateur d’emballage.',
        bodyParagraphs: [
          'Au sein d’environnements industriels réputés tels qu’Avon Industrial et Chris Cintos de Segurança, j’ai développé une rigueur à toute épreuve dans l’approvisionnement en continu des chaînes, l’emballage à cadence soutenue, la conformité du cerclage et la palettisation sécuritaire. Ma double formation de 720 heures au SENAI en inspection de la qualité et lecture de plans techniques me procure une vigilance naturelle quant aux tolérances et au respect des Bonnes Pratiques de Fabrication (BPF).',
          'Rompu aux méthodes 5S, Kaizen et TPM, je place la sécurité au travail (SST), l’entraide entre collègues et la constance au cœur de mon quotidien. Ponctuel, doté d’une excellente endurance et prêt à m’adapter aux quarts rotatifs (jour, soir, nuit), je suis impatient de mettre mon engagement au service de vos opérations au Québec.',
        ],
        closingParagraph:
          'Je serais ravi de vous exposer plus en détail ma motivation et mes compétences lors d’un entretien virtuel à votre convenance.',
        signoff: 'Veuillez agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
      },
    },
  },
  // 1. PREMIER EMPLOI / DÉBUTANT (0 EXPÉRIENCE FORMELLE)
  {
    id: 'premier-emploi-debutant',
    nocCode: '65100',
    titleFr: 'Premier Emploi / Débutant (0 Expérience)',
    titleEn: 'First Job / Entry-Level (Zero Formal Experience)',
    category: 'Premier Emploi & Débutant',
    level: 'premier_emploi',
    sector: 'commerce',
    badge: '🌱 1er Emploi & Jeunesse',
    highlightsFr: 'Spécifiquement conçu pour décrocher un premier emploi sans expérience formelle au Québec.',
    data: {
      fullName: 'Lucas Bouchard',
      jobTitle: 'Aide Général & Service à la Clientèle (Premier Emploi)',
      targetNoc: 'CNP 65100 (TEER 5)',
      city: 'Québec',
      province: 'QC',
      postalCode: 'G1V 4M6',
      email: 'lucas.bouchard.qc@email.com',
      phone: '(418) 555-0321',
      linkedin: '',
      portfolioUrl: '',
      workStatus: 'Citoyen canadien (Admissible au travail immédiat)',
      summary:
        'Jeune travailleur motivé, ponctuel et dynamique ayant complété son diplôme d’études secondaires (DES). Reconnu par mes enseignants et mes pairs pour mon sens des responsabilités, mon esprit d’entraide et ma rapidité d’apprentissage. Désireux de m’investir avec sérieux dans une première opportunité d’emploi au service à la clientèle ou aux opérations générales.',
      technicalSkills: [
        'Opération de caisse et terminaux de paiement',
        'Réception et rangement sécuritaire des marchandises',
        'Entretien et propreté des aires de travail',
        'Suite bureautique (Google Docs, Word, Excel de base)',
        'Gestion des stocks et inventaires de base',
      ],
      softSkills: [
        'Ponctualité exemplaire & assiduité',
        'Excellente facilité et rapidité d’apprentissage',
        'Sens du service client et politesse naturelle',
        'Esprit d’équipe et attitude positive',
        'Fiabilité sous supervision minimale',
      ],
      safetyAndStandards: [
        'Sensibilisation aux normes de sécurité au travail',
        'Bonnes pratiques d’hygiène et salubrité alimentaire',
        'Formation RCR & Premiers soins (Croix-Rouge)',
      ],
      experiences: [
        {
          id: 'exp-first-1',
          role: 'Bénévole Logistique & Accueil aux Événements',
          company: 'Maison des Jeunes & Centre Communautaire de Sainte-Foy',
          location: 'Québec, QC',
          period: '2023 - 2024',
          isCurrent: false,
          employmentType: 'Temps partiel',
          highlights: [
            'Accueillir chaleureusement plus de 150 visiteurs et participants lors des activités communautaires hebdomadaires.',
            'Coordonner la mise en place, le montage et le démontage sécuritaire du matériel audio et des tables.',
            'Assurer le maintien de la propreté des lieux et respecter scrupuleusement les consignes de sécurité du centre.',
            'Démontrer une fiabilité totale avec 100 % de présence aux quarts assignés.',
          ],
        },
        {
          id: 'exp-first-2',
          role: 'Entretien Paysager & Travaux Saisonniers Résidentiels',
          company: 'Travail autonome / Quartier Sainte-Foy',
          location: 'Québec, QC',
          period: 'Étés 2022 - 2023',
          isCurrent: false,
          employmentType: 'Saisonnier',
          highlights: [
            'Fournir des services d’entretien paysager (tonte, ramassage des feuilles, déneigement léger) auprès de 8 clients réguliers.',
            'Gérer son horaire avec autonomie et livrer un travail soigné respectant les exigences des propriétaires.',
            'Percevoir les paiements et maintenir une relation de confiance et de courtoisie exemplaire.',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-first-1',
          degree: 'Diplôme d’études secondaires (D.E.S.)',
          institution: 'École secondaire de Rochebelle',
          location: 'Québec, QC',
          year: '2024',
          equivalenceStatus: 'Diplôme canadien complété',
        },
      ],
      certifications: [
        {
          id: 'cert-first-1',
          name: 'Certificat Secourisme général & RCR/DEA niveau C',
          issuingBody: 'Croix-Rouge canadienne',
          year: '2024',
        },
        {
          id: 'cert-first-2',
          name: 'Sensibilisation Santé & Sécurité pour Nouveaux Travailleurs',
          issuingBody: 'CNESST Québec',
          year: '2024',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle (Parfaite maîtrise)' },
        { language: 'Anglais', level: 'Intermédiaire fonctionnel (Accueil client)' },
      ],
      volunteerWork: [
        {
          organization: 'Guignolée des Médias / Moisson Québec',
          role: 'Bénévole tri et collecte de denrées',
          period: 'Novembre 2023',
          details: 'Collecte et classement des dons alimentaires pour les familles défavorisées de la région de Québec.',
        },
      ],
      coverLetter: {
        recipientName: 'Responsable du Recrutement & Équipe RH',
        recipientTitle: 'Directeur des Opérations / Gérant',
        companyName: 'Entreprise québécoise d’excellence',
        companyAddress: 'Québec, QC',
        jobReference: 'EMPLOI-PREMIER-2026',
        salutation: 'Madame, Monsieur,',
        openingParagraph:
          'Récemment diplômé de mes études secondaires et animé par une grande volonté d’apprendre et de m’investir, je vous soumets avec enthousiasme ma candidature pour un premier emploi au sein de votre établissement reconnu.',
        bodyParagraphs: [
          'Bien que débutant sur le marché du travail officiel, mes expériences bénévoles au Centre communautaire de Sainte-Foy et mes projets saisonniers m’ont permis de développer une ponctualité irréprochable, un excellent sens du contact humain et une attitude respectueuse en tout temps.',
          'Je suis particulièrement attiré par votre équipe pour son environnement dynamique. Doté d’une grande énergie et d’une capacité d’adaptation rapide, je suis prêt à recevoir les formations requises et à exécuter avec minutie toutes les tâches qui me seront confiées.',
        ],
        closingParagraph:
          'Disponible immédiatement selon un horaire flexible, je serais honoré de pouvoir vous rencontrer lors d’une entrevue afin de vous témoigner de vive voix de ma motivation et de mon sérieux.',
        signoff: 'Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations les plus respectueuses.',
      },
    },
  },

  // 2. ÉTUDIANT & STAGIAIRE (STAGE CO-OP / CÉGEP / UNIVERSITÉ)
  {
    id: 'etudiant-stagiaire-coop',
    nocCode: '21232',
    titleFr: 'Étudiant(e) & Stagiaire (Stage CO-OP / TI)',
    titleEn: 'Student & Co-op Intern (Computer Science / Tech)',
    category: 'Étudiant & Stages CO-OP',
    level: 'etudiant',
    sector: 'tech',
    badge: '🎓 Étudiant & Stage CO-OP',
    highlightsFr: 'Optimisé pour les stages universitaires/collégiaux, projets GitHub et disponibilité étudiante.',
    data: {
      fullName: 'Camille Roy',
      jobTitle: 'Stagiaire en Génie Logiciel & Développement Web (Stage CO-OP)',
      targetNoc: 'CNP 21232 (TEER 1)',
      city: 'Montréal',
      province: 'QC',
      postalCode: 'H3T 1J4',
      email: 'camille.roy.coop@polymtl.ca',
      phone: '(514) 555-0876',
      linkedin: 'linkedin.com/in/camilleroy-dev',
      portfolioUrl: 'github.com/camilleroy-tech',
      workStatus: 'Citoyenne canadienne (Admissible stage CO-OP)',
      summary:
        'Étudiante de 3e année au Baccalauréat en Génie Logiciel à Polytechnique Montréal (Moyenne : 3.7/4.0). Passionnée par les architectures web modernes (React, Next.js, Node.js, Python), les tests automatisés et l’intégration continue. À la recherche d’un stage CO-OP de 4 mois où contribuer activement au développement de fonctionnalités concrètes en équipe Agile.',
      technicalSkills: [
        'TypeScript, JavaScript (ES6+), Python, C++',
        'React, Next.js, Tailwind CSS, HTML5/CSS3',
        'Node.js, Express, PostgreSQL, Prisma ORM',
        'Git, GitHub Actions, Docker (notions de base)',
        'Tests unitaires avec Jest et Cypress',
      ],
      softSkills: [
        'Curiosité intellectuelle & auto-apprentissage rapide',
        'Communication technique claire et collaborative',
        'Rigueur d’analyse et résolution de bogues',
        'Capacité à travailler en sprints Agile / Scrum',
      ],
      safetyAndStandards: [
        'Bonnes pratiques de sécurité OWASP Web',
        'Code propre (Clean Code & revue de code)',
        'Conformité accessibilité WCAG 2.1',
      ],
      experiences: [
        {
          id: 'exp-student-1',
          role: 'Développeuse Web & Assistante de Recherche (Projet Étudiant)',
          company: 'Laboratoire d’Informatique Distribuée - Polytechnique Montréal',
          location: 'Montréal, QC',
          period: '2023 - Présent',
          isCurrent: true,
          employmentType: 'Temps partiel',
          highlights: [
            'Concevoir une interface web réactive sous React et TypeScript pour visualiser des flux de données en temps réel.',
            'Intégrer des API RESTful et optimiser les composants pour garantir un affichage fluide de 10 000+ points de données.',
            'Mettre en place des tests d’intégration automatisés avec Jest, réduisant les régressions logicielles de 25 %.',
            'Collaborer avec 2 étudiants diplômés lors de réunions hebdomadaires de suivi scientifique.',
          ],
        },
        {
          id: 'exp-student-2',
          role: 'Tutrice en Programmation (Python & Algorithmique)',
          company: 'Association des Étudiants de Polytechnique Montréal (AEP)',
          location: 'Montréal, QC',
          period: '2022 - 2023',
          isCurrent: false,
          employmentType: 'Temps partiel',
          highlights: [
            'Encadrer plus de 30 étudiants de 1re année dans l’apprentissage des structures de données et des algorithmes en Python.',
            'Vulgariser les concepts complexes (récursivité, programmation orientée objet, complexité temporelle).',
            'Recevoir un taux d’appréciation positif de 96 % pour la clarté pédagogique et la patience démontrée.',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-student-1',
          degree: 'Baccalauréat en Génie Logiciel (En cours - 84/120 crédits)',
          institution: 'Polytechnique Montréal',
          location: 'Montréal, QC',
          year: 'Prévu 2026',
          equivalenceStatus: 'Programme accrédité BCAPG / OIQ',
        },
        {
          id: 'edu-student-2',
          degree: 'D.E.C. en Sciences pures et appliquées',
          institution: 'Collège Jean-de-Brébeuf',
          location: 'Montréal, QC',
          year: '2022',
          equivalenceStatus: 'Diplôme collégial québécois',
        },
      ],
      certifications: [
        {
          id: 'cert-student-1',
          name: 'Meta Front-End Developer Professional Certificate',
          issuingBody: 'Coursera / Meta',
          year: '2023',
        },
        {
          id: 'cert-student-2',
          name: 'Gagnante 2e place - Hackathon ConFoo Montréal',
          issuingBody: 'ConFoo Tech Conference',
          year: '2023',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Bilingue professionnel (C1/C2)' },
      ],
      volunteerWork: [
        {
          organization: 'Club Robotique Polytechnique Montréal',
          role: 'Membre équipe programmation embarquée',
          period: '2023 - 2024',
          details: 'Développement de scripts de contrôle en C++ et Python pour la compétition internationale.',
        },
      ],
      coverLetter: {
        recipientName: 'Comité de Sélection des Stagiaires CO-OP',
        recipientTitle: 'Gestionnaire du Recrutement Campus',
        companyName: 'Studio Tech Montréal',
        companyAddress: 'Montréal, QC',
        jobReference: 'STAGE-ETE-2026-DEV',
        salutation: 'Madame, Monsieur,',
        openingParagraph:
          'Actuellement en 3e année de Baccalauréat en Génie Logiciel à Polytechnique Montréal, je souhaite poser ma candidature pour le poste de Stagiaire en Développement Web (Session Été 2026) au sein de votre équipe reconnue pour son excellence technologique.',
        bodyParagraphs: [
          'Au cours de mes projets académiques et personnels, j’ai développé une solide maîtrise des technologies modernes telles que TypeScript, React et Node.js. Mon rôle d’assistante au laboratoire m’a appris à concevoir des architectures modulaires et à respecter des standards de tests unitaires rigoureux.',
          'Votre projet de plateforme distribuée correspond parfaitement à mes intérêts d’ingénierie. Dynamique, curieuse et dotée d’un esprit d’équipe rodé aux méthodologies Agiles, je suis impatiente de contribuer à vos sprints tout en apprenant aux côtés de vos développeurs seniors.',
        ],
        closingParagraph:
          'Disponible à temps plein pour une durée de 4 mois dès mai 2026, je me tiens à votre entière disposition pour une entrevue afin d’échanger sur les défis techniques de votre équipe.',
        signoff: 'Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
      },
    },
  },

  // 3. TECH & TI : DÉVELOPPEUR FULL-STACK CLOUD (INTERMÉDIAIRE)
  {
    id: 'tech-dev-fullstack',
    nocCode: '21232',
    titleFr: 'Développeur Full-Stack Web & Cloud',
    titleEn: 'Full-Stack Web & Cloud Developer',
    category: 'Technologies de l’Information',
    level: 'intermediaire',
    sector: 'tech',
    badge: '💻 Tech, Web & IA',
    highlightsFr: 'Standardisé pour les entreprises tech de Montréal, startups et cabinets conseils canadiens.',
    data: {
      fullName: 'Marc-Antoine Gagnon',
      jobTitle: 'Développeur Full-Stack Web & Cloud (React / Node / AWS)',
      targetNoc: 'CNP 21232 (TEER 1)',
      city: 'Montréal',
      province: 'QC',
      postalCode: 'H2X 1Y6',
      email: 'marc.gagnon.dev@email.com',
      phone: '(438) 555-0819',
      linkedin: 'linkedin.com/in/marcantoine-gagnon',
      portfolioUrl: 'github.com/magagnon-code',
      workStatus: 'Résident permanent (Admissible au travail immédiat)',
      summary:
        'Développeur Full-Stack cumulant 5 années d’expérience dans la conception d’applications SaaS résilientes à haut trafic à Montréal. Spécialisé en React 19, TypeScript, Next.js et architectures microservices Node.js/AWS. Reconnu pour ma rigueur d’ingénierie logicielle, l’optimisation de bases de données relationnelles volumineuses et le mentorat au sein d’équipes Scrum.',
      technicalSkills: [
        'TypeScript & JavaScript (ESNext)',
        'React, Next.js (App Router), Tailwind CSS',
        'Node.js, NestJS, Express, GraphQL & REST',
        'PostgreSQL, Redis, Prisma ORM, MongoDB',
        'AWS (ECS, Lambda, S3, RDS), Docker, CI/CD',
        'Tests Jest, Vitest, Cypress (85%+ coverage)',
      ],
      softSkills: [
        'Résolution de problèmes et refactorisation stratégique',
        'Communication technique bilingue (français/anglais)',
        'Mentorat de développeurs juniors',
        'Animation de rétrospectives et cérémonies Scrum',
      ],
      safetyAndStandards: [
        'Normes de sécurité OWASP Top 10',
        'Conformité Loi 25 Québec (Protection des données)',
        'Accessibilité numérique WCAG 2.1 AA',
      ],
      experiences: [
        {
          id: 'exp-tech-1',
          role: 'Développeur Full-Stack Intermédiaire / Senior',
          company: 'CloudScale Solutions Inc.',
          location: 'Montréal, QC',
          period: '2022 - Présent',
          isCurrent: true,
          employmentType: 'Temps plein',
          highlights: [
            'Diriger la refonte de la plateforme client vers Next.js avec Server Components, réduisant le First Contentful Paint de 45 %.',
            'Concevoir une architecture de traitement de commandes asynchrone via AWS SQS et Node.js supportant 80 000 requêtes/jour.',
            'Améliorer les requêtes PostgreSQL et indexations complexes, abaissant la latence médiane de 180 ms à 42 ms.',
            'Mettre en place des pipelines CI/CD automatisés avec GitHub Actions et conteneurs Docker pour des déploiements sans interruption.',
          ],
        },
        {
          id: 'exp-tech-2',
          role: 'Développeur Front-End Web',
          company: 'Numérique Média Québec',
          location: 'Québec, QC',
          period: '2020 - 2022',
          isCurrent: false,
          employmentType: 'Temps plein',
          highlights: [
            'Développer des interfaces utilisateur interactives sous React et Redux Toolkit pour 4 portails de nouvelles à fort achalandage.',
            'Collaborer étroitement avec les designers UX/UI sur Figma pour créer un Design System unifié de 60+ composants réutilisables.',
            'Assurer une conformité stricte aux normes d’accessibilité WCAG 2.1 AA.',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-tech-1',
          degree: 'Baccalauréat en Informatique et Génie Logiciel',
          institution: 'Université de Sherbrooke',
          location: 'Sherbrooke, QC',
          year: '2020',
          equivalenceStatus: 'Diplôme québécois accrédité',
        },
      ],
      certifications: [
        {
          id: 'cert-tech-1',
          name: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
          issuingBody: 'Amazon Web Services',
          year: '2023',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Bilinguisme professionnel complet' },
      ],
      coverLetter: {
        recipientName: 'Direction de l’Ingénierie Logicielle',
        recipientTitle: 'VP Ingénierie / Head of Engineering',
        companyName: 'Fintech Québec Innovations',
        companyAddress: 'Montréal, QC',
        jobReference: 'TECH-DEV-2026',
        salutation: 'Madame, Monsieur,',
        openingParagraph:
          'Fort de 5 années d’expérience concrète dans la conception d’architectures web et cloud à haut volume à Montréal, c’est avec enthousiasme que je soumets ma candidature pour le poste de Développeur Full-Stack au sein de votre équipe d’ingénierie.',
        bodyParagraphs: [
          'Au cours de mon parcours chez CloudScale Solutions, j’ai orchestré la migration de nos systèmes stratégiques vers Next.js et AWS, réduisant de 45 % le temps de chargement et sécurisant les flux selon les exigences de la Loi 25 québécoise.',
          'Votre vision d’excellence technologique et votre culture Agile résonnent profondément avec mes valeurs de code propre et de fiabilité des systèmes. Je serais fier de mettre mes compétences en TypeScript et cloud au service de votre croissance.',
        ],
        closingParagraph:
          'Je me tiens à votre entière disposition pour une entrevue afin de vous présenter les réalisations chiffrées de mes mandats passés.',
        signoff: 'Veuillez agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
      },
    },
  },

  // 4. SANTÉ : INFIRMIÈRE CLINICIENNE (OIIQ / SANTÉ QUÉBEC)
  {
    id: 'sante-infirmiere-oiiq',
    nocCode: '31301',
    titleFr: 'Infirmière Clinicienne (OIIQ / Santé)',
    titleEn: 'Registered Nurse (OIIQ / Healthcare)',
    category: 'Santé, Soins Infirmiers & Clinique',
    level: 'senior',
    sector: 'sante',
    badge: '🏥 Santé & OIIQ',
    highlightsFr: 'Conforme aux exigences de l’OIIQ, des CISSS/CIUSSS et de la déontologie médicale au Québec.',
    data: {
      fullName: 'Isabelle Morin',
      jobTitle: 'Infirmière Clinicienne (Membre OIIQ)',
      targetNoc: 'CNP 31301 (TEER 1)',
      city: 'Laval',
      province: 'QC',
      postalCode: 'H7M 3L2',
      email: 'isabelle.morin.inf@email.com',
      phone: '(450) 555-0914',
      linkedin: 'linkedin.com/in/isabelle-morin-inf',
      portfolioUrl: '',
      workStatus: 'Citoyenne canadienne (Permis d’exercice OIIQ valide)',
      summary:
        'Infirmière clinicienne d’expérience (7 ans) membre en règle de l’Ordre des infirmières et infirmiers du Québec (OIIQ). Spécialisée en médecine d’urgence et soins intensifs au sein du réseau public de santé (CISSS/CIUSSS). Reconnue pour mon jugement clinique sûr lors des situations critiques, mon leadership d’équipe bienveillant et la tenue rigoureuse des dossiers médicaux informatisés.',
      technicalSkills: [
        'Évaluation clinique avancée et triage selon l’ÉTG',
        'Administration sécuritaire de médications intraveineuses et soins complexes',
        'Gestion des voies respiratoires et monitorage hémodynamique',
        'Logiciels cliniques (Dossier Santé Québec DSQ, Cristal-Net, Oacis)',
        'Protocoles de prévention et contrôle des infections (PCI)',
      ],
      softSkills: [
        'Gestion exceptionnelle du stress en situation de crise',
        'Communication interdisciplinaire efficace et empathique',
        'Leadership d’équipe et soutien aux nouveaux diplômés',
        'Écoute active et plaidoyer pour les droits du patient',
      ],
      safetyAndStandards: [
        'Code de déontologie de l’OIIQ',
        'Protocoles RCR / ACLS avancés (Soins d’urgence)',
        'Normes de santé et sécurité au travail (CNESST / PDSB)',
      ],
      experiences: [
        {
          id: 'exp-nurse-1',
          role: 'Infirmière Clinicienne aux Urgences',
          company: 'Hôpital de la Cité-de-la-Santé (CISSS de Laval)',
          location: 'Laval, QC',
          period: '2020 - Présent',
          isCurrent: true,
          employmentType: 'Temps plein',
          highlights: [
            'Assurer la prise en charge clinique et le triage rapide de 40+ patients critiques par quart de travail.',
            'Collaborer en synergie avec les urgentologues, inhalothérapeutes et pharmaciens lors de réanimations cardiopulmonaires.',
            'Agir à titre d’infirmière préceptrice auprès de 6 candidates à l’exercice de la profession (CEPI).',
            'Participer activement au comité d’amélioration continue des flux patients pour réduire le temps d’attente aux urgences.',
          ],
        },
        {
          id: 'exp-nurse-2',
          role: 'Infirmière en Unité de Médecine Interne',
          company: 'Hôpital Maisonneuve-Rosemont (CIUSSS de l’Est)',
          location: 'Montréal, QC',
          period: '2017 - 2020',
          isCurrent: false,
          employmentType: 'Temps plein',
          highlights: [
            'Dispenser des soins globaux et personnalisés à une cohorte de 6 à 8 patients hospitalisés avec pathologies multiples.',
            'Élaborer des plans thérapeutiques infirmiers (PTI) individualisés et enseigner les protocoles de congé aux familles.',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-nurse-1',
          degree: 'Baccalauréat en Sciences infirmières (B.Sc.Inf.)',
          institution: 'Université de Montréal',
          location: 'Montréal, QC',
          year: '2017',
          equivalenceStatus: 'Diplôme accrédité OIIQ',
        },
      ],
      certifications: [
        {
          id: 'cert-nurse-1',
          name: 'Permis d’exercice régulier - OIIQ (#219842)',
          issuingBody: 'Ordre des infirmières et infirmiers du Québec',
          year: '2017 - Actif',
        },
        {
          id: 'cert-nurse-2',
          name: 'Certification ACLS (Advanced Cardiovascular Life Support)',
          issuingBody: 'Fondation des maladies du cœur et de l’AVC',
          year: '2023',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Avancé professionnel (Soins bilingues)' },
      ],
      coverLetter: {
        recipientName: 'Direction des Soins Infirmiers',
        recipientTitle: 'Chef de Service / Recrutement Clinique',
        companyName: 'Centre Intégré de Santé (CISSS)',
        companyAddress: 'Laval, QC',
        jobReference: 'SANTE-OIIQ-2026',
        salutation: 'Madame, Monsieur,',
        openingParagraph:
          'Infirmière clinicienne cumulant 7 années d’exercice en milieu hospitalier aigu et membre en règle de l’OIIQ, c’est avec un profond dévouement que je soumets ma candidature pour rejoindre votre équipe clinique.',
        bodyParagraphs: [
          'Mon expérience aux urgences de la Cité-de-la-Santé m’a permis de consolider un jugement clinique rapide et une maîtrise exemplaire des protocoles de réanimation hémodynamique, tout en maintenant une écoute humaine rassurante auprès des usagers et de leurs proches.',
          'Je suis particulièrement engagée dans le maintien de la sécurité des soins et le travail d’équipe interdisciplinaire. Votre établissement jouit d’une solide réputation de qualité des soins à laquelle je souhaite apporter mon énergie et mon professionnalisme.',
        ],
        closingParagraph:
          'Je me tiens à votre disposition pour convenir d’une rencontre afin d’échanger sur les besoins actuels de vos départements cliniques.',
        signoff: 'Veuillez agréer, Madame, Monsieur, mes salutations distinguées.',
      },
    },
  },

  // 5. INDUSTRIE : OPÉRATEUR & MAINTENANCE (CNESST / CADENCE)
  {
    id: 'industrie-operateur-cnesst',
    nocCode: '94100',
    titleFr: 'Opérateur de machines / Ligne de production',
    titleEn: 'Machine Operator / Automated Line',
    category: 'Manufacturier, Machinerie & CNESST',
    level: 'intermediaire',
    sector: 'industrie',
    badge: '⚙️ Industrie & CNESST',
    highlightsFr: 'Haute cadence, santé sécurité CNESST, cadenassage LOTO, maintenance préventive.',
    data: {
      fullName: 'Alexandre Tremblay',
      jobTitle: 'Technicien en Production & Maintenance Industrielle',
      targetNoc: 'CNP 94100 (TEER 4)',
      city: 'Québec',
      province: 'QC',
      postalCode: 'G1K 7P4',
      email: 'alexandre.tremblay@email.com',
      phone: '(418) 555-0192',
      linkedin: 'linkedin.com/in/alexandretremblay',
      portfolioUrl: '',
      workStatus: 'Résident permanent (Admissible au travail immédiat)',
      summary:
        'Professionnel technique rigoureux cumulant plus de 4 années d’expérience sur les lignes manufacturières automatisées au Québec. Reconnu pour ma ponctualité exemplaire, ma stricte adhésion aux normes CNESST/SIMDUT et ma capacité à résoudre les pannes mécaniques en direct pour préserver les cadences de production.',
      technicalSkills: [
        'Opération de lignes automatisées (120 u/min)',
        'Maintenance préventive de 1er niveau',
        'Diagnostic mécanique et pneumatique',
        'Systèmes ERP de production',
        'Contrôle qualité & tolérances métrologiques',
      ],
      softSkills: [
        'Rigueur et sens de l’observation',
        'Esprit d’équipe & Entraide',
        'Gestion des priorités sous pression',
        'Autonomie & Ponctualité',
      ],
      safetyAndStandards: [
        'Normes CNESST & SIMDUT 2015',
        'Procédures de cadenassage (LOTO)',
        'Bonnes pratiques de fabrication (BPF / HACCP)',
      ],
      experiences: [
        {
          id: 'exp-ind-1',
          role: 'Opérateur Principal de Ligne de Production',
          company: 'Biscuits Leclerc Ltée',
          location: 'Saint-Augustin-de-Desmaures, QC',
          period: '2023 - Présent',
          isCurrent: true,
          employmentType: 'Temps plein',
          highlights: [
            'Superviser le fonctionnement continu d’une ensacheuse automatisée cadencée à 120 paquets/minute sans compromis sur la qualité.',
            'Réduire les arrêts imprévus de 18 % grâce à des rondes d’inspection préventive des convoyeurs et cellules photoélectriques.',
            'Effectuer des vérifications métrologiques toutes les 30 minutes conformément aux critères HACCP et aux normes d’hygiène.',
            'Former et intégrer 3 nouveaux opérateurs aux règles de cadenassage sécuritaire et aux standards de l’usine.',
          ],
        },
        {
          id: 'exp-ind-2',
          role: 'Adjoint de Maintenance & Assemblage Mécanique',
          company: 'Industries Mécaniques du Québec',
          location: 'Lévis, QC',
          period: '2021 - 2023',
          isCurrent: false,
          employmentType: 'Temps plein',
          highlights: [
            'Assemblage et ajustement de pièces métalliques de précision selon les plans industriels et tolérances strictes.',
            'Membre actif du comité de santé et sécurité (CSS) : participation aux audits internes et à l’élimination des risques.',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-ind-1',
          degree: 'D.E.P. en Mécanique industrielle de construction et d’entretien',
          institution: 'Centre de formation professionnelle de Québec',
          location: 'Québec, QC',
          year: '2021',
          equivalenceStatus: 'Diplôme canadien',
        },
      ],
      certifications: [
        {
          id: 'cert-ind-1',
          name: 'Certification SIMDUT 2015 & Cadenassage sécuritaire',
          issuingBody: 'Santé et Sécurité Québec',
          year: '2024',
        },
        {
          id: 'cert-ind-2',
          name: 'Chariot élévateur (Cariste classe 1, 4 et 5)',
          issuingBody: 'Centre de Formation Logistique',
          year: '2023',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle / Courant professionnel' },
        { language: 'Anglais', level: 'Intermédiaire fonctionnel (compréhension technique)' },
      ],
      coverLetter: {
        recipientName: 'Direction des Ressources Humaines',
        recipientTitle: 'Responsable du Recrutement Technique',
        companyName: 'Biscuits Leclerc Ltée',
        companyAddress: 'Saint-Augustin-de-Desmaures, QC',
        jobReference: 'REQ-2026-OP94',
        salutation: 'Madame, Monsieur,',
        openingParagraph:
          'C’est avec un grand enthousiasme que je soumets ma candidature pour le poste d’Opérateur de Ligne de Production automatisée au sein de vos installations de renom. Fort de plus de 4 années d’expérience concrète sur des équipements à haute cadence au Québec, je souhaite mettre ma rigueur et ma maîtrise des cadences au service de votre excellence opérationnelle.',
        bodyParagraphs: [
          'Au cours de mon parcours chez Biscuits Leclerc, j’ai développé une solide expertise dans le réglage fin des ensacheuses automatisées et la surveillance continue des flux. En anticipant les micro-arrêts et en appliquant une maintenance préventive rigoureuse, j’ai contribué à réduire les temps d’arrêt de 18 % tout en garantissant une conformité stricte aux normes HACCP.',
          'Par ailleurs, ma formation complète aux protocoles de la CNESST, au cadenassage sécuritaire (LOTO) et au SIMDUT 2015 me permet d’évoluer dans un environnement industriel exigeant avec le plus haut niveau de vigilance pour la sécurité de mon équipe.',
        ],
        closingParagraph:
          'Rejoindre votre équipe représenterait pour moi l’opportunité d’apporter une contribution immédiate et pérenne à vos objectifs de production. Je me tiens à votre entière disposition pour une entrevue afin de vous exposer plus en détail la pertinence de mon profil.',
        signoff: 'Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
      },
    },
  },

  // 6. ADMINISTRATION & RH : ADJOINTE ADMINISTRATIVE BILINGUE
  {
    id: 'admin-adjointe-bilingue',
    nocCode: '13110',
    titleFr: 'Adjointe Administrative Bilingue & RH',
    titleEn: 'Bilingual Administrative & HR Assistant',
    category: 'Administration, RH & Bureautique',
    level: 'intermediaire',
    sector: 'admin',
    badge: '📋 Admin & Bureautique',
    highlightsFr: 'Bilinguisme parfait FR/EN, coordination de direction, facturation, Loi 25.',
    data: {
      fullName: 'Sophie Lavoie',
      jobTitle: 'Adjointe Administrative de Direction & Coordination RH',
      targetNoc: 'CNP 13110 (TEER 3)',
      city: 'Laval',
      province: 'QC',
      postalCode: 'H7N 4V2',
      email: 'sophie.lavoie.admin@email.com',
      phone: '(514) 555-0144',
      linkedin: 'linkedin.com/in/sophielavoie-admin',
      portfolioUrl: '',
      workStatus: 'Citoyenne canadienne',
      summary:
        'Adjointe administrative bilingue (français/anglais) cumulant 6 années d’expérience en soutien exécutif, gestion de la facturation et coordination des dossiers RH. Experte de la suite Microsoft 365 (Excel avancé, SharePoint) et des progiciels de paie. Reconnue pour ma rigueur méthodologique, mon sens élevé de la discrétion et ma capacité à anticiper les besoins de la direction.',
      technicalSkills: [
        'Gestion des comptes payables/recevables et facturation',
        'Microsoft 365 expert (Excel avancé, PowerPoint, Teams)',
        'Tenue d’agendas exécutifs et logistique de conseils d’administration',
        'Logiciels comptables QuickBooks & Acomba',
        'Gestion électronique des documents (GED) et archivage',
      ],
      softSkills: [
        'Discrétion absolue et sens de la confidentialité',
        'Excellent entregent et relations professionnelles',
        'Gestion des priorités multitâches avec sang-froid',
        'Bilinguisme fluide à l’oral et à l’écrit (FR/EN)',
      ],
      safetyAndStandards: [
        'Conformité Loi 25 sur la protection des données personnelles',
        'Normes de rédaction et protocole d’affaires du Québec',
      ],
      experiences: [
        {
          id: 'exp-admin-1',
          role: 'Adjointe Administrative Principale',
          company: 'Groupe Logistique Québec Inc.',
          location: 'Laval, QC',
          period: '2021 - Présent',
          isCurrent: true,
          employmentType: 'Temps plein',
          highlights: [
            'Prendre en charge la gestion d’agenda et la correspondance officielle bilingue pour 3 directeurs corporatifs.',
            'Superviser le cycle de facturation mensuel de 250+ clients avec un taux d’exactitude vérifié de 99,8 %.',
            'Mettre en place une procédure de classement numérique réduisant les délais de recherche documentaire de 35 %.',
            'Coordonner la logistique des réunions de direction et rédiger des comptes-rendus exécutifs précis.',
          ],
        },
        {
          id: 'exp-admin-2',
          role: 'Secrétaire de Bureau & Réceptionniste',
          company: 'Cabinet Conseils Rive-Nord',
          location: 'Montréal, QC',
          period: '2018 - 2021',
          isCurrent: false,
          employmentType: 'Temps plein',
          highlights: [
            'Assurer l’accueil bilingue professionnel en personne et par téléphone pour un cabinet de 25 professionnels.',
            'Préparer les contrats de service et effectuer la saisie de données dans le système ERP de l’entreprise.',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-admin-1',
          degree: 'D.E.C. en Techniques de bureautique et coordination',
          institution: 'Collège Ahuntsic',
          location: 'Montréal, QC',
          year: '2018',
          equivalenceStatus: 'Diplôme québécois complété',
        },
      ],
      certifications: [
        {
          id: 'cert-admin-1',
          name: 'Microsoft Office Specialist: Excel Expert (Office 365)',
          issuingBody: 'Microsoft Corporation',
          year: '2022',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Bilinguisme parfait (C2 oral et écrit)' },
      ],
      coverLetter: {
        recipientName: 'Direction des Ressources Humaines',
        recipientTitle: 'Directeur des Opérations Corporatives',
        companyName: 'Corporation Financière de Montréal',
        companyAddress: 'Montréal, QC',
        jobReference: 'ADMIN-DIR-2026',
        salutation: 'Madame, Monsieur,',
        openingParagraph:
          'Forte de 6 années d’expérience solide en soutien exécutif de direction et coordination administrative bilingue à Montréal, je vous soumets avec enthousiasme ma candidature pour le poste d’Adjointe Administrative Principale.',
        bodyParagraphs: [
          'Au cours de mon mandat chez Groupe Logistique Québec, j’ai développé une rigueur absolue dans la gestion des agendas complexes, le suivi budgétaire de la facturation et la protection rigoureuse des renseignements confidentiels selon la Loi 25.',
          'Polyvalente, proactive et parfaitement bilingue, j’ai à cœur de libérer le temps précieux des gestionnaires en anticipant les échéances et en offrant une image de marque irréprochable auprès de vos partenaires d’affaires.',
        ],
        closingParagraph:
          'Je serais ravie de vous rencontrer en entrevue pour vous détailler comment mon expertise peut soutenir l’efficacité de vos équipes dès aujourd’hui.',
        signoff: 'Je vous prie d’agréer, Madame, Monsieur, mes salutations distinguées.',
      },
    },
  },

  // 7. CONSTRUCTION & MÉTIERS : ÉLECTRICIEN CCQ
  {
    id: 'construction-electricien-ccq',
    nocCode: '72200',
    titleFr: 'Électricien Compagnon Industriel & CCQ',
    titleEn: 'Journeyman Electrician (Industrial & CCQ)',
    category: 'Construction & Métiers Spécialisés',
    level: 'intermediaire',
    sector: 'construction',
    badge: '⚡ CCQ & Électricité',
    highlightsFr: 'Carte CCQ, Code de l’électricité du Québec, cadenassage LOTO, lecture de plans.',
    data: {
      fullName: 'Jean-Philippe Côté',
      jobTitle: 'Électricien Industriel Compagnon (Carte CCQ)',
      targetNoc: 'CNP 72200 (TEER 2)',
      city: 'Trois-Rivières',
      province: 'QC',
      postalCode: 'G8Z 2X8',
      email: 'jp.cote.electricien@email.com',
      phone: '(819) 555-0761',
      linkedin: '',
      portfolioUrl: '',
      workStatus: 'Citoyen canadien (Carte de compétence CCQ active)',
      summary:
        'Électricien compagnon d’expérience cumulant 8 années de pratique sur des chantiers industriels et commerciaux d’envergure au Québec. Titulaire de la carte de compétence de la Commission de la construction du Québec (CCQ) et du certificat de qualification en électricité (Sceau rouge). Spécialiste du raccordement de panneaux haute tension, du dépannage d’automates programmables et du respect absolu des règles de cadenassage CNESST.',
      technicalSkills: [
        'Raccordement de transformateurs et appareillages haute/basse tension',
        'Lecture avancée de schémas unifilaires et devis techniques',
        'Dépannage d’automates PLC (Allen-Bradley, Siemens) et variateurs VFD',
        'Passage de canalisations et câblage industriel lourd',
        'Instrumentation et contrôle de procédé industriel',
      ],
      softSkills: [
        'Rigueur et précision d’exécution sur chantier',
        'Leadership d’équipe et encadrement d’apprentis',
        'Capacité d’adaptation aux horaires et quarts rotatifs',
        'Sens aigu de la responsabilité partagée',
      ],
      safetyAndStandards: [
        'Code de l’électricité du Québec (C22.10)',
        'Protocole strict de cadenassage à énergie zéro (LOTO)',
        'Attestation Sécurité générale sur les chantiers ASP Construction',
        'Norme CSA Z462 (Sécurité en matière d’électricité)',
      ],
      experiences: [
        {
          id: 'exp-elec-1',
          role: 'Électricien Compagnon Industriel',
          company: 'Énergie & Métiers du Bâtiment Mauricie',
          location: 'Trois-Rivières, QC',
          period: '2020 - Présent',
          isCurrent: true,
          employmentType: 'Temps plein',
          highlights: [
            'Superviser l’installation électrique complète de sous-stations industrielles de 600 V avec zéro incident de sécurité déclaré.',
            'Encadrer et superviser les travaux de 3 apprentis électriciens en s’assurant de la conformité au Code de l’électricité.',
            'Effectuer le calibrage de capteurs et le dépannage de boucles de contrôle 4-20 mA en milieu papetier continu.',
          ],
        },
        {
          id: 'exp-elec-2',
          role: 'Apprenti Électricien (Période 3 & 4)',
          company: 'Constructions Électriques du Québec',
          location: 'Québec, QC',
          period: '2016 - 2020',
          isCurrent: false,
          employmentType: 'Temps plein',
          highlights: [
            'Poser des chemins de câbles, tirage de conducteurs de gros calibres et raccordement d’éclairage d’urgence.',
            'Compléter avec succès les 8 000 heures d’apprentissage requises par la CCQ.',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-elec-1',
          degree: 'D.E.P. en Électricité (1 800 heures)',
          institution: 'Centre de formation professionnelle Pavillon de l’Avenir',
          location: 'Rivière-du-Loup, QC',
          year: '2016',
          equivalenceStatus: 'Diplôme d’études professionnelles accrédité',
        },
      ],
      certifications: [
        {
          id: 'cert-elec-1',
          name: 'Certificat de qualification Compagnon Électricien (Sceau rouge)',
          issuingBody: 'Commission de la construction du Québec (CCQ)',
          year: '2020 - Actif',
        },
        {
          id: 'cert-elec-2',
          name: 'Attestation ASP Construction & Nacelle élévatrice',
          issuingBody: 'ASP Construction Québec',
          year: '2022',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Intermédiaire technique (Plans et manuels)' },
      ],
      coverLetter: {
        recipientName: 'Direction des Projets et Opérations',
        recipientTitle: 'Surintendant des Chantiers Électriques',
        companyName: 'Grands Travaux Industriels du Québec',
        companyAddress: 'Bécancour, QC',
        jobReference: 'CCQ-ELEC-2026',
        salutation: 'Monsieur le Surintendant,',
        openingParagraph:
          'Électricien compagnon titulaire de ma carte CCQ et du Sceau rouge, cumulant 8 années de chantiers industriels sans compromis sur la sécurité, je vous présente ma candidature pour les projets d’envergure de votre division industrielle.',
        bodyParagraphs: [
          'Habitué aux environnements d’usine exigeants et aux arrêts de production planifiés, je maîtrise le raccordement d’équipements lourds de 600V et le diagnostic des systèmes automatisés, dans le strict respect de la norme CSA Z462 et du cadenassage.',
          'Ponctuel, méthodique et fier de mon métier, je valorise la collaboration avec les autres corps de métier pour livrer des installations durables dans le respect des échéanciers.',
        ],
        closingParagraph:
          'Disponible immédiatement pour vos chantiers régionaux, je suis à votre entière disposition pour une entrevue.',
        signoff: 'Veuillez agréer, Monsieur le Surintendant, mes salutations professionnelles.',
      },
    },
  },

  // 8. TRANSPORT & LOGISTIQUE : CHAUFFEUR CLASSE 1 (SAAQ)
  {
    id: 'transport-chauffeur-classe1',
    nocCode: '73300',
    titleFr: 'Conducteur de camion de transport (Classe 1)',
    titleEn: 'Transport Truck Driver (Class 1 License)',
    category: 'Logistique, Transport & Machinerie',
    level: 'intermediaire',
    sector: 'transport',
    badge: '🚛 Classe 1 & Transport',
    highlightsFr: 'Permis SAAQ Classe 1 mention FM, dossier de conduite impeccable, log électronique ELD.',
    data: {
      fullName: 'David Tremblay',
      jobTitle: 'Conducteur Professionnel Semi-Remorque (Classe 1 FM)',
      targetNoc: 'CNP 73300 (TEER 3)',
      city: 'Drummondville',
      province: 'QC',
      postalCode: 'J2C 1N8',
      email: 'david.tremblay.transport@email.com',
      phone: '(819) 555-0432',
      linkedin: '',
      portfolioUrl: '',
      workStatus: 'Citoyen canadien (Permis Classe 1 valide)',
      summary:
        'Chauffeur de camion de transport Classe 1 (Semi-remorque) comptant plus de 6 années et plus de 600 000 km sans accident sur les autoroutes québécoises, ontariennes et américaines. Dossier de conduite SAAQ vierge (0 point d’inaptitude). Expert de la vérification avant départ (ronde de sécurité), de l’arrimage conforme des charges et de l’utilisation des carnets de route électroniques (ELD).',
      technicalSkills: [
        'Conduite de trains routiers et semi-remorques 53 pieds',
        'Inspection avant départ rigoureuse (Ronde de sécurité SAAQ)',
        'Gestion des dispositifs de consignation électronique (ELD)',
        'Arrimage et répartition des charges sur essieux',
        'Conduite hivernale préventive en conditions extrêmes',
      ],
      softSkills: [
        'Ponctualité stricte pour les fenêtres de livraison',
        'Autonomie totale et sens de l’orientation',
        'Excellente communication avec les répartiteurs',
        'Résistance à la fatigue et hygiène de vie saine',
      ],
      safetyAndStandards: [
        'Réglementation sur les heures de conduite et de repos (S-4.2)',
        'Transport de marchandises dangereuses (TMD / TDG)',
        'Conformité stricte aux pesées du Contrôle routier Québec',
      ],
      experiences: [
        {
          id: 'exp-trans-1',
          role: 'Conducteur Routier Classe 1 Régional / Interurbain',
          company: 'Transport Trans-Québec Express',
          location: 'Drummondville, QC',
          period: '2021 - Présent',
          isCurrent: true,
          employmentType: 'Temps plein',
          highlights: [
            'Assurer les liaisons quotidiennes Québec - Montréal - Toronto en respectant 99,4 % des créneaux de livraison prévus.',
            'Réaliser des rondes de sécurité systématiques détectant les anomalies mécaniques avant départ, évitant les pannes sur route.',
            'Maintenir un dossier de conformité parfait lors des inspections aléatoires du Contrôle routier Québec (CRQ).',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-trans-1',
          degree: 'D.E.P. en Transport par camion (615 heures)',
          institution: 'Centre de formation en transport de Charlesbourg (CFTC)',
          location: 'Québec, QC',
          year: '2018',
          equivalenceStatus: 'Diplôme professionnel québécois',
        },
      ],
      certifications: [
        {
          id: 'cert-trans-1',
          name: 'Permis de conduire SAAQ Classe 1 avec mentions F (Freins pneumatiques) et M (Transmission manuelle)',
          issuingBody: 'Société de l’assurance automobile du Québec (SAAQ)',
          year: '2018 - Actif',
        },
        {
          id: 'cert-trans-2',
          name: 'Certification Transport des matières dangereuses (TMD)',
          issuingBody: 'CFTC Transport Québec',
          year: '2023',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Intermédiaire fonctionnel (douanes & répartiteurs)' },
      ],
      coverLetter: {
        recipientName: 'Direction de la Répartition et Flotte',
        recipientTitle: 'Chef des Opérations de Transport',
        companyName: 'Lignes de Transport Express Canada',
        companyAddress: 'Drummondville, QC',
        jobReference: 'CLASSE1-DRUM-2026',
        salutation: 'Monsieur le Directeur des Opérations,',
        openingParagraph:
          'Chauffeur professionnel de classe 1 avec plus de 600 000 km sans incident et un dossier SAAQ impeccable, je vous présente ma candidature pour rejoindre votre flotte de conducteurs.',
        bodyParagraphs: [
          'Reconnu pour mon respect des fenêtres de livraison et la rigueur de mes vérifications avant départ, je prends grand soin des équipements qui me sont confiés et applique en tout temps une conduite préventive et éco-énergétique.',
          'Je serais fier de représenter votre entreprise auprès de vos clients lors des livraisons partout au Québec.',
        ],
        closingParagraph:
          'Disponible immédiatement, je vous invite à consulter mon dossier de conduite SAAQ et me tiens prêt pour un essai sur route.',
        signoff: 'Veuillez agréer, Monsieur, mes salutations distinguées.',
      },
    },
  },

  // 9. FINANCE & COMPTABILITÉ : COMPTABLE CPA
  {
    id: 'finance-comptable-cpa',
    nocCode: '11100',
    titleFr: 'Comptable & Analyste Financier (CPA)',
    titleEn: 'Financial Analyst & Accountant (CPA)',
    category: 'Finance, Comptabilité & Fiscalité',
    level: 'senior',
    sector: 'finance',
    badge: '📊 Finance & CPA',
    highlightsFr: 'Titre CPA, états financiers NCECF/IFRS, déclarations fiscales QC/CA, audit.',
    data: {
      fullName: 'Guillaume Mercier',
      jobTitle: 'Comptable Professionnel Agréé (CPA) & Contrôleur',
      targetNoc: 'CNP 11100 (TEER 1)',
      city: 'Montréal',
      province: 'QC',
      postalCode: 'H3B 2Y5',
      email: 'guillaume.mercier.cpa@email.com',
      phone: '(514) 555-0678',
      linkedin: 'linkedin.com/in/guillaumemercier-cpa',
      portfolioUrl: '',
      workStatus: 'Citoyen canadien',
      summary:
        'Comptable professionnel agréé (CPA) cumulant 7 années d’expérience en cabinet comptable et en entreprise manufacturière à Montréal. Expert en clôtures mensuelles, préparation d’états financiers selon les NCECF/IFRS et déclarations fiscales provinciales (Revenu Québec) et fédérales (ARC). Reconnu pour ma modélisation financière avancée sous Excel et la mise en place de contrôles internes robustes.',
      technicalSkills: [
        'Préparation et analyse d’états financiers (IFRS & NCECF)',
        'Fiscalité corporative québécoise et canadienne (T2 / CO-17)',
        'Systèmes ERP comptables (SAP, Microsoft Dynamics 365, QuickBooks)',
        'Modélisation financière avancée et macros Excel (VBA/PowerQuery)',
        'Conformité des taxes de vente (TPS / TVQ / TVH)',
      ],
      softSkills: [
        'Rigueur analytique et intégrité déontologique',
        'Capacité à vulgariser les résultats financiers pour la direction',
        'Sens aigu de la gestion du temps lors des périodes d’audit',
        'Leadership d’équipe et collaboration avec les auditeurs externes',
      ],
      safetyAndStandards: [
        'Code de déontologie de l’Ordre des CPA du Québec',
        'Normes canadiennes d’audit (NCA)',
        'Réglementation fiscale de l’Agence du revenu du Canada et Revenu Québec',
      ],
      experiences: [
        {
          id: 'exp-cpa-1',
          role: 'Contrôleur Financier Adjoint',
          company: 'Groupe Industriel Canadien',
          location: 'Montréal, QC',
          period: '2021 - Présent',
          isCurrent: true,
          employmentType: 'Temps plein',
          highlights: [
            'Superviser le processus de clôture mensuelle et annuelle pour 3 entités générant 45 M$ de chiffre d’affaires.',
            'Réduire les délais de clôture financière de 12 à 5 jours ouvrables grâce à l’automatisation des écritures sous SAP.',
            'Coordonner les missions d’audit annuel avec les auditeurs externes sans aucun ajustement matériel.',
            'Identifier des crédits d’impôt R&D et d’investissement provinciaux générant 180 000 $ d’économies fiscales.',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-cpa-1',
          degree: 'D.E.S.S. en Comptabilité professionnelle (Programme CPA)',
          institution: 'HEC Montréal',
          location: 'Montréal, QC',
          year: '2019',
          equivalenceStatus: 'Diplôme québécois accrédité CPA',
        },
        {
          id: 'edu-cpa-2',
          degree: 'Baccalauréat en Administration des affaires (B.A.A. - Comptabilité)',
          institution: 'HEC Montréal',
          location: 'Montréal, QC',
          year: '2018',
          equivalenceStatus: 'Diplôme universitaire québécois',
        },
      ],
      certifications: [
        {
          id: 'cert-cpa-1',
          name: 'Titre de Comptable Professionnel Agréé (CPA)',
          issuingBody: 'Ordre des CPA du Québec',
          year: '2020 - Actif',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Bilingue professionnel complet' },
      ],
      coverLetter: {
        recipientName: 'Direction des Finances',
        recipientTitle: 'Chef de la Direction Financière (CFO)',
        companyName: 'Société d’Investissements Québec',
        companyAddress: 'Montréal, QC',
        jobReference: 'CPA-DIR-2026',
        salutation: 'Madame, Monsieur,',
        openingParagraph:
          'Comptable professionnel agréé (CPA) cumulant 7 années d’expertise en consolidation financière et conformité fiscale corporative à Montréal, c’est avec enthousiasme que je pose ma candidature pour le poste de Contrôleur Financier.',
        bodyParagraphs: [
          'Au cours de mon mandat chez Groupe Industriel Canadien, j’ai réduit de plus de 50 % les délais de clôture mensuelle tout en optimisant la structure des contrôles internes et des déclarations fiscales selon les normes NCECF.',
          'Reconnu pour ma précision analytique et mon leadership proactif, je serais ravi de collaborer étroitement avec votre direction pour éclairer vos prises de décision stratégiques.',
        ],
        closingParagraph:
          'Je me tiens à votre disposition pour une entrevue afin de vous présenter l’impact concret de mes réalisations.',
        signoff: 'Veuillez agréer, Madame, Monsieur, mes salutations distinguées.',
      },
    },
  },

  // 10. VENTE & SERVICE CLIENTÈLE : CONSEILLÈRE BILINGUE
  {
    id: 'commerce-vente-service',
    nocCode: '64100',
    titleFr: 'Conseillère en Vente & Service Clientèle Bilingue',
    titleEn: 'Bilingual Sales Consultant & Client Services',
    category: 'Ventes, Commerce & Marketing',
    level: 'junior',
    sector: 'commerce',
    badge: '🛍️ Vente & Service Client',
    highlightsFr: 'Bilinguisme actif FR/EN, atteinte d’objectifs de vente (+15%), caisse et CRM.',
    data: {
      fullName: 'Émilie Cloutier',
      jobTitle: 'Conseillère aux Ventes & Spécialiste Service Clientèle Bilingue',
      targetNoc: 'CNP 64100 (TEER 4)',
      city: 'Montréal',
      province: 'QC',
      postalCode: 'H1W 2P3',
      email: 'emilie.cloutier.vente@email.com',
      phone: '(514) 555-0552',
      linkedin: 'linkedin.com/in/emilie-cloutier-vente',
      portfolioUrl: '',
      workStatus: 'Citoyenne canadienne',
      summary:
        'Conseillère en vente consultative et service à la clientèle bilingue (français/anglais) cumulant 3 années d’expérience dans le commerce de détail haut de gamme à Montréal. Reconnue pour mon écoute empathique des besoins clients, ma capacité à dépasser les objectifs de vente mensuels de 15 % et la fidélisation d’une clientèle régulière exigeante.',
      technicalSkills: [
        'Techniques de vente consultative et valorisation produit',
        'Logiciels de point de vente (Lightspeed, Shopify POS)',
        'Gestion des retours et traitement des réclamations clients',
        'Tenue de caisse et réconciliations financières quotidiennes',
        'Merchandising visuel et mise en valeur des rayons',
      ],
      softSkills: [
        'Bilinguisme actif et entregent naturel',
        'Écoute active et orientation solution immédiate',
        'Enthousiasme et esprit d’équipe positif',
        'Gestion des situations délicates avec diplomatie',
      ],
      safetyAndStandards: [
        'Loi sur la protection du consommateur du Québec',
        'Normes de santé et sécurité au travail en magasin',
      ],
      experiences: [
        {
          id: 'exp-sale-1',
          role: 'Conseillère en Vente & Accueil Clientèle',
          company: 'Boutique Mode & Design Montréal',
          location: 'Montréal, QC',
          period: '2022 - Présent',
          isCurrent: true,
          employmentType: 'Temps plein',
          highlights: [
            'Dépasser les cibles de vente mensuelles individuelles de 15 % en moyenne sur 18 mois consécutifs.',
            'Offrir un accueil chaleureux et personnalisé bilingue (français et anglais) générant un score de satisfaction client de 98 %.',
            'Collaborer avec la gérance pour former 4 nouveaux commis aux techniques d’accueil et à l’encaissement.',
          ],
        },
      ],
      educations: [
        {
          id: 'edu-sale-1',
          degree: 'D.E.C. en Gestion de commerces',
          institution: 'Collège de Maisonneuve',
          location: 'Montréal, QC',
          year: '2022',
          equivalenceStatus: 'Diplôme collégial québécois',
        },
      ],
      certifications: [
        {
          id: 'cert-sale-1',
          name: 'Certification Service d’excellence à la clientèle',
          issuingBody: 'Conseil québécois du commerce de détail (CQCD)',
          year: '2023',
        },
      ],
      languages: [
        { language: 'Français', level: 'Langue maternelle' },
        { language: 'Anglais', level: 'Bilingue fluide (Accueil touristique et corporatif)' },
      ],
      coverLetter: {
        recipientName: 'Direction de la Boutique et Ventes',
        recipientTitle: 'Gérant de Magasin / Directeur Ventes',
        companyName: 'Prestige Retail Québec',
        companyAddress: 'Montréal, QC',
        jobReference: 'VENTE-MTL-2026',
        salutation: 'Madame, Monsieur,',
        openingParagraph:
          'Conseillère passionnée par le service à la clientèle d’excellence et parfaitement bilingue, c’est avec enthousiasme que je postule pour rejoindre votre équipe de vente reconnue à Montréal.',
        bodyParagraphs: [
          'Au cours de mes 3 années en commerce de détail, j’ai développé une approche d’écoute attentive qui permet de créer un lien de confiance durable avec les clients tout en dépassant régulièrement mes objectifs de chiffre d’affaires.',
          'Votre réputation d’excellence et la qualité de vos produits m’inspirent profondément. Souriante, proactive et engagée, je saurai être une ambassadrice dévouée de votre enseigne dès mon premier jour.',
        ],
        closingParagraph:
          'Je me tiens à votre entière disposition pour une entrevue afin de vous démontrer mon dynamisme et mon professionnalisme.',
        signoff: 'Je vous prie d’agréer, Madame, Monsieur, mes salutations distinguées.',
      },
    },
  },
];
