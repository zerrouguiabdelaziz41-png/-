import React, { useState, useEffect } from 'react';
import {
  Heart,
  Palette,
  BookOpen,
  Laptop,
  Leaf,
  Camera,
  Users,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { ActivityItem, ACTIVITIES } from '../data/clubData.ts';
import { Language, TRANSLATIONS } from '../data/translations.ts';

// Soccer Ball SVG matching the screenshot
const SoccerBallIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m12 7-3.5 2.5 1.5 4h4l1.5-4z" />
    <path d="M12 2v5" />
    <path d="M21.5 9 17 9.5" />
    <path d="m18 19-4-2" />
    <path d="m6 19 4-2" />
    <path d="M2.5 9 7 9.5" />
  </svg>
);

// Scout Tent SVG matching the triangular tent icon in the screenshot
const ScoutingTentIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3L2 21H22L12 3Z" />
    <path d="M12 3V21" />
    <path d="M12 14L17 21" />
    <path d="M12 14L7 21" />
  </svg>
);

type ActivityCategory = 'all' | 'tech' | 'culture' | 'community' | 'sports_eco';

interface ActivitiesSectionProps {
  onSelectActivity: (activity: ActivityItem) => void;
  language?: Language;
  onToast?: (message: string) => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  onSelectActivity,
  language = 'ar',
  onToast,
}) => {
  const [activeFilter, setActiveFilter] = useState<ActivityCategory>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('club_liked_activities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;
  const isLtr = t.direction === 'ltr';

  const toggleFavorite = (e: React.MouseEvent, activityId: string, activityName: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(activityId);
      const updated = exists ? prev.filter((id) => id !== activityId) : [...prev, activityId];
      try {
        localStorage.setItem('club_liked_activities', JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      if (onToast) {
        if (!exists) {
          onToast(
            language === 'ar'
              ? `تمت إضافة "${activityName}" إلى اهتماماتك المفضلة`
              : language === 'fr'
              ? `"${activityName}" ajouté à vos centres d'intérêt`
              : `Added "${activityName}" to your interests`
          );
        } else {
          onToast(
            language === 'ar'
              ? `تمت إزالة "${activityName}" من الاهتمامات`
              : `Removed "${activityName}" from interests`
          );
        }
      }
      return updated;
    });
  };

  // Map icons to categories
  const getIcon = (id: string, colorClass: string) => {
    const size = 'w-6 h-6 sm:w-7 sm:h-7';
    switch (id) {
      case 'volunteering':
        return <Heart className={`${size} text-rose-400 fill-rose-500/20`} />;
      case 'artistic':
        return <Palette className={`${size} text-fuchsia-400`} />;
      case 'cultural':
        return <BookOpen className={`${size} text-emerald-400`} />;
      case 'sports':
        return <SoccerBallIcon className={`${size} text-slate-100`} />;
      case 'tech':
        return <Laptop className={`${size} text-cyan-400`} />;
      case 'environmental':
        return <Leaf className={`${size} text-emerald-400`} />;
      case 'media':
        return <Camera className={`${size} text-sky-400`} />;
      case 'social':
        return <Users className={`${size} text-pink-400`} />;
      case 'scouting':
        return <ScoutingTentIcon className={`${size} text-teal-300`} />;
      default:
        return <Heart className={`${size} ${colorClass}`} />;
    }
  };

  const getLocalizedName = (id: string, defaultName: string) => {
    const found = t.activitiesSection.items.find((item) => item.id === id);
    return found ? found.name : defaultName;
  };

  // Category mapping
  const categoryMap: Record<string, ActivityCategory> = {
    tech: 'tech',
    media: 'tech',
    artistic: 'culture',
    cultural: 'culture',
    volunteering: 'community',
    social: 'community',
    sports: 'sports_eco',
    environmental: 'sports_eco',
    scouting: 'sports_eco',
  };

  const filterTabs: { id: ActivityCategory; label: string; count: number }[] = [
    {
      id: 'all',
      label: language === 'ar' ? 'جميع الأنشطة' : language === 'fr' ? 'Toutes les activités' : 'All Activities',
      count: ACTIVITIES.length,
    },
    {
      id: 'tech',
      label: language === 'ar' ? 'تقنية وإعلام' : language === 'fr' ? 'Tech & Médias' : 'Tech & Media',
      count: 2,
    },
    {
      id: 'culture',
      label: language === 'ar' ? 'ثقافة وفنون' : language === 'fr' ? 'Culture & Arts' : 'Culture & Arts',
      count: 2,
    },
    {
      id: 'community',
      label: language === 'ar' ? 'تطوع ومجتمع' : language === 'fr' ? 'Social & Volontariat' : 'Community & Social',
      count: 2,
    },
    {
      id: 'sports_eco',
      label: language === 'ar' ? 'رياضة، بيئة وكشافة' : language === 'fr' ? 'Sport, Éco & Scoutisme' : 'Sport, Eco & Scout',
      count: 3,
    },
  ];

  const filteredActivities =
    activeFilter === 'all'
      ? ACTIVITIES
      : ACTIVITIES.filter((act) => categoryMap[act.id] === activeFilter);

  // If viewing all, preserve the exact original 2-row layout (5 on row 1, 4 on row 2)
  const isAll = activeFilter === 'all';
  const row1 = ACTIVITIES.slice(0, 5);
  const row2 = ACTIVITIES.slice(5, 9);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 z-30 mb-8 sm:mb-12">
      {/* Outer Glass Container */}
      <div className="w-full bg-[#041427]/85 backdrop-blur-xl border border-cyan-600/35 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-[0_15px_35px_rgba(2,8,20,0.6)]">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>
              {language === 'ar'
                ? 'استكشف مجالات الإبداع التسعة'
                : language === 'fr'
                ? 'Explorez nos 9 domaines créatifs'
                : 'Explore our 9 creative fields'}
            </span>
            {favorites.length > 0 && (
              <span className="mr-1.5 px-2 py-0.2 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                {favorites.length} {language === 'ar' ? 'مفضل' : 'saved'}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1.5 drop-shadow-sm">
            {t.activitiesSection.title}
          </h2>
          <p className="text-sm sm:text-base text-cyan-200/80 font-medium">
            {t.activitiesSection.subtitle}
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 sm:mt-6">
            {filterTabs.map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] ring-2 ring-orange-400/50'
                      : 'bg-[#09223e]/70 hover:bg-[#0f345e] text-slate-300 hover:text-white border border-cyan-800/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-black/25 text-white'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity Buttons Grid */}
        {isAll ? (
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Row 1: 5 Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {row1.map((activity) => {
                const isFav = favorites.includes(activity.id);
                const locName = getLocalizedName(activity.id, activity.name);
                return (
                  <div
                    key={activity.id}
                    onClick={() => onSelectActivity(activity)}
                    className="relative activity-slot flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#09223e]/50 hover:bg-[#0f345e]/80 border border-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-[0_8px_20px_rgba(6,182,212,0.25)] hover:-translate-y-1"
                  >
                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, activity.id, locName)}
                      aria-label="إضافة للاهتمامات"
                      title={isFav ? 'في المفضلة' : 'أضف للاهتمامات'}
                      className={`absolute top-2.5 ${
                        isLtr ? 'right-2.5' : 'left-2.5'
                      } w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isFav
                          ? 'bg-rose-500/30 text-rose-400 opacity-100 scale-100'
                          : 'bg-slate-900/60 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-400 hover:bg-slate-900/90'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform ${
                          isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''
                        }`}
                      />
                    </button>

                    <div className="mb-2.5 transition-transform duration-300 group-hover:scale-110">
                      {getIcon(activity.id, activity.color)}
                    </div>
                    <span className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-white transition-colors text-center">
                      {locName}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Row 2: 4 Columns centered */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto w-full">
              {row2.map((activity) => {
                const isFav = favorites.includes(activity.id);
                const locName = getLocalizedName(activity.id, activity.name);
                return (
                  <div
                    key={activity.id}
                    onClick={() => onSelectActivity(activity)}
                    className="relative activity-slot flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#09223e]/50 hover:bg-[#0f345e]/80 border border-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-[0_8px_20px_rgba(6,182,212,0.25)] hover:-translate-y-1"
                  >
                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, activity.id, locName)}
                      aria-label="إضافة للاهتمامات"
                      title={isFav ? 'في المفضلة' : 'أضف للاهتمامات'}
                      className={`absolute top-2.5 ${
                        isLtr ? 'right-2.5' : 'left-2.5'
                      } w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isFav
                          ? 'bg-rose-500/30 text-rose-400 opacity-100 scale-100'
                          : 'bg-slate-900/60 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-400 hover:bg-slate-900/90'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform ${
                          isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''
                        }`}
                      />
                    </button>

                    <div className="mb-2.5 transition-transform duration-300 group-hover:scale-110">
                      {getIcon(activity.id, activity.color)}
                    </div>
                    <span className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-white transition-colors text-center">
                      {locName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Filtered Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto">
            {filteredActivities.map((activity) => {
              const isFav = favorites.includes(activity.id);
              const locName = getLocalizedName(activity.id, activity.name);
              return (
                <div
                  key={activity.id}
                  onClick={() => onSelectActivity(activity)}
                  className="relative activity-slot flex flex-col items-center justify-center p-5 rounded-2xl bg-[#09223e]/60 hover:bg-[#0f345e]/90 border border-cyan-500/40 hover:border-cyan-400/80 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-[0_8px_20px_rgba(6,182,212,0.3)] hover:-translate-y-1"
                >
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, activity.id, locName)}
                    className={`absolute top-2.5 ${
                      isLtr ? 'right-2.5' : 'left-2.5'
                    } w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isFav
                        ? 'bg-rose-500/30 text-rose-400 opacity-100'
                        : 'bg-slate-900/60 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-400'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </button>
                  <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                    {getIcon(activity.id, activity.color)}
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-white transition-colors text-center">
                    {locName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
