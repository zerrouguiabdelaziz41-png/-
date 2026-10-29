import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase Project URL provided by the user
export const DEFAULT_SUPABASE_URL = 'https://geniskumuwdedhckkexn.supabase.co';

/**
 * Get current configured Supabase URL
 */
export function getSupabaseUrl(): string {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  if (envUrl && envUrl.length > 5) {
    return envUrl;
  }
  return DEFAULT_SUPABASE_URL;
}

/**
 * Get current Publishable / Anon Key
 * Note: We never expose or accept service_role keys here.
 */
export function getSupabaseAnonKey(): string {
  // Check Vite environment variable first
  const envKey = (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();

  if (envKey && envKey.length > 10) {
    return envKey;
  }

  // Check localStorage for quick runtime verification if user tests in browser
  if (typeof window !== 'undefined') {
    try {
      const storedKey = (window.localStorage.getItem('supabase_anon_key') || '').trim();
      if (storedKey && storedKey.length > 10) {
        return storedKey;
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  return '';
}

/**
 * Save custom anon key to localStorage for immediate testing without dev server restart
 */
export function setLocalSupabaseAnonKey(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      if (!key) {
        window.localStorage.removeItem('supabase_anon_key');
      } else {
        window.localStorage.setItem('supabase_anon_key', key.trim());
      }
    } catch {
      // Ignore
    }
  }
}

/**
 * Create or reuse the Supabase client instance
 */
let cachedClient: SupabaseClient | null = null;
let cachedKeyUsed = '';

export function getSupabaseClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!anonKey) {
    return null;
  }

  if (cachedClient && cachedKeyUsed === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    cachedKeyUsed = anonKey;
    return cachedClient;
  } catch (error) {
    console.warn('[Supabase] Failed to initialize client:', error);
    return null;
  }
}

/**
 * Safe proxy export of the supabase client.
 * Calls won't throw uncaught exceptions if the key isn't provided yet.
 */
export const supabase = getSupabaseClient();

/**
 * Connection diagnosis result
 */
export interface ConnectionTestResult {
  success: boolean;
  code: 'OK' | 'MISSING_KEY' | 'INVALID_KEY' | 'NETWORK_ERROR' | 'SECURITY_WARNING';
  message: string;
  url: string;
  latencyMs?: number;
  details?: string;
  hasEnvKey: boolean;
  hasLocalKey: boolean;
  tablesDiscovered?: string[];
}

/**
 * Test connectivity with Supabase project using the configured or provided anon key
 */
export async function testSupabaseConnection(overrideKey?: string): Promise<ConnectionTestResult> {
  const url = getSupabaseUrl();
  const testKey = (overrideKey !== undefined ? overrideKey : getSupabaseAnonKey()).trim();

  const envKey = (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();
  const localKey =
    typeof window !== 'undefined'
      ? (window.localStorage.getItem('supabase_anon_key') || '').trim()
      : '';

  // 1. Check if key is provided
  if (!testKey) {
    return {
      success: false,
      code: 'MISSING_KEY',
      url,
      hasEnvKey: !!envKey,
      hasLocalKey: !!localKey,
      message: 'لم يتم إدخال المفتاح العام (Publishable / Anon Key) حتى الآن.',
      details: 'يرجى إضافة VITE_SUPABASE_ANON_KEY في إعدادات البيئة أو في ملف .env لإتمام الاتصال.',
    };
  }

  // 2. Security Check: Block service_role keys to protect the database!
  if (testKey.toLowerCase().includes('service_role') || testKey.startsWith('sb_sec_')) {
    return {
      success: false,
      code: 'SECURITY_WARNING',
      url,
      hasEnvKey: !!envKey,
      hasLocalKey: !!localKey,
      message: 'تحذير أمني: يمنع استخدام مفتاح service_role في الواجهة الأمامية!',
      details: 'استخدم فقط المفتاح العام (anon / publishable key) المتوفر في لوحة تحكم Supabase > Project Settings > API.',
    };
  }

  // 3. Test REST ping & Auth endpoint with latency measurement
  const startTime = performance.now();
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: testKey,
        Authorization: `Bearer ${testKey}`,
      },
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        code: 'INVALID_KEY',
        url,
        latencyMs,
        hasEnvKey: !!envKey,
        hasLocalKey: !!localKey,
        message: 'مفتاح Supabase غير صالح أو غير معتمد (401 Unauthorized).',
        details: 'تأكد من نسخ المفتاح العام (anon key) التابع للمشروع نفسه: ' + url,
      };
    }

    // Attempt to test client library initialization
    const client = createClient(url, testKey);
    const { error: authError } = await client.auth.getSession();

    if (authError && authError.status === 401) {
      return {
        success: false,
        code: 'INVALID_KEY',
        url,
        latencyMs,
        hasEnvKey: !!envKey,
        hasLocalKey: !!localKey,
        message: 'فشل تفويض المفتاح العام في Supabase Auth.',
        details: authError.message,
      };
    }

    // Try checking accessible tables without modifying anything
    let tables: string[] = [];
    try {
      const openApiData = await res.json();
      if (openApiData && openApiData.definitions) {
        tables = Object.keys(openApiData.definitions);
      }
    } catch {
      // JSON parse might fail if response is empty or standard html
    }

    return {
      success: true,
      code: 'OK',
      url,
      latencyMs,
      hasEnvKey: !!envKey,
      hasLocalKey: !!localKey,
      message: 'تم الاتصال بقاعدة بيانات Supabase بنجاح! 🚀',
      details: `استجابة سريعة (${latencyMs}ms) – مشروع: ${url}`,
      tablesDiscovered: tables,
    };
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      code: 'NETWORK_ERROR',
      url,
      latencyMs,
      hasEnvKey: !!envKey,
      hasLocalKey: !!localKey,
      message: 'تعذر الاتصال بخوادم Supabase (خطأ في الشبكة أو CORS).',
      details: error?.message || 'تأكد من الاتصال بالإنترنت وصحة الرابط.',
    };
  }
}
