import { describe, expect, it } from 'vitest';

import type { EsgGrade } from '@/types';
import { GRADE_BAR_CLASSES, gradeBand } from './risk';

describe('gradeBand', () => {
  it('maps each grade at the edge of its band', () => {
    const expected: Record<EsgGrade, string> = {
      AAA: 'excellent',
      AA: 'excellent',
      A: 'good',
      BBB: 'good',
      BB: 'fair',
      B: 'fair',
      CCC: 'poor',
      D: 'critical',
    };
    for (const [grade, band] of Object.entries(expected)) {
      expect(gradeBand(grade as EsgGrade)).toBe(band);
    }
  });

  it('has a style entry for every band it can return', () => {
    const grades: EsgGrade[] = ['AAA', 'A', 'BB', 'CCC', 'D'];
    for (const g of grades) {
      expect(GRADE_BAR_CLASSES[gradeBand(g)]).toBeDefined();
    }
  });
});
