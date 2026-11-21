import { describe, it, expect } from 'vitest';
import { calculateSGPA } from '../src/sgpa.js';

describe('calculateSGPA', () => {
  describe('Normal calculations', () => {
    it('calculates weighted SGPA correctly using prompt example', () => {
      const subjects = [
        { credits: 4, gradePoint: 9 },
        { credits: 3, gradePoint: 8 },
        { credits: 2, gradePoint: 10 }
      ];
      // Total points: (4 * 9) + (3 * 8) + (2 * 10) = 36 + 24 + 20 = 80
      // Total credits: 4 + 3 + 2 = 9
      // SGPA: 80 / 9 ≈ 8.888... -> 8.89
      expect(calculateSGPA(subjects)).toBe(8.89);
    });

    it('calculates SGPA accurately for a single subject', () => {
      const subjects = [{ credits: 4, gradePoint: 10 }];
      expect(calculateSGPA(subjects)).toBe(10);
    });

    it('handles decimal credits and grade points', () => {
      const subjects = [
        { credits: 1.5, gradePoint: 8.5 },
        { credits: 3.0, gradePoint: 9.0 }
      ];
      // (1.5 * 8.5 + 3.0 * 9.0) / 4.5 = (12.75 + 27) / 4.5 = 39.75 / 4.5 ≈ 8.833... -> 8.83
      expect(calculateSGPA(subjects)).toBe(8.83);
    });

    it('supports custom rounding precision', () => {
      const subjects = [
        { credits: 4, gradePoint: 9 },
        { credits: 3, gradePoint: 8 },
        { credits: 2, gradePoint: 10 }
      ];
      expect(calculateSGPA(subjects, 3)).toBe(8.889);
      expect(calculateSGPA(subjects, 1)).toBe(8.9);
      expect(calculateSGPA(subjects, 0)).toBe(9);
    });

    it('handles grade point 0 (fail grade)', () => {
      const subjects = [
        { credits: 4, gradePoint: 0 },
        { credits: 4, gradePoint: 10 }
      ];
      expect(calculateSGPA(subjects)).toBe(5);
    });
  });

  describe('Input validation and error handling', () => {
    it('throws TypeError if subjects is not an array', () => {
      expect(() => calculateSGPA('subjects')).toThrow(TypeError);
      expect(() => calculateSGPA(null)).toThrow(TypeError);
      expect(() => calculateSGPA(undefined)).toThrow(TypeError);
      expect(() => calculateSGPA({ credits: 4, gradePoint: 9 })).toThrow(TypeError);
      expect(() => calculateSGPA(123)).toThrow(TypeError);
    });

    it('throws RangeError if subjects array is empty', () => {
      expect(() => calculateSGPA([])).toThrow(RangeError);
      expect(() => calculateSGPA([])).toThrow(/cannot be empty/);
    });

    it('throws TypeError if subject elements are not valid objects', () => {
      expect(() => calculateSGPA([null])).toThrow(TypeError);
      expect(() => calculateSGPA(['subject'])).toThrow(TypeError);
      expect(() => calculateSGPA([[4, 9]])).toThrow(TypeError);
    });

    it('throws TypeError if required properties (credits, gradePoint) are missing', () => {
      expect(() => calculateSGPA([{ credits: 4 }])).toThrow(TypeError);
      expect(() => calculateSGPA([{ gradePoint: 9 }])).toThrow(TypeError);
      expect(() => calculateSGPA([{}])).toThrow(TypeError);
    });

    it('throws TypeError if credits or gradePoint are not finite numbers', () => {
      expect(() => calculateSGPA([{ credits: '4', gradePoint: 9 }])).toThrow(TypeError);
      expect(() => calculateSGPA([{ credits: 4, gradePoint: '9' }])).toThrow(TypeError);
      expect(() => calculateSGPA([{ credits: NaN, gradePoint: 9 }])).toThrow(TypeError);
      expect(() => calculateSGPA([{ credits: 4, gradePoint: NaN }])).toThrow(TypeError);
    });

    it('throws RangeError if credits are zero or negative', () => {
      expect(() => calculateSGPA([{ credits: 0, gradePoint: 9 }])).toThrow(RangeError);
      expect(() => calculateSGPA([{ credits: 0, gradePoint: 9 }])).toThrow(/greater than zero/);
      expect(() => calculateSGPA([{ credits: -2, gradePoint: 9 }])).toThrow(RangeError);
    });

    it('throws RangeError if gradePoint is outside [0, 10]', () => {
      expect(() => calculateSGPA([{ credits: 3, gradePoint: -1 }])).toThrow(RangeError);
      expect(() => calculateSGPA([{ credits: 3, gradePoint: 11 }])).toThrow(RangeError);
    });

    it('throws RangeError for invalid precision values', () => {
      const subjects = [{ credits: 4, gradePoint: 9 }];
      expect(() => calculateSGPA(subjects, -1)).toThrow(RangeError);
      expect(() => calculateSGPA(subjects, 1.5)).toThrow(RangeError);
      expect(() => calculateSGPA(subjects, '2')).toThrow(TypeError);
    });
  });
});
