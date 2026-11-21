import { describe, it, expect } from 'vitest';
import { calculatePercentage } from '../src/percentage.js';

describe('calculatePercentage', () => {
  describe('Normal calculations', () => {
    it('calculates percentage accurately for standard exam marks', () => {
      expect(calculatePercentage(425, 500)).toBe(85);
      expect(calculatePercentage(90, 100)).toBe(90);
      expect(calculatePercentage(360, 600)).toBe(60);
      expect(calculatePercentage(500, 500)).toBe(100);
    });

    it('handles decimal marks and rounds to 2 decimal places by default', () => {
      expect(calculatePercentage(78.5, 100)).toBe(78.5);
      expect(calculatePercentage(33, 70)).toBe(47.14);
      expect(calculatePercentage(355.5, 500)).toBe(71.1);
    });

    it('supports custom rounding precision', () => {
      expect(calculatePercentage(33, 70, 4)).toBe(47.1429);
      expect(calculatePercentage(33, 70, 0)).toBe(47);
      expect(calculatePercentage(33, 70, 1)).toBe(47.1);
    });
  });

  describe('Zero values and edge cases', () => {
    it('returns 0 when obtained marks is 0', () => {
      expect(calculatePercentage(0, 500)).toBe(0);
    });

    it('handles zero total marks safely without returning NaN', () => {
      expect(calculatePercentage(0, 0)).toBe(0);
    });

    it('throws RangeError when totalMarks is 0 and obtainedMarks is greater than 0', () => {
      expect(() => calculatePercentage(10, 0)).toThrow(RangeError);
      expect(() => calculatePercentage(10, 0)).toThrow(/cannot exceed total marks/);
    });
  });

  describe('Invalid inputs and validation', () => {
    it('throws TypeError for non-number obtainedMarks', () => {
      expect(() => calculatePercentage('400', 500)).toThrow(TypeError);
      expect(() => calculatePercentage(null, 500)).toThrow(TypeError);
      expect(() => calculatePercentage(undefined, 500)).toThrow(TypeError);
      expect(() => calculatePercentage(NaN, 500)).toThrow(TypeError);
      expect(() => calculatePercentage(Infinity, 500)).toThrow(TypeError);
    });

    it('throws TypeError for non-number totalMarks', () => {
      expect(() => calculatePercentage(400, '500')).toThrow(TypeError);
      expect(() => calculatePercentage(400, null)).toThrow(TypeError);
      expect(() => calculatePercentage(400, undefined)).toThrow(TypeError);
      expect(() => calculatePercentage(400, NaN)).toThrow(TypeError);
      expect(() => calculatePercentage(400, Infinity)).toThrow(TypeError);
    });

    it('throws RangeError for negative marks', () => {
      expect(() => calculatePercentage(-10, 500)).toThrow(RangeError);
      expect(() => calculatePercentage(-10, 500)).toThrow(/cannot be negative/);
      expect(() => calculatePercentage(400, -500)).toThrow(RangeError);
      expect(() => calculatePercentage(400, -500)).toThrow(/cannot be negative/);
    });

    it('throws RangeError when obtained marks exceed total marks', () => {
      expect(() => calculatePercentage(505, 500)).toThrow(RangeError);
      expect(() => calculatePercentage(505, 500)).toThrow(/cannot exceed total marks/);
    });

    it('throws RangeError for invalid precision values', () => {
      expect(() => calculatePercentage(400, 500, -1)).toThrow(RangeError);
      expect(() => calculatePercentage(400, 500, 2.5)).toThrow(RangeError);
      expect(() => calculatePercentage(400, 500, '2')).toThrow(TypeError);
    });
  });
});
