/**
 * Percentage calculation module for student-toolkit.
 * Provides functions for calculating examination percentage and marks evaluation.
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
 * Calculates examination percentage based on obtained marks and total marks.
 *
 * @param {number} obtainedMarks - Marks scored by the student (non-negative).
 * @param {number} totalMarks - Maximum possible marks (non-negative).
 * @param {number} [precision=2] - Number of decimal places to round the result to.
 * @returns {number} The calculated percentage rounded to the specified precision. Returns 0 if total marks is 0.
 *
 * @throws {TypeError} If obtainedMarks, totalMarks, or precision is not a finite number.
 * @throws {RangeError} If marks are negative, if obtainedMarks exceeds totalMarks, or if precision is negative.
 *
 * @example
 * calculatePercentage(425, 500); // returns 85
 * calculatePercentage(78.5, 100); // returns 78.5
 * calculatePercentage(0, 0);     // returns 0 (handles zero total marks)
 */
export function calculatePercentage(obtainedMarks, totalMarks, precision = 2) {
  assertFiniteNumber(obtainedMarks, 'obtainedMarks');
  assertFiniteNumber(totalMarks, 'totalMarks');
  assertFiniteNumber(precision, 'precision');

  if (precision < 0 || !Number.isInteger(precision)) {
    throw new RangeError('Expected "precision" to be a non-negative integer.');
  }

  if (obtainedMarks < 0) {
    throw new RangeError(`Obtained marks cannot be negative. Received: ${obtainedMarks}.`);
  }

  if (totalMarks < 0) {
    throw new RangeError(`Total marks cannot be negative. Received: ${totalMarks}.`);
  }

  // Handle zero total marks gracefully
  if (totalMarks === 0) {
    if (obtainedMarks > 0) {
      throw new RangeError(`Obtained marks (${obtainedMarks}) cannot exceed total marks (0).`);
    }
    return 0;
  }

  if (obtainedMarks > totalMarks) {
    throw new RangeError(`Obtained marks (${obtainedMarks}) cannot exceed total marks (${totalMarks}).`);
  }

  const percentage = (obtainedMarks / totalMarks) * 100;
  return Number(percentage.toFixed(precision));
}
