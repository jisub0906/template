import { createBrowserClient } from "@supabase/ssr";

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
 * 브라우저용 Supabase 클라이언트 생성
 * 
 * @description Next.js 클라이언트 컴포넌트에서 사용하는 Supabase 클라이언트
 * @returns {SupabaseClient} 브라우저 환경에 최적화된 Supabase 클라이언트
 * 
 * @example
 * ```tsx
 * import { createClient } from '@/lib/client';
 * 
 * export default function MyComponent() {
 *   const supabase = createClient();
 *   // 클라이언트 컴포넌트에서 사용
 * }
 * ```
 */
export const createClient = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  return createBrowserClient(supabaseUrl, supabaseKey);
};
