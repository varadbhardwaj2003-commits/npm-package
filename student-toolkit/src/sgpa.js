/**
 * SGPA (Semester Grade Point Average) calculation module for student-toolkit.
 * Calculates credit-weighted grade point averages for academic semesters.
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
 * Calculates Semester Grade Point Average (SGPA) from an array of subjects.
 * Formula: SGPA = Σ(credits * gradePoint) / Σ(credits)
 *
 * @param {Array<{ credits: number, gradePoint: number }>} subjects - List of subjects.
 * @param {number} [precision=2] - Number of decimal places to round the result to.
 * @returns {number} The calculated SGPA rounded to the specified precision.
 *
 * @throws {TypeError} If subjects is not an array, or if subject items have invalid properties.
 * @throws {RangeError} If subjects array is empty, credits <= 0, or gradePoint is not in [0, 10].
 *
 * @example
 * const subjects = [
 *   { credits: 4, gradePoint: 9 },
 *   { credits: 3, gradePoint: 8 },
 *   { credits: 2, gradePoint: 10 }
 * ];
 * calculateSGPA(subjects); // returns 8.89
 */
export function calculateSGPA(subjects, precision = 2) {
  if (!Array.isArray(subjects)) {
    throw new TypeError(`Expected "subjects" to be an array, but received ${typeof subjects}.`);
  }

  if (subjects.length === 0) {
    throw new RangeError('Subjects array cannot be empty.');
  }

  assertFiniteNumber(precision, 'precision');
  if (precision < 0 || !Number.isInteger(precision)) {
    throw new RangeError('Expected "precision" to be a non-negative integer.');
  }

  let totalWeightedPoints = 0;
  let totalCredits = 0;

  for (let i = 0; i < subjects.length; i++) {
    const item = subjects[i];

    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new TypeError(`Subject at index ${i} must be a valid non-null object.`);
    }

    const { credits, gradePoint } = item;

    if (credits === undefined || gradePoint === undefined) {
      throw new TypeError(`Subject at index ${i} must contain both "credits" and "gradePoint" properties.`);
    }

    assertFiniteNumber(credits, `subjects[${i}].credits`);
    assertFiniteNumber(gradePoint, `subjects[${i}].gradePoint`);

    if (credits <= 0) {
      throw new RangeError(`Credits for subject at index ${i} must be greater than zero. Received: ${credits}.`);
    }

    if (gradePoint < 0 || gradePoint > 10) {
      throw new RangeError(`Grade point for subject at index ${i} must be between 0 and 10. Received: ${gradePoint}.`);
    }

    totalWeightedPoints += credits * gradePoint;
    totalCredits += credits;
  }

  if (totalCredits <= 0) {
    throw new RangeError('Total semester credits must be greater than zero.');
  }

  const sgpa = totalWeightedPoints / totalCredits;
  return Number(sgpa.toFixed(precision));
}
