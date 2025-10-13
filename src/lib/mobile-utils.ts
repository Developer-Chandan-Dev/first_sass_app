export const MOBILE_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export function isMobileDevice(userAgent?: string): boolean {
  if (typeof window === 'undefined' && !userAgent) return false;
  
  const ua = userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : '');
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

export function getTouchSupport(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function getViewportSize() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function isMobileViewport(breakpoint: number = MOBILE_BREAKPOINTS.md): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoint;
}

export const mobileOptimizations = {
  // Touch-friendly button sizes
  touchTarget: {
    minSize: 'min-h-[44px] min-w-[44px]', // Apple's recommended minimum
    padding: 'p-3',
  },
  
  // Mobile-optimized spacing
  spacing: {
    container: 'px-4 py-3',
    section: 'space-y-4',
    card: 'p-4',
  },
  
  // Mobile typography
  typography: {
    title: 'text-lg sm:text-xl',
    subtitle: 'text-sm sm:text-base',
    body: 'text-sm',
    caption: 'text-xs',
  },
  
  // Mobile grid layouts
  grid: {
    stats: 'grid-cols-2 gap-3 sm:gap-4',
    cards: 'grid-cols-1 gap-3 sm:gap-4',
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const;