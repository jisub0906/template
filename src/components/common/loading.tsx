import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

/**
 * 2025년 완벽한 로딩 컴포넌트
 * - 접근성 지원 (aria-label, role)
 * - 다양한 크기 옵션
 * - 커스텀 스타일링 지원
 * - 부드러운 애니메이션
 */
export function Loading({ className, size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2",
        className
      )}
      role="status"
      aria-label={text || "로딩 중"}
    >
      <Loader2 
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {text && (
        <span className="text-sm text-muted-foreground">
          {text}
        </span>
      )}
      <span className="sr-only">
        {text || "페이지를 불러오는 중입니다"}
      </span>
    </div>
  );
}

/**
 * 전체 화면 로딩 컴포넌트
 */
export function FullPageLoading({ text = "페이지를 불러오는 중..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loading size="lg" />
        <p className="text-lg font-medium text-foreground">
          {text}
        </p>
      </div>
    </div>
  );
}

/**
 * 인라인 로딩 스피너 (버튼 내부 등에서 사용)
 */
export function InlineLoading({ className }: { className?: string }) {
  return (
    <Loader2 
      className={cn("animate-spin w-4 h-4", className)}
      aria-hidden="true"
    />
  );
} 