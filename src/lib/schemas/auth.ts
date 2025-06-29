import { z } from "zod";

/**
 * 2025년 완벽한 인증 스키마
 * - Zod를 사용한 런타임 검증
 * - TypeScript 타입 자동 생성
 * - 클라이언트/서버 공유
 * - 접근성 친화적 에러 메시지
 */

// 기본 검증 규칙들
const email = z
  .string()
  .min(1, "이메일을 입력해주세요")
  .email("올바른 이메일 형식이 아닙니다")
  .max(255, "이메일이 너무 깁니다");

const password = z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
  .max(128, "비밀번호가 너무 깁니다")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "비밀번호는 영문 대소문자와 숫자를 포함해야 합니다"
  );

const name = z
  .string()
  .min(2, "이름은 최소 2자 이상이어야 합니다")
  .max(50, "이름이 너무 깁니다")
  .regex(/^[가-힣a-zA-Z\s]+$/, "이름에는 한글, 영문, 공백만 사용할 수 있습니다");

// 로그인 스키마
export const signInSchema = z.object({
  email,
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  rememberMe: z.boolean().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;

// 회원가입 스키마
export const signUpSchema = z.object({
  email,
  password,
  confirmPassword: z.string(),
  name,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "서비스 이용약관에 동의해주세요",
  }),
  marketingAccepted: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

export type SignUpInput = z.infer<typeof signUpSchema>;

// 비밀번호 재설정 요청 스키마
export const resetPasswordRequestSchema = z.object({
  email,
});

export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;

// 비밀번호 재설정 스키마
export const resetPasswordSchema = z.object({
  password,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// 프로필 업데이트 스키마
export const updateProfileSchema = z.object({
  name: name.optional(),
  avatar_url: z.string().url("올바른 URL 형식이 아닙니다").optional().or(z.literal("")),
  bio: z.string().max(500, "자기소개는 500자 이하로 작성해주세요").optional(),
  website: z.string().url("올바른 URL 형식이 아닙니다").optional().or(z.literal("")),
  location: z.string().max(100, "위치는 100자 이하로 작성해주세요").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// 비밀번호 변경 스키마
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
  newPassword: password,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "새 비밀번호가 일치하지 않습니다",
  path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "새 비밀번호는 현재 비밀번호와 달라야 합니다",
  path: ["newPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// 이메일 변경 스키마
export const changeEmailSchema = z.object({
  newEmail: email,
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

// 2FA 설정 스키마
export const setup2FASchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  totpCode: z.string().length(6, "인증 코드는 6자리입니다").regex(/^\d+$/, "숫자만 입력해주세요"),
});

export type Setup2FAInput = z.infer<typeof setup2FASchema>;

// 2FA 인증 스키마
export const verify2FASchema = z.object({
  totpCode: z.string().length(6, "인증 코드는 6자리입니다").regex(/^\d+$/, "숫자만 입력해주세요"),
});

export type Verify2FAInput = z.infer<typeof verify2FASchema>;

// 소셜 로그인 연결 해제 스키마
export const unlinkProviderSchema = z.object({
  provider: z.enum(["google", "github", "discord", "apple"], {
    errorMap: () => ({ message: "지원하지 않는 소셜 로그인 제공자입니다" }),
  }),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type UnlinkProviderInput = z.infer<typeof unlinkProviderSchema>;

// 계정 삭제 스키마
export const deleteAccountSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  confirmation: z.string().refine((val) => val === "DELETE", {
    message: "'DELETE'를 정확히 입력해주세요",
  }),
  reason: z.string().optional(),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

/**
 * 스키마 검증 헬퍼 함수들
 */

// 안전한 스키마 파싱 (에러 대신 결과 객체 반환)
export function safeParseSchema<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? null : result.error.flatten().fieldErrors,
  };
}

// 폼 검증용 헬퍼
export function validateFormData<T>(schema: z.ZodSchema<T>, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  return safeParseSchema(schema, data);
}

// 부분 스키마 검증 (실시간 검증용) - 간단한 구현
export function validateField<T>(schema: z.ZodSchema<T>, data: T) {
  try {
    schema.parse(data);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation failed" };
    }
    return { success: false, error: "Validation failed" };
  }
} 