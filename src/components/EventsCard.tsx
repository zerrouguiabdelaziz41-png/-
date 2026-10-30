import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, ArrowRight, MapPin, Clock, Share2, Heart, Check } from 'lucide-react';
import { FEATURED_EVENT, EventItem } from '../data/clubData.ts';
import { Language, TRANSLATIONS } from '../data/translations.ts';

interface EventsCardProps {
  onRegisterEvent: (event: EventItem) => void;
  onViewAllEvents: () => void;
  onToast?: (msg: string) => void;
  language?: Language;
}

export const EventsCard: React.FC<EventsCardProps> = ({
  onRegisterEvent,
  onViewAllEvents,
  onToast,
  language = 'ar',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;
  const isLtr = t.direction === 'ltr';
  const feat = t.eventsCard.featured;

  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live countdown state (Targeting April 22, 2026 / future date)
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    // Check initial like state from localStorage
    const savedLike = localStorage.getItem('liked_event_' + FEATURED_EVENT.id);
    if (savedLike === 'true') setIsLiked(true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isLiked;
    setIsLiked(nextState);
    localStorage.setItem('liked_event_' + FEATURED_EVENT.id, String(nextState));
    if (onToast) {
      onToast(nextState ? (language === 'ar' ? 'تمت إضافة الفعالية إلى مفضلتك ❤️' : 'Added to favorites ❤️') : (language === 'ar' ? 'تمت إزالة الفعالية من المفضلة' : 'Removed from favorites'));
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.origin + '#events');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        if (onToast) {
          onToast(language === 'ar' ? 'تم نسخ رابط الفعالية بنجاح! 📋' : 'Event link copied! 📋');
        }
      }
    } catch {
      if (onToast) {
        onToast(language === 'ar' ? 'فعالية معسكر الشباب المبدع' : 'Creative Youth Camp');
      }
    }
  };

  const event: EventItem = {
    ...FEATURED_EVENT,
    title: feat.title,
    day: feat.day,
    month: feat.month,
    year: feat.year,
    location: feat.location,
    description: feat.description,
    price: feat.price,
    duration: feat.duration,
    schedule: feat.schedule,
  };

  return (
    <div
      className={`rounded-2xl bg-[#041427]/85 backdrop-blur-xl border border-cyan-700/30 p-5 sm:p-6 flex flex-col justify-between h-full min-h-[380px] shadow-[0_10px_25px_rgba(2,8,20,0.5)] ${
        isLtr ? 'text-left' : 'text-right'
      }`}
    >
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-cyan-800/30">
          {/* Calendar Icon + Title */}
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>{t.eventsCard.title}</span>
          </div>

          {/* Action icons + View All Link */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              title={language === 'ar' ? 'مشاركة رابط الفعالية' : 'Share event link'}
              className="p-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/60 text-cyan-300 hover:text-white transition-all cursor-pointer border border-cyan-800/40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleToggleLike}
              title={isLiked ? 'إلغاء الإعجاب' : 'إعجاب بالفعالية'}
              className={`p-1.5 rounded-lg transition-all cursor-pointer border ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-cyan-950/70 hover:bg-cyan-900/60 text-slate-300 hover:text-rose-400 border-cyan-800/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={onViewAllEvents}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer group"
            >
              <span>{t.eventsCard.viewAll}</span>
              {isLtr ? (
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              ) : (
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              )}
            </button>
          </div>
        </div>

        {/* Featured Event Card */}
        <div className="flex flex-col">
          {/* Image Container with Date Badge & Interactive Live Countdown Bar */}
          <div className="relative rounded-xl overflow-hidden aspect-[16/8] sm:aspect-[16/7] mb-3.5 border border-cyan-800/40 group">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Date Badge */}
            <div
              className={`absolute top-2.5 ${
                isLtr ? 'left-2.5' : 'right-2.5'
              } bg-[#ea580c] text-white px-2.5 py-1 rounded-lg text-center shadow-lg font-bold flex flex-col items-center justify-center min-w-[42px] leading-tight`}
            >
              <span className="text-base sm:text-lg font-black leading-none">{event.day}</span>
              <span className="text-[10px] sm:text-xs font-semibold leading-tight">{event.month}</span>
              <span className="text-[9px] font-normal opacity-90 leading-none">{event.year}</span>
            </div>

            {/* Live Interactive Countdown Banner at bottom of Image */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#041224]/85 backdrop-blur-md border border-cyan-500/30 text-[11px] text-cyan-200">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Clock className="w-3 h-3 animate-pulse" />
                <span>{language === 'ar' ? 'العد التنازلي:' : 'Starts in:'}</span>
              </span>
              <div className="flex items-center gap-1 font-mono font-bold text-white text-[10px] sm:text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                  {timeLeft.days}ي
                </span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                  {String(timeLeft.hours).padStart(2, '0')}س
                </span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                  {String(timeLeft.minutes).padStart(2, '0')}د
                </span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-orange-600/80 border border-orange-500 text-amber-200">
                  {String(timeLeft.seconds).padStart(2, '0')}ث
                </span>
              </div>
            </div>
          </div>

          {/* Event Title */}
          <h4
            onClick={() => onRegisterEvent(event)}
            className="text-base sm:text-lg font-extrabold text-white mb-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {event.title}
          </h4>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-2 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#f97316] shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>
        </div>
      </div>

      {/* Register Button */}
      <div className="pt-2">
        <button
          onClick={() => onRegisterEvent(event)}
          className="btn-orange-gradient w-full py-2.5 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-95"
        >
          <span>{feat.button}</span>
          {isLtr ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

