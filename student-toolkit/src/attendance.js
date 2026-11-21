/**
 * Attendance calculation module for student-toolkit.
 * Provides functions for calculating attendance percentage and determining
 * the required number of consecutive classes needed to meet a target percentage.
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
 * Calculates the attendance percentage given attended and total classes.
 *
 * @param {number} attended - Number of classes attended by the student (non-negative).
 * @param {number} total - Total number of classes conducted (non-negative).
 * @param {number} [precision=2] - Number of decimal places to round the result to.
 * @returns {number} The attendance percentage rounded to the specified precision. Returns 0 if total classes is 0.
 *
 * @throws {TypeError} If attended, total, or precision is not a finite number.
 * @throws {RangeError} If attended or total is negative, if attended exceeds total, or if precision is negative.
 *
 * @example
 * calculateAttendance(18, 24); // returns 75
 * calculateAttendance(37, 45); // returns 82.22
 * calculateAttendance(0, 0);   // returns 0 (handles zero total classes safely)
 */
export function calculateAttendance(attended, total, precision = 2) {
  assertFiniteNumber(attended, 'attended');
  assertFiniteNumber(total, 'total');
  assertFiniteNumber(precision, 'precision');

  if (precision < 0 || !Number.isInteger(precision)) {
    throw new RangeError('Expected "precision" to be a non-negative integer.');
  }

  if (attended < 0) {
    throw new RangeError(`Attended classes cannot be negative. Received: ${attended}.`);
  }

  if (total < 0) {
    throw new RangeError(`Total classes cannot be negative. Received: ${total}.`);
  }

  // Handle zero total classes gracefully (e.g. at the start of a semester)
  if (total === 0) {
    if (attended > 0) {
      throw new RangeError(`Attended classes (${attended}) cannot exceed total classes (0).`);
    }
    return 0;
  }

  if (attended > total) {
    throw new RangeError(`Attended classes (${attended}) cannot exceed total classes (${total}).`);
  }

  const percentage = (attended / total) * 100;
  return Number(percentage.toFixed(precision));
}

/**
 * Calculates the number of consecutive upcoming classes a student must attend
 * to reach or exceed a target attendance percentage.
 *
 * @param {number} attended - Number of classes attended so far (non-negative).
 * @param {number} total - Total number of classes conducted so far (non-negative).
 * @param {number} [targetPercentage=75] - Desired attendance percentage (0 to 100).
 * @returns {number} Minimum number of consecutive classes required. Returns 0 if target is already met.
 *                   Returns Infinity if target is 100% and at least one class has been missed.
 *
 * @throws {TypeError} If any argument is not a valid finite number.
 * @throws {RangeError} If class counts are negative, attended exceeds total, or targetPercentage is not between 0 and 100.
 *
 * @example
 * // Currently at 30/50 (60%), target is 75%
 * requiredClasses(30, 50, 75); // returns 30
 *
 * // Currently at 40/50 (80%), target is 75%
 * requiredClasses(40, 50, 75); // returns 0 (already achieved)
 */
export function requiredClasses(attended, total, targetPercentage = 75) {
  assertFiniteNumber(attended, 'attended');
  assertFiniteNumber(total, 'total');
  assertFiniteNumber(targetPercentage, 'targetPercentage');

  if (attended < 0) {
    throw new RangeError(`Attended classes cannot be negative. Received: ${attended}.`);
  }

  if (total < 0) {
    throw new RangeError(`Total classes cannot be negative. Received: ${total}.`);
  }

  if (targetPercentage < 0 || targetPercentage > 100) {
    throw new RangeError(`Target percentage must be between 0 and 100. Received: ${targetPercentage}.`);
  }

  if (total === 0) {
    if (attended > 0) {
      throw new RangeError(`Attended classes (${attended}) cannot exceed total classes (0).`);
    }
    // With 0 classes held, target 0% is met; target > 0 requires attending at least 1 class (1/1 = 100%)
    return targetPercentage === 0 ? 0 : 1;
  }

  if (attended > total) {
    throw new RangeError(`Attended classes (${attended}) cannot exceed total classes (${total}).`);
  }

  // Check if target is already achieved
  const currentPercentage = (attended / total) * 100;
  if (currentPercentage >= targetPercentage) {
    return 0;
  }

  // If target is 100% and classes have already been missed, 100% is mathematically unattainable
  if (targetPercentage === 100) {
    return Infinity;
  }

  // Formula derivation:
  // (attended + x) / (total + x) >= targetPercentage / 100
  // (attended + x) * 100 >= targetPercentage * (total + x)
  // 100 * attended + 100 * x >= targetPercentage * total + targetPercentage * x
  // x * (100 - targetPercentage) >= targetPercentage * total - 100 * attended
  // x >= (targetPercentage * total - 100 * attended) / (100 - targetPercentage)
  const numerator = targetPercentage * total - 100 * attended;
  const denominator = 100 - targetPercentage;
  const classesNeeded = Math.ceil(numerator / denominator);

  return Math.max(0, classesNeeded);
}
