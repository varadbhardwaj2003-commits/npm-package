/**
 * CGPA (Cumulative Grade Point Average) calculation module for student-toolkit.
 * Supports weighted calculation using credits or simple unweighted calculation across semesters.
 */

/**
 * Validates that an argument is a finite number.
 *
 * @private
 * @param {unknown} value - Value to validate.
 * @param {string} paramName - Name of parameter for error messages.
 * @throws {TypeError} If value is not a valid finite number.
 */
function assertFiniteNumber(value, paramName) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`Expected "${paramName}" to be a valid finite number, but received ${typeof value === 'string' ? `"${value}"` : value} (${typeof value}).`);
  }
}

/**
 * Calculates Cumulative Grade Point Average (CGPA) from semester grades.
 * Supports weighted calculation via semester objects { sgpa, credits } or direct SGPA numbers.
 * Formula: CGPA = Σ(sgpa * credits) / Σ(credits)
 *
 * @param {Array<{ sgpa: number, credits?: number } | number>} semesterGrades - Array of semester objects or SGPA numbers.
 * @param {number} [precision=2] - Number of decimal places to round the result to.
 * @returns {number} The calculated CGPA rounded to the specified precision.
 *
 * @throws {TypeError} If semesterGrades is not an array or elements are invalid.
 * @throws {RangeError} If semesterGrades is empty, SGPA is not in [0, 10], or credits <= 0.
 *
 * @example
 * // Weighted with credits
 * calculateCGPA([
 *   { sgpa: 8.5, credits: 20 },
 *   { sgpa: 9.0, credits: 22 },
 *   { sgpa: 8.0, credits: 18 }
 * ]); // returns 8.53
 *
 * // Unweighted (direct numbers)
 * calculateCGPA([8.5, 9.0, 8.0]); // returns 8.5
 */
export function calculateCGPA(semesterGrades, precision = 2) {
  if (!Array.isArray(semesterGrades)) {
    throw new TypeError(`Expected "semesterGrades" to be an array, but received ${typeof semesterGrades}.`);
  }

  if (semesterGrades.length === 0) {
    throw new RangeError('Semester grades array cannot be empty.');
  }

  assertFiniteNumber(precision, 'precision');
  if (precision < 0 || !Number.isInteger(precision)) {
    throw new RangeError('Expected "precision" to be a non-negative integer.');
  }

  let totalWeightedPoints = 0;
  let totalCredits = 0;

  for (let i = 0; i < semesterGrades.length; i++) {
    const item = semesterGrades[i];

    let sgpa;
    let credits;

    if (typeof item === 'number') {
      sgpa = item;
      credits = 1; // default equal weight
    } else if (item && typeof item === 'object' && !Array.isArray(item)) {
      if (item.sgpa === undefined) {
        throw new TypeError(`Semester entry at index ${i} must include an "sgpa" property.`);
      }
      sgpa = item.sgpa;
      credits = item.credits !== undefined ? item.credits : 1;
    } else {
      throw new TypeError(`Semester entry at index ${i} must be a number or an object with "sgpa" and optional "credits".`);
    }

    assertFiniteNumber(sgpa, `semesterGrades[${i}].sgpa`);
    assertFiniteNumber(credits, `semesterGrades[${i}].credits`);

    if (sgpa < 0 || sgpa > 10) {
      throw new RangeError(`SGPA at index ${i} must be between 0 and 10. Received: ${sgpa}.`);
    }

    if (credits <= 0) {
      throw new RangeError(`Credits at index ${i} must be greater than zero. Received: ${credits}.`);
    }

    totalWeightedPoints += sgpa * credits;
    totalCredits += credits;
  }

  if (totalCredits <= 0) {
    throw new RangeError('Total credits across semesters must be greater than zero.');
  }

  const cgpa = totalWeightedPoints / totalCredits;
  return Number(cgpa.toFixed(precision));
}
