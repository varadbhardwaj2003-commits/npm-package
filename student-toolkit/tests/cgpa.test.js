import { describe, it, expect } from 'vitest';
import { calculateCGPA } from '../src/cgpa.js';

describe('calculateCGPA', () => {
  describe('Weighted calculations (array of objects)', () => {
    it('calculates credit-weighted CGPA correctly', () => {
      const semesterGrades = [
        { sgpa: 8.5, credits: 20 },
        { sgpa: 9.0, credits: 22 },
        { sgpa: 8.0, credits: 18 }
      ];
      // Total points: (8.5 * 20) + (9.0 * 22) + (8.0 * 18) = 170 + 198 + 144 = 512
      // Total credits: 20 + 22 + 18 = 60
      // CGPA: 512 / 60 ≈ 8.5333... -> 8.53
      expect(calculateCGPA(semesterGrades)).toBe(8.53);
    });

    it('supports objects with optional credits (defaults to equal weight)', () => {
      const semesterGrades = [
        { sgpa: 8.5 },
        { sgpa: 9.5 }
      ];
      expect(calculateCGPA(semesterGrades)).toBe(9.0);
    });

    it('supports custom rounding precision', () => {
      const semesterGrades = [
        { sgpa: 8.5, credits: 20 },
        { sgpa: 9.0, credits: 22 },
        { sgpa: 8.0, credits: 18 }
      ];
      expect(calculateCGPA(semesterGrades, 3)).toBe(8.533);
      expect(calculateCGPA(semesterGrades, 1)).toBe(8.5);
      expect(calculateCGPA(semesterGrades, 0)).toBe(9);
    });
  });

  describe('Unweighted calculations (array of numbers)', () => {
    it('calculates unweighted arithmetic mean when given an array of SGPA numbers', () => {
      const semesterGrades = [8.5, 9.0, 8.0];
      // (8.5 + 9.0 + 8.0) / 3 = 25.5 / 3 = 8.5
      expect(calculateCGPA(semesterGrades)).toBe(8.5);
    });

    it('handles a single semester grade correctly', () => {
      expect(calculateCGPA([9.2])).toBe(9.2);
    });

    it('handles mixed arrays of numbers and objects with credits', () => {
      const mixed = [
        { sgpa: 8.0, credits: 20 },
        8.0 // credit = 1
      ];
      // (8.0 * 20 + 8.0 * 1) / 21 = 8.0
      expect(calculateCGPA(mixed)).toBe(8.0);
    });
  });

  describe('Input validation and error handling', () => {
    it('throws TypeError if semesterGrades is not an array', () => {
      expect(() => calculateCGPA('semesterGrades')).toThrow(TypeError);
      expect(() => calculateCGPA(null)).toThrow(TypeError);
      expect(() => calculateCGPA(undefined)).toThrow(TypeError);
      expect(() => calculateCGPA({ sgpa: 8.5, credits: 20 })).toThrow(TypeError);
      expect(() => calculateCGPA(8.5)).toThrow(TypeError);
    });

    it('throws RangeError if semesterGrades array is empty', () => {
      expect(() => calculateCGPA([])).toThrow(RangeError);
      expect(() => calculateCGPA([])).toThrow(/cannot be empty/);
    });

    it('throws TypeError if semester entries are not valid numbers or objects', () => {
      expect(() => calculateCGPA([null])).toThrow(TypeError);
      expect(() => calculateCGPA(['8.5'])).toThrow(TypeError);
      expect(() => calculateCGPA([true])).toThrow(TypeError);
    });

    it('throws TypeError if object entry is missing sgpa property', () => {
      expect(() => calculateCGPA([{ credits: 20 }])).toThrow(TypeError);
      expect(() => calculateCGPA([{}])).toThrow(TypeError);
    });

    it('throws TypeError if sgpa or credits are not finite numbers', () => {
      expect(() => calculateCGPA([{ sgpa: '8.5', credits: 20 }])).toThrow(TypeError);
      expect(() => calculateCGPA([{ sgpa: 8.5, credits: '20' }])).toThrow(TypeError);
      expect(() => calculateCGPA([{ sgpa: NaN, credits: 20 }])).toThrow(TypeError);
      expect(() => calculateCGPA([{ sgpa: 8.5, credits: NaN }])).toThrow(TypeError);
    });

    it('throws RangeError if sgpa is not in range [0, 10]', () => {
      expect(() => calculateCGPA([-1])).toThrow(RangeError);
      expect(() => calculateCGPA([11])).toThrow(RangeError);
      expect(() => calculateCGPA([{ sgpa: -0.5, credits: 20 }])).toThrow(RangeError);
      expect(() => calculateCGPA([{ sgpa: 10.5, credits: 20 }])).toThrow(RangeError);
    });

    it('throws RangeError if credits are zero or negative', () => {
      expect(() => calculateCGPA([{ sgpa: 8.5, credits: 0 }])).toThrow(RangeError);
      expect(() => calculateCGPA([{ sgpa: 8.5, credits: 0 }])).toThrow(/greater than zero/);
      expect(() => calculateCGPA([{ sgpa: 8.5, credits: -5 }])).toThrow(RangeError);
    });

    it('throws RangeError for invalid precision values', () => {
      expect(() => calculateCGPA([8.5, 9.0], -1)).toThrow(RangeError);
      expect(() => calculateCGPA([8.5, 9.0], 1.5)).toThrow(RangeError);
      expect(() => calculateCGPA([8.5, 9.0], '2')).toThrow(TypeError);
    });
  });
});
