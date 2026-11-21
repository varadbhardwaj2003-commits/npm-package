import { describe, it, expect } from 'vitest';
import { calculateAttendance, requiredClasses } from '../src/attendance.js';

describe('calculateAttendance', () => {
  describe('Normal calculations', () => {
    it('calculates exact attendance percentage correctly', () => {
      expect(calculateAttendance(18, 24)).toBe(75);
      expect(calculateAttendance(75, 100)).toBe(75);
      expect(calculateAttendance(50, 50)).toBe(100);
    });

    it('handles decimal results and rounds to 2 decimal places by default', () => {
      expect(calculateAttendance(37, 45)).toBe(82.22);
      expect(calculateAttendance(22, 33)).toBe(66.67);
      expect(calculateAttendance(1, 3)).toBe(33.33);
    });

    it('supports custom rounding precision', () => {
      expect(calculateAttendance(22, 33, 4)).toBe(66.6667);
      expect(calculateAttendance(22, 33, 0)).toBe(67);
      expect(calculateAttendance(22, 33, 1)).toBe(66.7);
    });
  });

  describe('Zero values and edge cases', () => {
    it('returns 0 when attended classes is 0', () => {
      expect(calculateAttendance(0, 50)).toBe(0);
    });

    it('handles zero total classes safely without returning NaN', () => {
      expect(calculateAttendance(0, 0)).toBe(0);
    });

    it('throws RangeError when total is 0 but attended is greater than 0', () => {
      expect(() => calculateAttendance(5, 0)).toThrow(RangeError);
      expect(() => calculateAttendance(5, 0)).toThrow(/cannot exceed total classes/);
    });
  });

  describe('Invalid inputs and type safety', () => {
    it('throws TypeError for non-number attended values', () => {
      expect(() => calculateAttendance('18', 24)).toThrow(TypeError);
      expect(() => calculateAttendance(null, 24)).toThrow(TypeError);
      expect(() => calculateAttendance(undefined, 24)).toThrow(TypeError);
      expect(() => calculateAttendance(NaN, 24)).toThrow(TypeError);
      expect(() => calculateAttendance(Infinity, 24)).toThrow(TypeError);
    });

    it('throws TypeError for non-number total values', () => {
      expect(() => calculateAttendance(18, '24')).toThrow(TypeError);
      expect(() => calculateAttendance(18, null)).toThrow(TypeError);
      expect(() => calculateAttendance(18, undefined)).toThrow(TypeError);
      expect(() => calculateAttendance(18, NaN)).toThrow(TypeError);
      expect(() => calculateAttendance(18, Infinity)).toThrow(TypeError);
    });

    it('throws RangeError for negative values', () => {
      expect(() => calculateAttendance(-5, 20)).toThrow(RangeError);
      expect(() => calculateAttendance(-5, 20)).toThrow(/cannot be negative/);
      expect(() => calculateAttendance(5, -20)).toThrow(RangeError);
      expect(() => calculateAttendance(5, -20)).toThrow(/cannot be negative/);
    });

    it('throws RangeError when attended classes exceed total classes', () => {
      expect(() => calculateAttendance(25, 20)).toThrow(RangeError);
      expect(() => calculateAttendance(25, 20)).toThrow(/cannot exceed total classes/);
    });

    it('throws RangeError for invalid precision values', () => {
      expect(() => calculateAttendance(18, 24, -1)).toThrow(RangeError);
      expect(() => calculateAttendance(18, 24, 1.5)).toThrow(RangeError);
      expect(() => calculateAttendance(18, 24, '2')).toThrow(TypeError);
    });
  });
});

describe('requiredClasses', () => {
  describe('Normal calculations', () => {
    it('calculates the exact number of consecutive classes required', () => {
      // 30 / 50 = 60%, target 75%
      // (75 * 50 - 100 * 30) / (100 - 75) = (3750 - 3000) / 25 = 750 / 25 = 30
      // Check: (30 + 30) / (50 + 30) = 60 / 80 = 75%
      expect(requiredClasses(30, 50, 75)).toBe(30);

      // 18 / 30 = 60%, target 75% -> 18 classes
      expect(requiredClasses(18, 30, 75)).toBe(18);
    });

    it('uses default target percentage of 75% if not provided', () => {
      expect(requiredClasses(30, 50)).toBe(30);
    });

    it('rounds up (ceil) when fractional classes are required', () => {
      // 10 / 20 = 50%, target 65%
      // (65 * 20 - 100 * 10) / (100 - 65) = (1300 - 1000) / 35 = 300 / 35 ≈ 8.57 -> 9
      expect(requiredClasses(10, 20, 65)).toBe(9);
    });

    it('returns 0 if student has already achieved target percentage', () => {
      expect(requiredClasses(40, 50, 75)).toBe(0); // 80% >= 75%
      expect(requiredClasses(30, 40, 75)).toBe(0); // 75% >= 75%
    });

    it('returns 0 when target is 0%', () => {
      expect(requiredClasses(5, 10, 0)).toBe(0);
      expect(requiredClasses(0, 10, 0)).toBe(0);
    });
  });

  describe('Edge cases and boundary conditions', () => {
    it('handles total = 0 gracefully', () => {
      expect(requiredClasses(0, 0, 0)).toBe(0);
      expect(requiredClasses(0, 0, 75)).toBe(1); // 1 class attended out of 1 gives 100% >= 75%
    });

    it('returns 0 when target is 100% and attended equals total', () => {
      expect(requiredClasses(20, 20, 100)).toBe(0);
    });

    it('returns Infinity when target is 100% and a class was missed', () => {
      expect(requiredClasses(19, 20, 100)).toBe(Infinity);
    });
  });

  describe('Invalid inputs and validation', () => {
    it('throws TypeError for non-number arguments', () => {
      expect(() => requiredClasses('30', 50, 75)).toThrow(TypeError);
      expect(() => requiredClasses(30, '50', 75)).toThrow(TypeError);
      expect(() => requiredClasses(30, 50, '75')).toThrow(TypeError);
      expect(() => requiredClasses(null, 50, 75)).toThrow(TypeError);
      expect(() => requiredClasses(30, undefined, 75)).toThrow(TypeError);
      expect(() => requiredClasses(30, 50, NaN)).toThrow(TypeError);
    });

    it('throws RangeError for negative class counts', () => {
      expect(() => requiredClasses(-5, 50, 75)).toThrow(RangeError);
      expect(() => requiredClasses(30, -50, 75)).toThrow(RangeError);
    });

    it('throws RangeError when attended exceeds total', () => {
      expect(() => requiredClasses(55, 50, 75)).toThrow(RangeError);
    });

    it('throws RangeError for invalid target percentage (<0 or >100)', () => {
      expect(() => requiredClasses(30, 50, -10)).toThrow(RangeError);
      expect(() => requiredClasses(30, 50, 101)).toThrow(RangeError);
    });
  });
});
