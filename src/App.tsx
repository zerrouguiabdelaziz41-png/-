import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ActivitiesSection } from './components/ActivitiesSection.tsx';
import { JoinCard } from './components/JoinCard.tsx';
import { NewsCard } from './components/NewsCard.tsx';
import { EventsCard } from './components/EventsCard.tsx';
import { Footer } from './components/Footer.tsx';
import {
  JoinModal,
  EventModal,
  ActivityModal,
  NewsModal,
  VideoModal,
  AboutModal,
  ContactModal,
  LegalModal,
} from './components/Modals.tsx';
import { ActivityItem, EventItem, NewsItem } from './data/clubData.ts';
import { ContactPage } from './components/ContactPage.tsx';
import { EventsPage } from './components/EventsPage.tsx';
import { NewsPage } from './components/NewsPage.tsx';
import { AboutPage } from './components/AboutPage.tsx';
import { MembershipPage } from './components/MembershipPage.tsx';
import { AccountPage } from './components/AccountPage.tsx';
import { VerificationPage } from './components/VerificationPage.tsx';
import { MembershipCardModal, MemberData, DEFAULT_MEMBER } from './components/MembershipCardModal.tsx';
import { SupabaseModal } from './components/SupabaseModal.tsx';
import { QuickSearchModal } from './components/QuickSearchModal.tsx';
import { ToastNotification, ToastMessage } from './components/ToastNotification.tsx';
import { Language } from './data/translations.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ar');

  // Member & Digital Card state
  const [currentMember, setCurrentMember] = useState<MemberData>(DEFAULT_MEMBER);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);

  // Modals state
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);

  // Interactive Global Quick Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Interactive Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Scroll Progress & Scroll to Top Button
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success', title?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type, title, duration: 3500 }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener (Ctrl+K or Cmd+K) & Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setShowScrollTop(window.scrollY > 350);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Smooth scroll to sections
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isLtr = currentLanguage !== 'ar';

  return (
    <div
      dir={isLtr ? 'ltr' : 'rtl'}
      className="min-h-screen font-['Cairo',sans-serif] selection:bg-orange-500 selection:text-white transition-colors duration-300 bg-[#040f1c] text-white"
    >
      {/* Top Reading / Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-400 z-50 transition-[width] duration-150 ease-out pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={(tab) => {
          if (tab === 'about') {
            setActiveTab('about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (tab === 'contact') {
            setActiveTab('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (tab === 'events') {
            setActiveTab('events');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (tab === 'news') {
            setActiveTab('news');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (tab === 'membership') {
            setActiveTab('membership');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (tab === 'account') {
            setActiveTab('account');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (tab === 'verification') {
            setActiveTab('verification');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (tab === 'home') {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (activeTab !== 'home') {
            setActiveTab('home');
            setTimeout(() => {
              if (tab === 'activities') scrollToSection('activities-section');
            }, 50);
          } else {
            setActiveTab(tab);
            if (tab === 'activities') {
              scrollToSection('activities-section');
            }
          }
        }}
        onOpenJoin={() => {
          setActiveTab('membership');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAccount={() => {
          setActiveTab('account');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCard={() => {
          setIsCardModalOpen(true);
        }}
        onOpenVerify={() => {
          setActiveTab('verification');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupabase={() => {
          setIsSupabaseOpen(true);
        }}
        onOpenContact={() => {
          setActiveTab('contact');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAbout={() => {
          setActiveTab('about');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEvents={() => {
          setActiveTab('events');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNews={() => {
          setActiveTab('news');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenActivities={() => {
          if (activeTab !== 'home') {
            setActiveTab('home');
            setTimeout(() => scrollToSection('activities-section'), 50);
          } else {
            scrollToSection('activities-section');
          }
        }}
      />

      {/* Main Page Content */}
      <main className="w-full">
        {activeTab === 'about' ? (
          <AboutPage
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={currentLanguage}
            onOpenJoin={() => setIsJoinOpen(true)}
            onOpenVideo={() => setIsVideoOpen(true)}
            onOpenContact={() => {
              setActiveTab('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenEvents={() => {
              setActiveTab('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'contact' ? (
          <ContactPage
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={currentLanguage}
            onOpenJoin={() => setIsJoinOpen(true)}
          />
        ) : activeTab === 'events' ? (
          <EventsPage
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={currentLanguage}
            onOpenJoin={() => setIsJoinOpen(true)}
          />
        ) : activeTab === 'news' ? (
          <NewsPage
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={currentLanguage}
            onOpenJoin={() => {
              setActiveTab('membership');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'membership' ? (
          <MembershipPage
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRegistered={(newMember) => {
              setCurrentMember(newMember);
              setActiveTab('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              addToast(
                currentLanguage === 'ar'
                  ? 'تم إنشاء بطاقة العضوية الخاصة بك بنجاح!'
                  : 'Membership created successfully!'
              );
            }}
            onOpenAccount={() => {
              setActiveTab('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPrivacy={() => setLegalType('privacy')}
            onOpenTerms={() => setLegalType('terms')}
            onOpenSupabase={() => setIsSupabaseOpen(true)}
            language={currentLanguage}
          />
        ) : activeTab === 'account' ? (
          <AccountPage
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCardModal={(m) => {
              setCurrentMember(m);
              setIsCardModalOpen(true);
            }}
            onOpenVerify={(m) => {
              setCurrentMember(m);
              setActiveTab('verification');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialMember={currentMember}
            language={currentLanguage}
            onOpenSupabase={() => setIsSupabaseOpen(true)}
          />
        ) : activeTab === 'verification' ? (
          <VerificationPage
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToAccount={() => {
              setActiveTab('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            member={currentMember}
            language={currentLanguage}
          />
        ) : (
          <>
            {/* 1. Hero Section */}
            <section id="home-hero">
              <Hero
                onDiscoverActivities={() => scrollToSection('activities-section')}
                onWatchVideo={() => setIsVideoOpen(true)}
                onOpenJoin={() => {
                  setActiveTab('membership');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                language={currentLanguage}
              />
            </section>

            {/* 2. Activities Container */}
            <div id="activities-section">
              <ActivitiesSection
                onSelectActivity={(activity) => setSelectedActivity(activity)}
                language={currentLanguage}
                onToast={addToast}
              />
            </div>

            {/* 3. Bottom 3-Card Section */}
            <section
              id="cards-section"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {/* Card 1: Join / Community CTA */}
                <div className={isLtr ? 'order-3' : 'order-1'}>
                  <JoinCard
                    onOpenJoin={() => {
                      setActiveTab('membership');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    language={currentLanguage}
                  />
                </div>

                {/* Card 2: Latest News */}
                <div className="order-2">
                  <NewsCard
                    onSelectNews={() => {
                      setActiveTab('news');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onViewAllNews={() => {
                      setActiveTab('news');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    language={currentLanguage}
                    onToast={addToast}
                  />
                </div>

                {/* Card 3: Upcoming Events */}
                <div className={isLtr ? 'order-1' : 'order-3'}>
                  <EventsCard
                    onRegisterEvent={() => {
                      setActiveTab('events');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onViewAllEvents={() => {
                      setActiveTab('events');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    language={currentLanguage}
                    onToast={addToast}
                  />
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={currentLanguage === 'ar' ? 'الرجوع إلى الأعلى' : 'Scroll to top'}
          title={currentLanguage === 'ar' ? 'الرجوع إلى الأعلى' : 'Scroll to top'}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#0d2847]/90 hover:bg-[#133863] border border-cyan-500/50 hover:border-orange-500 text-cyan-300 hover:text-white shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setLegalType('privacy')}
        onOpenTerms={() => setLegalType('terms')}
        language={currentLanguage}
      />

      {/* Interactive Global Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectActivity={(activity) => setSelectedActivity(activity)}
        onSelectEvent={(event) => setSelectedEvent(event)}
        onSelectNews={(news) => setSelectedNews(news)}
        onOpenJoin={() => {
          setActiveTab('membership');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCard={() => setIsCardModalOpen(true)}
        onOpenVerify={() => {
          setActiveTab('verification');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={currentLanguage}
      />

      {/* Interactive Toast Notifications */}
      <ToastNotification
        toasts={toasts}
        onDismiss={removeToast}
      />

      {/* Interactive Modals */}
      <JoinModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        language={currentLanguage}
      />

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        language={currentLanguage}
      />

      <ActivityModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onOpenJoin={() => setIsJoinOpen(true)}
        language={currentLanguage}
      />

      <NewsModal
        news={selectedNews}
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        language={currentLanguage}
      />

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        language={currentLanguage}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenJoin={() => setIsJoinOpen(true)}
        language={currentLanguage}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        language={currentLanguage}
      />

      <LegalModal
        type={legalType}
        isOpen={!!legalType}
        onClose={() => setLegalType(null)}
        language={currentLanguage}
      />

      {/* Digital Membership Card Modal */}
      <MembershipCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        member={currentMember}
        language={currentLanguage}
        onVerify={() => {
          setIsCardModalOpen(false);
          setActiveTab('verification');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Supabase Connection & Settings Modal */}
      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />
    </div>
  );
}
