/**
 * MobileHome — the mobile Home composition.
 *
 * This is the "GOATED" mobile experience and is intentionally isolated from the
 * desktop one: nothing here is shared with DesktopHome except the platform-
 * agnostic content sections. Edit desktop freely without ever touching this file.
 *
 * Order & markup are kept identical to the original Home so the loved mobile
 * layout is byte-for-byte unchanged.
 */
import { lazy, Suspense } from 'react';
import CodeOfOlympus from '../components/CodeOfOlympus';
import {
  QuickStart, CoreCapabilities, Showcase3D, FeaturedProjects,
  SandboxSection, HowItWorks, FinalCTA,
} from './home/sections';

// Mobile hero only — the desktop hero chunk is never referenced on mobile.
const MobileHero = lazy(() => import('../components/MobileHero'));

export default function MobileHome() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen" />}>
        <MobileHero />
      </Suspense>

      <div className="pb-8">
        <QuickStart />
        <CoreCapabilities />
        <Showcase3D />
        <FeaturedProjects />
        <SandboxSection />
        <HowItWorks />
        <CodeOfOlympus />
        <FinalCTA />
      </div>
    </>
  );
}
