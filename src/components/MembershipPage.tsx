import React, { useState, useRef } from 'react';
import {
  Home,
  Users,
  UserPlus,
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Camera,
  FileText,
  Send,
  GraduationCap,
  Heart,
  BookOpen,
  Award,
  Medal,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckSquare,
  Square,
  ClipboardList,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations.ts';
import { MemberData } from './MembershipCardModal.tsx';
import { SupabaseClubService } from '../services/supabaseClubService.ts';

interface MembershipPageProps {
  onBackToHome: () => void;
  onRegistered: (newMember: MemberData) => void;
  onOpenAccount: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  language?: Language;
}

export const MembershipPage: React.FC<MembershipPageProps> = ({
  onBackToHome,
  onRegistered,
  onOpenAccount,
  onOpenPrivacy,
  onOpenTerms,
  language = 'ar',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;
  const isLtr = t.direction === 'ltr';

  // Form State
  const [fullName, setFullName] = useState('أحمد محمد علي');
  const [age, setAge] = useState('16');
  const [email, setEmail] = useState('ahmed@example.com');
  const [phone, setPhone] = useState('+213 697 92 15 51');
  const [interest, setInterest] = useState('technological');
  const [bio, setBio] = useState('شاب طموح مهتم بمجالات الإبداع التكنولوجي والبرمجة والعمل التطوعي.');
  const [photoPreview, setPhotoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'
  );
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    setIsSubmitting(true);

    const newMember: MemberData = {
      id: `mem-${Date.now()}`,
      membershipNumber: '231045',
      name: fullName || 'أحمد محمد علي',
      role: 'member',
      roleLabel: 'عضو نشط',
      age: parseInt(age, 10) || 16,
      phone: phone || '+213 697 92 15 51',
      email: email || 'ahmed@example.com',
      city: 'سوق أهراس، الجزائر',
      avatar: photoPreview,
      issueDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      expiryDate: '2026/01/15',
      status: 'active',
    };

    try {
      await SupabaseClubService.registerMember(newMember);
    } catch (err) {
      console.warn('Notice when registering member in Supabase:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onRegistered(newMember);
    }, 600);
  };

  return (
    <div
      dir={isLtr ? 'ltr' : 'rtl'}
      className="min-h-screen bg-[#040f1c] text-white selection:bg-orange-500 selection:text-white pb-24"
    >
      {/* 1. Hero Panorama & Breadcrumb Header Banner */}
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
          {/* Breadcrumb Row */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-200/80">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>الرئيسية</span>
            </button>
            <span className="text-cyan-700">/</span>
            <span className="text-white font-bold">العضوية والأنضمام</span>
          </div>

          {/* Page Main Title Badge */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#040f1d] rounded-[14px] flex items-center justify-center">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span>العضوية والأنضمام</span>
              </h1>
              <p className="text-xs sm:text-sm text-cyan-200/80 mt-1 font-medium">
                كن جزءاً من مجتمعنا الإبداعي .. وانضم إلى نادي منبر الشباب المبدع
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid - 1:1 match to reference screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ------------------------------------------------------------- */}
          {/* COLUMN 1 (Right in RTL): استمارة التسجيل (Registration Form) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-5 bg-[#06182c]/95 backdrop-blur-md border border-cyan-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl">
            {isSubmitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-black text-white">تم قبول طلب العضوية بنجاح!</h3>
                <p className="text-xs sm:text-sm text-cyan-200/90 max-w-sm mx-auto leading-relaxed">
                  مرحباً بك في نادي منبر الشباب المبدع! تم تفعيل حسابك وإصدار بطاقة العضوية الرقمية الخاصة بك برقم <span className="text-amber-400 font-bold font-mono">231045</span>.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={onOpenAccount}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs transition-all cursor-pointer shadow-lg shadow-orange-500/30"
                  >
                    الانتقال إلى حسابي ومعاينة البطاقة
                  </button>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="py-3 px-5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-200 text-xs font-bold hover:bg-cyan-900 cursor-pointer"
                  >
                    تعديل البيانات
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form Header */}
                <div className="pb-3 border-b border-cyan-900/50">
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-5 h-5 text-orange-400" />
                    <h2 className="text-lg sm:text-xl font-black text-white">استمارة التسجيل</h2>
                  </div>
                  <p className="text-xs text-cyan-200/80 mt-1">
                    يرجى تعبئة البيانات التالية بدقة، وسيتم إرسال طلبك إلى إدارة النادي لمراجعته والموافقة عليه.
                  </p>
                </div>

                {/* Name & Age Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-cyan-200 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>الاسم الكامل *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسمك الكامل"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#040f1d] border border-cyan-800/70 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-xs font-bold text-cyan-200 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>العمر *</span>
                    </label>
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-[#040f1d] border border-cyan-800/70 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {Array.from({ length: 24 }, (_, i) => i + 12).map((a) => (
                        <option key={a} value={a}>
                          {a} سنة
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-cyan-200 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>رقم الهاتف *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="أدخل رقم هاتفك"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#040f1d] border border-cyan-800/70 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      dir="ltr"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-cyan-200 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>البريد الإلكتروني *</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="أدخل بريدك الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#040f1d] border border-cyan-800/70 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Interests / Specialization */}
                <div>
                  <label className="block text-xs font-bold text-cyan-200 mb-1 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>التخصصات / الاهتمامات</span>
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full bg-[#040f1d] border border-cyan-800/70 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="technological">تقنية وبرمجة وذكاء اصطناعي</option>
                    <option value="artistic">فنون تشكيلية وتصميم ومسرح</option>
                    <option value="volunteering">عمل تطوعي ومبادرات مجتمعية</option>
                    <option value="cultural">آداب وقراءة وخطابة وإلقاء</option>
                    <option value="media">إعلام وصحافة وصناعة محتوى</option>
                    <option value="scouting">أنشطة كشفية ومغامرة وهواء طلق</option>
                  </select>
                </div>

                {/* Personal Photo Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-cyan-200 mb-1 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>الصورة الشخصية *</span>
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-cyan-800/80 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#031122]/60 hover:bg-[#031122]"
                  >
                    <div className="flex flex-col items-center">
                      {photoPreview ? (
                        <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 mb-2">
                          <img
                            src={photoPreview}
                            alt="preview"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 mb-2">
                          <Upload className="w-6 h-6" />
                        </div>
                      )}
                      <p className="text-xs font-bold text-white">اضغط لرفع الصورة أو اسحبها هنا</p>
                      <p className="text-[10px] text-cyan-300/70 mt-0.5">
                        الصيغ المقبولة: JPG, PNG | الحد الأقصى للحجم: 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Short Bio (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-cyan-200 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>نبذة مختصرة عنك (اختياري)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="اكتب نبذة قصيرة عن نفسك، مهاراتك، أو أي معلومات إضافية ترغب بمشاركتها."
                    className="w-full bg-[#040f1d] border border-cyan-800/70 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>

                {/* Terms Agreement Checkbox */}
                <div
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1"
                >
                  <div className="text-orange-400 shrink-0">
                    {agreeTerms ? (
                      <CheckSquare className="w-4 h-4 fill-orange-500 text-white" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </div>
                  <span className="leading-snug select-none">
                    أوافق على{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTerms();
                      }}
                      className="text-cyan-400 underline hover:text-cyan-300"
                    >
                      الشروط والأحكام
                    </button>{' '}
                    و
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPrivacy();
                      }}
                      className="text-cyan-400 underline hover:text-cyan-300 ml-1"
                    >
                      سياسة الخصوصية
                    </button>{' '}
                    الخاصة بالنادي.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !agreeTerms}
                  className={`w-full py-3.5 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                    agreeTerms
                      ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:brightness-110 shadow-orange-500/30'
                      : 'bg-slate-700 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري معالجة الطلب...' : 'إرسال الطلب'}</span>
                </button>
              </form>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* COLUMN 2 (Left in RTL): شروط ومميزات العضوية & بانر معاً نصنع فرقاً */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card 1: شروط الانضمام */}
            <div className="bg-[#06182c]/95 backdrop-blur-md border border-cyan-900/60 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2.5 mb-1.5">
                <ClipboardList className="w-5 h-5 text-orange-400" />
                <h3 className="text-base sm:text-lg font-black text-white">شروط الانضمام</h3>
              </div>
              <p className="text-xs text-cyan-200/80 mb-4">
                للانضمام إلى نادي منبر الشباب المبدع، يرجى استيفاء الشروط التالية:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Condition 1 */}
                <div className="p-3.5 rounded-2xl bg-[#031122]/80 border border-cyan-900/60 hover:border-amber-400/50 flex flex-col items-center text-center transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 leading-snug">
                    الاهتمام بالمجالات الإبداعية والتطويرية
                  </p>
                </div>

                {/* Condition 2 */}
                <div className="p-3.5 rounded-2xl bg-[#031122]/80 border border-cyan-900/60 hover:border-amber-400/50 flex flex-col items-center text-center transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-rose-400 mb-2 group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 leading-snug">
                    الالتزام بقيم النادي وأهدافه
                  </p>
                </div>

                {/* Condition 3 */}
                <div className="p-3.5 rounded-2xl bg-[#031122]/80 border border-cyan-900/60 hover:border-amber-400/50 flex flex-col items-center text-center transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 leading-snug">
                    أن يكون المتقدم من الفئة العمرية المستهدفة (12 - 25 سنة)
                  </p>
                </div>

                {/* Condition 4 */}
                <div className="p-3.5 rounded-2xl bg-[#031122]/80 border border-cyan-900/60 hover:border-amber-400/50 flex flex-col items-center text-center transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 leading-snug">
                    تقديم طلب الانضمام عبر الموقع الإلكتروني
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: مميزات العضوية */}
            <div className="bg-[#06182c]/95 backdrop-blur-md border border-cyan-900/60 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-white">مميزات العضوية</h3>
              </div>
              <p className="text-xs text-cyan-200/80 mb-4">
                بعد انضمامك إلى النادي ستحصل على العديد من المميزات:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* Benefit 1 */}
                <div className="p-3 rounded-2xl bg-[#031122]/80 border border-cyan-900/60 hover:border-amber-400/50 flex flex-col items-center text-center transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-2">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 leading-snug">
                    المشاركة في الفعاليات والأنشطة
                  </p>
                </div>

                {/* Benefit 2 */}
                <div className="p-3 rounded-2xl bg-[#031122]/80 border border-cyan-900/60 hover:border-amber-400/50 flex flex-col items-center text-center transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 leading-snug">
                    الحصول على دورات وورش عمل
                  </p>
                </div>

                {/* Benefit 3 */}
                <div className="p-3 rounded-2xl bg-[#031122]/80 border border-cyan-900/60 hover:border-amber-400/50 flex flex-col items-center text-center transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 leading-snug">
                    التواصل مع خبراء ومختصين
                  </p>
                </div>

                {/* Benefit 4 */}
                <div className="p-3 rounded-2xl bg-[#031122]/80 border border-cyan-900/60 hover:border-amber-400/50 flex flex-col items-center text-center transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 leading-snug">
                    فرص التطوع والمبادرات
                  </p>
                </div>

                {/* Benefit 5 */}
                <div className="p-3 rounded-2xl bg-[#031122]/80 border border-cyan-900/60 hover:border-amber-400/50 flex flex-col items-center text-center transition-all group col-span-2 sm:col-span-1">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
                    <Medal className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-200 leading-snug">
                    شهادات معتمدة عند المشاركة
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Banner "معاً .. نصنع فرقاً" */}
            <div className="relative rounded-3xl overflow-hidden border border-cyan-800/60 shadow-xl bg-gradient-to-r from-[#072444] via-[#051c35] to-[#0a2f58] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 z-10">
                <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md shrink-0 flex items-center justify-center bg-white/10">
                  <img
                    src="/assets/aistudio/Youth_Creativity_Club_Emblem_41b52108.png"
                    alt="Emblem"
                    className="w-full h-full object-cover rounded-full filter drop-shadow"
                  />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-amber-300">
                    معاً .. نصنع فرقاً
                  </h4>
                  <p className="text-xs sm:text-sm text-cyan-100/90 mt-0.5">
                    انضم إلينا وكن جزءاً من رحلة الإبداع والتغيير
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenAccount}
                className="z-10 py-2.5 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md whitespace-nowrap"
              >
                <span>دخول بوابة العضوية</span>
                {isLtr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              </button>

              {/* Background ambient texture */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
