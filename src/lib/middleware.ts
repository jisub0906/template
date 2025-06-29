import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
 * 미들웨어용 Supabase 클라이언트 생성
 * 
 * @description Next.js 미들웨어에서 사용하는 Supabase 클라이언트
 * @param {NextRequest} request - Next.js 요청 객체
 * @returns {{ supabase: SupabaseClient, response: NextResponse }} Supabase 클라이언트와 응답 객체
 * 
 * @example
 * ```ts
 * import { createClient } from '@/lib/middleware';
 * 
 * export async function middleware(request: NextRequest) {
 *   const { supabase, response } = createClient(request);
 *   const { data: { user } } = await supabase.auth.getUser();
 *   return response;
 * }
 * ```
 */
export const createClient = (request: NextRequest) => {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Apply cookies to the request for immediate access
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Create a new response to forward the cookies
          supabaseResponse = NextResponse.next({
            request,
          });

          // Apply cookies to the response for persistence
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return {
    supabase,
    response: supabaseResponse,
  };
};

/**
 * 미들웨어에서 사용자 인증 상태 확인
 * 
 * @description 사용자 인증 상태를 확인하고 적절한 응답을 반환
 * @param {NextRequest} request - Next.js 요청 객체
 * @returns {Promise<{ user: User | null, response: NextResponse }>} 사용자 정보와 응답 객체
 * 
 * @example
 * ```ts
 * import { updateSession } from '@/lib/middleware';
 * 
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 * ```
 */
export const updateSession = async (request: NextRequest) => {
  const { supabase, response } = createClient(request);

  try {
    // Refresh session if expired - required for Server Components
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user in middleware:", error.message);
    }

    return {
      user,
      response,
    };
  } catch (error) {
    console.error("Unexpected error in middleware:", error);
    return {
      user: null,
      response,
    };
  }
};
