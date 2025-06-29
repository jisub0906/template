import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 프로바이더들
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "2025 Template - 완벽한 Next.js 템플릿",
    template: "%s | 2025 Template",
  },
  description: "Next.js 15.3.4, React 19, TailwindCSS 4.0, Supabase SSR을 사용한 2025년 완벽한 웹 애플리케이션 템플릿",
  keywords: [
    "Next.js",
    "React",
    "TypeScript", 
    "TailwindCSS",
    "Supabase",
    "Template",
    "2025",
    "웹 애플리케이션",
    "반응형",
    "접근성",
  ],
  authors: [
    {
      name: "2025 Template Team",
      url: "https://github.com/your-username/template",
    },
  ],
  creator: "2025 Template Team",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://your-domain.com",
    title: "2025 Template - 완벽한 Next.js 템플릿",
    description: "Next.js 15.3.4, React 19, TailwindCSS 4.0을 사용한 최신 웹 애플리케이션 템플릿",
    siteName: "2025 Template",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "2025 Template Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2025 Template - 완벽한 Next.js 템플릿",
    description: "Next.js 15.3.4, React 19, TailwindCSS 4.0을 사용한 최신 웹 애플리케이션 템플릿",
    images: ["/og-image.png"],
    creator: "@your_twitter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://your-domain.com",
    languages: {
      "ko-KR": "https://your-domain.com/ko",
      "en-US": "https://your-domain.com/en",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon", 
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * 2025년 완벽한 루트 레이아웃
 * - 모든 프로바이더 통합
 * - SEO 최적화
 * - 성능 최적화
 * - 접근성 보장
 * - PWA 지원
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preload 중요한 리소스들 */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* 보안 정책 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        
        {/* 뷰포트 설정 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* 테마 컬러 */}
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Apple 설정 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="2025 Template" />
        
        {/* Microsoft 설정 */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="min-h-screen bg-background font-inter antialiased">
        {/* React Query Provider */}
        <QueryProvider>
          {/* Theme Provider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            {/* Main Content */}
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
            </div>
            
            {/* Global Toast Notifications */}
            <Toaster 
              position="bottom-right"
              closeButton
              richColors
              expand
              duration={4000}
            />
          </ThemeProvider>
        </QueryProvider>
        
        {/* Service Worker 등록 (프로덕션에서만) */}
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
