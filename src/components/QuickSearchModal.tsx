import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Calendar,
  FileText,
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Users,
  ShieldCheck,
  CreditCard,
  Phone,
  Tag,
} from 'lucide-react';
import { ACTIVITIES, ALL_EVENTS, NEWS, ActivityItem, EventItem, NewsItem } from '../data/clubData.ts';
import { Language, TRANSLATIONS } from '../data/translations.ts';

interface SearchResultItem {
  id: string;
  type: 'activity' | 'event' | 'news' | 'page';
  title: string;
  subtitle: string;
  category: string;
  action: () => void;
}

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onSelectActivity: (activity: ActivityItem) => void;
  onSelectEvent: (event: EventItem) => void;
  onSelectNews: (news: NewsItem) => void;
  onOpenJoin: () => void;
  onOpenCard: () => void;
  onOpenVerify: () => void;
  language?: Language;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectActivity,
  onSelectEvent,
  onSelectNews,
  onOpenJoin,
  onOpenCard,
  onOpenVerify,
  language = 'ar',
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'activity' | 'event' | 'news' | 'page'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;
  const isLtr = t.direction === 'ltr';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build searchable repository
  const searchItems: SearchResultItem[] = [
    // 1. Pages
    {
      id: 'page-home',
      type: 'page',
      title: language === 'ar' ? 'الصفحة الرئيسية' : 'Home Page',
      subtitle: language === 'ar' ? 'واجهة النادي، أحدث الأنشطة والفعاليات والأخبار' : 'Club homepage, latest updates and activities',
      category: language === 'ar' ? 'صفحة' : 'Page',
      action: () => {
        onNavigate('home');
        onClose();
      },
    },
    {
      id: 'page-about',
      type: 'page',
      title: language === 'ar' ? 'عن النادي والهيئة الإدارية' : 'About the Club & Board',
      subtitle: language === 'ar' ? 'الرؤية والرسالة، الهيئة الإدارية، التاريخ، وقاعات المقر' : 'Vision, mission, administration and facilities',
      category: language === 'ar' ? 'صفحة' : 'Page',
      action: () => {
        onNavigate('about');
        onClose();
      },
    },
    {
      id: 'page-join',
      type: 'page',
      title: language === 'ar' ? 'استمارة الانضمام والعضوية' : 'Join & Membership Application',
      subtitle: language === 'ar' ? 'التسجيل في النادي، شروط العضوية والامتيازات' : 'Club registration and member perks',
      category: language === 'ar' ? 'عضوية' : 'Membership',
      action: () => {
        onOpenJoin();
        onClose();
      },
    },
    {
      id: 'page-card',
      type: 'page',
      title: language === 'ar' ? 'بطاقة العضوية الرقمية' : 'Digital Membership Card',
      subtitle: language === 'ar' ? 'عرض وتحميل البطاقة الرسمية المعتمدة ورمز QR' : 'View and download official QR card',
      category: language === 'ar' ? 'بطاقة' : 'Card',
      action: () => {
        onOpenCard();
        onClose();
      },
    },
    {
      id: 'page-verify',
      type: 'page',
      title: language === 'ar' ? 'التحقق من صحة العضوية' : 'Membership Verification',
      subtitle: language === 'ar' ? 'فحص السجلات الرسمية والاعتماد برقم العضوية' : 'Check membership records and validation',
      category: language === 'ar' ? 'اعتماد' : 'Verification',
      action: () => {
        onOpenVerify();
        onClose();
      },
    },
    {
      id: 'page-contact',
      type: 'page',
      title: language === 'ar' ? 'تواصل معنا واستفسارات النادي' : 'Contact Us & Inquiries',
      subtitle: language === 'ar' ? 'المقر، البريد، أرقام الهاتف، وموقع دار الشباب حفصي عبد الرزاق' : 'Headquarters, phone, email & location',
      category: language === 'ar' ? 'تواصل' : 'Contact',
      action: () => {
        onNavigate('contact');
        onClose();
      },
    },

    // 2. Activities
    ...ACTIVITIES.map((act) => ({
      id: `act-${act.id}`,
      type: 'activity' as const,
      title: act.name,
      subtitle: `${act.description} — ${act.upcomingEvent}`,
      category: language === 'ar' ? 'نشاط' : 'Activity',
      action: () => {
        onSelectActivity(act);
        onClose();
      },
    })),

    // 3. Events
    ...ALL_EVENTS.map((ev) => ({
      id: `ev-${ev.id}`,
      type: 'event' as const,
      title: ev.title,
      subtitle: `${ev.day} ${ev.month} ${ev.year} | ${ev.location} — ${ev.description}`,
      category: language === 'ar' ? 'فعالية' : 'Event',
      action: () => {
        onSelectEvent(ev);
        onClose();
      },
    })),

    // 4. News
    ...NEWS.map((n) => ({
      id: `news-${n.id}`,
      type: 'news' as const,
      title: n.title,
      subtitle: `${n.date} | ${n.summary}`,
      category: language === 'ar' ? 'خبر' : 'News',
      action: () => {
        onSelectNews(n);
        onClose();
      },
    })),
  ];

  // Filtered results
  const filtered = searchItems.filter((item) => {
    if (activeCategory !== 'all' && item.type !== activeCategory) {
      return false;
    }
    if (!query.trim()) return true;
    const cleanQ = query.trim().toLowerCase();
    return (
      item.title.toLowerCase().includes(cleanQ) ||
      item.subtitle.toLowerCase().includes(cleanQ) ||
      item.category.toLowerCase().includes(cleanQ)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'activity':
        return <Compass className="w-4 h-4 text-cyan-400" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'news':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'page':
      default:
        return <Sparkles className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        dir={isLtr ? 'ltr' : 'rtl'}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#06182c] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white my-auto sm:my-0 max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-cyan-800/40 bg-[#041122]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'ar'
                ? 'ابحث عن نشاط، فعالية، ورشة، خبر، أو صفحة... (أو اضغط ESC للإغلاق)'
                : language === 'fr'
                ? 'Rechercher une activité, événement, actualité...'
                : 'Search activities, events, news, pages...'
            }
            className="w-full bg-transparent px-3 text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
              ESC
            </span>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#051528] border-b border-cyan-900/40 overflow-x-auto text-xs">
          {[
            { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
            { id: 'activity', label: language === 'ar' ? 'الأنشطة والورشات' : 'Activities' },
            { id: 'event', label: language === 'ar' ? 'الفعاليات' : 'Events' },
            { id: 'news', label: language === 'ar' ? 'الأخبار' : 'News' },
            { id: 'page', label: language === 'ar' ? 'الصفحات' : 'Pages' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-xs ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-cyan-950/60 text-slate-300 hover:bg-cyan-900/50 hover:text-white border border-cyan-800/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-[11px] text-slate-400 mr-auto font-mono">
            {filtered.length} {language === 'ar' ? 'نتيجة' : 'results'}
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto max-h-96 divide-y divide-cyan-950/60 p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500/20 via-cyan-900/30 to-transparent border border-orange-500/40 text-white'
                      : 'hover:bg-cyan-900/20 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-orange-500/30 border-orange-400 text-orange-300'
                          : 'bg-cyan-950/80 border-cyan-800/40 text-cyan-300'
                      }`}
                    >
                      {getIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5 max-w-md">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-cyan-400 pl-2 shrink-0">
                    {isLtr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-8 h-8 text-cyan-500/40 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">
                {language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ar'
                  ? 'جرب البحث بكلمات أخرى مثل: روبوت، معسكر، استمارة، مسابقة، أو اتصل'
                  : 'Try searching with different terms'}
              </p>
            </div>
          )}
        </div>

        {/* Keyboard Helper Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#030e1c] border-t border-cyan-900/40 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 font-mono text-[10px]">↑↓</kbd>
              <span>{language === 'ar' ? 'للتنقل' : 'Navigate'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 font-mono text-[10px]">Enter</kbd>
              <span>{language === 'ar' ? 'للاختيار' : 'Select'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 font-mono text-[10px]">ESC</kbd>
              <span>{language === 'ar' ? 'للإغلاق' : 'Close'}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-cyan-300 font-semibold">
            <span>نادي منبر الشاب المبدع</span>
          </div>
        </div>
      </div>
    </div>
  );
};
