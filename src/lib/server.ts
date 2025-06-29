import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 환경변수 검증 및 추출
 * @throws {Error} 필수 환경변수가 없을 경우 에러 발생
 */
const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your .env.local file."
    );
  }

  if (!supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please check your .env.local file."
    );
  }

  return { supabaseUrl, supabaseKey };
};

/**
 * 서버용 Supabase 클라이언트 생성
 * 
 * @description Next.js 서버 컴포넌트, API 라우트, 서버 액션에서 사용하는 Supabase 클라이언트
 * @returns {Promise<SupabaseClient>} 서버 환경에 최적화된 Supabase 클라이언트
 * 
 * @example
 * ```tsx
 * import { createClient } from '@/lib/server';
 * 
 * export default async function ServerComponent() {
 *   const supabase = await createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   // 서버 컴포넌트에서 사용
 * }
 * ```
 */
export const createClient = async () => {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn(
              "Unable to set cookies in Server Component. This is expected behavior when called from a Server Component. Ensure middleware is configured to refresh user sessions."
            );
          }
        },
      },
    }
  );
};

/**
 * 서버 액션용 Supabase 클라이언트 생성 (관리자 권한)
 * 
 * @description 서버 액션에서 관리자 권한이 필요한 작업에 사용
 * @returns {SupabaseClient} 서비스 롤 키를 사용하는 Supabase 클라이언트
 * 
 * @example
 * ```ts
 * import { createAdminClient } from '@/lib/server';
 * 
 * export async function deleteUser(userId: string) {
 *   const supabase = createAdminClient();
 *   // 관리자 권한으로 사용자 삭제
 * }
 * ```
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your .env.local file."
    );
  }

  if (!supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Please check your .env.local file."
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
};

/**
 * 쿠키 스토어 없이 서버용 Supabase 클라이언트 생성
 * 
 * @description API 라우트나 서버 액션에서 사용자 세션이 불필요한 경우 사용
 * @returns {SupabaseClient} 쿠키 스토어 없는 Supabase 클라이언트
 * 
 * @example
 * ```ts
 * import { createClientWithoutCookies } from '@/lib/server';
 * 
 * export async function GET() {
 *   const supabase = createClientWithoutCookies();
 *   // 공개 데이터 조회
 * }
 * ```
 */
export const createClientWithoutCookies = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
};
