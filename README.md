# 🚀 Next.js + Supabase 템플릿

> **실용적이고 간결한 웹 애플리케이션 템플릿**

Next.js와 Supabase를 사용하여 빠르게 웹 애플리케이션을 구축할 수 있는 실용적인 템플릿입니다.

## ✨ **주요 특징**

- 🔥 **Next.js 15.3.4** - App Router
- ⚛️ **React 19** - 최신 React 기능
- 🎨 **TailwindCSS 4.0** - 유틸리티 기반 스타일링
- 🔐 **Supabase** - 인증 + 데이터베이스
- 📱 **반응형 디자인** - 모든 디바이스 지원
- 🌙 **다크모드** - 시스템 설정 연동
- 🔧 **TypeScript** - 완전한 타입 안전성

## 🛠️ **기술 스택**

| 분야 | 기술 |
|------|------|
| **프레임워크** | Next.js 15.3.4, React 19 |
| **언어** | TypeScript |
| **스타일링** | TailwindCSS 4.0 |
| **UI 컴포넌트** | Shadcn/UI |
| **데이터베이스** | Supabase (PostgreSQL) |
| **인증** | Supabase Auth |
| **상태 관리** | TanStack Query |
| **폼 관리** | React Hook Form + Zod |
| **배포** | Vercel |

## 🚀 **빠른 시작**

### 1. 템플릿 복사
```bash
git clone <repository-url> my-project
cd my-project
```

### 2. 의존성 설치
```bash
pnpm install
```

### 3. 환경변수 설정
```bash
cp .env.example .env.local
```

`.env.local` 파일을 편집하여 Supabase 정보를 입력하세요:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. 개발 서버 시작
```bash
pnpm dev
```

🎉 `http://localhost:3000`에서 앱이 실행됩니다!

## 📁 **프로젝트 구조**

```
src/
├── app/                 # Next.js App Router 페이지
│   ├── page.tsx        # 홈페이지
│   ├── layout.tsx      # 루트 레이아웃
│   └── globals.css     # 전역 스타일
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # Shadcn/UI 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── layouts/        # 레이아웃 컴포넌트
│   └── providers/      # Context 프로바이더
├── hooks/              # 커스텀 훅
│   └── use-auth.ts     # 인증 훅
└── lib/                # 유틸리티 및 설정
    ├── client.ts       # Supabase 클라이언트
    ├── server.ts       # 서버용 클라이언트
    ├── schemas/        # Zod 스키마
    └── utils.ts        # 유틸리티 함수
```

## 🔐 **인증 시스템**

이 템플릿은 Supabase Auth를 사용한 완전한 인증 시스템을 포함합니다:

- ✅ 이메일/비밀번호 로그인
- ✅ 회원가입
- ✅ 비밀번호 재설정
- ✅ 소셜 로그인 (Google, GitHub 등)
- ✅ 사용자 세션 관리

### 사용 예시
```typescript
import { useAuth } from '@/hooks/use-auth';

export function LoginForm() {
  const { signIn, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    await signIn({ email, password });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleLogin(
        formData.get('email') as string,
        formData.get('password') as string
      );
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={isLoading}>
        로그인
      </button>
    </form>
  );
}
```

## 🎨 **UI 컴포넌트**

Shadcn/UI 기반의 아름다운 컴포넌트들이 포함되어 있습니다:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>제목</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="입력하세요..." />
        <Button className="mt-4">제출</Button>
      </CardContent>
    </Card>
  );
}
```

## 📊 **데이터베이스**

### Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 데이터베이스 URL과 API 키를 `.env.local`에 추가
3. 필요한 테이블과 RLS 정책 설정

### 기본 사용법
```typescript
import { createClient } from '@/lib/client';

export async function getUsers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw error;
  return data;
}
```

## 🌙 **다크모드**

템플릿에는 자동 다크모드 지원이 포함되어 있습니다:

```typescript
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      테마 변경
    </button>
  );
}
```

## 🚀 **배포**

### Vercel (권장)
1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 다른 플랫폼
```bash
pnpm build
pnpm start
```

## 📜 **스크립트**

```bash
pnpm dev        # 개발 서버 시작
pnpm build      # 프로덕션 빌드
pnpm start      # 프로덕션 서버 시작
pnpm lint       # ESLint 실행
pnpm type-check # TypeScript 타입 체크
```

## 🛠️ **커스터마이징**

### 색상 테마 변경
`src/app/globals.css`에서 CSS 변수를 수정하세요:

```css
:root {
  --color-primary: 59 130 246; /* blue-500 */
  --color-secondary: 107 114 128; /* gray-500 */
}
```

### 메타데이터 수정
`src/app/layout.tsx`에서 앱 정보를 수정하세요:

```typescript
export const metadata: Metadata = {
  title: 'My App',
  description: 'My awesome application',
};
```

## 🤝 **기여하기**

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 **라이센스**

MIT 라이센스

## 🙏 **감사의 말**

- [Next.js](https://nextjs.org) - React 프레임워크
- [Supabase](https://supabase.com) - 백엔드 플랫폼  
- [TailwindCSS](https://tailwindcss.com) - CSS 프레임워크
- [Shadcn/UI](https://ui.shadcn.com) - UI 컴포넌트

---

**이 템플릿으로 빠르게 프로젝트를 시작해보세요! 🚀**
