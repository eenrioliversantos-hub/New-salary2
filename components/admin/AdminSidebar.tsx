'use client';

import React from 'react';
import {
  LayoutDashboard,
  Radar,
  Sparkles,
  Compass,
  FileText,
  Link2,
  Megaphone,
  BookOpen,
  Mail,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building2,
  Lock,
  ArrowLeft,
  X,
  Target,
  BadgeDollarSign,
  TrendingUp,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'radar'
  | 'career-pass'
  | 'ebook'
  | 'affiliates'
  | 'ads'
  | 'b2b-jobs'
  | 'articles'
  | 'newsletter'
  | 'security';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onBackToPortal: () => void;
  onLogout: () => void;
  counts?: {
    articlesCount?: number;
    affiliatesCount?: number;
    adsCount?: number;
    assetsCount?: number;
    careerPassesCount?: number;
    b2bJobsCount?: number;
    leadsCount?: number;
    radarAlertsCount?: number;
  };
}

interface NavItem {
  id: AdminTab;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeVariant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  isNew?: boolean;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onBackToPortal,
  onLogout,
  counts = {},
}) => {
  const navGroups: NavGroup[] = [
    {
      groupTitle: 'Estratégia & Raio-X',
      items: [
        {
          id: 'overview',
          label: 'Visão Geral & Telemetria',
          shortLabel: 'Geral',
          icon: LayoutDashboard,
        },
        {
          id: 'radar',
          label: 'Radar de Oportunidades',
          shortLabel: 'Radar',
          icon: Radar,
          badge: counts.radarAlertsCount && counts.radarAlertsCount > 0 ? `${counts.radarAlertsCount} Alertas` : undefined,
          badgeVariant: 'amber',
          isNew: true,
        },
      ],
    },
    {
      groupTitle: 'Core Business (Produtos)',
      items: [
        {
          id: 'career-pass',
          label: 'Passaporte de Carreira',
          shortLabel: 'Passaporte',
          icon: Target,
          badge: counts.careerPassesCount,
          badgeVariant: 'emerald',
          isNew: true,
        },
        {
          id: 'ebook',
          label: 'E-books & Ativos Digitais',
          shortLabel: 'E-books',
          icon: BookOpen,
          badge: counts.assetsCount,
          badgeVariant: 'slate',
        },
      ],
    },
    {
      groupTitle: 'Monetização & Parcerias',
      items: [
        {
          id: 'affiliates',
          label: 'Links de Afiliados (Amazon/SaaS)',
          shortLabel: 'Afiliados',
          icon: Link2,
          badge: counts.affiliatesCount,
          badgeVariant: 'slate',
        },
        {
          id: 'ads',
          label: 'Anúncios & Banners',
          shortLabel: 'Anúncios',
          icon: Megaphone,
          badge: counts.adsCount,
          badgeVariant: 'slate',
        },
        {
          id: 'b2b-jobs',
          label: 'Vagas B2B & Recrutadores',
          shortLabel: 'Vagas B2B',
          icon: Building2,
          badge: counts.b2bJobsCount,
          badgeVariant: 'blue',
          isNew: true,
        },
      ],
    },
    {
      groupTitle: 'Conteúdo & Tráfego',
      items: [
        {
          id: 'articles',
          label: 'Blog & Artigos (CMS)',
          shortLabel: 'Artigos',
          icon: FileText,
          badge: counts.articlesCount,
          badgeVariant: 'slate',
        },
        {
          id: 'newsletter',
          label: 'Leads & Newsletter',
          shortLabel: 'Leads',
          icon: Mail,
          badge: counts.leadsCount,
          badgeVariant: 'slate',
        },
      ],
    },
    {
      groupTitle: 'Sistema',
      items: [
        {
          id: 'security',
          label: 'Segurança & Ajustes',
          shortLabel: 'Ajustes',
          icon: ShieldCheck,
        },
      ],
    },
  ];

  const handleSelect = (tab: AdminTab) => {
    onSelectTab(tab);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 select-none">
      {/* Brand & Applet Header */}
      <div className={`p-4 border-b border-slate-800 flex items-center justify-between ${isCollapsed ? 'flex-col gap-3 py-4 px-2' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
            ⚡
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-extrabold text-white text-sm tracking-tight block truncate">
                PaieNet.qc <span className="text-blue-400">Admin</span>
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                Central de Monetização
              </span>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Fechar menu lateral"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          aria-label={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                {group.groupTitle}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group text-left ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-300 hover:text-white hover:bg-slate-850 hover:bg-slate-900/80'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />

                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="truncate">{item.label}</span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {item.isNew && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                              Novo
                            </span>
                          )}
                          {item.badge !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : item.badgeVariant === 'amber'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : item.badgeVariant === 'emerald'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : item.badgeVariant === 'blue'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile & Actions */}
      <div className={`p-3 border-t border-slate-800 space-y-2 ${isCollapsed ? 'p-2' : ''}`}>
        <button
          type="button"
          onClick={onBackToPortal}
          title={isCollapsed ? 'Voltar ao Portal Público' : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-blue-400 shrink-0" />
          {!isCollapsed && <span className="truncate">Ver Portal Público</span>}
        </button>

        <button
          type="button"
          onClick={onLogout}
          title={isCollapsed ? 'Encerrar Sessão' : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/20 hover:bg-rose-900/40 border border-rose-900/30 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <Lock className="w-4 h-4 text-rose-400 shrink-0" />
          {!isCollapsed && <span className="truncate">Encerrar Sessão</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 z-30 sticky top-0 h-screen ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-Over Backdrop & Panel) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-950 z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
