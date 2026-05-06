import { Search } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { RatingBadge } from '@/components/common/RatingBadge';
import { RiskPill } from '@/components/common/RiskPill';
import { DeltaIndicator } from '@/components/common/DeltaIndicator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GRADES, RISK_LEVELS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Inline helpers (no barrel files needed)
// ---------------------------------------------------------------------------

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-lg font-semibold tracking-tight border-b border-border pb-2">
      {children}
    </h2>
  );
}

function SubLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-text-3">{children}</p>
  );
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3">
      <div className="h-12 rounded-md border border-border" style={{ background: hex }} />
      <code className="font-mono text-xs text-text-1">{name}</code>
      <code className="font-mono text-[0.6875rem] text-text-3">{hex}</code>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Token data
// ---------------------------------------------------------------------------

const NEUTRALS = [
  { name: '--color-bg',           hex: '#FAFAF7' },
  { name: '--color-surface',      hex: '#FFFFFF' },
  { name: '--color-surface-2',    hex: '#F5F4EE' },
  { name: '--color-border',       hex: '#E8E6DE' },
  { name: '--color-border-strong',hex: '#D6D3C7' },
  { name: '--color-text-1',       hex: '#1A1A17' },
  { name: '--color-text-2',       hex: '#4A4A45' },
  { name: '--color-text-3',       hex: '#8A8A82' },
] as const;

const BRAND = [
  { name: '--color-brand-50',  hex: '#EEF5F1' },
  { name: '--color-brand-100', hex: '#D8E8DF' },
  { name: '--color-brand-200', hex: '#B0D1BE' },
  { name: '--color-brand-400', hex: '#4F8770' },
  { name: '--color-brand-600', hex: '#2A6B57' },
  { name: '--color-brand-700', hex: '#1F5C4E' },
  { name: '--color-brand-800', hex: '#174538' },
] as const;

const RISK_SYSTEM = [
  { name: '--color-risk-low',          hex: '#6B8E7F' },
  { name: '--color-risk-low-bg',       hex: '#EAF1ED' },
  { name: '--color-risk-medium',       hex: '#C99846' },
  { name: '--color-risk-medium-bg',    hex: '#FAF1DF' },
  { name: '--color-risk-high',         hex: '#C26B4F' },
  { name: '--color-risk-high-bg',      hex: '#F8E5DC' },
  { name: '--color-risk-critical',     hex: '#8E3B26' },
  { name: '--color-risk-critical-bg',  hex: '#F1D9D2' },
  { name: '--color-success',           hex: '#2F7A5C' },
  { name: '--color-warning',           hex: '#B47A2A' },
  { name: '--color-error',             hex: '#B14A38' },
  { name: '--color-info',              hex: '#3A5F7A' },
] as const;

const SPACING = [
  { token: '0.5', px: 2 },
  { token: '1',   px: 4 },
  { token: '2',   px: 8 },
  { token: '3',   px: 12 },
  { token: '4',   px: 16 },
  { token: '6',   px: 24 },
  { token: '8',   px: 32 },
  { token: '12',  px: 48 },
  { token: '16',  px: 64 },
] as const;

const TYPE_SAMPLES = [
  {
    sample: <p style={{ fontSize: '3rem', lineHeight: 1.1 }} className="font-semibold tracking-tight">ChainScope</p>,
    label: 'Display · 3rem',
  },
  {
    sample: <h1 className="text-4xl font-semibold tracking-tight">Heading 1 — 2.25rem</h1>,
    label: 'text-4xl',
  },
  {
    sample: <h2 className="text-3xl font-semibold tracking-tight">Heading 2 — 1.875rem</h2>,
    label: 'text-3xl',
  },
  {
    sample: <h3 className="text-2xl font-semibold">Heading 3 — 1.5rem</h3>,
    label: 'text-2xl',
  },
  {
    sample: <h4 className="text-xl font-semibold">Heading 4 — 1.25rem</h4>,
    label: 'text-xl',
  },
  {
    sample: <h5 className="text-lg font-medium">Heading 5 — 1.125rem</h5>,
    label: 'text-lg',
  },
  {
    sample: <p className="text-base">Body — 1rem · The quick brown fox jumps over the lazy dog. 0123456789.</p>,
    label: 'text-base',
  },
  {
    sample: <p className="text-sm text-text-2">Body small — 0.875rem · The quick brown fox jumps over the lazy dog.</p>,
    label: 'text-sm',
  },
  {
    sample: <p className="text-xs text-text-3 uppercase tracking-wide">Eyebrow — 0.75rem uppercase</p>,
    label: 'text-xs uppercase',
  },
  {
    sample: <p className="font-mono text-sm tabular-nums">JetBrains Mono — 0123456789 · 8.42% · sup-001</p>,
    label: 'font-mono',
  },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function DesignSystemPage() {
  return (
    <>
      <PageHeader
        title="Design System"
        description="Tokens, typography, spacing, and component reference for ChainScope."
      />

      <div className="flex flex-col gap-10 px-6 py-8 animate-fade-in">

        {/* ---------------------------------------------------------------- */}
        {/* 1. Foundations                                                   */}
        {/* ---------------------------------------------------------------- */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Foundations</SectionTitle>
          <p className="mt-2 text-sm text-text-2 max-w-2xl">
            ChainScope's UI is built on a tokenized design system using Tailwind v4's{' '}
            <code className="font-mono text-xs px-1 rounded bg-surface-2">@theme</code>{' '}
            directive. Every color, radius, shadow, and spacing step is a CSS custom
            property — themable at runtime, traceable at build.
          </p>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Colors                                                        */}
        {/* ---------------------------------------------------------------- */}
        <section className="flex flex-col gap-6">
          <SectionTitle>Colors</SectionTitle>

          <div className="flex flex-col gap-3">
            <SubLabel>Neutrals</SubLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {NEUTRALS.map(({ name, hex }) => (
                <ColorSwatch key={name} name={name} hex={hex} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SubLabel>Brand</SubLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {BRAND.map(({ name, hex }) => (
                <ColorSwatch key={name} name={name} hex={hex} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SubLabel>Risk + System</SubLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {RISK_SYSTEM.map(({ name, hex }) => (
                <ColorSwatch key={name} name={name} hex={hex} />
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. Typography                                                    */}
        {/* ---------------------------------------------------------------- */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Typography</SectionTitle>
          <div className="flex flex-col rounded-lg border border-border bg-surface">
            {TYPE_SAMPLES.map(({ sample, label }, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">{sample}</div>
                <code className="shrink-0 font-mono text-xs text-text-3">{label}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. Spacing scale                                                 */}
        {/* ---------------------------------------------------------------- */}
        <section className="flex flex-col gap-4">
          <SectionTitle>Spacing Scale</SectionTitle>
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface px-5 py-5">
            {SPACING.map(({ token, px }) => (
              <div key={token} className="flex items-center gap-4">
                <code className="w-16 font-mono text-xs text-text-3">{token}</code>
                <div
                  className="h-3 rounded-sm bg-brand-200"
                  style={{ width: `${px}px` }}
                />
                <code className="font-mono text-xs text-text-3">{px}px</code>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. Components                                                    */}
        {/* ---------------------------------------------------------------- */}
        <section className="flex flex-col gap-6">
          <SectionTitle>Components</SectionTitle>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Button</CardTitle>
              <CardDescription>5 variants × 4 sizes. Includes icon and disabled states.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* default */}
              <div className="flex flex-col gap-1.5">
                <SubLabel>default</SubLabel>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="default" size="sm">Default sm</Button>
                  <Button variant="default" size="md">Default md</Button>
                  <Button variant="default" size="lg">Default lg</Button>
                  <Button variant="default" disabled>Disabled</Button>
                  <Button variant="default" size="icon" aria-label="Search">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* secondary */}
              <div className="flex flex-col gap-1.5">
                <SubLabel>secondary</SubLabel>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" size="sm">Secondary sm</Button>
                  <Button variant="secondary" size="md">Secondary md</Button>
                  <Button variant="secondary" size="lg">Secondary lg</Button>
                  <Button variant="secondary" disabled>Disabled</Button>
                </div>
              </div>
              {/* ghost */}
              <div className="flex flex-col gap-1.5">
                <SubLabel>ghost</SubLabel>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="ghost" size="sm">Ghost sm</Button>
                  <Button variant="ghost" size="md">Ghost md</Button>
                  <Button variant="ghost" size="lg">Ghost lg</Button>
                  <Button variant="ghost" disabled>Disabled</Button>
                </div>
              </div>
              {/* outline */}
              <div className="flex flex-col gap-1.5">
                <SubLabel>outline</SubLabel>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="sm">Outline sm</Button>
                  <Button variant="outline" size="md">Outline md</Button>
                  <Button variant="outline" size="lg">Outline lg</Button>
                  <Button variant="outline" disabled>Disabled</Button>
                </div>
              </div>
              {/* destructive */}
              <div className="flex flex-col gap-1.5">
                <SubLabel>destructive</SubLabel>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="destructive" size="sm">Destructive sm</Button>
                  <Button variant="destructive" size="md">Destructive md</Button>
                  <Button variant="destructive" size="lg">Destructive lg</Button>
                  <Button variant="destructive" disabled>Disabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badge</CardTitle>
              <CardDescription>7 semantic variants.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="muted">Muted</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Rating Badges */}
          <Card>
            <CardHeader>
              <CardTitle>RatingBadge</CardTitle>
              <CardDescription>All 8 ESG grades at every size.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <SubLabel>All grades — md</SubLabel>
                <div className="flex flex-wrap gap-2">
                  {GRADES.map((g) => (
                    <RatingBadge key={g} grade={g} size="md" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <SubLabel>Size comparison — AA</SubLabel>
                <div className="flex items-center gap-3">
                  <RatingBadge grade="AA" size="sm" />
                  <RatingBadge grade="AA" size="md" />
                  <RatingBadge grade="AA" size="lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Pills */}
          <Card>
            <CardHeader>
              <CardTitle>RiskPill</CardTitle>
              <CardDescription>4 risk levels × 2 sizes.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <SubLabel>md</SubLabel>
                <div className="flex flex-wrap gap-2">
                  {RISK_LEVELS.map((l) => (
                    <RiskPill key={l} level={l} size="md" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <SubLabel>sm</SubLabel>
                <div className="flex flex-wrap gap-2">
                  {RISK_LEVELS.map((l) => (
                    <RiskPill key={l} level={l} size="sm" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>Default and disabled states.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Default state" />
                <Input placeholder="Disabled" disabled />
              </div>
            </CardContent>
          </Card>

          {/* Card sample */}
          <Card>
            <CardHeader>
              <CardTitle>Card composition</CardTitle>
              <CardDescription>Header · Content · Footer with CardTitle, CardDescription, CardContent, CardFooter.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="max-w-sm">
                <Card>
                  <CardHeader>
                    <CardTitle>Card title</CardTitle>
                    <CardDescription>Short description text.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-2">Body content lives in CardContent.</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="ghost">Footer action</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Delta Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>DeltaIndicator</CardTitle>
              <CardDescription>Positive, negative, zero, and inverted.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col gap-1 items-start">
                  <SubLabel>positive</SubLabel>
                  <DeltaIndicator value={3.2} format="percent" />
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <SubLabel>negative</SubLabel>
                  <DeltaIndicator value={-1.4} format="percent" />
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <SubLabel>zero</SubLabel>
                  <DeltaIndicator value={0} />
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <SubLabel>inverted (positive = bad)</SubLabel>
                  <DeltaIndicator value={5} inverted />
                </div>
              </div>
            </CardContent>
          </Card>

        </section>
      </div>
    </>
  );
}
