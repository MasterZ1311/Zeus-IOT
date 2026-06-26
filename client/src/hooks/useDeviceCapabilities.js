/**
 * useDeviceCapabilities
 * Detects device tier and capabilities at runtime to drive adaptive rendering.
 * Returns stable values so consumers can safely use them in animation decisions.
 *
 * Tiers:
 *   'high'  — Desktop / flagship phone / 120Hz+ display
 *   'mid'   — Mid-range phone / tablet
 *   'low'   — Budget phone / constrained UA
 */
import { useMemo } from 'react';

function getDeviceTier() {
  if (typeof window === 'undefined') return 'mid';

  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  // Hardware concurrency is the most reliable proxy for CPU power
  const cores = navigator.hardwareConcurrency ?? 2;
  // deviceMemory is Chromium-only (GB)
  const memory = navigator.deviceMemory ?? 4;

  // Check for reduced-motion preference — always respect it
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 'low';

  // Desktop with decent hardware
  if (!isMobile) {
    return cores >= 4 ? 'high' : 'mid';
  }

  // Mobile/tablet: be conservative
  if (cores >= 8 && memory >= 4) return 'high';
  if (cores >= 4 && memory >= 2) return 'mid';
  return 'low';
}

export function useDeviceCapabilities() {
  return useMemo(() => {
    const tier = getDeviceTier();
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isTouch = navigator.maxTouchPoints > 0;
    const isDesktop = !isMobile;

    // Capability flags
    const supportsBackdropBlur = CSS.supports('backdrop-filter', 'blur(1px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      tier,          // 'high' | 'mid' | 'low'
      isMobile,
      isIOS,
      isAndroid,
      isTouch,
      isDesktop,
      supportsBackdropBlur,
      prefersReducedMotion,
      // Derived flags for easy conditional rendering
      canRunParticles: tier === 'high' && !prefersReducedMotion,
      canRunHeavyBlur: supportsBackdropBlur && tier !== 'low',
      shouldReduceAnimations: tier === 'low' || prefersReducedMotion,
    };
  }, []);
}
