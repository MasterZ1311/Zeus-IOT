/**
 * DesktopHome — the desktop Home composition.
 *
 * Fully isolated from MobileHome: this file owns the desktop hero, the desktop
 * section rhythm and any desktop-only flourishes. Changes here can NEVER reach a
 * phone (Home routes to MobileHome on mobile UAs, and this chunk isn't even
 * downloaded there).
 *
 * Desktop WOW layered on top of the shared sections:
 *  • Greek "meander" dividers between major section groups → editorial cadence
 *    on the wide canvas that mobile (tight, single-column) doesn't need.
 *  • The interactive constellation backdrop, custom cursor, magnetic CTAs and
 *    parallax hero are provided by Layout + DesktopHero (desktop-gated already).
 */
import { lazy, Suspense } from 'react';
import CodeOfOlympus from '../components/CodeOfOlympus';
import GreekKeyDivider from '../components/GreekKeyDivider';
import {
  QuickStart, CoreCapabilities, Showcase3D, FeaturedProjects,
  SandboxSection, HowItWorks, FinalCTA,
} from './home/sections';

// Desktop hero only — the mobile hero chunk is never referenced on desktop.
const DesktopHero = lazy(() => import('../components/DesktopHero'));

// Themed separator with comfortable breathing room, aligned to the section grid.
function SectionBreak() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-16 mt-20 md:mt-32" aria-hidden="true">
      <GreekKeyDivider />
    </div>
  );
}

export default function DesktopHome() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen" />}>
        <DesktopHero />
      </Suspense>

      <div className="pb-8">
        <QuickStart />
        <SectionBreak />
        <CoreCapabilities />
        <Showcase3D />
        <SectionBreak />
        <FeaturedProjects />
        <SandboxSection />
        <SectionBreak />
        <HowItWorks />
        <CodeOfOlympus />
        <FinalCTA />
      </div>
    </>
  );
}
