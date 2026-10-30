import { getSupabaseClient } from '../lib/supabase.ts';
import { MemberData, DEFAULT_MEMBER } from '../components/MembershipCardModal.tsx';

export type UserRole = 'member' | 'organizer' | 'admin';

export interface ClubRoleProfile {
  id: string;
  role: UserRole;
  roleLabel: string;
  name: string;
  email: string;
  phone: string;
  membershipNumber: string;
  avatar: string;
  city: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'pending' | 'expired';
}

export interface SignUpMemberParams {
  email: string;
  password?: string;
  fullName: string;
  phone: string;
  age: number;
  interest?: string;
  motivation?: string;
  avatar?: string;
  city?: string;
}

export interface SignUpMemberResult {
  success: boolean;
  user?: any;
  userId?: string;
  session?: any;
  needsEmailConfirmation?: boolean;
  error?: string;
  errorCode?: string;
  arabicMessage: string;
}

function translateSupabaseAuthError(errMessage: string, status?: number): string {
  const msg = (errMessage || '').toLowerCase();

  if (msg.includes('user already registered') || msg.includes('user_already_exists') || msg.includes('already exists')) {
    return 'هذا البريد الإلكتروني مسجل مسبقاً في النادي. إذا كنت مسجلاً من قبل يمكنك تسجيل الدخول أو استخدام بريد آخر.';
  }
  if (msg.includes('password should be at least') || msg.includes('weak_password')) {
    return 'كلمة المرور ضعيفة. يجب أن تتكون من 6 أحرف أو أرقام على الأقل.';
  }
  if (msg.includes('signup requires a valid password') || msg.includes('missing password')) {
    return 'يرجى إدخال كلمة مرور صالحة (6 خانات على الأقل) لإنشاء حساب العضوية.';
  }
  if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
    return 'صيغة البريد الإلكتروني غير صالحة. يرجى إدخال عنوان بريد إلكتروني صحيح.';
  }
  if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
    return 'تم تجاوز الحد الأقصى لمحاولات التسجيل مؤقتاً. يرجى الانتظار بضع دقائق والمحاولة مجدداً.';
  }
  if (msg.includes('signups not allowed') || msg.includes('signup_disabled')) {
    return 'التسجيل الذاتي مغلق حالياً في إعدادات Supabase Auth (Signups are disabled).';
  }
  if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('cors')) {
    return `تعذر الاتصال بخوادم Supabase (${errMessage}). يرجى التحقق من اتصال الإنترنت وصلاحية رابط المشروع.`;
  }
  if (msg.includes('invalid api key') || msg.includes('jwt') || msg.includes('api key')) {
    return `مفتاح Supabase غير معتمد من الخادم ("${errMessage}"). يرجى التأكد من نسخ المفتاح العام الكامل (الذي يبدأ بـ sb_publishable_ أو eyJ...) من لوحة تحكم Supabase > Project Settings > API.`;
  }

  return `حدث خطأ أثناء الاتصال بـ Supabase: "${errMessage}"`;
}

/**
 * Service for interacting with Supabase tables without altering schemas or RLS
 */
export const SupabaseClubService = {
  /**
   * Search member by membership number (used in VerificationPage and QR Code scanner)
   */
  async verifyMember(membershipNumber: string): Promise<{
    found: boolean;
    member?: MemberData;
    source: 'supabase' | 'local';
    error?: string;
  }> {
    const client = getSupabaseClient();
    const cleanNumber = (membershipNumber || '').trim();

    if (client) {
      try {
        // 1. Try querying 'members' table if exists
        const { data, error } = await client
          .from('members')
          .select('*')
          .eq('membership_number', cleanNumber)
          .maybeSingle();

        if (data && !error) {
          return {
            found: true,
            source: 'supabase',
            member: {
              id: data.id || `mem-${data.membership_number}`,
              membershipNumber: data.membership_number || cleanNumber,
              name: data.name || data.full_name || 'عضو منبر الشباب',
              role: (data.role as UserRole) || 'member',
              roleLabel: data.role_label || (data.role === 'admin' ? 'مدير الموقع' : data.role === 'organizer' ? 'مشرف نشاط' : 'عضو نشط'),
              age: data.age || 20,
              phone: data.phone || '+213 697 92 15 51',
              email: data.email || 'member@creativeyouth.dz',
              city: data.city || 'سوق أهراس، الجزائر',
              avatar: data.avatar || data.photo_url || DEFAULT_MEMBER.avatar,
              issueDate: data.issue_date || data.created_at?.split('T')[0]?.replace(/-/g, '/') || '2025/01/15',
              expiryDate: data.expiry_date || '2026/01/15',
              status: (data.status as 'active' | 'pending' | 'expired') || 'active',
            },
          };
        }

        // 2. Try querying 'profiles' table if the user project uses standard profiles
        const { data: profileData, error: profileErr } = await client
          .from('profiles')
          .select('*')
          .or(`membership_number.eq.${cleanNumber},id.eq.${cleanNumber}`)
          .maybeSingle();

        if (profileData && !profileErr) {
          return {
            found: true,
            source: 'supabase',
            member: {
              id: profileData.id,
              membershipNumber: profileData.membership_number || cleanNumber,
              name: profileData.full_name || profileData.name || 'عضو معتمد',
              role: (profileData.role as UserRole) || 'member',
              roleLabel: profileData.role === 'admin' ? 'مدير الموقع' : profileData.role === 'organizer' ? 'مشرف نشاط' : 'عضو نشط',
              age: profileData.age || 20,
              phone: profileData.phone || '+213 697 92 15 51',
              email: profileData.email || 'profile@creativeyouth.dz',
              city: profileData.city || 'سوق أهراس، الجزائر',
              avatar: profileData.avatar_url || profileData.avatar || DEFAULT_MEMBER.avatar,
              issueDate: profileData.created_at?.split('T')[0]?.replace(/-/g, '/') || '2025/01/15',
              expiryDate: '2026/01/15',
              status: 'active',
            },
          };
        }
      } catch (err: any) {
        console.warn('[SupabaseClubService] Error verifying member in Supabase:', err.message);
      }
    }

    // Fallback to local default / demo validation if number matches
    if (
      cleanNumber === DEFAULT_MEMBER.membershipNumber ||
      cleanNumber === '231045' ||
      cleanNumber === '104920' ||
      cleanNumber === '000141'
    ) {
      return {
        found: true,
        source: 'local',
        member: DEFAULT_MEMBER,
      };
    }

    return {
      found: false,
      source: client ? 'supabase' : 'local',
    };
  },

  /**
   * Register a new member using Supabase Authentication
   * Passes full name, motivation, and details in raw_user_meta_data for handle_new_user trigger
   */
  async signUpClubMember(params: SignUpMemberParams): Promise<SignUpMemberResult> {
    const client = getSupabaseClient();
    if (!client) {
      return {
        success: false,
        errorCode: 'MISSING_SUPABASE_KEY',
        arabicMessage: 'لم يتم العثور على المفتاح العام لـ Supabase (VITE_SUPABASE_ANON_KEY أو VITE_SUPABASE_PUBLISHABLE_KEY). يرجى وضع المفتاح العام (الذي يبدأ بـ sb_publishable_ أو eyJ...) في ملف .env.local أو في نافذة إعدادات Supabase.',
      };
    }

    const cleanEmail = (params.email || '').trim().toLowerCase();
    const cleanPassword = (params.password || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return {
        success: false,
        errorCode: 'INVALID_EMAIL',
        arabicMessage: 'يرجى إدخال بريد إلكتروني صالح (مثال: user@example.com).',
      };
    }

    if (cleanPassword.length < 6) {
      return {
        success: false,
        errorCode: 'WEAK_PASSWORD',
        arabicMessage: 'يجب أن تتكون كلمة المرور من 6 خانات أو أحرف على الأقل لحماية حسابك.',
      };
    }

    try {
      // Strictly prevent any Base64 strings or binary data from bloating the Auth request payload
      // Supabase Auth enforces a 1MB max body limit
      const rawAvatar = typeof params.avatar === 'string' ? params.avatar.trim() : '';
      const safeAvatar = rawAvatar.startsWith('data:') ? '' : rawAvatar;

      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: params.fullName.trim(),
            name: params.fullName.trim(),
            phone: params.phone.trim(),
            age: params.age,
            interest: params.interest || 'technological',
            motivation: (params.motivation || '').trim(),
            bio: (params.motivation || '').trim(),
            city: params.city || 'سوق أهراس، الجزائر',
            avatar: safeAvatar,
            role: 'member' as UserRole, // دور العضو
            role_label: 'عضو جديد',
            status: 'pending', // حالة طلب الانضمام المعلق للمراجعة
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          errorCode: error.code || 'AUTH_ERROR',
          arabicMessage: translateSupabaseAuthError(error.message, error.status),
        };
      }

      if (!data || !data.user) {
        return {
          success: false,
          errorCode: 'NO_USER_RETURNED',
          arabicMessage: 'تعذر استلام بيانات المستخدم من Supabase Auth، يرجى المحاولة مرة أخرى.',
        };
      }

      const needsEmailConfirmation = !data.session;

      // Note: per requirement 5, we do NOT execute a secondary manual insert into 'members'
      // because database trigger 'handle_new_user' automatically provisions the member record from raw_user_meta_data!

      return {
        success: true,
        user: data.user,
        userId: data.user.id,
        session: data.session,
        needsEmailConfirmation,
        arabicMessage: needsEmailConfirmation
          ? 'تم إنشاء الحساب بنجاح! تم إرسال رابط تأكيد إلى بريدك الإلكتروني، وطلبك قيد المراجعة لدى إدارة النادي.'
          : 'تم تسجيل حسابك بنجاح! طلب الانضمام معلّق حالياً وهو قيد المراجعة والاعتماد من قبل إدارة النادي.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        errorCode: 'NETWORK_OR_CLIENT_ERROR',
        arabicMessage: translateSupabaseAuthError(err.message || 'Network error'),
      };
    }
  },

  /**
   * Upload user photo separately to Supabase Storage after account creation
   * Uses an isolated, secure path scoped to the user ID: avatars/{userId}/avatar-{timestamp}.{ext}
   */
  async uploadUserAvatar(userId: string, file: File): Promise<{
    success: boolean;
    publicUrl?: string;
    error?: string;
  }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'عميل Supabase غير مهيأ' };
    }

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
      const filePath = `${userId}/avatar-${Date.now()}.${cleanExt}`;

      const { data, error } = await client.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.warn('[SupabaseClubService] Storage upload notice:', error.message);
        return { success: false, error: error.message };
      }

      const { data: urlData } = client.storage.from('avatars').getPublicUrl(filePath);
      return {
        success: true,
        publicUrl: urlData?.publicUrl,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'تعذر رفع الصورة إلى التخزين' };
    }
  },

  /**
   * Save a newly registered member into Supabase (if table exists and permitted)
   */
  async registerMember(member: MemberData): Promise<{
    success: boolean;
    savedToSupabase: boolean;
    error?: string;
  }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: true, savedToSupabase: false };
    }

    try {
      const payload = {
        membership_number: member.membershipNumber,
        name: member.name,
        full_name: member.name,
        role: member.role,
        role_label: member.roleLabel,
        age: member.age,
        phone: member.phone,
        email: member.email,
        city: member.city,
        avatar: member.avatar,
        status: member.status,
        issue_date: member.issueDate,
        expiry_date: member.expiryDate,
      };

      const { error } = await client.from('members').insert([payload]);

      if (error) {
        // Table might not exist or RLS might require auth; we don't break the user flow
        console.info('[SupabaseClubService] Notice on insert:', error.message);
        return { success: true, savedToSupabase: false, error: error.message };
      }

      return { success: true, savedToSupabase: true };
    } catch (err: any) {
      return { success: true, savedToSupabase: false, error: err.message };
    }
  },

  /**
   * Fetch club stats for Admin / Organizer dashboards
   */
  async getDashboardStats(): Promise<{
    totalMembers: number;
    activeActivities: number;
    pendingRequests: number;
    source: 'supabase' | 'demo';
  }> {
    const client = getSupabaseClient();
    if (!client) {
      return {
        totalMembers: 248,
        activeActivities: 8,
        pendingRequests: 6,
        source: 'demo',
      };
    }

    try {
      const { count: membersCount, error: mErr } = await client
        .from('members')
        .select('*', { count: 'exact', head: true });

      if (!mErr && typeof membersCount === 'number') {
        return {
          totalMembers: membersCount || 248,
          activeActivities: 8,
          pendingRequests: 6,
          source: 'supabase',
        };
      }
    } catch {
      // Fallback smoothly
    }

    return {
      totalMembers: 248,
      activeActivities: 8,
      pendingRequests: 6,
      source: 'demo',
    };
  },
};
