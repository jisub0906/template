"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

/**
 * 2025년 완벽한 테마 프로바이더
 * - 자동 시스템 테마 감지
 * - 부드러운 테마 전환
 * - SSR 하이드레이션 문제 해결
 * - 사용자 선택 기억
 */
export function ThemeProvider({ 
  children, 
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

/**
 * 테마 상태를 위한 커스텀 훅
 * 클라이언트 컴포넌트에서 안전하게 테마 상태 사용
 */
export function useTheme() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return {
      theme: undefined,
      setTheme,
      resolvedTheme: undefined,
    };
  }

  return {
    theme,
    setTheme,
    resolvedTheme,
  };
} 