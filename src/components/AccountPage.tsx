import React, { useState } from 'react';
import {
  Home,
  User,
  Activity,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  Edit3,
  Download,
  QrCode,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Award,
  Sparkles,
  Shield,
  Layers,
  TrendingUp,
  FileText,
  PlusCircle,
  Eye,
  Check,
  X,
  ExternalLink,
  Database,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations.ts';
import { QRCodeBadge } from './QRCodeBadge.tsx';
import { MemberData, DEFAULT_MEMBER } from './MembershipCardModal.tsx';
import { getSupabaseAnonKey } from '../lib/supabase.ts';

interface AccountPageProps {
  onBackToHome: () => void;
  onOpenCardModal: (member: MemberData) => void;
  onOpenVerify: (member: MemberData) => void;
  onOpenSupabase?: () => void;
  initialMember?: MemberData;
  language?: Language;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onBackToHome,
  onOpenCardModal,
  onOpenVerify,
  onOpenSupabase,
  initialMember = DEFAULT_MEMBER,
  language = 'ar',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;
  const isLtr = t.direction === 'ltr';
  const hasAnonKey = Boolean(getSupabaseAnonKey());

  // Active role switcher: member | organizer | admin
  const [activeRole, setActiveRole] = useState<'member' | 'organizer' | 'admin'>('member');
  const [sidebarTab, setSidebarTab] = useState<string>('home');
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Current active member details
  const [member, setMember] = useState<MemberData>(initialMember);

  // Edit form states
  const [editName, setEditName] = useState(member.name);
  const [editPhone, setEditPhone] = useState(member.phone);
  const [editEmail, setEditEmail] = useState(member.email);

  // Organizer: Member list state
  const [organizerRequests, setOrganizerRequests] = useState([
    { id: '1', name: 'أحمد محمد علي', activity: 'نشاط المطالعة', status: 'approved', date: '2025/04/20' },
    { id: '2', name: 'مريم بن سالم', activity: 'الندوات الثقافية', status: 'pending', date: '2025/03/05' },
    { id: '3', name: 'ياسين دراجي', activity: 'المسابقات الفكرية', status: 'pending', date: '2025/02/18' },
  ]);

  // Admin: Request approvals state
  const [adminRequests, setAdminRequests] = useState([
    { id: '1', name: 'أحمد محمد علي', role: 'عضو جديد', status: 'approved', date: '2025/05/10' },
    { id: '2', name: 'نور خالد العتيبي', role: 'عضو جديد', status: 'pending', date: '2025/05/08' },
    { id: '3', name: 'يوسف علي زروقي', role: 'متطوع', status: 'rejected', date: '2025/05/05' },
  ]);

  // Role details config
  const roleProfiles: Record<'member' | 'organizer' | 'admin', MemberData> = {
    member: member,
    organizer: {
      id: 'org-10492',
      membershipNumber: '104920',
      name: 'أ. خالد التومي',
      role: 'organizer',
      roleLabel: 'مشرف نشاط',
      age: 26,
      phone: '+213 697 92 15 52',
      email: 'khaled.organizer@creativeyouth.dz',
      city: 'سوق أهراس، الجزائر',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      issueDate: '2024/09/01',
      expiryDate: '2026/09/01',
      status: 'active',
    },
    admin: {
      id: 'adm-0001',
      membershipNumber: '000141',
      name: 'أ. سارة بوعزيز',
      role: 'admin',
      roleLabel: 'مدير الموقع',
      age: 29,
      phone: '+213 697 92 15 50',
      email: 'admin.sara@creativeyouth.dz',
      city: 'سوق أهراس، الجزائر',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      issueDate: '2024/01/01',
      expiryDate: '2027/01/01',
      status: 'active',
    },
  };

  const currentProfile = roleProfiles[activeRole];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMember({
      ...member,
      name: editName,
      phone: editPhone,
      email: editEmail,
    });
    setEditProfileOpen(false);
  };

  const handleApproveAdminRequest = (id: string) => {
    setAdminRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  };

  const handleRejectAdminRequest = (id: string) => {
    setAdminRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  return (
    <div
      dir={isLtr ? 'ltr' : 'rtl'}
      className="min-h-screen bg-[#040f1c] text-white selection:bg-orange-500 selection:text-white pb-24"
    >
      {/* 1. Hero Panorama & Header Banner */}
      <div className="relative w-full h-56 sm:h-64 lg:h-72 overflow-hidden border-b border-cyan-900/40">
        <img
          src="/assets/aistudio/_____________38f0e34a.png"
          alt="Panoramic Banner"
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040f1c] via-[#040f1c]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040f1c]/80 via-transparent to-[#040f1c]/80" />

        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-amber-500/15 via-cyan-500/10 to-transparent blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-6">
          {/* Breadcrumb Row & Role Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-200/80">
              <button
                onClick={onBackToHome}
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>الرئيسية</span>
              </button>
              <span className="text-cyan-700">/</span>
              <span className="text-white font-bold">حسابي</span>
            </div>

            {/* Quick 3-Role Switcher Bar (Matches user request to apply same theme across member, organizer, admin) */}
            <div className="flex items-center gap-1.5 bg-[#030e1c]/90 p-1.5 rounded-2xl border border-cyan-800/60 shadow-lg">
              <span className="text-[11px] text-cyan-300 font-bold px-2 hidden sm:inline">
                تبديل نوع الحساب:
              </span>
              <button
                onClick={() => setActiveRole('member')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRole === 'member'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-cyan-950'
                }`}
              >
                👤 حساب عضو
              </button>
              <button
                onClick={() => setActiveRole('organizer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRole === 'organizer'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-cyan-950'
                }`}
              >
                🧑‍🏫 مشرف نشاط
              </button>
              <button
                onClick={() => setActiveRole('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-cyan-950'
                }`}
              >
                👑 مدير الموقع
              </button>

              {onOpenSupabase && (
                <button
                  onClick={onOpenSupabase}
                  title="قاعدة بيانات Supabase – فحص الاتصال"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#06182c] border border-cyan-700/60 text-slate-300 hover:text-white hover:border-emerald-500/60 transition-all cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Supabase</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasAnonKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Page Main Title Badge */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#040f1d] rounded-[14px] flex items-center justify-center">
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span>حسابي</span>
                <span className="text-xs sm:text-sm font-bold px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentProfile.roleLabel}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-cyan-200/80 mt-1 font-medium">
                مرحباً بك في حسابك الشخصي – هنا يمكنك متابعة نشاطاتك وطلباتك ومعلوماتك في النادي
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace Layout: Sidebar + Dashboard Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ------------------------------------------------------------- */}
          {/* SIDEBAR NAVIGATION (Col 3 in RTL) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-3 bg-[#06182c]/95 backdrop-blur-md border border-cyan-900/60 rounded-3xl p-4 shadow-xl space-y-1.5">
            <button
              onClick={() => setSidebarTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                sidebarTab === 'home'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#040f1d]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>الصفحة الرئيسية</span>
            </button>

            <button
              onClick={() => {
                setSidebarTab('profile');
                setEditProfileOpen(true);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                sidebarTab === 'profile'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#040f1d]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>معلوماتي الشخصية</span>
            </button>

            <button
              onClick={() => setSidebarTab('activities')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                sidebarTab === 'activities'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#040f1d]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{activeRole === 'member' ? 'أنشطتي' : 'إدارة الأنشطة'}</span>
            </button>

            <button
              onClick={() => setSidebarTab('requests')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                sidebarTab === 'requests'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#040f1d]'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>طلبات التسجيل</span>
            </button>

            <button
              onClick={() => setSidebarTab('announcements')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                sidebarTab === 'announcements'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#040f1d]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>الإعلانات والأخبار</span>
            </button>

            <button
              onClick={() => setSidebarTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                sidebarTab === 'settings'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-[#040f1d]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>إعدادات الحساب</span>
            </button>

            <div className="pt-2 border-t border-cyan-900/50">
              <button
                onClick={onBackToHome}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* DASHBOARD CONTENT (Col 9 in RTL) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Profile & Membership Card Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              
              {/* Member Profile Summary (7 cols) */}
              <div className="md:col-span-7 bg-[#06182c]/95 backdrop-blur-md border border-cyan-900/60 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  {/* Glowing Circular Photo */}
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-300 shadow-md shrink-0">
                    <img
                      src={currentProfile.avatar}
                      alt={currentProfile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                    <button
                      onClick={() => setEditProfileOpen(true)}
                      className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-amber-400 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                      title="تعديل الصورة"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Profile texts */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {currentProfile.name}
                    </h3>
                    <p className="text-xs text-amber-400 font-bold mt-0.5">
                      {currentProfile.roleLabel} في نادي منبر الشباب المبدع
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-300">
                      <div>الهاتف: <span className="font-mono text-cyan-200" dir="ltr">{currentProfile.phone}</span></div>
                      <div>البريد: <span className="text-cyan-200">{currentProfile.email}</span></div>
                      <div>العمر: <span className="text-cyan-200">{currentProfile.age} سنة</span></div>
                      <div>المدينة: <span className="text-cyan-200">{currentProfile.city}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cyan-900/40 flex items-center justify-between">
                  <button
                    onClick={() => setEditProfileOpen(true)}
                    className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-xs font-bold text-cyan-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>تعديل البيانات</span>
                  </button>

                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>حساب نشط ومفعل</span>
                  </span>
                </div>
              </div>

              {/* Digital Membership Card Widget (5 cols) */}
              <div className="md:col-span-5 bg-gradient-to-br from-[#072547] via-[#051c36] to-[#041427] border border-cyan-500/40 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-800/50">
                  <div>
                    <span className="text-[11px] font-black text-amber-400 block">بطاقة العضوية</span>
                    <span className="text-xs font-black text-white">نادي منبر الشباب المبدع</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {currentProfile.roleLabel}
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between gap-3">
                  <div className="space-y-1 text-xs">
                    <div>الاسم: <span className="text-white font-bold">{currentProfile.name}</span></div>
                    <div>رقم العضوية: <span className="font-mono text-amber-400 font-bold">{currentProfile.membershipNumber}</span></div>
                    <div>تاريخ الانضمام: <span className="text-slate-300 font-mono text-[11px]">{currentProfile.issueDate}</span></div>
                  </div>

                  {/* QR Code Widget */}
                  <div className="shrink-0">
                    <QRCodeBadge
                      size={68}
                      value={`https://creative-youth.dz/verify/${currentProfile.membershipNumber}`}
                      onClick={() => onOpenVerify(currentProfile)}
                      showClickHint={false}
                    />
                  </div>
                </div>

                <button
                  onClick={() => onOpenCardModal(currentProfile)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>عرض وتحميل البطاقة</span>
                </button>
              </div>

            </div>

            {/* ------------------------------------------------------------- */}
            {/* VIEW A: Role Member (حساب عضو) */}
            {/* ------------------------------------------------------------- */}
            {activeRole === 'member' && (
              <>
                {/* 3 Columns Row: Registered Activities, Requests Status, Announcements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Card 1: الأنشطة التي سجّلت فيها */}
                  <div className="bg-[#06182c]/95 backdrop-blur-md border border-cyan-900/60 rounded-3xl p-4 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-900/40">
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-orange-400" />
                          <span>الأنشطة التي سجّلت فيها</span>
                        </h4>
                        <span className="text-[10px] text-cyan-300">عرض الكل ←</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl overflow-hidden border border-cyan-900/60 bg-[#030e1c] p-1.5 text-center">
                          <img
                            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80"
                            alt="event"
                            className="w-full h-16 rounded-lg object-cover mb-1"
                          />
                          <p className="text-[11px] font-bold text-white truncate">نشاط المطالعة</p>
                          <span className="text-[9px] text-slate-400 font-mono">2025/04/20</span>
                        </div>

                        <div className="rounded-xl overflow-hidden border border-cyan-900/60 bg-[#030e1c] p-1.5 text-center">
                          <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"
                            alt="event"
                            className="w-full h-16 rounded-lg object-cover mb-1"
                          />
                          <p className="text-[11px] font-bold text-white truncate">الندوات الثقافية</p>
                          <span className="text-[9px] text-slate-400 font-mono">2025/05/10</span>
                        </div>

                        <div className="rounded-xl overflow-hidden border border-cyan-900/60 bg-[#030e1c] p-1.5 text-center">
                          <img
                            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80"
                            alt="event"
                            className="w-full h-16 rounded-lg object-cover mb-1"
                          />
                          <p className="text-[11px] font-bold text-white truncate">المسابقات الفكرية</p>
                          <span className="text-[9px] text-slate-400 font-mono">2025/03/15</span>
                        </div>

                        <div className="rounded-xl overflow-hidden border border-cyan-900/60 bg-[#030e1c] p-1.5 text-center">
                          <img
                            src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&q=80"
                            alt="event"
                            className="w-full h-16 rounded-lg object-cover mb-1"
                          />
                          <p className="text-[11px] font-bold text-white truncate">المخيمات الشبابية</p>
                          <span className="text-[9px] text-slate-400 font-mono">2025/06/01</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: حالة طلبات التسجيل */}
                  <div className="bg-[#06182c]/95 backdrop-blur-md border border-cyan-900/60 rounded-3xl p-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-900/40">
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        <ClipboardList className="w-4 h-4 text-orange-400" />
                        <span>حالة طلبات التسجيل</span>
                      </h4>
                      <span className="text-[10px] text-cyan-300">عرض الكل ←</span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-[#030e1c] border border-cyan-900/50 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">نشاط المطالعة</p>
                          <span className="text-[10px] text-slate-400 font-mono">2025/04/20</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          مقبول
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#030e1c] border border-cyan-900/50 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">الندوات الثقافية</p>
                          <span className="text-[10px] text-slate-400 font-mono">2025/03/05</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          قيد المراجعة
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#030e1c] border border-cyan-900/50 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">المسابقات الفكرية</p>
                          <span className="text-[10px] text-slate-400 font-mono">2025/02/18</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-700/60 text-slate-300 border border-slate-600">
                          مرفوض
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: إشعارات وأخبار الأعضاء */}
                  <div className="bg-[#06182c]/95 backdrop-blur-md border border-cyan-900/60 rounded-3xl p-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-900/40">
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-orange-400" />
                        <span>إشعارات وأخبار الأعضاء</span>
                      </h4>
                      <span className="text-[10px] text-cyan-300">عرض الكل ←</span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#030e1c] border border-cyan-900/50 flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-[11px] leading-tight">نتائج مسابقة الإبداع الثقافي</p>
                          <span className="text-[9px] text-slate-400 font-mono">2025/05/10</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#030e1c] border border-cyan-900/50 flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-[11px] leading-tight">دعوة لحضور ندوة التفكير الإبداعي</p>
                          <span className="text-[9px] text-slate-400 font-mono">2025/04/28</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#030e1c] border border-cyan-900/50 flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-[11px] leading-tight">فرصة تطوعية جديدة بقوافل الخير</p>
                          <span className="text-[9px] text-slate-400 font-mono">2025/04/15</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Row: Quick Stats & Slogan */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-6 bg-gradient-to-r from-[#072444] via-[#051c35] to-[#072444] border border-cyan-800/60 rounded-3xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md shrink-0 flex items-center justify-center bg-white/10">
                        <img
                          src="/assets/aistudio/__________________3__201639fb.svg"
                          alt="Emblem"
                          className="w-full h-full object-contain filter drop-shadow"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-amber-300">معاً .. نصنع فرقاً</h4>
                        <p className="text-xs text-cyan-200">كن جزءاً من رحلة الإبداع والتغيير</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6 bg-[#06182c]/95 backdrop-blur-md border border-cyan-900/60 rounded-3xl p-5 flex items-center justify-around text-center">
                    <div>
                      <span className="text-lg sm:text-xl font-black text-amber-400 block">+520</span>
                      <span className="text-[11px] text-slate-300">أعضاء النادي</span>
                    </div>
                    <div className="border-x border-cyan-900/50 px-4">
                      <span className="text-lg sm:text-xl font-black text-amber-400 block">3</span>
                      <span className="text-[11px] text-slate-300">الفعاليات القادمة</span>
                    </div>
                    <div>
                      <span className="text-lg sm:text-xl font-black text-amber-400 block">12</span>
                      <span className="text-[11px] text-slate-300">عدد الأنشطة</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW B: Role Organizer (حساب مشرف نشاط) */}
            {/* ------------------------------------------------------------- */}
            {activeRole === 'organizer' && (
              <div className="space-y-5">
                {/* 4 Stats Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-2xl bg-[#06182c] border border-cyan-900/60 text-center">
                    <span className="text-2xl font-black text-amber-400 block">3</span>
                    <span className="text-xs text-slate-300">الأنشطة المسندة إليك</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#06182c] border border-cyan-900/60 text-center">
                    <span className="text-2xl font-black text-cyan-400 block">87</span>
                    <span className="text-xs text-slate-300">المشاركون في الأنشطة</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#06182c] border border-cyan-900/60 text-center">
                    <span className="text-2xl font-black text-orange-400 block">6</span>
                    <span className="text-xs text-slate-300">طلبات تسجيل قيد المراجعة</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#06182c] border border-cyan-900/60 text-center">
                    <span className="text-2xl font-black text-emerald-400 block">42</span>
                    <span className="text-xs text-slate-300">مشاركات الأنشطة</span>
                  </div>
                </div>

                {/* Organizer Management Tables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Current Assigned Activities */}
                  <div className="bg-[#06182c]/95 border border-cyan-900/60 rounded-3xl p-5 shadow-xl">
                    <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-orange-400" />
                      <span>الأنشطة الحالية المسندة إليك</span>
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-2xl bg-[#030e1c] border border-cyan-900/50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">نشاط المطالعة وقراءة الكتب</p>
                          <span className="text-[10px] text-slate-400 font-mono">2025/04/20 – 28 مشارك</span>
                        </div>
                        <button className="py-1 px-3 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 hover:text-white text-xs font-bold cursor-pointer">
                          إدارة النشاط
                        </button>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#030e1c] border border-cyan-900/50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">الندوات الثقافية والتفكير الإبداعي</p>
                          <span className="text-[10px] text-slate-400 font-mono">2025/05/15 – 35 مشارك</span>
                        </div>
                        <button className="py-1 px-3 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 hover:text-white text-xs font-bold cursor-pointer">
                          إدارة النشاط
                        </button>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#030e1c] border border-cyan-900/50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">المسابقات الفكرية والعلمية</p>
                          <span className="text-[10px] text-slate-400 font-mono">2025/03/01 – 24 مشارك</span>
                        </div>
                        <button className="py-1 px-3 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 hover:text-white text-xs font-bold cursor-pointer">
                          إدارة النشاط
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Incoming Participant Requests */}
                  <div className="bg-[#06182c]/95 border border-cyan-900/60 rounded-3xl p-5 shadow-xl">
                    <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-400" />
                      <span>طلبات تسجيل الأعضاء في أنشطتك</span>
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      {organizerRequests.map((req) => (
                        <div key={req.id} className="p-3 rounded-2xl bg-[#030e1c] border border-cyan-900/50 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white">{req.name}</p>
                            <span className="text-[10px] text-cyan-300">{req.activity}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {req.status === 'approved' ? (
                              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40">
                                مقبول
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  setOrganizerRequests((prev) =>
                                    prev.map((r) => (r.id === req.id ? { ...r, status: 'approved' } : r))
                                  )
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                              >
                                قبول الطلب
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW C: Role Admin (حساب مدير الموقع) */}
            {/* ------------------------------------------------------------- */}
            {activeRole === 'admin' && (
              <div className="space-y-5">
                {/* Admin Overview Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div className="p-4 rounded-2xl bg-[#06182c] border border-cyan-900/60 text-center">
                    <span className="text-2xl font-black text-amber-400 block">248</span>
                    <span className="text-xs text-slate-300">إجمالي الأعضاء</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#06182c] border border-cyan-900/60 text-center">
                    <span className="text-2xl font-black text-cyan-400 block">12</span>
                    <span className="text-xs text-slate-300">الأنشطة الكلية</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#06182c] border border-cyan-900/60 text-center">
                    <span className="text-2xl font-black text-orange-400 block">18</span>
                    <span className="text-xs text-slate-300">الأخبار والإعلانات</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#06182c] border border-cyan-900/60 text-center">
                    <span className="text-2xl font-black text-emerald-400 block">78%</span>
                    <span className="text-xs text-slate-300">معدل المشاركة</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#06182c] border border-cyan-900/60 text-center col-span-2 sm:col-span-1">
                    <span className="text-2xl font-black text-purple-400 block">8</span>
                    <span className="text-xs text-slate-300">أنشطة نشطة</span>
                  </div>
                </div>

                {/* Quick Admin Actions Row */}
                <div className="p-4 rounded-2xl bg-[#06182c]/90 border border-cyan-800/60 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>إجراءات إدارية سريعة:</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="py-1.5 px-3 rounded-xl bg-cyan-950 border border-cyan-700 text-xs font-bold text-cyan-200 hover:text-white cursor-pointer">
                      + إضافة عضو جديد
                    </button>
                    <button className="py-1.5 px-3 rounded-xl bg-cyan-950 border border-cyan-700 text-xs font-bold text-cyan-200 hover:text-white cursor-pointer">
                      + إضافة نشاط جديد
                    </button>
                    <button className="py-1.5 px-3 rounded-xl bg-cyan-950 border border-cyan-700 text-xs font-bold text-cyan-200 hover:text-white cursor-pointer">
                      + نشر خبر / إعلان
                    </button>
                    <button className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold cursor-pointer">
                      مراجعة الطلبات المعلقة
                    </button>
                  </div>
                </div>

                {/* Admin Requests Review Table */}
                <div className="bg-[#06182c]/95 border border-cyan-900/60 rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/40">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-orange-400" />
                      <span>طلبات العضوية والتسجيل الأخيرة</span>
                    </h4>
                    <span className="text-xs text-cyan-300">عرض جميع الطلبات (248) ←</span>
                  </div>

                  <div className="space-y-3">
                    {adminRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-3.5 rounded-2xl bg-[#030e1c] border border-cyan-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center text-amber-400 font-bold border border-cyan-800">
                            {req.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{req.name}</p>
                            <span className="text-slate-400 text-[11px] font-mono">{req.role} – {req.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {req.status === 'approved' ? (
                            <span className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              مقبول
                            </span>
                          ) : req.status === 'rejected' ? (
                            <span className="px-3 py-1 rounded-lg text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              مرفوض
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleApproveAdminRequest(req.id)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                              >
                                قبول
                              </button>
                              <button
                                onClick={() => handleRejectAdminRequest(req.id)}
                                className="px-3 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold cursor-pointer"
                              >
                                رفض
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* 3. Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#06182c] border border-cyan-500/50 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>تعديل بيانات الحساب</span>
              </h3>
              <button
                onClick={() => setEditProfileOpen(false)}
                className="w-7 h-7 rounded-full bg-cyan-950 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-cyan-200 mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#040f1d] border border-cyan-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-cyan-200 mb-1">رقم الهاتف:</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#040f1d] border border-cyan-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-cyan-200 mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#040f1d] border border-cyan-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-950 text-slate-300 hover:bg-cyan-900 cursor-pointer font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black cursor-pointer shadow-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
