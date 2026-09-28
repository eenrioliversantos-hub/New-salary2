'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Language } from '@/lib/i18n';
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Crown,
  Eye,
  Edit3,
  Building,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  ShieldCheck,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  Layers,
  FileCode,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Lightbulb,
  Share2,
  Upload,
  Palette,
  Type,
  Sliders,
  Send,
  Filter,
  Search,
  X,
  Target,
  Zap,
  HelpCircle,
  School,
  RefreshCw,
  FileUp,
} from 'lucide-react';
import { RICH_PRESETS_CATALOG, FullPreset, CareerLevel, CareerSector } from './ResumePresets';

// -------------------------------------------------------------
// TYPES & DATA STRUCTURES (CANADIAN & QUÉBEC STANDARD)
// -------------------------------------------------------------
export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent: boolean;
  employmentType: 'Temps plein' | 'Temps partiel' | 'Contractuel' | 'Saisonnier';
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  equivalenceStatus?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingBody: string;
  year: string;
}

export interface CoverLetterData {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobReference: string;
  salutation: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signoff: string;
}

export interface ResumeData {
  // 1. Identité & Contact (Normes Canadiennes Anti-Biais)
  fullName: string;
  jobTitle: string;
  targetNoc: string;
  city: string;
  province: string;
  postalCode: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolioUrl: string;
  workStatus: string;

  // 2. Sommaire Exécutif
  summary: string;

  // 3. Compétences Clés
  technicalSkills: string[];
  softSkills: string[];
  safetyAndStandards: string[];

  // 4. Parcours Professionnel
  experiences: WorkExperience[];

  // 5. Formation & Équivalences
  educations: EducationItem[];

  // 6. Certifications & Ordres Professionnels
  certifications: CertificationItem[];

  // 7. Langues & Niveaux NCLC/CLB
  languages: { language: string; level: string }[];

  // 8. Bénévolat / Projets
  volunteerWork?: { organization: string; role: string; period: string; details: string }[];

  // 9. Cover Letter (Lettre de Présentation)
  coverLetter: CoverLetterData;
}

interface ResumeBuilderProps {
  lang: Language;
  isPro: boolean;
  onOpenProModal: (trigger?: string) => void;
}

// -------------------------------------------------------------
// BIBLIOTHÈQUE OFFICIELLE CNP 2021 (JOB BANK CANADA)
// -------------------------------------------------------------
interface NocPreset {
  nocCode: string;
  titleFr: string;
  titleEn: string;
  teer: string;
  category: string;
  suggestedTasksFr: string[];
  suggestedTasksEn: string[];
}

const NOC_LIBRARY: NocPreset[] = [
  {
    nocCode: '94100',
    titleFr: 'Opérateur de machines / Ligne de production',
    titleEn: 'Machine Operator / Food & Packaging Line',
    teer: 'TEER 4',
    category: 'Manufacturier & Agroalimentaire',
    suggestedTasksFr: [
      'Opérer et ajuster les équipements automatisés sur la ligne de conditionnement à une cadence de 120 unités/min.',
      'Effectuer des contrôles de qualité visuels et pondéraux rigoureux selon les normes HACCP et d’hygiène.',
      'Assurer la maintenance préventive de premier niveau (lubrification, nettoyage des capteurs, dépannage mineur).',
      'Respecter et appliquer activement les protocoles de santé et sécurité au travail de la CNESST et du SIMDUT 2015.',
      'Remplir avec exactitude les fiches de suivi de production et signaler toute anomalie aux superviseurs.',
    ],
    suggestedTasksEn: [
      'Operate and monitor automated packaging machinery maintaining targeted throughput of 120 units/min.',
      'Perform strict visual and weight quality assurance checks adhering to HACCP and food safety standards.',
      'Execute first-level preventative maintenance, sensor sanitation, and minor mechanical troubleshooting.',
      'Enforce and uphold CNESST workplace health, safety, and WHMIS 2015 hazard guidelines.',
      'Maintain accurate digital shift logs and promptly report deviations to shift supervisors.',
    ],
  },
  {
    nocCode: '21232',
    titleFr: 'Développeur Full-Stack Web & Logiciel',
    titleEn: 'Full-Stack Software & Web Developer',
    teer: 'TEER 1',
    category: 'Technologies de l’Information',
    suggestedTasksFr: [
      'Concevoir et déployer des applications web résilientes utilisant React, TypeScript, Next.js et Node.js.',
      'Optimiser les requêtes PostgreSQL et l’architecture d’API RESTful/GraphQL pour réduire la latence de 35 %.',
      'Collaborer étroitement en méthodologie Agile/Scrum avec les équipes UX et chefs de produit lors des sprints bihebdomadaires.',
      'Mettre en place des pipelines CI/CD automatisés avec Docker et GitHub Actions pour fiabiliser les déploiements.',
      'Rédiger des tests unitaires et d’intégration robustes atteignant une couverture de code de 85 %.',
    ],
    suggestedTasksEn: [
      'Design, develop, and deploy scalable cloud-native web applications using React, TypeScript, and Node.js.',
      'Optimize database queries and API endpoints, reducing average response latency by 35%.',
      'Collaborate actively in Agile/Scrum sprints alongside product managers and UX designers.',
      'Build and maintain CI/CD pipelines via GitHub Actions and Docker containers for reliable production releases.',
      'Write comprehensive unit and integration test suites ensuring 85%+ code coverage.',
    ],
  },
  {
    nocCode: '13110',
    titleFr: 'Adjoint(e) administratif(ve) et bureautique',
    titleEn: 'Administrative & Office Assistant',
    teer: 'TEER 3',
    category: 'Administration & Finance',
    suggestedTasksFr: [
      'Gérer l’accueil bilingue (français/anglais), les correspondances officielles et la filtration des appels corporatifs.',
      'Préparer et vérifier la facturation, les comptes fournisseurs et recevables avec une précision comptable de 99 %.',
      'Coordonner les calendriers de la direction, la logistique des réunions et la rédaction des comptes-rendus officiels.',
      'Maîtriser la suite Microsoft 365 (Excel avancé, Word, Teams) et les systèmes ERP/comptables comme QuickBooks.',
      'Organiser le classement documentaire numérique conformément à la Loi 25 sur la protection des renseignements personnels.',
    ],
    suggestedTasksEn: [
      'Deliver bilingual client service (French/English), managing executive correspondence and call routing.',
      'Process accounts payable/receivable and invoice reconciliations with a 99% accuracy benchmark.',
      'Coordinate executive calendars, board meeting agendas, travel itineraries, and official minutes.',
      'Leverage advanced MS Excel, QuickBooks, and cloud-based file management systems.',
      'Ensure strict compliance with Québec Law 25 confidentiality and personal data protection regulations.',
    ],
  },
  {
    nocCode: '72200',
    titleFr: 'Électricien(ne) industriel ou du bâtiment',
    titleEn: 'Electrician (Industrial & Construction)',
    teer: 'TEER 2',
    category: 'Construction & Métiers Spécialisés',
    suggestedTasksFr: [
      'Installer, raccorder et entretenir des panneaux électriques, transformateurs et canalisations selon le Code de l’électricité du Québec.',
      'Effectuer le diagnostic des pannes sur les circuits de commande et variateurs de fréquence moteur.',
      'Travailler sous la juridiction de la CCQ ou en milieu industriel dans le respect total des règles de cadenassage (LOTO).',
      'Lire et interpréter avec précision les schémas électriques, devis techniques et plans d’implantation.',
    ],
    suggestedTasksEn: [
      'Install, test, and troubleshoot electrical systems, panels, and transformers compliant with the Québec Electrical Code.',
      'Diagnose PLC controls, motor frequency drives, and industrial electrical instrumentation.',
      'Execute work under CCQ regulations and industrial safety lockout/tagout (LOTO) protocols.',
      'Interpret blueprints, electrical schematics, and technical specifications with precision.',
    ],
  },
  {
    nocCode: '31301',
    titleFr: 'Infirmier(ère) clinicien(ne) (OIIQ / Santé)',
    titleEn: 'Registered Nurse (OIIQ)',
    teer: 'TEER 1',
    category: 'Santé & Soins',
    suggestedTasksFr: [
      'Évaluer l’état de santé des patients, planifier et administrer les soins infirmiers et médications prescrites.',
      'Collaborer avec l’équipe interdisciplinaire (médecins, pharmaciens, préposés) au sein du réseau de la santé (CISSS/CIUSSS).',
      'Assurer la tenue rigoureuse des dossiers médicaux informatisés selon les normes déontologiques de l’OIIQ.',
      'Offrir un soutien empathique et enseigner les protocoles de convalescence aux patients et à leurs proches.',
    ],
    suggestedTasksEn: [
      'Assess patient vital signs, formulate care plans, and safely administer prescribed medications.',
      'Collaborate with multidisciplinary healthcare teams across CISSS/CIUSSS hospital networks.',
      'Maintain rigorous computerized health records adhering to OIIQ ethical and regulatory guidelines.',
      'Provide compassionate patient advocacy and discharge education to patients and families.',
    ],
  },
];

// DONNÉES PAR DÉFAUT (RÉALISTE QUÉBEC)
const INITIAL_PRESET: ResumeData = {
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
      id: '1',
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
      id: '2',
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
      id: '1',
      degree: 'D.E.P. en Mécanique industrielle de construction et d’entretien',
      institution: 'Centre de formation professionnelle de Québec',
      location: 'Québec, QC',
      year: '2021',
      equivalenceStatus: 'Diplôme canadien',
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'Certification SIMDUT 2015 & Cadenassage sécuritaire',
      issuingBody: 'Santé et Sécurité Québec',
      year: '2024',
    },
    {
      id: '2',
      name: 'Chariot élévateur (Cariste classe 1, 4 et 5)',
      issuingBody: 'Centre de Formation Logistique',
      year: '2023',
    },
  ],
  languages: [
    { language: 'Français', level: 'Langue maternelle / Courant professionnel' },
    { language: 'Anglais', level: 'Intermédiaire fonctionnel (compréhension technique)' },
  ],
  volunteerWork: [
    {
      organization: 'Moisson Québec',
      role: 'Bénévole tri et logistique d’entrepôt',
      period: '2022 - 2024',
      details: 'Tri et palettisation des denrées alimentaires pour les banques communautaires de la région.',
    },
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
};

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  lang,
  isPro,
  onOpenProModal,
}) => {
  // 1. MODE PRINCIPAL : 'build' (Construction guidée) vs 'preview' (Visualisation studio plein écran)
  const [viewMode, setViewMode] = useState<'build' | 'preview'>('build');

  // 2. DOCUMENT ACTIF : 'resume' (CV) vs 'cover_letter' (Lettre de présentation)
  const [activeDocument, setActiveDocument] = useState<'resume' | 'cover_letter'>('resume');

  // 3. SOUS-ONGLETS DE CONSTRUCTION DANS L'ÉDITEUR
  const [builderSection, setBuilderSection] = useState<'basics' | 'experience' | 'skills' | 'education' | 'cover_letter'>('basics');

  // 4. PERSONNALISATION DU RENDU (THEMES, COULEURS, DENSITÉ, POLICES)
  const [resumeLanguage, setResumeLanguage] = useState<'fr' | 'en'>('fr');
  const [templateTheme, setTemplateTheme] = useState<'classic' | 'modern' | 'tech' | 'industrial'>('classic');
  const [colorAccent, setColorAccent] = useState<string>('#1e40af'); // Classic Royal Navy
  const [density, setDensity] = useState<'compact' | 'normal' | 'relaxed'>('normal');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');

  // 5. DONNÉES DU CV & LETTRE
  const [data, setData] = useState<ResumeData>(INITIAL_PRESET);
  const [selectedNocIndex, setSelectedNocIndex] = useState<number>(0);

  // 6. ÉTATS D'INTERACTION & MODES SPÉCIALISÉS
  const [copiedTextNotice, setCopiedTextNotice] = useState(false);
  const [copiedLinkNotice, setCopiedLinkNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Mode guidé spécialisé (Premier Emploi / Étudiant)
  const [guidedMode, setGuidedMode] = useState<'none' | 'first_job' | 'student'>('none');

  // Catalogue de modèles par secteur et niveau
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogSector, setCatalogSector] = useState<CareerSector | 'all'>('all');
  const [catalogLevel, setCatalogLevel] = useState<CareerLevel | 'all'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Importateur & Convertisseur IA (extraction depuis texte / autre langue / format)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importRawText, setImportRawText] = useState('');
  const [importTargetLang, setImportTargetLang] = useState<'fr' | 'en'>('fr');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessNotice, setImportSuccessNotice] = useState<string | null>(null);

  // Contrôle de réduction de l'en-tête (Plein écran / Maximiser la vue du document)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  // Menus déroulants organisés (Navigation simplifiée & UX épurée)
  const [isPresetsMenuOpen, setIsPresetsMenuOpen] = useState(false);
  const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const headerNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (headerNavRef.current && !headerNavRef.current.contains(e.target as Node)) {
        setIsPresetsMenuOpen(false);
        setIsDesignMenuOpen(false);
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Optimisation pour offre d'emploi ciblée (ATS Tailoring & Mots-clés)
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);
  const [jobCompany, setJobCompany] = useState('');
  const [jobTargetTitle, setJobTargetTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any | null>(null);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);
  const [applySuccessNotice, setApplySuccessNotice] = useState<string | null>(null);

  // Nouvelles options avancées d'optimisation (Source du CV & Choix du modèle/formatage)
  const [optResumeSource, setOptResumeSource] = useState<'current' | 'custom_text'>('current');
  const [optCustomCvText, setOptCustomCvText] = useState('');
  const [optTemplateTheme, setOptTemplateTheme] = useState<'classic' | 'modern' | 'tech' | 'industrial'>('classic');
  const [optPrimaryColor, setOptPrimaryColor] = useState<string>('#1e40af');
  const [optFontFamily, setOptFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [optTargetLang, setOptTargetLang] = useState<'fr' | 'en'>('fr');
  const [optStepStatus, setOptStepStatus] = useState<string | null>(null);
  const optFileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------
  // MOTEUR D'AUDIT ATS & CONFORMITÉ IRCC / QUÉBEC (SCORE 0 - 100)
  // -------------------------------------------------------------
  const auditReport = useMemo(() => {
    let score = 100;
    const checks: { passed: boolean; label: string; desc: string; severity: 'high' | 'medium' | 'low' }[] = [];

    const rawContent = JSON.stringify(data).toLowerCase();
    const hasPhotoMention = rawContent.includes('photo') || rawContent.includes('image') || rawContent.includes('portrait');
    const hasAgeMention = rawContent.includes('âge') || rawContent.includes('age') || rawContent.includes('marié') || rawContent.includes('célibataire') || rawContent.includes('enfants');
    const hasSinMention = rawContent.includes('nas') || rawContent.includes('sin') || rawContent.includes('assurance sociale');

    if (hasPhotoMention || hasAgeMention || hasSinMention) {
      score -= 25;
      checks.push({
        passed: false,
        label: 'Données discriminatoires ou sensibles détectées',
        desc: 'Au Canada, AUCUNE photo, âge, situation matrimoniale ni NAS ne doit figurer sur le CV.',
        severity: 'high',
      });
    } else {
      checks.push({
        passed: true,
        label: 'Conformité anti-biais respectée (Charte canadienne)',
        desc: 'Aucune photo, statut familial ou âge. Votre CV est 100 % conforme à l’équité d’embauche.',
        severity: 'high',
      });
    }

    const hasValidPhone = data.phone.trim().length >= 10;
    const hasCity = data.city.trim().length > 1;
    const hasEmail = data.email.includes('@');
    if (!hasValidPhone || !hasCity || !hasEmail) {
      score -= 15;
      checks.push({
        passed: false,
        label: 'Coordonnées incomplètes',
        desc: 'Indiquez un téléphone au format canadien (ex: 418 555-0192), courriel et ville/province.',
        severity: 'high',
      });
    } else {
      checks.push({
        passed: true,
        label: 'Coordonnées canadiennes valides',
        desc: 'Format ville, province, téléphone et courriel parfaitement calibré pour les filtres ATS.',
        severity: 'high',
      });
    }

    if (data.summary.trim().length < 60) {
      score -= 15;
      checks.push({
        passed: false,
        label: 'Sommaire professionnel trop court',
        desc: 'Rédigez 3 à 4 phrases résumant vos années d’expérience, vos forces et votre objectif au Québec.',
        severity: 'medium',
      });
    } else {
      checks.push({
        passed: true,
        label: 'Accroche professionnelle percutante',
        desc: 'Sommaire bien développé permettant au recruteur de situer votre valeur en moins de 6 secondes.',
        severity: 'medium',
      });
    }

    const allHighlights = data.experiences.flatMap((e) => e.highlights).join(' ');
    const hasMetrics = /\d+([%|\$|u|h|min|unités|kg])?/.test(allHighlights);
    if (!hasMetrics) {
      score -= 15;
      checks.push({
        passed: false,
        label: 'Manque de réalisations mesurables',
        desc: 'Les recruteurs canadiens recherchent des chiffres concrets (ex: % de gain, cadences, nombre de personnes formées).',
        severity: 'medium',
      });
    } else {
      checks.push({
        passed: true,
        label: 'Présence de résultats chiffrés',
        desc: 'Vos expériences mettent en valeur des indicateurs concrets de performance.',
        severity: 'medium',
      });
    }

    const totalSkills = data.technicalSkills.length + data.softSkills.length + data.safetyAndStandards.length;
    if (totalSkills < 5) {
      score -= 10;
      checks.push({
        passed: false,
        label: 'Compétences clés insuffisantes',
        desc: 'Ajoutez au moins 6 à 8 compétences techniques et normes de sécurité pertinentes.',
        severity: 'medium',
      });
    } else {
      checks.push({
        passed: true,
        label: 'Mots-clés de compétences riches',
        desc: 'Bonne densité de mots-clés techniques alignés avec la classification nationale des professions (CNP).',
        severity: 'medium',
      });
    }

    return {
      score: Math.max(20, Math.min(100, score)),
      checks,
    };
  }, [data]);

  // Ajouter une tâche suggérée depuis la bibliothèque CNP
  const handleInsertSuggestedTask = (task: string) => {
    if (data.experiences.length === 0) return;
    const updated = [...data.experiences];
    updated[0].highlights.push(task);
    setData({ ...data, experiences: updated });
  };

  // Téléchargement / Impression optimisée
  const handlePrintOrPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Exporter en texte brut pour les portails ATS (Job Bank, Taleo, Workday)
  const handleCopyAsPlainText = () => {
    const isFr = resumeLanguage === 'fr';
    const plainText = `
${data.fullName.toUpperCase()}
${data.jobTitle} | ${data.targetNoc}
${data.city}, ${data.province} ${data.postalCode} • ${data.phone} • ${data.email} • ${data.linkedin}
${isFr ? 'Statut légal au Canada' : 'Work Authorization in Canada'}: ${data.workStatus}

${isFr ? 'SOMMAIRE PROFESSIONNEL' : 'PROFESSIONAL SUMMARY'}
------------------------------------------------------------
${data.summary}

${isFr ? 'COMPÉTENCES CLÉS' : 'CORE COMPETENCIES'}
------------------------------------------------------------
• ${isFr ? 'Techniques' : 'Technical'}: ${data.technicalSkills.join(', ')}
• ${isFr ? 'Qualités professionnelles' : 'Professional Skills'}: ${data.softSkills.join(', ')}
• ${isFr ? 'Normes & Sécurité CNESST' : 'Safety & Regulatory Standards'}: ${data.safetyAndStandards.join(', ')}

${isFr ? 'EXPÉRIENCE PROFESSIONNELLE' : 'PROFESSIONAL EXPERIENCE'}
------------------------------------------------------------
${data.experiences
  .map(
    (e) => `
${e.role.toUpperCase()} | ${e.company} (${e.location})
${e.period} [${e.employmentType}]
${e.highlights.map((h) => ` - ${h}`).join('\n')}
`
  )
  .join('\n')}

${isFr ? 'FORMATION & ÉQUIVALENCES' : 'EDUCATION & CREDENTIALS'}
------------------------------------------------------------
${data.educations
  .map(
    (edu) =>
      `• ${edu.degree} — ${edu.institution} (${edu.location}, ${edu.year}) ${
        edu.equivalenceStatus ? `[${edu.equivalenceStatus}]` : ''
      }`
  )
  .join('\n')}

${isFr ? 'CERTIFICATIONS & ORDRES PROFESSIONNELS' : 'CERTIFICATIONS & LICENSES'}
------------------------------------------------------------
${data.certifications.map((c) => `• ${c.name} — ${c.issuingBody} (${c.year})`).join('\n')}

${isFr ? 'LANGUES' : 'LANGUAGES'}
------------------------------------------------------------
${data.languages.map((l) => `• ${l.language}: ${l.level}`).join('\n')}
    `.trim();

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(plainText);
      setCopiedTextNotice(true);
      setTimeout(() => setCopiedTextNotice(false), 2500);
    }
  };

  // Sauvegarder JSON localement
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cv_${data.fullName.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importer JSON sauvegardé
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.fullName) {
            setData(parsed);
          }
        } catch (err) {
          // Ignore invalid files
        }
      };
    }
  };

  // Copier le lien de partage
  const handleShareLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLinkNotice(true);
      setTimeout(() => setCopiedLinkNotice(false), 2500);
    }
  };

  // Charger un profil prédéfini CNP
  const handleLoadProfile = (index: number) => {
    const preset = NOC_LIBRARY[index];
    setSelectedNocIndex(index);
    if (preset.nocCode === '94100') {
      setData(INITIAL_PRESET);
    } else if (preset.nocCode === '21232') {
      setData({
        ...INITIAL_PRESET,
        fullName: 'Lucas Silva',
        jobTitle: 'Développeur Full-Stack Web & Logiciel',
        targetNoc: 'CNP 21232 (TEER 1)',
        city: 'Montréal',
        province: 'QC',
        postalCode: 'H2X 1Y6',
        email: 'lucas.silva.dev@email.com',
        phone: '(438) 555-0819',
        linkedin: 'linkedin.com/in/lucassilvadev',
        workStatus: 'Permis de travail fermé avec CSQ en cours',
        summary:
          'Ingénieur logiciel cumulant 5 années d’expérience internationale et québécoise dans le développement d’architectures web résilientes (React, TypeScript, Next.js, Node.js). Habitué aux sprints Agile Scrum, aux révisions de code rigoureuses et à l’optimisation des bases de données volumineuses.',
        technicalSkills: ['TypeScript & JavaScript', 'React, Next.js & Redux', 'Node.js, Express & NestJS', 'PostgreSQL, Prisma & Redis', 'Docker & CI/CD GitHub Actions', 'APIs RESTful & GraphQL'],
        softSkills: ['Résolution de problèmes complexes', 'Communication transparente', 'Mentorat technique', 'Esprit d’équipe Agile'],
        safetyAndStandards: ['Cybersécurité OWASP', 'Loi 25 Québec (Protection des données)', 'Accessibilité WCAG 2.1'],
        experiences: [
          {
            id: '1',
            role: 'Développeur Full-Stack Intermédiaire',
            company: 'TechnoSolutions Québec',
            location: 'Montréal, QC',
            period: '2022 - Présent',
            isCurrent: true,
            employmentType: 'Temps plein',
            highlights: [
              'Développer et maintenir une plateforme SaaS traitant plus de 45 000 requêtes journalières avec une disponibilité de 99,9 %.',
              'Réduire de 42 % les temps de chargement des pages stratégiques grâce à la refonte vers Next.js avec Server Components.',
              'Automatiser la suite de tests d’intégration, augmentant la couverture de test de 60 % à 88 %.',
            ],
          },
        ],
        educations: [
          {
            id: '1',
            degree: 'Baccalauréat en Génie Logiciel / Informatique',
            institution: 'Université de Sherbrooke / Équivalence comparative reconnue',
            location: 'Sherbrooke, QC',
            year: '2021',
            equivalenceStatus: 'Émise par le MIFI (Québec)',
          },
        ],
        certifications: [
          {
            id: '1',
            name: 'AWS Certified Solutions Architect – Associate',
            issuingBody: 'Amazon Web Services',
            year: '2023',
          },
        ],
        languages: [
          { language: 'Français', level: 'Niveau B2/C1 professionnel' },
          { language: 'Anglais', level: 'Bilingue courant' },
          { language: 'Portugais', level: 'Langue maternelle' },
        ],
      });
    } else if (preset.nocCode === '13110') {
      setData({
        ...INITIAL_PRESET,
        fullName: 'Marie-Ève Roy',
        jobTitle: 'Adjointe Administrative & Coordination de Bureau',
        targetNoc: 'CNP 13110 (TEER 3)',
        city: 'Laval',
        province: 'QC',
        postalCode: 'H7N 4V2',
        email: 'marie.eve.roy@email.com',
        phone: '(514) 555-0144',
        linkedin: 'linkedin.com/in/marie-everoy',
        workStatus: 'Citoyenne canadienne',
        summary:
          'Adjointe administrative bilingue (français/anglais) cumulant 6 années d’expérience en gestion de dossiers clients, facturation et coordination logistique. Grande maîtrise d’Excel et QuickBooks, reconnue pour mon organisation méthodique et mon souci du détail.',
        technicalSkills: ['Gestion des comptes recevables/payables', 'Excel avancé (tableaux croisés, RECHERCHEV)', 'Logiciels QuickBooks & Acomba', 'Tenue d’agendas exécutifs', 'Rédaction administrative'],
        softSkills: ['Excellent entregent', 'Sens de la discrétion et confidentialité', 'Gestion des priorités', 'Sens du service client'],
        safetyAndStandards: ['Loi 25 sur la confidentialité', 'Normes d’archivage numérique'],
        experiences: [
          {
            id: '1',
            role: 'Adjointe Administrative Principale',
            company: 'Groupe Logistique Québec',
            location: 'Laval, QC',
            period: '2021 - Présent',
            isCurrent: true,
            employmentType: 'Temps plein',
            highlights: [
              'Superviser le traitement de plus de 250 factures mensuelles avec un taux d’exactitude de 99,5 %.',
              'Coordonner les plannings et déplacements d’une équipe de 14 professionnels et préparer les assemblées.',
              'Mettre en place un système de numérisation réduisant les délais de traitement des dossiers de 30 %.',
            ],
          },
        ],
        educations: [
          {
            id: '1',
            degree: 'D.E.C. en Techniques de bureautique',
            institution: 'Collège Ahuntsic',
            location: 'Montréal, QC',
            year: '2020',
            equivalenceStatus: 'Diplôme canadien',
          },
        ],
        certifications: [
          {
            id: '1',
            name: 'Certification Microsoft Office Specialist (Excel Expert)',
            issuingBody: 'Microsoft',
            year: '2022',
          },
        ],
        languages: [
          { language: 'Français', level: 'Langue maternelle' },
          { language: 'Anglais', level: 'Bilinguisme parfait' },
        ],
      });
    }
  };

  // Filtrage du catalogue de presets riches par secteur, niveau et recherche
  const filteredCatalogPresets = useMemo(() => {
    return RICH_PRESETS_CATALOG.filter((p) => {
      if (catalogSector !== 'all' && p.sector !== catalogSector) return false;
      if (catalogLevel !== 'all' && p.level !== catalogLevel) return false;
      if (catalogSearch.trim()) {
        const query = catalogSearch.toLowerCase();
        const matchesTitle =
          p.titleFr.toLowerCase().includes(query) || p.titleEn.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesNoc = p.nocCode.toLowerCase().includes(query);
        const matchesHighlights = p.highlightsFr.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesNoc && !matchesHighlights) return false;
      }
      return true;
    });
  }, [catalogSector, catalogLevel, catalogSearch]);

  const handleLoadRichPreset = (preset: FullPreset) => {
    setData(preset.data);
    if (preset.level === 'premier_emploi') {
      setGuidedMode('first_job');
      setTemplateTheme('classic');
    } else if (preset.level === 'etudiant') {
      setGuidedMode('student');
      setTemplateTheme('modern');
    } else if (preset.sector === 'tech') {
      setTemplateTheme('tech');
    } else if (preset.sector === 'industrie' || preset.sector === 'construction' || preset.sector === 'transport') {
      setTemplateTheme('industrial');
    } else {
      setTemplateTheme('classic');
    }
    setIsCatalogOpen(false);
  };

  const handleLoadFirstJob = () => {
    const p = RICH_PRESETS_CATALOG.find((x) => x.id === 'premier-emploi-debutant');
    if (p) handleLoadRichPreset(p);
  };

  const handleLoadStudent = () => {
    const p = RICH_PRESETS_CATALOG.find((x) => x.id === 'etudiant-stagiaire-coop');
    if (p) handleLoadRichPreset(p);
  };

  // Import de fichier texte (.txt, .json, etc.)
  const handleImportTextFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportRawText(text);
      }
    };
    reader.readAsText(file);
  };

  // Appel API : Extraire & Normaliser CV avec IA
  const handleRunAiImport = async () => {
    if (!importRawText || importRawText.trim().length < 20) {
      setImportError(
        lang === 'pt'
          ? 'Por favor cole ao menos 20 caracteres do texto do seu currículo.'
          : 'Veuillez coller au moins 20 caractères de votre CV.'
      );
      return;
    }
    setIsImporting(true);
    setImportError(null);
    try {
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: importRawText,
          targetLanguage: importTargetLang,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de l’extraction du CV.');
      }
      setData(json.data);
      setResumeLanguage(importTargetLang);
      setImportSuccessNotice(
        lang === 'pt'
          ? 'Currículo extraído e padronizado com sucesso para as normas canadenses!'
          : 'CV extrait et adapté aux normes canadiennes avec succès !'
      );
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportSuccessNotice(null);
      }, 1500);
    } catch (err: any) {
      setImportError(err.message || 'Échec de l’importation du CV.');
    } finally {
      setIsImporting(false);
    }
  };

  // Import de fichier pour l'optimiseur
  const handleOptTextFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setOptCustomCvText(text);
        setOptResumeSource('custom_text');
      }
    };
    reader.readAsText(file);
  };

  // Appel API : Analyser & Optimiser pour offre d'emploi ciblée
  const handleRunAiOptimize = async () => {
    if (!jobDescription || jobDescription.trim().length < 20) {
      setOptimizeError(
        lang === 'pt'
          ? 'Por favor cole a descrição ou requisitos da vaga cobiçada.'
          : 'Veuillez coller la description ou les exigences de l’offre d’emploi.'
      );
      return;
    }
    setIsOptimizing(true);
    setOptimizeError(null);
    setOptStepStatus(null);

    try {
      let activeResumeData = data;

      // Si l'utilisateur a choisi de charger/coller son propre CV brut dans l'optimiseur
      if (optResumeSource === 'custom_text' && optCustomCvText.trim().length >= 20) {
        setOptStepStatus(
          lang === 'pt'
            ? 'Passo 1/2: Lendo e estruturando o seu currículo bruto...'
            : 'Étape 1/2 : Extraction et structuration de votre CV...'
        );
        try {
          const parseRes = await fetch('/api/resume/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              rawText: optCustomCvText,
              targetLanguage: optTargetLang,
            }),
          });
          const parseJson = await parseRes.json();
          if (parseJson.success && parseJson.data) {
            activeResumeData = parseJson.data;
            setData(parseJson.data);
          }
        } catch (parseErr) {
          console.warn('Fallback parsing applied:', parseErr);
        }
      }

      setOptStepStatus(
        lang === 'pt'
          ? 'Passo 2/2: Comparando com a vaga e calibrando o modelo...'
          : 'Étape 2/2 : Comparaison avec l’offre et calibrage du modèle...'
      );

      const res = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: activeResumeData,
          jobDescription,
          companyName: jobCompany,
          jobTitle: jobTargetTitle,
          targetLanguage: optTargetLang,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Erreur lors de l’optimisation pour ce poste.');
      }
      setOptimizationResult(json.data);
    } catch (err: any) {
      setOptimizeError(err.message || 'Échec de l’analyse d’adéquation pour ce poste.');
    } finally {
      setIsOptimizing(false);
      setOptStepStatus(null);
    }
  };

  // Appliquer les optimisations générées au CV
  const handleApplyOptimization = () => {
    if (!optimizationResult) return;
    const updatedData: ResumeData = {
      ...data,
      summary: optimizationResult.tailoredSummary || data.summary,
      technicalSkills: Array.from(
        new Set([...(optimizationResult.recommendedTechnicalSkills || []), ...data.technicalSkills])
      ),
      coverLetter: optimizationResult.tailoredCoverLetter || data.coverLetter,
    };

    if (optimizationResult.tailoredHighlightsByExpId) {
      updatedData.experiences = data.experiences.map((exp) => {
        const tailored = optimizationResult.tailoredHighlightsByExpId[exp.id];
        if (tailored && tailored.length > 0) {
          return { ...exp, highlights: tailored };
        }
        return exp;
      });
    }

    setData(updatedData);

    // Appliquer le modèle et formatage choisis par l'utilisateur
    setTemplateTheme(optTemplateTheme);
    setColorAccent(optPrimaryColor);
    setFontFamily(optFontFamily);
    setResumeLanguage(optTargetLang);

    // Basculer directement en mode prévisualisation plein écran pour voir le résultat formaté !
    setViewMode('preview');

    setApplySuccessNotice(
      lang === 'pt'
        ? 'Otimizações aplicadas com sucesso! Exibindo o documento com o modelo selecionado.'
        : 'Optimisations appliquées avec succès ! Affichage du document avec le modèle sélectionné.'
    );
    setTimeout(() => {
      setApplySuccessNotice(null);
      setIsOptimizeModalOpen(false);
    }, 1200);
  };

  // PALETTES DE COULEURS
  const COLOR_PALETTES = [
    { name: 'Royal Navy', hex: '#1e40af' },
    { name: 'Deep Slate', hex: '#334155' },
    { name: 'Forest Green', hex: '#166534' },
    { name: 'Burgundy', hex: '#831843' },
    { name: 'Canadian Maple', hex: '#b91c1c' },
    { name: 'Midnight Charcoal', hex: '#0f172a' },
  ];

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------
          HEADER & MASTER CONTROLS BAR (SWITCH EDITOR <-> PREVIEW)
          SUPPORT COLLAPSE / EXPAND POUR MAXIMISER LA VISUALISATION
      ------------------------------------------------------------- */}
      {isHeaderCollapsed ? (
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-slate-900 text-xs truncate max-w-[180px] sm:max-w-xs">
              {data.fullName || (lang === 'pt' ? 'Meu Currículo' : 'Mon CV')}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600 text-xs truncate hidden sm:inline max-w-[150px]">
              {data.jobTitle || 'Journalier de production'}
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
              ATS {auditReport.score}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'build' ? 'preview' : 'build')}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer active:scale-95"
            >
              {viewMode === 'build'
                ? (lang === 'pt' ? 'Visualizar CV' : 'Voir CV')
                : (lang === 'pt' ? 'Editar' : 'Modifier')}
            </button>

            <button
              type="button"
              onClick={handlePrintOrPdf}
              className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
            >
              PDF
            </button>

            <button
              type="button"
              onClick={() => setIsOptimizeModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer active:scale-95"
            >
              {lang === 'pt' ? 'Otimizar' : 'Cibler'}
            </button>

            <button
              type="button"
              onClick={() => setIsHeaderCollapsed(false)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
            >
              {lang === 'pt' ? 'Expandir' : 'Déplier'}
            </button>
          </div>
        </div>
      ) : (
        <div ref={headerNavRef} className="bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 shadow-2xs relative">
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            {/* LEFT SIDE: Dynamic Candidate Info (No static tool titles or descriptions) */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-xs">
                {data.fullName || (lang === 'pt' ? 'Meu Currículo' : 'Mon CV')}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 text-xs truncate hidden sm:inline max-w-[180px]">
                {data.jobTitle || 'Journalier de production'}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                ATS {auditReport.score}%
              </span>
            </div>

            {/* RIGHT SIDE: Text-only Compact Buttons & Dropdowns */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Document Switcher: Text only */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveDocument('resume')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activeDocument === 'resume'
                      ? 'bg-white text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  CV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDocument('cover_letter');
                    if (viewMode === 'build') setBuilderSection('cover_letter');
                  }}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activeDocument === 'cover_letter'
                      ? 'bg-white text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'pt' ? 'Carta' : 'Lettre'}
                </button>
              </div>

              {/* Dropdown: Modelos & Perfis (Text only) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsPresetsMenuOpen(!isPresetsMenuOpen);
                    setIsDesignMenuOpen(false);
                    setIsToolsMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    isPresetsMenuOpen
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'pt' ? 'Modelos ▾' : 'Modèles ▾'}
                </button>

                {isPresetsMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-50 text-xs">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400">
                      {lang === 'pt' ? 'Perfis Prontos' : 'Profils Prêts'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleLoadProfile(0);
                        setIsPresetsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-blue-50 text-slate-800 hover:text-blue-900 font-medium transition-colors cursor-pointer block"
                    >
                      <div className="font-bold text-xs">Henrique Santos (Indústria & Produção)</div>
                      <div className="text-[10px] text-slate-500">5S, Kaizen, BPF, Palettisation, SENAI</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleLoadFirstJob();
                        setIsPresetsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-medium transition-colors cursor-pointer block"
                    >
                      <div className="font-bold text-xs">{lang === 'pt' ? '1º Emprego (0 Exp)' : '1er Emploi (0 Exp)'}</div>
                      <div className="text-[10px] text-slate-500">Sans expérience formelle</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleLoadStudent();
                        setIsPresetsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 font-medium transition-colors cursor-pointer block"
                    >
                      <div className="font-bold text-xs">{lang === 'pt' ? 'Estudante & CO-OP' : 'Étudiant & CO-OP'}</div>
                      <div className="text-[10px] text-slate-500">Projets, cours & bénévolat</div>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsCatalogOpen(true);
                        setIsPresetsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
                    >
                      {lang === 'pt' ? 'Catálogo Completo (10 Áreas)' : 'Catalogue Complet (10 Métiers)'}
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400">
                      {lang === 'pt' ? 'Perfis CNP / NOC' : 'Profils CNP / NOC'}
                    </div>
                    <div className="grid grid-cols-2 gap-1 px-1">
                      {NOC_LIBRARY.map((preset, idx) => (
                        <button
                          key={preset.nocCode}
                          type="button"
                          onClick={() => {
                            handleLoadProfile(idx);
                            setIsPresetsMenuOpen(false);
                          }}
                          className={`text-left px-2 py-1 rounded text-[11px] truncate cursor-pointer ${
                            selectedNocIndex === idx
                              ? 'bg-blue-100 text-blue-800 font-bold'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {preset.titleFr.split('/')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown: Design (Text only) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsDesignMenuOpen(!isDesignMenuOpen);
                    setIsPresetsMenuOpen(false);
                    setIsToolsMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    isDesignMenuOpen
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'pt' ? 'Design ▾' : 'Design ▾'}
                </button>

                {isDesignMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-2.5 z-50 text-xs space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        {lang === 'pt' ? 'Gabarito' : 'Gabarit'}
                      </label>
                      <select
                        value={templateTheme}
                        onChange={(e) => setTemplateTheme(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800 text-xs cursor-pointer focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="classic">Classique Fédéral (ATS 100%)</option>
                        <option value="modern">Québec Moderne (Montréal)</option>
                        <option value="tech">Tech & TI</option>
                        <option value="industrial">Indústria & Operações</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        {lang === 'pt' ? 'Fonte' : 'Police'}
                      </label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-semibold text-center text-xs">
                        <button
                          type="button"
                          onClick={() => setFontFamily('sans')}
                          className={`py-0.5 rounded cursor-pointer ${
                            fontFamily === 'sans' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          Sans
                        </button>
                        <button
                          type="button"
                          onClick={() => setFontFamily('serif')}
                          className={`py-0.5 rounded font-serif cursor-pointer ${
                            fontFamily === 'serif' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          Serif
                        </button>
                        <button
                          type="button"
                          onClick={() => setFontFamily('mono')}
                          className={`py-0.5 rounded font-mono cursor-pointer ${
                            fontFamily === 'mono' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          Mono
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        {lang === 'pt' ? 'Cor' : 'Couleur'}
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {COLOR_PALETTES.map((pal) => (
                          <button
                            key={pal.hex}
                            type="button"
                            onClick={() => setColorAccent(pal.hex)}
                            className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                              colorAccent === pal.hex ? 'scale-125 border-slate-900' : 'border-white'
                            }`}
                            style={{ backgroundColor: pal.hex }}
                            title={pal.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        {lang === 'pt' ? 'Idioma do Documento' : 'Langue du Document'}
                      </label>
                      <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-semibold text-center text-xs">
                        <button
                          type="button"
                          onClick={() => setResumeLanguage('fr')}
                          className={`py-0.5 rounded cursor-pointer ${
                            resumeLanguage === 'fr' ? 'bg-blue-600 text-white font-bold shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          Français (QC)
                        </button>
                        <button
                          type="button"
                          onClick={() => setResumeLanguage('en')}
                          className={`py-0.5 rounded cursor-pointer ${
                            resumeLanguage === 'en' ? 'bg-blue-600 text-white font-bold shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          English (CA)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        {lang === 'pt' ? 'Espaçamento' : 'Espacement'}
                      </label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-semibold text-center text-xs">
                        <button
                          type="button"
                          onClick={() => setDensity('compact')}
                          className={`py-0.5 rounded cursor-pointer ${
                            density === 'compact' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          {lang === 'pt' ? 'Compacto' : 'Compact'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDensity('normal')}
                          className={`py-0.5 rounded cursor-pointer ${
                            density === 'normal' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          {lang === 'pt' ? 'Normal' : 'Normal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDensity('relaxed')}
                          className={`py-0.5 rounded cursor-pointer ${
                            density === 'relaxed' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600'
                          }`}
                        >
                          {lang === 'pt' ? 'Amplo' : 'Aéré'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Optimize Button: Text only, compact */}
              <button
                type="button"
                onClick={() => setIsOptimizeModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer active:scale-95"
                title={lang === 'pt' ? 'Otimizar para vaga com IA' : 'Optimiser pour une offre'}
              >
                {lang === 'pt' ? 'Otimizar Vaga' : 'Cibler Offre'}
              </button>

              {/* Dropdown: Ações (Text only) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsToolsMenuOpen(!isToolsMenuOpen);
                    setIsPresetsMenuOpen(false);
                    setIsDesignMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    isToolsMenuOpen
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'pt' ? 'Ações ▾' : 'Actions ▾'}
                </button>

                {isToolsMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsImportModalOpen(true);
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-purple-50 text-slate-800 hover:text-purple-900 font-medium transition-colors cursor-pointer block"
                    >
                      {lang === 'pt' ? 'Importar CV (IA)' : 'Importer CV (IA)'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handlePrintOrPdf();
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-800 font-medium transition-colors cursor-pointer block"
                    >
                      {lang === 'pt' ? 'Imprimir / PDF' : 'Imprimer / PDF'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleCopyAsPlainText();
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-800 font-medium transition-colors cursor-pointer block"
                    >
                      {copiedTextNotice
                        ? (lang === 'pt' ? 'Copiado!' : 'Copié !')
                        : (lang === 'pt' ? 'Copiar Texto Puro (ATS)' : 'Copier Texte Brut (ATS)')}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleShareLink();
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-800 font-medium transition-colors cursor-pointer block"
                    >
                      {copiedLinkNotice
                        ? (lang === 'pt' ? 'Link Copiado!' : 'Lien Copié !')
                        : (lang === 'pt' ? 'Compartilhar Link' : 'Partager le Lien')}
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        handleExportJson();
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1 rounded text-slate-600 hover:bg-slate-50 cursor-pointer text-[11px] block"
                    >
                      {lang === 'pt' ? 'Exportar Backup JSON' : 'Exporter JSON'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click();
                        setIsToolsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1 rounded text-slate-600 hover:bg-slate-50 cursor-pointer text-[11px] block"
                    >
                      {lang === 'pt' ? 'Restaurar JSON' : 'Charger JSON'}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" className="hidden" />
                  </div>
                )}
              </div>

              {/* View / Edit Mode Switch: Text only */}
              {viewMode === 'build' ? (
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer active:scale-95"
                >
                  {lang === 'pt' ? 'Visualizar CV' : 'Voir CV'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setViewMode('build')}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer active:scale-95"
                >
                  {lang === 'pt' ? 'Editar' : 'Modifier'}
                </button>
              )}

              {/* Collapse button: Text only */}
              <button
                type="button"
                onClick={() => setIsHeaderCollapsed(true)}
                className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 font-medium text-xs transition-colors cursor-pointer"
                title={lang === 'pt' ? 'Recolher barra' : 'Réduire barre'}
              >
                {lang === 'pt' ? 'Recolher' : 'Réduire'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          VUE 1 : MODE CONSTRUCTION (BUILDER PLEIN ÉCRAN)
      ============================================================= */}
      {viewMode === 'build' && (
        <div className="space-y-6">
          {/* BANNIÈRE GUIDÉE SPÉCIALE : PREMIER EMPLOI (0 EXPÉRIENCE) */}
          {guidedMode === 'first_job' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 shadow-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                      <span>{lang === 'pt' ? 'Modo Guiado: Primeiro Emprego no Canadá (Zéro Experiência Formal)' : 'Mode Guidé : Premier Emploi au Québec (Zéro Expérience Formelle)'}</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                        {lang === 'pt' ? 'Dica de Especialista RH' : 'Conseil Expert RH'}
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                      {lang === 'pt'
                        ? 'No mercado canadense, não ter emprego anterior formal é esperado para jovens e iniciantes! Recrutadores valorizam acima de tudo: pontualidade impecável, atitude positiva, rapidez de aprendizado, trabalho em equipe e compromisso com segurança.'
                        : 'Au Québec, ne pas avoir d’expérience formelle antérieure est normal pour les débutants ! Les recruteurs recherchent : ponctualité exemplaire, attitude positive, rapidité d’apprentissage, esprit d’équipe et respect des normes.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGuidedMode('none')}
                  className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
                  title="Masquer le guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="pt-2 border-t border-emerald-200/60">
                <span className="text-[11px] font-bold text-emerald-900 block mb-1.5">
                  {lang === 'pt' ? 'Inserções rápidas recomendadas para o seu CV:' : 'Ajouts rapides recommandés pour votre profil :'}
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      const skill = lang === 'pt' ? 'Pontualidade rigorosa & assiduidade comprovada' : 'Ponctualité exemplaire & assiduité';
                      if (!data.softSkills.includes(skill)) {
                        setData({ ...data, softSkills: [...data.softSkills, skill] });
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-medium transition-colors cursor-pointer"
                  >
                    + {lang === 'pt' ? 'Pontualidade rigorosa & assiduidade' : 'Ponctualité exemplaire & assiduité'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const skill = lang === 'pt' ? 'Atendimento cortês e acolhimento com sorriso' : 'Service à la clientèle avec courtoisie naturelle';
                      if (!data.softSkills.includes(skill)) {
                        setData({ ...data, softSkills: [...data.softSkills, skill] });
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-medium transition-colors cursor-pointer"
                  >
                    + {lang === 'pt' ? 'Atendimento cortês com sorriso' : 'Service client avec courtoisie'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const task = lang === 'pt' ? 'Operação de caixa registradora e terminais Interac/Visa' : 'Opération de caisse et terminaux de paiement électronique';
                      if (!data.technicalSkills.includes(task)) {
                        setData({ ...data, technicalSkills: [...data.technicalSkills, task] });
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-medium transition-colors cursor-pointer"
                  >
                    + {lang === 'pt' ? 'Operação de caixa & Interac' : 'Opération de caisse & Interac'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cert = {
                        id: `cert-first-${Date.now()}`,
                        name: 'Formation Premiers Soins & RCR / DEA (Croix-Rouge)',
                        issuingBody: 'Croix-Rouge canadienne',
                        year: '2024',
                      };
                      setData({ ...data, certifications: [...data.certifications, cert] });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-medium transition-colors cursor-pointer"
                  >
                    + {lang === 'pt' ? 'Certificado RCR / Primeiros Socorros' : 'Certificat RCR / Premiers Soins'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BANNIÈRE GUIDÉE SPÉCIALE : ÉTUDIANTS & STAGES CO-OP */}
          {guidedMode === 'student' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/90 border border-indigo-200 shadow-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <h3 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                      <span>{lang === 'pt' ? 'Modo Guiado: Estudante & Estagiário CO-OP (Cégep / Université)' : 'Mode Guidé : Étudiant & Stagiaire CO-OP (Cégep / Université)'}</span>
                      <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
                        {lang === 'pt' ? 'Foco em Projetos & Disponibilidade' : 'Focus Projets & Disponibilité'}
                      </span>
                    </h3>
                    <p className="text-xs text-indigo-800 leading-relaxed mt-1">
                      {lang === 'pt'
                        ? 'Destaque seus projetos práticos de curso (projets de session), laboratórios e trabalhos em equipe. Especifique com clareza a sua autorização de estudo no Canadá (trabalho legal de 24h/semana durante o semestre e tempo integral nas férias de verão).'
                        : 'Mettez de l’avant vos projets de session académiques, laboratoires et travail en équipe. Précisez votre statut légal d’admissibilité (permis d’études autorisant 24h/semaine hors campus et temps plein lors des congés).'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGuidedMode('none')}
                  className="text-indigo-700 hover:text-indigo-950 p-1 cursor-pointer"
                  title="Masquer le guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="pt-2 border-t border-indigo-200/60">
                <span className="text-[11px] font-bold text-indigo-900 block mb-1.5">
                  {lang === 'pt' ? 'Inserções rápidas recomendadas para estudantes:' : 'Ajouts rapides recommandés pour profils étudiants :'}
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setData({
                        ...data,
                        workStatus: 'Permis d’études avec autorisation de travail (24h/semaine hors campus)',
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white text-indigo-800 border border-indigo-300 hover:bg-indigo-100 font-medium transition-colors cursor-pointer"
                  >
                    + {lang === 'pt' ? 'Status: Permissão de estudos 24h/sem' : 'Statut : Permis d’études 24h/sem'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const addition = lang === 'pt' ? ' Disponível para estágio CO-OP de 4 meses (Verão 2026).' : ' Disponible pour stage CO-OP rémunéré de 4 mois (Été 2026).';
                      setData({ ...data, summary: data.summary + addition });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white text-indigo-800 border border-indigo-300 hover:bg-indigo-100 font-medium transition-colors cursor-pointer"
                  >
                    + {lang === 'pt' ? 'Disponibilidade Estágio CO-OP (4 meses)' : 'Disponibilité Stage CO-OP (4 mois)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const skill = lang === 'pt' ? 'Gestão ágil de projetos acadêmicos e sprints em equipe' : 'Gestion de projets de session en méthodologie Agile Scrum';
                      if (!data.softSkills.includes(skill)) {
                        setData({ ...data, softSkills: [...data.softSkills, skill] });
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white text-indigo-800 border border-indigo-300 hover:bg-indigo-100 font-medium transition-colors cursor-pointer"
                  >
                    + {lang === 'pt' ? 'Projetos acadêmicos em equipe Scrum' : 'Projets de session en équipe Scrum'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setBuilderSection('basics')}
              className={`px-3.5 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                builderSection === 'basics'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              1. {lang === 'pt' ? 'Identidade & Contato' : 'Identité & Coordonnées'}
            </button>
            <button
              type="button"
              onClick={() => setBuilderSection('experience')}
              className={`px-3.5 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                builderSection === 'experience'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              2. {lang === 'pt' ? 'Experiência Profissional' : 'Expériences & Tâches CNP'}
            </button>
            <button
              type="button"
              onClick={() => setBuilderSection('skills')}
              className={`px-3.5 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                builderSection === 'skills'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              3. {lang === 'pt' ? 'Competências & Segurança' : 'Compétences & Sécurité'}
            </button>
            <button
              type="button"
              onClick={() => setBuilderSection('education')}
              className={`px-3.5 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                builderSection === 'education'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              4. {lang === 'pt' ? 'Formação & Ordens' : 'Formation & Équivalences MIFI'}
            </button>
            <button
              type="button"
              onClick={() => {
                setBuilderSection('cover_letter');
                setActiveDocument('cover_letter');
              }}
              className={`px-3.5 py-2 rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                builderSection === 'cover_letter'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              5. {lang === 'pt' ? 'Carta de Apresentação (Cover Letter)' : 'Lettre de Motivation'}
            </button>
          </div>

          {/* TAB 1: IDENTITÉ & CONTACT */}
          {builderSection === 'basics' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span>Coordonnées Professionnelles (Format Anti-Biais Canadien)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Au Québec et au Canada, ne mettez JAMAIS de photo, d’âge, d’état civil ni de NAS pour respecter la Charte des droits et libertés.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {lang === 'pt' ? 'Nome Completo' : 'Nom et Prénom'}
                  </label>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={(e) => setData({ ...data, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {lang === 'pt' ? 'Cargo Pretendido' : 'Titre du poste ciblé'}
                  </label>
                  <input
                    type="text"
                    value={data.jobTitle}
                    onChange={(e) => setData({ ...data, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ville</label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => setData({ ...data, city: e.target.value })}
                    placeholder="Québec"
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Province</label>
                  <input
                    type="text"
                    value={data.province}
                    onChange={(e) => setData({ ...data, province: e.target.value })}
                    placeholder="QC"
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Code Postal</label>
                  <input
                    type="text"
                    value={data.postalCode}
                    onChange={(e) => setData({ ...data, postalCode: e.target.value })}
                    placeholder="G1K 7P4"
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Téléphone (Canadien)</label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    placeholder="(418) 555-0192"
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Courriel</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={data.linkedin}
                    onChange={(e) => setData({ ...data, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/profil"
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Statut Légal d’Embauche au Canada
                  </label>
                  <input
                    type="text"
                    value={data.workStatus}
                    onChange={(e) => setData({ ...data, workStatus: e.target.value })}
                    placeholder="ex: Résident permanent / Permis de travail ouvert"
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Sommaire professionnel */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sommaire Professionnel (Accroche en 3-4 phrases percutantes)
                </label>
                <textarea
                  rows={4}
                  value={data.summary}
                  onChange={(e) => setData({ ...data, summary: e.target.value })}
                  className="w-full p-3 text-xs leading-relaxed text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Next Step CTA */}
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setBuilderSection('experience')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  <span>{lang === 'pt' ? 'Avançar para Experiências' : 'Étape suivante : Expériences'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EXPÉRIENCES & BANQUE DE TÂCHES CNP 2021 */}
          {builderSection === 'experience' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <span>Expériences Professionnelles (Chronologique Inversé)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Utilisez la banque officielle de tâches CNP 2021 ci-dessous pour insérer des réalisations éprouvées pour les ATS.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      experiences: [
                        {
                          id: Date.now().toString(),
                          role: 'Nouveau Poste',
                          company: 'Nom de l’entreprise',
                          location: 'Québec, QC',
                          period: '2023 - Présent',
                          isCurrent: true,
                          employmentType: 'Temps plein',
                          highlights: ['Responsabilité concrète avec verbe d’action et résultat chiffré.'],
                        },
                        ...data.experiences,
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une expérience</span>
                </button>
              </div>

              {/* Banque de tâches suggérées CNP */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Banque de Tâches Officielles CNP 2021 ({NOC_LIBRARY[selectedNocIndex].nocCode})</span>
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Guichet-Emplois Canada
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  {NOC_LIBRARY[selectedNocIndex].suggestedTasksFr.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white border border-blue-200 text-xs text-slate-800 flex items-start justify-between gap-2"
                    >
                      <span className="text-[11px] leading-relaxed flex-1">{task}</span>
                      <button
                        type="button"
                        onClick={() => handleInsertSuggestedTask(task)}
                        className="px-2 py-1 text-[10px] font-bold rounded bg-blue-600 hover:bg-blue-700 text-white shrink-0 cursor-pointer whitespace-nowrap"
                      >
                        + Insérer
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liste des expériences */}
              <div className="space-y-4">
                {data.experiences.map((exp, expIdx) => (
                  <div key={exp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          experiences: data.experiences.filter((e) => e.id !== exp.id),
                        })
                      }
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Supprimer ce poste"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Titre du poste</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[expIdx].role = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Entreprise</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[expIdx].company = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Lieu (Ville, QC)</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[expIdx].location = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Période (Années ou Mois/Année)</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[expIdx].period = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Type d’emploi</label>
                        <select
                          value={exp.employmentType}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[expIdx].employmentType = e.target.value as any;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg"
                        >
                          <option value="Temps plein">Temps plein</option>
                          <option value="Temps partiel">Temps partiel</option>
                          <option value="Contractuel">Contractuel</option>
                          <option value="Saisonnier">Saisonnier</option>
                        </select>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Réalisations & Tâches clés (Format puces ATS) :
                      </label>
                      {exp.highlights.map((hl, hlIdx) => (
                        <div key={hlIdx} className="flex items-center gap-2">
                          <span className="text-slate-400">•</span>
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[expIdx].highlights[hlIdx] = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="flex-1 px-2.5 py-1 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...data.experiences];
                              updated[expIdx].highlights = updated[expIdx].highlights.filter((_, i) => i !== hlIdx);
                              setData({ ...data, experiences: updated });
                            }}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...data.experiences];
                          updated[expIdx].highlights.push('Nouvelle réalisation chiffrée.');
                          setData({ ...data, experiences: updated });
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:underline pt-1 inline-block"
                      >
                        + Ajouter une ligne de réalisation
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setBuilderSection('basics')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  ← Précédent
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderSection('skills')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  <span>Étape suivante : Compétences</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: COMPÉTENCES & NORMES CNESST */}
          {builderSection === 'skills' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  <span>Matrice de Compétences (Techniques, Humaines & Sécurité)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Les systèmes ATS analysent la densité de mots-clés. Séparez vos compétences par des virgules.
                </p>
              </div>

              {/* Compétences Techniques */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Compétences Techniques & Outils (Séparées par des virgules)
                </label>
                <textarea
                  rows={3}
                  value={data.technicalSkills.join(', ')}
                  onChange={(e) =>
                    setData({
                      ...data,
                      technicalSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="ex: React, Node.js, Opération de convoyeurs, Diagnostic pneumatique..."
                />
              </div>

              {/* Qualités Humaines / Soft Skills */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Qualités Professionnelles / Savoir-Être (Soft Skills)
                </label>
                <textarea
                  rows={2}
                  value={data.softSkills.join(', ')}
                  onChange={(e) =>
                    setData({
                      ...data,
                      softSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="ex: Rigueur, Esprit d’équipe, Ponctualité, Résolution de conflits..."
                />
              </div>

              {/* Sécurité & CNESST */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Normes de Sécurité, Réglementations & SIMDUT (Essentiel au Québec)
                </label>
                <textarea
                  rows={2}
                  value={data.safetyAndStandards.join(', ')}
                  onChange={(e) =>
                    setData({
                      ...data,
                      safetyAndStandards: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="ex: Normes CNESST, SIMDUT 2015, Cadenassage (LOTO), Bonnes pratiques de fabrication (HACCP)..."
                />
              </div>

              {/* Langues & Niveaux NCLC */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Langues & Niveaux (Échelle NCLC / CLB canadienne)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        languages: [...data.languages, { language: 'Espagnol', level: 'Intermédiaire' }],
                      })
                    }
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    + Ajouter une langue
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.languages.map((l, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <input
                        type="text"
                        value={l.language}
                        onChange={(e) => {
                          const updated = [...data.languages];
                          updated[lIdx].language = e.target.value;
                          setData({ ...data, languages: updated });
                        }}
                        className="w-1/2 px-2 py-1 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={l.level}
                        onChange={(e) => {
                          const updated = [...data.languages];
                          updated[lIdx].level = e.target.value;
                          setData({ ...data, languages: updated });
                        }}
                        className="w-1/2 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setData({
                            ...data,
                            languages: data.languages.filter((_, i) => i !== lIdx),
                          })
                        }
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setBuilderSection('experience')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  ← Précédent
                </button>
                <button
                  type="button"
                  onClick={() => setBuilderSection('education')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  <span>Étape suivante : Formation & Diplômes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FORMATION, ÉQUIVALENCES MIFI & CERTIFICATIONS */}
          {builderSection === 'education' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                      4
                    </span>
                    <span>Diplômes, Équivalences MIFI/WES & Ordres Professionnels</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Indiquez vos diplômes et si vous possédez une évaluation comparative officielle émise par le MIFI au Québec.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      educations: [
                        {
                          id: Date.now().toString(),
                          degree: 'Nouveau Diplôme / Certificat',
                          institution: 'Établissement d’enseignement',
                          location: 'Montréal, QC',
                          year: '2022',
                          equivalenceStatus: 'Diplôme canadien',
                        },
                        ...data.educations,
                      ],
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                >
                  + Ajouter un diplôme
                </button>
              </div>

              {/* Formations */}
              <div className="space-y-3">
                {data.educations.map((edu, eduIdx) => (
                  <div key={edu.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          educations: data.educations.filter((e) => e.id !== edu.id),
                        })
                      }
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Diplôme / Programme</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...data.educations];
                            updated[eduIdx].degree = e.target.value;
                            setData({ ...data, educations: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Établissement</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...data.educations];
                            updated[eduIdx].institution = e.target.value;
                            setData({ ...data, educations: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Lieu</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const updated = [...data.educations];
                            updated[eduIdx].location = e.target.value;
                            setData({ ...data, educations: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Année d’obtention</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const updated = [...data.educations];
                            updated[eduIdx].year = e.target.value;
                            setData({ ...data, educations: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Statut d’équivalence</label>
                        <select
                          value={edu.equivalenceStatus || 'Diplôme canadien'}
                          onChange={(e) => {
                            const updated = [...data.educations];
                            updated[eduIdx].equivalenceStatus = e.target.value as any;
                            setData({ ...data, educations: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg"
                        >
                          <option value="Diplôme canadien">Diplôme canadien</option>
                          <option value="Émise par le MIFI (Québec)">Émise par le MIFI (Québec)</option>
                          <option value="Évaluation WES/ICAS (IRCC)">Évaluation WES / ICAS (IRCC)</option>
                          <option value="En cours de traitement">En cours de traitement</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications & Licences */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Certifications, Permis & Ordres Professionnels (OIQ, OIIQ, CCQ, etc.)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        certifications: [
                          ...data.certifications,
                          { id: Date.now().toString(), name: 'Nouvelle certification', issuingBody: 'Organisme', year: '2024' },
                        ],
                      })
                    }
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    + Ajouter une certification
                  </button>
                </div>

                <div className="space-y-2">
                  {data.certifications.map((cert, cIdx) => (
                    <div key={cert.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[cIdx].name = e.target.value;
                          setData({ ...data, certifications: updated });
                        }}
                        placeholder="Nom de la certification"
                        className="w-1/2 px-2 py-1 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={cert.issuingBody}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[cIdx].issuingBody = e.target.value;
                          setData({ ...data, certifications: updated });
                        }}
                        placeholder="Organisme émetteur"
                        className="w-1/3 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[cIdx].year = e.target.value;
                          setData({ ...data, certifications: updated });
                        }}
                        placeholder="Année"
                        className="w-16 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg text-center"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setData({
                            ...data,
                            certifications: data.certifications.filter((c) => c.id !== cert.id),
                          })
                        }
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* BÉNÉVOLAT, PROJETS ACADÉMIQUES & IMPLICATION COMMUNAUTAIRE */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>🤝</span>
                      <span>{lang === 'pt' ? 'Voluntariado, Bénévolat & Projetos Acadêmicos' : 'Bénévolat, Projets Académiques & Implication'}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {lang === 'pt'
                        ? 'Diferencial decisivo no Canadá para 1º emprego, estudantes, estagiários CO-OP e recém-chegados.'
                        : 'Atout décisif au Québec pour les 1ers emplois, étudiants, stagiaires CO-OP et nouveaux arrivants.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = data.volunteerWork ? [...data.volunteerWork] : [];
                      updated.push({
                        organization: '',
                        role: '',
                        period: '2024',
                        details: '',
                      });
                      setData({ ...data, volunteerWork: updated });
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'pt' ? '+ Adicionar Projeto / Bénévolat' : '+ Ajouter Bénévolat / Projet'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.volunteerWork || []).map((v, vIdx) => (
                    <div key={vIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={v.role}
                          onChange={(e) => {
                            const updated = [...(data.volunteerWork || [])];
                            updated[vIdx].role = e.target.value;
                            setData({ ...data, volunteerWork: updated });
                          }}
                          placeholder={lang === 'pt' ? 'Papel / Função (ex: Voluntário de triagem)' : 'Rôle (ex: Bénévole logistique ou Chef de projet CO-OP)'}
                          className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                        <input
                          type="text"
                          value={v.organization}
                          onChange={(e) => {
                            const updated = [...(data.volunteerWork || [])];
                            updated[vIdx].organization = e.target.value;
                            setData({ ...data, volunteerWork: updated });
                          }}
                          placeholder={lang === 'pt' ? 'Organização / Instituição / Bairro' : 'Organisme / Club étudiant / Quartier'}
                          className="sm:w-56 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                        <input
                          type="text"
                          value={v.period}
                          onChange={(e) => {
                            const updated = [...(data.volunteerWork || [])];
                            updated[vIdx].period = e.target.value;
                            setData({ ...data, volunteerWork: updated });
                          }}
                          placeholder={lang === 'pt' ? 'Período (ex: 2023 - 2024)' : 'Période (ex: Été 2024)'}
                          className="sm:w-28 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (data.volunteerWork || []).filter((_, idx) => idx !== vIdx);
                            setData({ ...data, volunteerWork: updated });
                          }}
                          className="text-slate-400 hover:text-rose-600 self-center px-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={v.details}
                        onChange={(e) => {
                          const updated = [...(data.volunteerWork || [])];
                          updated[vIdx].details = e.target.value;
                          setData({ ...data, volunteerWork: updated });
                        }}
                        placeholder={lang === 'pt' ? 'Impacto e tarefas realizadas (ex: Organização e triagem de 150 kits de doação semanalmente).' : 'Impact et réalisations concrètes (ex: Coordination de 150 paniers de denrées, respect des consignes).'}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  ))}
                  {(!data.volunteerWork || data.volunteerWork.length === 0) && (
                    <p className="text-[11px] text-slate-400 italic">
                      {lang === 'pt'
                        ? 'Nenhum voluntariado adicionado. Recomendado para candidatos iniciantes ou estudantes para demonstrar engajamento e responsabilidade.'
                        : 'Aucune implication enregistrée. Fortement conseillé pour les profils débutants et étudiants pour démontrer rigueur et entregent.'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setBuilderSection('skills')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  ← Précédent
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'pt' ? 'Concluir & Ver Resultado ➔' : 'Terminer & Prévisualiser ➔'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: LETTRE DE PRÉSENTATION (COVER LETTER BUILDER) */}
          {builderSection === 'cover_letter' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span>Rédacteur de Lettre de Présentation (Cover Letter)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Générez une lettre adaptée à l’offre d’emploi au Québec, partageant le même en-tête graphique que votre CV.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDocument('cover_letter');
                    setViewMode('preview');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Prévisualiser la Lettre ➔</span>
                </button>
              </div>

              {/* Destinataire */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nom du Destinataire ou Département
                  </label>
                  <input
                    type="text"
                    value={data.coverLetter.recipientName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        coverLetter: { ...data.coverLetter, recipientName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Titre du Responsable</label>
                  <input
                    type="text"
                    value={data.coverLetter.recipientTitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        coverLetter: { ...data.coverLetter, recipientTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nom de l’Entreprise</label>
                  <input
                    type="text"
                    value={data.coverLetter.companyName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        coverLetter: { ...data.coverLetter, companyName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Référence du Poste / Numéro de Concours
                  </label>
                  <input
                    type="text"
                    value={data.coverLetter.jobReference}
                    onChange={(e) =>
                      setData({
                        ...data,
                        coverLetter: { ...data.coverLetter, jobReference: e.target.value },
                      })
                    }
                    placeholder="ex: REQ-2026-94 ou Poste d’Opérateur"
                    className="w-full px-3 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Corps de la lettre */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Paragraphe d’Accroche (Pourquoi cette entreprise et ce poste ?)
                  </label>
                  <textarea
                    rows={3}
                    value={data.coverLetter.openingParagraph}
                    onChange={(e) =>
                      setData({
                        ...data,
                        coverLetter: { ...data.coverLetter, openingParagraph: e.target.value },
                      })
                    }
                    className="w-full p-3 text-xs leading-relaxed text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {data.coverLetter.bodyParagraphs.map((para, pIdx) => (
                  <div key={pIdx}>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Paragraphe de Valeur Ajoutée #{pIdx + 1} (Expérience concrète & Réalisations)
                    </label>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) => {
                        const updated = [...data.coverLetter.bodyParagraphs];
                        updated[pIdx] = e.target.value;
                        setData({
                          ...data,
                          coverLetter: { ...data.coverLetter, bodyParagraphs: updated },
                        });
                      }}
                      className="w-full p-3 text-xs leading-relaxed text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Paragraphe de Conclusion & Appel à l’Action (Entrevue)
                  </label>
                  <textarea
                    rows={2}
                    value={data.coverLetter.closingParagraph}
                    onChange={(e) =>
                      setData({
                        ...data,
                        coverLetter: { ...data.coverLetter, closingParagraph: e.target.value },
                      })
                    }
                    className="w-full p-3 text-xs leading-relaxed text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveDocument('cover_letter');
                    setViewMode('preview');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'pt' ? 'Visualizar Carta Pronta ➔' : 'Prévisualiser la Lettre ➔'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =============================================================
          VUE 2 : STUDIO DE VISUALISATION PLEIN ÉCRAN (LE FORMULAIRE DISPARAÎT)
      ============================================================= */}
      {viewMode === 'preview' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* REALISTIC CANADIAN RESUME CANVAS (8.5" x 11" LETTER DIMENSIONS) */}
          <div
            className={`max-w-4xl mx-auto bg-white p-6 sm:p-10 md:p-12 rounded-2xl border border-slate-200 shadow-2xl text-slate-900 transition-all ${
              fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
            } print:shadow-none print:border-none print:p-0 print:m-0`}
          >
            {/* -------------------------------------------------------------
                DOCUMENT A : CURRICULUM VITAE (CV)
            ------------------------------------------------------------- */}
            {activeDocument === 'resume' && (
              <>
                {/* =========================================================
                    GABARIT 1 : CLASSIQUE FÉDÉRAL & ORDRES (DÉFAUT - ATS 100%)
                ========================================================= */}
                {templateTheme === 'classic' && (
                  <div className={density === 'compact' ? 'space-y-3.5 text-xs' : density === 'relaxed' ? 'space-y-6 text-sm' : 'space-y-4 sm:space-y-5 text-xs sm:text-[13px]'}>
                    {/* Header Classique Centré & Épuré (Norme Canadienne) */}
                    <div className="border-b-2 pb-3.5 text-center space-y-1" style={{ borderColor: colorAccent }}>
                      <h1 className="text-2xl sm:text-[28px] font-black tracking-wide text-slate-900" style={{ color: colorAccent }}>
                        {data.fullName.toUpperCase()}
                      </h1>
                      <div className="text-sm sm:text-base font-bold text-slate-800">
                        {data.jobTitle}
                      </div>

                      {/* Coordonnées horizontales avec séparateurs élégants */}
                      <div className="text-xs text-slate-600 flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 pt-0.5 font-medium">
                        <span>{data.city}, {data.province} {data.postalCode && `(${data.postalCode})`}</span>
                        <span className="text-slate-300">•</span>
                        <span>{data.phone}</span>
                        <span className="text-slate-300">•</span>
                        <span>{data.email}</span>
                        {data.linkedin && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-blue-700 font-medium">{data.linkedin}</span>
                          </>
                        )}
                      </div>

                      {/* Admissibilité légale au Canada (Clé pour recruteurs RH au Québec) */}
                      <div className="pt-1 flex items-center justify-center gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{resumeLanguage === 'fr' ? 'Admissibilité légale :' : 'Work Authorization:'} {data.workStatus}</span>
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          CNP : {data.targetNoc}
                        </span>
                      </div>
                    </div>

                    {/* Sommaire Professionnel / Profil */}
                    {data.summary && (
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-300 flex items-center justify-between" style={{ color: colorAccent }}>
                          <span>{resumeLanguage === 'fr' ? 'Sommaire Professionnel' : 'Professional Summary'}</span>
                        </h2>
                        <p className="leading-relaxed text-slate-800 text-justify">
                          {data.summary}
                        </p>
                      </div>
                    )}

                    {/* Domaines d'Expertise & Compétences Clés (Blocs Horizontaux par Catégories) */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b border-slate-300 flex items-center justify-between" style={{ color: colorAccent }}>
                        <span>{resumeLanguage === 'fr' ? 'Domaines d\'Expertise & Compétences Clés' : 'Core Competencies & Expertise'}</span>
                      </h2>
                      <div className="space-y-1.5 text-xs text-slate-800">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                          <span className="font-bold text-slate-900 shrink-0 sm:w-44 text-[12px]">
                            {resumeLanguage === 'fr' ? 'Compétences Techniques :' : 'Technical Skills:'}
                          </span>
                          <span className="text-slate-700 leading-relaxed">
                            {data.technicalSkills.join(' • ')}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                          <span className="font-bold text-slate-900 shrink-0 sm:w-44 text-[12px]">
                            {resumeLanguage === 'fr' ? 'Gestion & Savoir-Être :' : 'Leadership & Soft Skills:'}
                          </span>
                          <span className="text-slate-700 leading-relaxed">
                            {data.softSkills.join(' • ')}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                          <span className="font-bold text-slate-900 shrink-0 sm:w-44 text-[12px]">
                            {resumeLanguage === 'fr' ? 'Normes, Sécurité & SST :' : 'Compliance & Safety (CNESST):'}
                          </span>
                          <span className="text-slate-700 leading-relaxed">
                            {data.safetyAndStandards.join(' • ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expérience Professionnelle (Ordre Chronologique Inversé) */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-2.5 border-b border-slate-300 flex items-center justify-between" style={{ color: colorAccent }}>
                        <span>{resumeLanguage === 'fr' ? 'Expérience Professionnelle' : 'Professional Experience'}</span>
                      </h2>
                      <div className="space-y-3.5">
                        {data.experiences.map((exp) => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1">
                              <div>
                                <span className="font-black text-slate-900 text-sm">{exp.role}</span>
                                <span className="text-slate-400 mx-1.5">—</span>
                                <span className="font-bold text-slate-800">{exp.company}</span>
                                <span className="text-slate-500 text-[11px] ml-1">({exp.location})</span>
                              </div>
                              <div className="text-[11px] font-bold text-slate-600 sm:text-right shrink-0">
                                <span>{exp.period}</span>
                                <span className="text-slate-300 mx-1.5">|</span>
                                <span className="text-slate-500 font-normal">{exp.employmentType}</span>
                              </div>
                            </div>
                            <ul className="space-y-1 text-xs text-slate-700 pl-3">
                              {exp.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-slate-400 leading-none mt-1">•</span>
                                  <span className="leading-relaxed">{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Formation & Équivalences MIFI */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b border-slate-300 flex items-center justify-between" style={{ color: colorAccent }}>
                        <span>{resumeLanguage === 'fr' ? 'Formation Académique & Diplômes' : 'Education & Credentials'}</span>
                      </h2>
                      <div className="space-y-2">
                        {data.educations.map((edu) => (
                          <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1">
                            <div>
                              <span className="font-bold text-slate-900">{edu.degree}</span>
                              <span className="text-slate-400 mx-1.5">—</span>
                              <span className="text-slate-700">{edu.institution}</span>
                              <span className="text-slate-500 text-[11px] ml-1">({edu.location})</span>
                              {edu.equivalenceStatus && (
                                <span className="ml-2 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                  ✓ {resumeLanguage === 'fr' ? 'Équivalence MIFI :' : 'Equivalency:'} {edu.equivalenceStatus}
                                </span>
                              )}
                            </div>
                            <span className="text-slate-600 font-bold text-[11px] shrink-0">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications, Ordres Professionnels & Langues (En Ligne) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-300" style={{ color: colorAccent }}>
                          {resumeLanguage === 'fr' ? 'Certifications & Ordres' : 'Certifications & Licenses'}
                        </h2>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {data.certifications.map((c) => (
                            <li key={c.id} className="flex items-baseline justify-between text-[11px]">
                              <div>
                                <span className="font-bold text-slate-900">{c.name}</span>
                                <span className="text-slate-500 block text-[10px]">{c.issuingBody}</span>
                              </div>
                              <span className="text-slate-500 font-semibold">{c.year}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-300" style={{ color: colorAccent }}>
                          {resumeLanguage === 'fr' ? 'Compétences Linguistiques' : 'Languages'}
                        </h2>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {data.languages.map((l, i) => (
                            <li key={i} className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-900">{l.language}</span>
                              <span className="text-slate-600 font-medium">{l.level}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bénévolat, Projets Académiques & Implication */}
                    {data.volunteerWork && data.volunteerWork.length > 0 && (
                      <div className="pt-2">
                        <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-300 flex items-center justify-between" style={{ color: colorAccent }}>
                          <span>{resumeLanguage === 'fr' ? 'Implication Communautaire, Projets & Bénévolat' : 'Community Involvement, Projects & Volunteering'}</span>
                        </h2>
                        <div className="space-y-1.5 text-xs text-slate-700">
                          {data.volunteerWork.map((v, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[11px] gap-1">
                              <div>
                                <span className="font-bold text-slate-900">{v.role}</span>
                                <span className="text-slate-400 mx-1">—</span>
                                <span className="font-semibold text-slate-800">{v.organization}</span>
                                <p className="text-slate-600 text-[10px] mt-0.5">{v.details}</p>
                              </div>
                              <span className="text-slate-500 font-medium shrink-0">{v.period}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* =========================================================
                    GABARIT 2 : QUÉBEC MODERNE (MONTRÉAL PRO & HYBRIDE)
                ========================================================= */}
                {templateTheme === 'modern' && (
                  <div className={density === 'compact' ? 'space-y-3.5 text-xs' : density === 'relaxed' ? 'space-y-6 text-sm' : 'space-y-4 sm:space-y-5 text-xs sm:text-[13px]'}>
                    {/* Header Moderne avec Barre d'accent latérale */}
                    <div className="border-l-4 pl-4 py-1" style={{ borderColor: colorAccent }}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div>
                          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                            {data.fullName.toUpperCase()}
                          </h1>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm sm:text-base font-bold text-slate-800">{data.jobTitle}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: colorAccent }}>
                              CNP {data.targetNoc}
                            </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right text-[11px] space-y-0.5 shrink-0">
                          <span className="inline-block font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ✓ {data.workStatus}
                          </span>
                          <p className="text-slate-500 font-semibold">{data.city}, {data.province} • {data.phone}</p>
                          <p className="text-slate-500">{data.email}</p>
                        </div>
                      </div>

                      {data.summary && (
                        <p className="mt-2.5 text-xs leading-relaxed text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
                          {data.summary}
                        </p>
                      )}
                    </div>

                    {/* Faits Saillants & Compétences (3 Cartes Horizontales Modernes) */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-3.5 rounded-full" style={{ backgroundColor: colorAccent }} />
                        <span>{resumeLanguage === 'fr' ? 'Faits Saillants & Compétences Clés' : 'Core Competencies & Tooling'}</span>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <span className="font-bold text-slate-900 block text-xs mb-1.5">
                            {resumeLanguage === 'fr' ? 'Compétences Techniques' : 'Technical Skills'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {data.technicalSkills.map((s, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-800 shadow-2xs">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <span className="font-bold text-slate-900 block text-xs mb-1.5">
                            {resumeLanguage === 'fr' ? 'Gestion & Savoir-Être' : 'Leadership & Soft Skills'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {data.softSkills.map((s, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-800 shadow-2xs">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <span className="font-bold text-slate-900 block text-xs mb-1.5">
                            {resumeLanguage === 'fr' ? 'Normes & SST (CNESST)' : 'Safety & Compliance'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {data.safetyAndStandards.map((s, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-800 shadow-2xs">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expérience Professionnelle (Timeline Moderne) */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider mb-2.5 text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-3.5 rounded-full" style={{ backgroundColor: colorAccent }} />
                        <span>{resumeLanguage === 'fr' ? 'Parcours & Expérience Professionnelle' : 'Professional Experience'}</span>
                      </h2>
                      <div className="border-l-2 border-slate-200 pl-3.5 space-y-3.5">
                        {data.experiences.map((exp) => (
                          <div key={exp.id} className="relative space-y-1">
                            <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: colorAccent }} />
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1">
                              <span className="font-black text-slate-900 text-sm">{exp.role}</span>
                              <span className="text-[11px] font-bold text-slate-500 shrink-0">{exp.period}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-700">
                              {exp.company} <span className="font-normal text-slate-500">· {exp.location} ({exp.employmentType})</span>
                            </p>
                            <ul className="space-y-1 text-xs text-slate-700 pt-0.5">
                              {exp.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-slate-400 mt-1">•</span>
                                  <span className="leading-relaxed">{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Formation, Équivalences & Langues */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-900 flex items-center gap-2">
                          <span className="w-1.5 h-3.5 rounded-full" style={{ backgroundColor: colorAccent }} />
                          <span>{resumeLanguage === 'fr' ? 'Formation Académique' : 'Education'}</span>
                        </h2>
                        <div className="space-y-2">
                          {data.educations.map((edu) => (
                            <div key={edu.id} className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/70 text-xs">
                              <p className="font-bold text-slate-900">{edu.degree}</p>
                              <p className="text-slate-600 text-[11px]">{edu.institution} ({edu.location}) • {edu.year}</p>
                              {edu.equivalenceStatus && (
                                <p className="text-[10px] font-bold text-blue-700 mt-0.5">
                                  ✓ {resumeLanguage === 'fr' ? 'Équivalence MIFI :' : 'Equivalency:'} {edu.equivalenceStatus}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-900 flex items-center gap-2">
                          <span className="w-1.5 h-3.5 rounded-full" style={{ backgroundColor: colorAccent }} />
                          <span>{resumeLanguage === 'fr' ? 'Certifications & Langues' : 'Certifications & Languages'}</span>
                        </h2>
                        <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/70 space-y-2 text-xs">
                          <ul className="space-y-1 text-[11px]">
                            {data.certifications.map((c) => (
                              <li key={c.id} className="flex justify-between font-medium">
                                <span className="font-bold text-slate-800">{c.name}</span>
                                <span className="text-slate-500">{c.year}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="pt-1.5 border-t border-slate-200 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                            {data.languages.map((l, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <span className="font-bold text-slate-900">{l.language} :</span>
                                <span className="text-slate-600">{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bénévolat & Projets */}
                    {data.volunteerWork && data.volunteerWork.length > 0 && (
                      <div className="pt-2">
                        <h2 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-900 flex items-center gap-2">
                          <span className="w-1.5 h-3.5 rounded-full" style={{ backgroundColor: colorAccent }} />
                          <span>{resumeLanguage === 'fr' ? 'Implication Communautaire & Projets' : 'Community Involvement & Projects'}</span>
                        </h2>
                        <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/70 space-y-1.5 text-xs">
                          {data.volunteerWork.map((v, idx) => (
                            <div key={idx} className="flex justify-between items-baseline text-[11px]">
                              <div>
                                <span className="font-bold text-slate-800">{v.role}</span>
                                <span className="text-slate-500 ml-1">({v.organization})</span>
                                <p className="text-slate-600 text-[10px] mt-0.5">{v.details}</p>
                              </div>
                              <span className="text-slate-500 font-semibold shrink-0">{v.period}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* =========================================================
                    GABARIT 3 : TECH, TI & INGÉNIERIE (STANDARD HUB MONTRÉAL)
                ========================================================= */}
                {templateTheme === 'tech' && (
                  <div className={density === 'compact' ? 'space-y-3.5 text-xs' : density === 'relaxed' ? 'space-y-6 text-sm' : 'space-y-4 sm:space-y-5 text-xs sm:text-[13px]'}>
                    {/* Header Tech Pro (Clair, Moderne & Professionnel) */}
                    <div className="border-b-2 pb-3.5" style={{ borderColor: colorAccent }}>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div>
                          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                            {data.fullName}
                          </h1>
                          <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
                            {data.jobTitle} <span className="text-slate-400 font-normal">| CNP {data.targetNoc}</span>
                          </p>
                        </div>

                        {/* Tech & Contact Links */}
                        <div className="text-xs sm:text-right text-slate-600 space-y-0.5 shrink-0">
                          <p className="font-medium">{data.city}, {data.province} • {data.phone}</p>
                          <p className="text-slate-700">{data.email}</p>
                          {data.linkedin && <p className="text-blue-700 font-bold">{data.linkedin}</p>}
                        </div>
                      </div>

                      {/* Work Status Badge */}
                      <div className="mt-2 flex items-center gap-2 text-[11px]">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ {resumeLanguage === 'fr' ? 'Autorisation de travail :' : 'Work Permit:'} {data.workStatus}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">
                          {resumeLanguage === 'fr' ? 'Disponible immédiatement au Canada' : 'Available immediately in Canada'}
                        </span>
                      </div>

                      {data.summary && (
                        <p className="mt-2.5 text-xs leading-relaxed text-slate-800 text-justify">
                          {data.summary}
                        </p>
                      )}
                    </div>

                    {/* Matrice Horizontale des Compétences & Stacks Techniques */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b border-slate-300 flex items-center justify-between text-slate-950">
                        <span>{resumeLanguage === 'fr' ? 'Matrice des Compétences & Stack Technique' : 'Technical Skills & Tooling Matrix'}</span>
                      </h2>
                      <div className="space-y-1.5 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                          <span className="font-bold text-slate-900 shrink-0 sm:w-44 text-[12px]">
                            {resumeLanguage === 'fr' ? 'Langages & Frameworks :' : 'Languages & Frameworks:'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {data.technicalSkills.map((s, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800 shadow-2xs">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 pt-1 border-t border-slate-200/60">
                          <span className="font-bold text-slate-900 shrink-0 sm:w-44 text-[12px]">
                            {resumeLanguage === 'fr' ? 'Architecture & Méthodes :' : 'Architecture & Agile:'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {data.softSkills.map((s, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800 shadow-2xs">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 pt-1 border-t border-slate-200/60">
                          <span className="font-bold text-slate-900 shrink-0 sm:w-44 text-[12px]">
                            {resumeLanguage === 'fr' ? 'Cloud, DevOps & Normes :' : 'Cloud, Security & Tools:'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {data.safetyAndStandards.map((s, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800 shadow-2xs">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expérience en Ingénierie & Développement */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-2.5 border-b border-slate-300 flex items-center justify-between text-slate-950">
                        <span>{resumeLanguage === 'fr' ? 'Expérience en Ingénierie & Développement' : 'Software Engineering Experience'}</span>
                      </h2>
                      <div className="space-y-3.5">
                        {data.experiences.map((exp) => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1">
                              <div>
                                <span className="font-black text-slate-900 text-sm">{exp.role}</span>
                                <span className="text-slate-400 mx-1.5">—</span>
                                <span className="font-bold text-slate-800">{exp.company}</span>
                                <span className="text-slate-500 text-[11px] ml-1">({exp.location})</span>
                              </div>
                              <span className="font-bold text-slate-600 text-[11px] shrink-0">{exp.period}</span>
                            </div>

                            <ul className="space-y-1 text-xs text-slate-700 pl-3">
                              {exp.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-blue-600 font-bold mt-0.5">›</span>
                                  <span className="leading-relaxed">{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Formation Académique & Certifications Tech */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-300 text-slate-950">
                          {resumeLanguage === 'fr' ? 'Diplômes & Équivalences MIFI' : 'Education'}
                        </h2>
                        <div className="space-y-1.5 text-xs">
                          {data.educations.map((edu) => (
                            <div key={edu.id}>
                              <p className="font-bold text-slate-900">{edu.degree}</p>
                              <p className="text-slate-600 text-[11px]">{edu.institution} ({edu.year})</p>
                              {edu.equivalenceStatus && (
                                <span className="text-[10px] text-blue-700 font-bold block mt-0.5">
                                  ✓ {resumeLanguage === 'fr' ? 'Équivalence MIFI :' : 'Equivalency:'} {edu.equivalenceStatus}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xs font-black uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-300 text-slate-950">
                          {resumeLanguage === 'fr' ? 'Certifications & Langues' : 'Certifications & Languages'}
                        </h2>
                        <ul className="space-y-1 text-[11px]">
                          {data.certifications.map((c) => (
                            <li key={c.id} className="flex justify-between font-medium">
                              <span className="font-bold text-slate-900">{c.name}</span>
                              <span className="text-slate-500">{c.year}</span>
                            </li>
                          ))}
                          {data.languages.map((l, i) => (
                            <li key={i} className="flex justify-between pt-1 border-t border-slate-100 font-medium">
                              <span className="font-bold text-slate-800">{l.language}</span>
                              <span className="text-slate-600">{l.level}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bénévolat / Open Source & Projets */}
                    {data.volunteerWork && data.volunteerWork.length > 0 && (
                      <div className="pt-2">
                        <h2 className="text-xs font-mono font-bold uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-900 text-slate-950 flex items-center justify-between">
                          <span>{resumeLanguage === 'fr' ? '// PROJETS ACADÉMIQUES, OPEN-SOURCE & COMMUNAUTAIRE' : '// ACADEMIC, OPEN-SOURCE & COMMUNITY PROJECTS'}</span>
                        </h2>
                        <div className="space-y-1.5 text-xs text-slate-700">
                          {data.volunteerWork.map((v, idx) => (
                            <div key={idx} className="flex justify-between items-baseline text-[11px]">
                              <div>
                                <span className="font-bold text-slate-900">{v.role}</span>
                                <span className="text-slate-400 mx-1">—</span>
                                <span className="text-slate-700 font-medium">{v.organization}</span>
                                <p className="text-slate-600 text-[10px] mt-0.5">{v.details}</p>
                              </div>
                              <span className="font-mono text-slate-500 shrink-0">{v.period}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* =========================================================
                    GABARIT 4 : OPÉRATIONS, MÉTIERS & INDUSTRIE (CNESST / CCQ)
                ========================================================= */}
                {templateTheme === 'industrial' && (
                  <div className={density === 'compact' ? 'space-y-3.5 text-xs' : density === 'relaxed' ? 'space-y-6 text-sm' : 'space-y-4 sm:space-y-5 text-xs sm:text-[13px]'}>
                    {/* Header Industriel avec Badge Sécurité SST */}
                    <div className="border-b-4 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3" style={{ borderColor: colorAccent }}>
                      <div>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block mb-1">
                          🛡️ CONFORMITÉ SANTÉ ET SÉCURITÉ AU TRAVAIL (CNESST)
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                          {data.fullName.toUpperCase()}
                        </h1>
                        <p className="text-base font-black text-slate-800 mt-0.5">
                          {data.jobTitle}
                        </p>
                        <p className="text-xs font-bold text-slate-600">
                          {data.city}, {data.province} • {data.phone} • {data.email}
                        </p>
                      </div>

                      <div className="text-left sm:text-right text-xs space-y-1 shrink-0">
                        <span className="inline-block font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                          ✓ {data.workStatus}
                        </span>
                        <p className="font-bold text-slate-700 text-[11px]">
                          CNP Qualification : {data.targetNoc}
                        </p>
                      </div>
                    </div>

                    {/* Sommaire & Fiabilité Opérationnelle */}
                    {data.summary && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <h2 className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: colorAccent }}>
                          {resumeLanguage === 'fr' ? 'Aptitudes Opérationnelles & Fiabilité' : 'Operational Summary & Reliability'}
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-800 text-justify">
                          {data.summary}
                        </p>
                      </div>
                    )}

                    {/* Aptitudes Opérationnelles & Machinerie (Lignes Horizontales Dédiées) */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider mb-2 pb-1 border-b-2 border-slate-900 flex items-center justify-between text-slate-950">
                        <span>{resumeLanguage === 'fr' ? 'Sécurité, Machinerie & Équipements Opérés' : 'Safety, Machinery & Tooling'}</span>
                      </h2>
                      <div className="space-y-1.5 text-xs bg-amber-50/40 p-3 rounded-xl border border-amber-200">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                          <span className="font-black text-amber-950 shrink-0 sm:w-44 text-[12px]">
                            {resumeLanguage === 'fr' ? 'Normes SST & CNESST :' : 'Safety Protocols:'}
                          </span>
                          <span className="text-amber-900 font-semibold leading-relaxed">
                            {data.safetyAndStandards.join(' • ')}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 pt-1 border-t border-amber-200/60">
                          <span className="font-black text-slate-900 shrink-0 sm:w-44 text-[12px]">
                            {resumeLanguage === 'fr' ? 'Outillage & Machinerie :' : 'Machinery & Tools:'}
                          </span>
                          <span className="text-slate-800 font-medium leading-relaxed">
                            {data.technicalSkills.join(' • ')}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 pt-1 border-t border-amber-200/60">
                          <span className="font-black text-slate-900 shrink-0 sm:w-44 text-[12px]">
                            {resumeLanguage === 'fr' ? 'Rigueur & Travail d\'Équipe :' : 'Work Ethic & Team:'}
                          </span>
                          <span className="text-slate-800 font-medium leading-relaxed">
                            {data.softSkills.join(' • ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expérience de Travail & Cadence Industrielle */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider mb-2.5 pb-1 border-b-2 border-slate-900 flex items-center justify-between text-slate-950">
                        <span>{resumeLanguage === 'fr' ? 'Expérience en Milieu de Travail' : 'Practical Work Experience'}</span>
                      </h2>
                      <div className="space-y-3.5">
                        {data.experiences.map((exp) => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs gap-1">
                              <div>
                                <span className="font-black text-slate-950 text-sm">{exp.role}</span>
                                <span className="text-slate-400 mx-1.5">—</span>
                                <span className="font-bold text-slate-800">{exp.company}</span>
                                <span className="text-slate-600 text-[11px] ml-1">({exp.location})</span>
                              </div>
                              <span className="font-bold text-slate-700 text-[11px] shrink-0">{exp.period} ({exp.employmentType})</span>
                            </div>
                            <ul className="space-y-1 text-xs text-slate-700 pl-3">
                              {exp.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-slate-900 font-bold mt-0.5">■</span>
                                  <span className="leading-relaxed">{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Formation Professionnelle, Cartes & Langues */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-300 text-slate-950">
                          {resumeLanguage === 'fr' ? 'Diplômes Professionnels (DEP/ASP)' : 'Trade Education'}
                        </h2>
                        <div className="space-y-1.5 text-xs">
                          {data.educations.map((edu) => (
                            <div key={edu.id}>
                              <p className="font-bold text-slate-900">{edu.degree}</p>
                              <p className="text-slate-600 text-[11px]">{edu.institution} ({edu.year})</p>
                              {edu.equivalenceStatus && (
                                <p className="text-[10px] font-bold text-blue-700">{edu.equivalenceStatus}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xs font-black uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-300 text-slate-950">
                          {resumeLanguage === 'fr' ? 'Permis SAAQ & Certifications' : 'Licenses & Certifications'}
                        </h2>
                        <ul className="space-y-1 text-[11px]">
                          {data.certifications.map((c) => (
                            <li key={c.id} className="flex justify-between font-semibold">
                              <span>{c.name} ({c.issuingBody})</span>
                              <span className="text-slate-500">{c.year}</span>
                            </li>
                          ))}
                          {data.languages.map((l, i) => (
                            <li key={i} className="flex justify-between text-slate-700">
                              <span className="font-bold">{l.language}</span>
                              <span>{l.level}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Implication Communautaire & Travaux Bénévoles */}
                    {data.volunteerWork && data.volunteerWork.length > 0 && (
                      <div className="pt-2">
                        <h2 className="text-xs font-black uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-300 text-slate-950">
                          {resumeLanguage === 'fr' ? 'Implication Communautaire & Projets' : 'Community Involvement & Projects'}
                        </h2>
                        <div className="space-y-1 text-xs">
                          {data.volunteerWork.map((v, idx) => (
                            <div key={idx} className="flex justify-between items-baseline text-[11px]">
                              <div>
                                <span className="font-bold text-slate-900">{v.role}</span>
                                <span className="text-slate-600 ml-1">— {v.organization}</span>
                                <p className="text-slate-600 text-[10px]">{v.details}</p>
                              </div>
                              <span className="text-slate-500 font-semibold shrink-0">{v.period}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* -------------------------------------------------------------
                DOCUMENT B : LETTRE DE PRÉSENTATION (COVER LETTER)
            ------------------------------------------------------------- */}
            {activeDocument === 'cover_letter' && (
              <>
                {/* =========================================================
                    LETTRE GABARIT 1 : CLASSIQUE (EXECUTIVE CANADIEN & QUÉBEC)
                ========================================================= */}
                {templateTheme === 'classic' && (
                  <div className="space-y-5 text-xs sm:text-[13px] leading-relaxed text-slate-800">
                    {/* En-tête Exécutif Traditionnel Centré */}
                    <div className="border-b-2 pb-4 text-center space-y-1" style={{ borderColor: colorAccent }}>
                      <h1 className="text-2xl font-black tracking-wide text-slate-900" style={{ color: colorAccent }}>
                        {data.fullName.toUpperCase()}
                      </h1>
                      <p className="text-xs font-bold text-slate-700">{data.jobTitle}</p>
                      <p className="text-xs text-slate-600">
                        {data.city}, {data.province} • {data.phone} • {data.email}
                      </p>
                    </div>

                    {/* Date Formelle Canadienne */}
                    <div className="pt-2 text-slate-600 font-semibold text-right">
                      {new Date().toLocaleDateString(resumeLanguage === 'fr' ? 'fr-CA' : 'en-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    {/* Coordonnées Destinataire */}
                    <div className="space-y-0.5 text-xs">
                      <p className="font-bold text-slate-900">{data.coverLetter.recipientName}</p>
                      <p className="text-slate-700">{data.coverLetter.recipientTitle}</p>
                      <p className="font-bold text-slate-900">{data.coverLetter.companyName}</p>
                      <p className="text-slate-600">{data.coverLetter.companyAddress}</p>
                    </div>

                    {/* Objet Formel */}
                    <div className="py-1">
                      <p className="font-black text-slate-950 text-xs sm:text-sm">
                        {resumeLanguage === 'fr' ? 'OBJET :' : 'SUBJECT:'}{' '}
                        <span className="font-bold underline decoration-slate-300 underline-offset-2">
                          Candidature pour le poste de {data.jobTitle}
                          {data.coverLetter.jobReference && ` (Réf. : ${data.coverLetter.jobReference})`}
                        </span>
                      </p>
                    </div>

                    {/* Salutation Formelle */}
                    <p className="font-bold text-slate-900">{data.coverLetter.salutation}</p>

                    {/* Paragraphe 1 : Accroche */}
                    <p className="text-justify leading-relaxed">{data.coverLetter.openingParagraph}</p>

                    {/* Paragraphes Centraux : Réalisations & Valeur Ajoutée */}
                    {data.coverLetter.bodyParagraphs.map((para, idx) => (
                      <p key={idx} className="text-justify leading-relaxed">
                        {para}
                      </p>
                    ))}

                    {/* Paragraphe Conclusion */}
                    <p className="text-justify leading-relaxed">{data.coverLetter.closingParagraph}</p>

                    {/* Formule de Politesse Finale & Signature */}
                    <div className="pt-4 space-y-6">
                      <p>{data.coverLetter.signoff}</p>
                      <div className="pt-2">
                        <p className="font-black text-slate-950 text-sm">{data.fullName}</p>
                        <p className="text-slate-500 text-xs">{data.phone} • {data.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================
                    LETTRE GABARIT 2 : QUÉBEC MODERNE
                ========================================================= */}
                {templateTheme === 'modern' && (
                  <div className="space-y-5 text-xs sm:text-[13px] leading-relaxed text-slate-800">
                    {/* Header Moderne avec Bandeau Accent */}
                    <div className="border-l-4 pl-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: colorAccent }}>
                      <div>
                        <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                          {data.fullName.toUpperCase()}
                        </h1>
                        <p className="text-xs font-bold text-slate-700">{data.jobTitle}</p>
                      </div>
                      <div className="text-xs text-slate-600 sm:text-right">
                        <p>{data.city}, {data.province} • {data.phone}</p>
                        <p>{data.email}</p>
                      </div>
                    </div>

                    {/* Carte Destinataire Moderne */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">{resumeLanguage === 'fr' ? 'À L\'ATTENTION DE :' : 'ATTENTION :'}</p>
                        <p className="font-bold text-slate-900">{data.coverLetter.recipientName} — <span className="font-normal text-slate-600">{data.coverLetter.recipientTitle}</span></p>
                        <p className="font-semibold text-slate-800">{data.coverLetter.companyName}</p>
                        <p className="text-slate-500 text-[11px]">{data.coverLetter.companyAddress}</p>
                      </div>
                      <span className="font-semibold text-slate-500 text-[11px]">
                        {new Date().toLocaleDateString(resumeLanguage === 'fr' ? 'fr-CA' : 'en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Objet Moderne */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: colorAccent }}>
                        {resumeLanguage === 'fr' ? 'OBJET' : 'SUBJECT'}
                      </span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        Candidature : {data.jobTitle} {data.coverLetter.jobReference && `(#${data.coverLetter.jobReference})`}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900">{data.coverLetter.salutation}</p>
                    <p className="text-justify leading-relaxed">{data.coverLetter.openingParagraph}</p>
                    {data.coverLetter.bodyParagraphs.map((para, idx) => (
                      <p key={idx} className="text-justify leading-relaxed">
                        {para}
                      </p>
                    ))}
                    <p className="text-justify leading-relaxed">{data.coverLetter.closingParagraph}</p>

                    {/* Signature Moderne */}
                    <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                      <div>
                        <p>{data.coverLetter.signoff}</p>
                        <p className="font-black text-slate-900 mt-2 text-sm">{data.fullName}</p>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        ✓ {resumeLanguage === 'fr' ? 'Profil Vérifié Canada' : 'Verified Canada Profile'}
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================
                    LETTRE GABARIT 3 : TECH, TI & INGÉNIERIE
                ========================================================= */}
                {templateTheme === 'tech' && (
                  <div className="space-y-5 text-xs sm:text-[13px] leading-relaxed text-slate-800">
                    {/* Header Tech Pro (Clair & Net) */}
                    <div className="border-b-2 pb-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2" style={{ borderColor: colorAccent }}>
                      <div>
                        <h1 className="text-2xl font-black text-slate-950">{data.fullName}</h1>
                        <p className="text-xs font-bold text-slate-700">{data.jobTitle}</p>
                      </div>
                      <div className="text-xs text-slate-600 sm:text-right">
                        <p>{data.city}, {data.province} • {data.phone}</p>
                        <p>{data.email}</p>
                      </div>
                    </div>

                    {/* Metadata Box Tech */}
                    <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <p><span className="font-bold text-slate-900">{resumeLanguage === 'fr' ? 'DESTINATAIRE :' : 'TO:'}</span> {data.coverLetter.recipientName} ({data.coverLetter.recipientTitle})</p>
                        <p className="font-semibold text-slate-800">{data.coverLetter.companyName}</p>
                        <p className="text-slate-500 text-[11px]">{data.coverLetter.companyAddress}</p>
                      </div>
                      <div className="sm:text-right text-[11px] text-slate-500">
                        <p className="font-bold text-slate-700">{resumeLanguage === 'fr' ? 'RÉF :' : 'REF:'} {data.coverLetter.jobReference || 'TECH-QC-2026'}</p>
                        <p>{new Date().toLocaleDateString(resumeLanguage === 'fr' ? 'fr-CA' : 'en-CA')}</p>
                      </div>
                    </div>

                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {resumeLanguage === 'fr' ? 'Objet :' : 'Subject:'} Candidature — {data.jobTitle}
                    </div>

                    <p className="font-bold text-slate-900">{data.coverLetter.salutation}</p>
                    <p className="text-justify leading-relaxed">{data.coverLetter.openingParagraph}</p>
                    {data.coverLetter.bodyParagraphs.map((para, idx) => (
                      <p key={idx} className="text-justify leading-relaxed">
                        {para}
                      </p>
                    ))}
                    <p className="text-justify leading-relaxed">{data.coverLetter.closingParagraph}</p>

                    <div className="pt-4 space-y-4">
                      <p>{data.coverLetter.signoff}</p>
                      <div>
                        <p className="font-black text-slate-950 text-sm">{data.fullName}</p>
                        <p className="text-xs text-slate-500">{data.phone} • {data.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================
                    LETTRE GABARIT 4 : OPÉRATIONS, MÉTIERS & INDUSTRIE
                ========================================================= */}
                {templateTheme === 'industrial' && (
                  <div className="space-y-5 text-xs sm:text-[13px] leading-relaxed text-slate-800">
                    {/* Header Industriel avec Badge Sécurité */}
                    <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 block w-fit mb-1">
                          CONFORMITÉ SANTÉ ET SÉCURITÉ (CNESST)
                        </span>
                        <h1 className="text-2xl font-black text-slate-950">{data.fullName.toUpperCase()}</h1>
                        <p className="text-xs font-bold text-slate-700">{data.jobTitle}</p>
                      </div>
                      <div className="text-right text-xs text-slate-600">
                        <p className="font-bold text-slate-900">{data.phone}</p>
                        <p>{data.email}</p>
                        <p>{data.city}, {data.province}</p>
                      </div>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <p className="text-slate-500">{new Date().toLocaleDateString(resumeLanguage === 'fr' ? 'fr-CA' : 'en-CA')}</p>
                      <p className="font-black text-slate-950">{data.coverLetter.recipientName} ({data.coverLetter.recipientTitle})</p>
                      <p className="font-bold text-slate-800">{data.coverLetter.companyName}</p>
                      <p className="text-slate-600">{data.coverLetter.companyAddress}</p>
                    </div>

                    <div className="bg-slate-100 p-2 rounded text-xs font-bold text-slate-900">
                      {resumeLanguage === 'fr' ? 'OBJET :' : 'SUBJECT:'} Candidature - {data.jobTitle}
                      {data.coverLetter.jobReference && ` (Réf. : ${data.coverLetter.jobReference})`}
                    </div>

                    <p className="font-bold text-slate-900">{data.coverLetter.salutation}</p>
                    <p className="text-justify leading-relaxed">{data.coverLetter.openingParagraph}</p>
                    {data.coverLetter.bodyParagraphs.map((para, idx) => (
                      <p key={idx} className="text-justify leading-relaxed">
                        {para}
                      </p>
                    ))}
                    <p className="text-justify leading-relaxed">{data.coverLetter.closingParagraph}</p>

                    <div className="pt-4 space-y-4">
                      <p>{data.coverLetter.signoff}</p>
                      <div>
                        <p className="font-black text-slate-950 text-sm">{data.fullName}</p>
                        <p className="text-xs text-slate-600">Disponibilité : Immédiate / Quart de travail flexible</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 1 : CATALOGUE DE MODÈLES PAR CARGO, SETOR & NÍVEL
      ============================================================= */}
      {isCatalogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {lang === 'pt' ? '10 Perfis Especializados' : '10 Gabarits Spécialisés'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {lang === 'pt' ? 'Normas CNP 2021 & IRCC' : 'Normes CNP 2021 & IRCC'}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    {lang === 'pt'
                      ? 'Catálogo de Modelos por Setor, Cargo & Nível de Experiência'
                      : 'Catalogue de Modèles par Secteur, Métier & Niveau d’Expérience'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    {lang === 'pt'
                      ? 'Selecione um modelo pronto baseado no mercado de trabalho real do Canadá e Québec. Inclui tarefas verídicas da CNP, palavras-chave para robôs ATS, competências técnicas e carta de apresentação integrada.'
                      : 'Sélectionnez un modèle calibré sur les réalités du marché de l’emploi québécois et canadien. Comprend tâches réelles CNP, mots-clés ATS, compétences et lettre de motivation.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCatalogOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar: Sectors, Levels & Search */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-white space-y-3">
              {/* Search & Status Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder={lang === 'pt' ? 'Buscar por cargo, setor, CNP ou competência (ex: infirmière, fullstack, CNESST)...' : 'Rechercher par métier, secteur, CNP ou compétence (ex: infirmière, fullstack, CNESST)...'}
                    className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                  {catalogSearch && (
                    <button
                      type="button"
                      onClick={() => setCatalogSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                  <span className="font-bold text-slate-800">{filteredCatalogPresets.length}</span>
                  <span>{lang === 'pt' ? 'modelos encontrados' : 'modèles trouvés'}</span>
                </div>
              </div>

              {/* Levels Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-slate-400" />
                  <span>{lang === 'pt' ? 'Nível:' : 'Niveau :'}</span>
                </span>
                {[
                  { id: 'all', label: lang === 'pt' ? 'Todos os Níveis' : 'Tous Niveaux' },
                  { id: 'premier_emploi', label: lang === 'pt' ? '🌱 1º Emprego (0 Exp)' : '🌱 1er Emploi (0 Exp)' },
                  { id: 'etudiant', label: lang === 'pt' ? '🎓 Estudante / CO-OP' : '🎓 Étudiant / CO-OP' },
                  { id: 'junior', label: 'Junior (1-3 ans)' },
                  { id: 'intermediaire', label: 'Intermédiaire (3-5 ans)' },
                  { id: 'senior', label: 'Senior (5+ ans)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCatalogLevel(item.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      catalogLevel === item.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Sectors Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-400" />
                  <span>{lang === 'pt' ? 'Setor:' : 'Secteur :'}</span>
                </span>
                {[
                  { id: 'all', label: lang === 'pt' ? 'Todos os Setores' : 'Tous Secteurs' },
                  { id: 'tech', label: '💻 Tech & TI' },
                  { id: 'sante', label: '🏥 Santé & OIIQ' },
                  { id: 'industrie', label: '⚙️ Industrie & CNESST' },
                  { id: 'construction', label: '🔨 Construction & CCQ' },
                  { id: 'admin', label: '📁 Administration' },
                  { id: 'finance', label: '📈 Finance & CPA' },
                  { id: 'commerce', label: '🏷️ Ventes & Service' },
                  { id: 'transport', label: '🚛 Transport & Classe 1' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCatalogSector(item.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      catalogSector === item.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Cards Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50">
              {filteredCatalogPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-5 flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block px-2.5 py-1 rounded-lg font-bold text-xs bg-blue-50 text-blue-800 border border-blue-200">
                        {preset.badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                        {preset.nocCode}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {lang === 'pt' ? preset.titleFr : preset.titleFr}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{preset.category}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {preset.highlightsFr}
                    </p>

                    {/* Quick Competencies Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {lang === 'pt' ? 'Competências Chave Inclusas:' : 'Compétences clés intégrées :'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {preset.data.technicalSkills.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {preset.data.technicalSkills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold py-0.5">
                            +{preset.data.technicalSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 font-medium">
                      {preset.data.experiences.length} {lang === 'pt' ? 'experiências' : 'expériences'} • {preset.data.educations.length} {lang === 'pt' ? 'diplomas' : 'diplômes'}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLoadRichPreset(preset)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === 'pt' ? 'Carregar Este Modelo' : 'Charger ce Modèle'}</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredCatalogPresets.length === 0 && (
                <div className="col-span-full py-12 text-center space-y-2 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
                  <p className="text-sm font-bold text-slate-700">
                    {lang === 'pt' ? 'Nenhum modelo encontrado para estes filtros.' : 'Aucun modèle correspondant à ces filtres.'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {lang === 'pt' ? 'Tente limpar a pesquisa ou selecionar "Todos os Setores".' : 'Essayez d’effacer la recherche ou de sélectionner « Tous Secteurs ».'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCatalogSector('all');
                      setCatalogLevel('all');
                      setCatalogSearch('');
                    }}
                    className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    {lang === 'pt' ? 'Redefinir Filtros' : 'Réinitialiser les filtres'}
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center text-xs">
              <span className="text-slate-500">
                {lang === 'pt'
                  ? '💡 Você sempre poderá editar todos os campos depois de carregar o modelo.'
                  : '💡 Vous pourrez modifier librement chaque champ une fois le modèle chargé.'}
              </span>
              <button
                type="button"
                onClick={() => setIsCatalogOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                {lang === 'pt' ? 'Fechar' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 2 : EXTRACTEUR & CONVERTISSEUR IA DE CV (AUTRE FORMAT / LANGUE)
      ============================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden my-auto">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-purple-50/60">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                    {lang === 'pt' ? 'Inteligência Artificial Gemini 3.8 Flash' : 'Intelligence Artificielle Gemini 3.8 Flash'}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5">
                    {lang === 'pt'
                      ? 'Importar, Extrair & Padronizar Currículo (Qualquer Idioma)'
                      : 'Importer, Extraire & Adapter votre CV (Toute Langue)'}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {lang === 'pt'
                      ? 'Cole o texto do seu currículo atual (em português, inglês, espanhol ou francês). Nossa IA elimina dados sensíveis (sem fotos, idade nem estado civil), reescreve realizações com verbos de ação canadenses, calcula equivalências MIFI e gera também uma carta de apresentação sob medida.'
                      : 'Collez le texte brut de votre CV (en portugais, anglais, espagnol ou français). L’IA supprime les données discriminatoires, calibre selon la CNP, reformule les verbes d’action et génère une lettre.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Target Language Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {lang === 'pt' ? 'Idioma de Saída do Currículo e Carta:' : 'Langue de sortie du CV & Lettre :'}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'pt' ? 'Escolha o formato linguístico oficial desejado' : 'Choisissez le format linguistique cible'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setImportTargetLang('fr')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      importTargetLang === 'fr'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🇫🇷 Français (Québec)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportTargetLang('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      importTargetLang === 'en'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🇨🇦 Canadian English
                  </button>
                </div>
              </div>

              {/* File Upload Helper */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-700">
                  {lang === 'pt' ? 'Texto do Currículo Atual:' : 'Texte brut de votre CV :'}
                </span>
                <div>
                  <input
                    type="file"
                    ref={importFileInputRef}
                    onChange={handleImportTextFile}
                    accept=".txt,.json,.md"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => importFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>{lang === 'pt' ? 'Carregar arquivo (.txt, .json)' : 'Charger un fichier (.txt, .json)'}</span>
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                rows={8}
                value={importRawText}
                onChange={(e) => setImportRawText(e.target.value)}
                placeholder={
                  lang === 'pt'
                    ? 'Cole aqui o texto do seu currículo em qualquer formato ou língua...\nExemplo:\n"João Santos, Engenheiro de Software em São Paulo. 6 anos de experiência em Java, Spring, React e AWS. Trabalhou na TechCorp como líder técnico liderando equipe de 8 desenvolvedores..."'
                    : 'Collez ici le texte brut de votre CV...\nExemple :\n"Lucas Tremblay, 5 ans d’expérience en gestion logistique et entrepôt. Maîtrise des chariots élévateurs et supervision de 12 employés..."'
                }
                className="w-full p-3 text-xs leading-relaxed text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-sans"
              />

              {/* Feedback & Errors */}
              {importError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccessNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importSuccessNotice}</span>
                </div>
              )}

              {/* AI Rules Pill */}
              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">
                  {lang === 'pt' ? 'Garantias do Conversor Canadense:' : 'Garanties de conversion aux normes :'}:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                  <li>{lang === 'pt' ? 'Elimina automaticamente foto, idade, estado civil e NAS (anti-discriminação)' : 'Suppression automatique des photos, âges et statuts matrimoniaux'}</li>
                  <li>{lang === 'pt' ? 'Converte tarefas em realizações quantificadas com verbos de ação' : 'Formulation des réalisations avec verbes d’action au passé'}</li>
                  <li>{lang === 'pt' ? 'Classifica competências técnicas vs comportamentais vs normas de segurança' : 'Ventilation technique vs savoir-être vs normes SST'}</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-white cursor-pointer"
              >
                {lang === 'pt' ? 'Cancelar' : 'Annuler'}
              </button>

              <button
                type="button"
                onClick={handleRunAiImport}
                disabled={isImporting || !importRawText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md shadow-purple-500/20 cursor-pointer active:scale-95"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{lang === 'pt' ? 'Extraindo e Adaptando...' : 'Extraction et adaptation en cours...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>{lang === 'pt' ? 'Extrair & Aplicar ao CV' : 'Extraire & Adapter au CV'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 3 : OPTIMISEUR DE CV POUR OFFRE D'EMPLOI CIBLÉE (ATS MATCH & TAILOR)
      ============================================================= */}
      {isOptimizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                    {lang === 'pt' ? 'ATS Matcher & Tailor Pro' : 'Ciblage ATS & Offre d’Emploi'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    {lang === 'pt'
                      ? 'Otimizar Currículo para uma Vaga Específica'
                      : 'Optimiser mon CV pour une Offre d’Emploi Précise'}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                    {lang === 'pt'
                      ? 'Compartilhe o anúncio ou a descrição da vaga da empresa. O nosso motor compara as exigências reais da vaga com o seu perfil, calcula o score ATS, identifica palavras-chave faltantes, contorna pontos fracos e reescreve seu currículo sob medida para conquistar a entrevista.'
                      : 'Collez la description du poste. Notre algorithme calcule votre score ATS, identifie les mots-clés manquants, suggère comment contourner les faiblesses et adapte vos puces et votre lettre sur-mesure.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOptimizeModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* ETAPA 1: FONTE DO CURRÍCULO DO USUÁRIO */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>{lang === 'pt' ? 'Currículo do Usuário (Fonte de Leitura)' : 'CV du Candidat (Source de Données)'}</span>
                  </span>

                  {/* Switch between Current CV in Editor vs Upload/Paste New */}
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setOptResumeSource('current')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        optResumeSource === 'current'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lang === 'pt' ? '📌 Usar CV Atual do Editor' : '📌 Utiliser le CV Actuel'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOptResumeSource('custom_text')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        optResumeSource === 'custom_text'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lang === 'pt' ? '📥 Carregar / Colar Outro CV' : '📥 Charger / Coller un CV'}
                    </button>
                  </div>
                </div>

                {optResumeSource === 'current' ? (
                  /* Preview do currículo atual */
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">
                          {data.fullName || (lang === 'pt' ? 'Candidato' : 'Candidat')}
                        </span>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {data.jobTitle || 'Journalier de production'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {data.experiences.length} {lang === 'pt' ? 'experiências cadastradas' : 'expériences'} · {data.educations.length} {lang === 'pt' ? 'formações' : 'diplômes'} · {data.technicalSkills.length} {lang === 'pt' ? 'competências técnicas' : 'compétences'}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
                      ✓ {lang === 'pt' ? 'Pronto para calibrar com a vaga' : 'Prêt pour l’alignement'}
                    </span>
                  </div>
                ) : (
                  /* Upload ou Colagem de CV novo */
                  <div className="space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-xs text-slate-600">
                        {lang === 'pt'
                          ? 'Faça o upload do seu arquivo de currículo ou cole o texto abaixo. A IA lerá seus dados e adaptará às exigências da vaga.'
                          : 'Chargez votre fichier ou collez le texte de votre CV brut. L’IA extraira vos données réelles pour les calibrer avec le poste.'}
                      </p>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={optFileInputRef}
                          onChange={handleOptTextFileUpload}
                          accept=".txt,.doc,.docx,.pdf,.json"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => optFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>{lang === 'pt' ? 'Carregar Arquivo (.txt / .doc)' : 'Charger Fichier'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOptCustomCvText(`Henrique de Oliveira Santos
Brasileiro – casado - nascido em 23/02/1988
End: Rua Padre Donizete n° 11 JD. Campestre, Embu – Guaçú SP
Tel. (11)96507-2483 / (11)95740-6364
Email: henriqueoliveira248@gmail.com
Objetivo: Auxiliar de produção / embalagem / abastecimento
Formação:
- Ensino médio completo (2009)
- Leitura e Interpretação de desenho técnico mecânico - SENAI (360hs, 2011)
- Inspetor de qualidade - SENAI (360hs, 2012)
Qualificações: Linha de produção, boas práticas de fabricação (BPF), 5S, TPM, KAIZEN, relatórios de produção.
Experiências:
- 06/2017 – Atualmente: Sodimac Dicico (Repositor / atendente especialista)
- 01/2015 – 11/2016: Avon Industrial LTDA (Auxiliar de Produção)
- 03/2011 – 02/2013: Chris Cintos de Segurança LTDA (Ajudante de produção)
Cursos: Segurança no trabalho - SENAI (14hs, 2019)`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors cursor-pointer"
                          title="Inserir texto do currículo do Henrique Santos para demonstração"
                        >
                          {lang === 'pt' ? '⭐ Exemplo Henrique Santos' : '⭐ Exemple Henrique'}
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={4}
                      value={optCustomCvText}
                      onChange={(e) => setOptCustomCvText(e.target.value)}
                      placeholder={
                        lang === 'pt'
                          ? 'Cole aqui o texto do seu currículo em qualquer formato ou idioma (ex: Henrique de Oliveira Santos, experiências, formações no Brasil, etc.)...'
                          : 'Collez ici le texte brut de votre CV...'
                      }
                      className="w-full p-3 text-xs leading-relaxed text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* ETAPA 2: VAGA DE EMPREGO COBIÇADA */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>{lang === 'pt' ? 'Vaga de Emprego Pretendida' : 'Offre d’Emploi Ciblée'}</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'pt' ? 'Nome da Empresa Cobiçada:' : 'Nom de l’Entreprise :'}
                    </label>
                    <input
                      type="text"
                      value={jobCompany}
                      onChange={(e) => setJobCompany(e.target.value)}
                      placeholder="ex: Biscuits Leclerc, Hydro-Québec, Bombardier, Sodimac..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {lang === 'pt' ? 'Título do Cargo na Oferta:' : 'Titre du Poste :'}
                    </label>
                    <input
                      type="text"
                      value={jobTargetTitle}
                      onChange={(e) => setJobTargetTitle(e.target.value)}
                      placeholder="ex: Journalier de production, Opérateur d’emballage, Commis d’entrepôt..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {lang === 'pt' ? 'Descrição / Exigências da Oferta de Emprego:' : 'Description & Exigences de l’Offre d’Emploi :'}
                  </label>
                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder={
                      lang === 'pt'
                        ? 'Cole aqui a descrição completa da vaga do LinkedIn, Indeed, Guichet-Emplois ou site da empresa (responsabilidades, requisitos, máquinas, certificações, etc.)...'
                        : 'Collez ici les responsabilités et qualifications demandées dans l’offre d’emploi...'
                    }
                    className="w-full p-3 text-xs leading-relaxed text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* ETAPA 3: ESCOLHA DO MODELO & FORMATAÇÃO */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>{lang === 'pt' ? 'Modelo de Currículo & Formatações Canadenses' : 'Modèle de CV & Formatage Canadien'}</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    {
                      id: 'classic',
                      title: 'Classique Fédéral',
                      desc: 'Padrão RH Canadá/QC 100% ATS',
                      badge: '⭐ 100% ATS Safe',
                    },
                    {
                      id: 'modern',
                      title: 'Québec Moderne',
                      desc: 'Montréal Pro & Layout Híbrido',
                      badge: '🎨 Design Dinâmico',
                    },
                    {
                      id: 'industrial',
                      title: 'Indústria & Ofícios',
                      desc: 'CNESST, BPF, 5S e Fábricas',
                      badge: '⚙️ Foco em Fábricas',
                    },
                    {
                      id: 'tech',
                      title: 'Tech & Engenharia',
                      desc: 'Hub Montréal & Projetos',
                      badge: '💻 Foco Técnico',
                    },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setOptTemplateTheme(tpl.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        optTemplateTheme === tpl.id
                          ? 'bg-blue-50/80 border-blue-500 shadow-2xs ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-black text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                        {tpl.badge}
                      </span>
                      <span className="font-black text-slate-900 text-xs block mt-1.5">
                        {tpl.title}
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        {tpl.desc}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Sub-opções de Formatação: Cor, Fonte e Idioma */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 text-xs">
                  {/* Cor de Destaque */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-bold">{lang === 'pt' ? 'Cor de Destaque:' : 'Couleur :'}</span>
                    <div className="flex items-center gap-1.5">
                      {COLOR_PALETTES.map((pal) => (
                        <button
                          key={pal.hex}
                          type="button"
                          onClick={() => setOptPrimaryColor(pal.hex)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                            optPrimaryColor === pal.hex ? 'scale-125 border-slate-900 shadow-xs' : 'border-white hover:scale-110'
                          }`}
                          style={{ backgroundColor: pal.hex }}
                          title={pal.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Fonte */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 font-bold">{lang === 'pt' ? 'Tipografia:' : 'Police :'}</span>
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setOptFontFamily('sans')}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                          optFontFamily === 'sans' ? 'bg-blue-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        Sans
                      </button>
                      <button
                        type="button"
                        onClick={() => setOptFontFamily('serif')}
                        className={`px-2 py-0.5 rounded font-serif transition-all cursor-pointer ${
                          optFontFamily === 'serif' ? 'bg-blue-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        Serif
                      </button>
                      <button
                        type="button"
                        onClick={() => setOptFontFamily('mono')}
                        className={`px-2 py-0.5 rounded font-mono transition-all cursor-pointer ${
                          optFontFamily === 'mono' ? 'bg-blue-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        Mono
                      </button>
                    </div>
                  </div>

                  {/* Idioma de Destino */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 font-bold">{lang === 'pt' ? 'Idioma do CV:' : 'Langue :'}</span>
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setOptTargetLang('fr')}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                          optTargetLang === 'fr' ? 'bg-blue-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        Français (QC)
                      </button>
                      <button
                        type="button"
                        onClick={() => setOptTargetLang('en')}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                          optTargetLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        English (CA)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status do Processamento em Tempo Real */}
              {optStepStatus && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                  <span className="font-bold">{optStepStatus}</span>
                </div>
              )}

              {/* Run Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRunAiOptimize}
                  disabled={isOptimizing || !jobDescription.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/25 cursor-pointer active:scale-95 transition-all"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{optStepStatus || (lang === 'pt' ? 'Otimizando para a vaga...' : 'Optimisation en cours...')}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>{lang === 'pt' ? '⚡ Analisar Compatibilidade & Otimizar para esta Vaga' : '⚡ Analyser l’Adéquation & Optimiser'}</span>
                    </>
                  )}
                </button>
              </div>

              {optimizeError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{optimizeError}</span>
                </div>
              )}

              {applySuccessNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{applySuccessNotice}</span>
                </div>
              )}

              {/* RESULTS SECTION */}
              {optimizationResult && (
                <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in duration-300">
                  {/* Score Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900 text-white">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400 font-semibold">{lang === 'pt' ? 'Score ATS Atual:' : 'Score ATS Actuel :'}</span>
                        <span className="font-black text-amber-400">{optimizationResult.matchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all"
                          style={{ width: `${optimizationResult.matchScore}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400 font-semibold">{lang === 'pt' ? 'Score Projetado com Otimização:' : 'Score Projeté après Optimisation :'}</span>
                        <span className="font-black text-emerald-400">{optimizationResult.projectedScoreAfterOptimization}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${optimizationResult.projectedScoreAfterOptimization}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Keywords Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
                      <span className="font-black text-emerald-950 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'pt' ? 'Mots-clés Já Presentes no seu CV:' : 'Mots-clés déjà présents :'}</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(optimizationResult.matchedKeywords || []).map((kw: string, i: number) => (
                          <span key={i} className="text-[11px] bg-white text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
                      <span className="font-black text-amber-950 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>{lang === 'pt' ? 'Mots-clés Críticos que Faltavam na Vaga:' : 'Mots-clés critiques manquants :'}</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(optimizationResult.missingKeywords || []).map((kw: string, i: number) => (
                          <span key={i} className="text-[11px] bg-white text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-300">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weakness Mitigation */}
                  <div className="space-y-3">
                    <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1 text-xs">
                      <span className="font-black text-blue-950 block">
                        {lang === 'pt' ? '💪 Seus Maiores Pontos Fortes para esta Vaga:' : '💪 Vos Atouts Majeurs pour ce Poste :'}
                      </span>
                      <p className="text-blue-900 leading-relaxed">{optimizationResult.strengthsAnalysis}</p>
                    </div>

                    <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-1 text-xs">
                      <span className="font-black text-purple-950 block">
                        {lang === 'pt' ? '🛡️ Como Contornar Pontos Fracos / Falta de Experiência Local:' : '🛡️ Stratégie pour Contourner les Faiblesses :'}
                      </span>
                      <p className="text-purple-900 leading-relaxed">{optimizationResult.weaknessesAdvice}</p>
                    </div>
                  </div>

                  {/* Tailored Professional Summary */}
                  {optimizationResult.tailoredSummary && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">
                          {lang === 'pt' ? '⭐ Sommaire Profissional Sob Medida para o Posto:' : '⭐ Sommaire Professionnel Cible :'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(optimizationResult.tailoredSummary);
                            }
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          {lang === 'pt' ? 'Copiar texto' : 'Copier'}
                        </button>
                      </div>
                      <p className="text-slate-800 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200/80">
                        &ldquo;{optimizationResult.tailoredSummary}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Apply All Button */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-sm font-black text-emerald-950 block">
                        {lang === 'pt' ? 'Pronto para aplicar as melhorias ao seu currículo?' : 'Prêt à appliquer ces optimisations ?'}
                      </span>
                      <p className="text-xs text-emerald-800">
                        {lang === 'pt'
                          ? 'Atualiza automaticamente o seu Sommaire, competências técnicas recomendadas, realizações de experiência e gera a carta de apresentação direcionada à empresa.'
                          : 'Met à jour instantanément votre sommaire, compétences, puces d’expériences et lettre personnalisée.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyOptimization}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95 shrink-0"
                    >
                      {lang === 'pt' ? '⭐ Aplicar ao meu CV & Visualizar no Modelo Escolhido ➔' : '⭐ Appliquer & Visualiser avec le Modèle ➔'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {lang === 'pt' ? 'Análise em tempo real calibrada para o mercado de emprego canadense.' : 'Analyse calibrée pour les logiciels ATS du marché canadien.'}
              </span>
              <button
                type="button"
                onClick={() => setIsOptimizeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
              >
                {lang === 'pt' ? 'Fechar' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
