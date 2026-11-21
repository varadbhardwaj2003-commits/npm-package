# @varad123/student-toolkit

A lightweight, zero-dependency, production-grade JavaScript utility library designed for college and university students. Easily calculate attendance metrics, required upcoming classes, examination percentages, Semester Grade Point Average (SGPA), and Cumulative Grade Point Average (CGPA).

Built with modern ES Modules, full input validation, predictable floating-point rounding, comprehensive JSDoc annotations, and full compatibility with Node.js and frontend frameworks (such as React, Vue, Svelte, or plain Vanilla JS).

---

## Features

- **Attendance Tracker**: Calculate accurate attendance percentages and handle zero-class scenarios smoothly.
- **Goal Planner (`requiredClasses`)**: Determine how many consecutive upcoming lectures must be attended to achieve a desired target attendance (e.g., 75% or 85%).
- **Examination Percentage**: Compute score percentages with custom rounding and strict validation.
- **SGPA Calculator**: Calculate credit-weighted Semester Grade Point Average following standard university 10-point grading scales.
- **CGPA Calculator**: Compute multi-semester Cumulative Grade Point Average with support for credit-weighted and unweighted averages.
- **Zero Runtime Dependencies**: Ultra-lightweight footprint with zero external dependencies.
- **Robust Error Handling**: Throws clear `TypeError` and `RangeError` messages on invalid inputs.
- **Tree Shakeable**: Import the complete library or individual subpaths (`@varad123/student-toolkit/attendance`, etc.).

---

## Installation

Install using npm:

```bash
npm install @varad123/student-toolkit
```

Or using yarn / pnpm:

```bash
yarn add @varad123/student-toolkit
# or
pnpm add @varad123/student-toolkit
```

---

## Quick Start & Usage Examples

### 1. Import Everything or Select Functions

```javascript
// Central import
import {
  calculateAttendance,
  requiredClasses,
  calculatePercentage,
  calculateSGPA,
  calculateCGPA
} from '@varad123/student-toolkit';

// Or individual subpath imports (tree-shaking optimized)
import { calculateAttendance, requiredClasses } from '@varad123/student-toolkit/attendance';
import { calculatePercentage } from '@varad123/student-toolkit/percentage';
import { calculateSGPA } from '@varad123/student-toolkit/sgpa';
import { calculateCGPA } from '@varad123/student-toolkit/cgpa';
```

---

### 2. Attendance Calculations

#### `calculateAttendance(attended, total, [precision=2])`

Calculates current attendance percentage.

```javascript
import { calculateAttendance } from '@varad123/student-toolkit';

// 38 attended out of 48 total classes
const attendance = calculateAttendance(38, 48);
console.log(attendance); // 79.17

// Beginning of semester (0 total classes conducted)
console.log(calculateAttendance(0, 0)); // 0

// Custom precision
console.log(calculateAttendance(22, 33, 4)); // 66.6667
```

#### `requiredClasses(attended, total, [targetPercentage=75])`

Calculates how many consecutive upcoming classes a student must attend to reach or exceed a target percentage.

```javascript
import { requiredClasses } from '@varad123/student-toolkit';

// Currently attended 30 out of 50 classes (60%). Target is 75%:
const needed = requiredClasses(30, 50, 75);
console.log(needed); // 30 classes

// When already above the target (e.g., 42/50 = 84%):
console.log(requiredClasses(42, 50, 75)); // 0

// Target 100% when at least one class has already been missed:
console.log(requiredClasses(19, 20, 100)); // Infinity (impossible)
```

---

### 3. Examination Percentage

#### `calculatePercentage(obtainedMarks, totalMarks, [precision=2])`

Calculates score percentage with validation.

```javascript
import { calculatePercentage } from '@varad123/student-toolkit';

const score = calculatePercentage(462, 500);
console.log(score); // 92.4

// Decimal marks
console.log(calculatePercentage(78.5, 100)); // 78.5

// Zero total marks safe handling
console.log(calculatePercentage(0, 0)); // 0
```

---

### 4. Semester Grade Point Average (SGPA)

#### `calculateSGPA(subjects, [precision=2])`

Calculates weighted SGPA using each subject's credit weight and earned grade points (0 to 10 scale).

Formula: `SGPA = Σ(credits * gradePoint) / Σ(credits)`

```javascript
import { calculateSGPA } from '@varad123/student-toolkit';

const subjects = [
  { credits: 4, gradePoint: 9 },  // e.g. Data Structures (Grade A+)
  { credits: 3, gradePoint: 8 },  // e.g. Mathematics (Grade A)
  { credits: 2, gradePoint: 10 }  // e.g. Laboratory (Grade O)
];

const sgpa = calculateSGPA(subjects);
console.log(sgpa); // 8.89
```

---

### 5. Cumulative Grade Point Average (CGPA)

#### `calculateCGPA(semesterGrades, [precision=2])`

Calculates overall CGPA across multiple semesters.

**Mode A: Credit-Weighted (Recommended for universities where semester credit loads vary)**

```javascript
import { calculateCGPA } from '@varad123/student-toolkit';

const semesterHistory = [
  { sgpa: 8.5, credits: 20 },
  { sgpa: 9.0, credits: 22 },
  { sgpa: 8.0, credits: 18 }
];

const cgpa = calculateCGPA(semesterHistory);
console.log(cgpa); // 8.53
```

**Mode B: Simple Unweighted Average**

```javascript
import { calculateCGPA } from '@varad123/student-toolkit';

// Array of semester SGPAs
const cgpa = calculateCGPA([8.5, 9.0, 8.0]);
console.log(cgpa); // 8.5
```

---

## API Reference & Function Parameters

| Function | Parameters | Return Type | Description |
| :--- | :--- | :--- | :--- |
| `calculateAttendance` | `attended: number, total: number, precision?: number` | `number` | Attendance percentage rounded to `precision` (default 2). Returns `0` if total is 0. |
| `requiredClasses` | `attended: number, total: number, targetPercentage?: number` | `number` | Consecutive upcoming classes needed to hit target percentage (default 75). |
| `calculatePercentage` | `obtainedMarks: number, totalMarks: number, precision?: number` | `number` | Score percentage. Returns `0` if totalMarks is 0. |
| `calculateSGPA` | `subjects: Array<{credits: number, gradePoint: number}>, precision?: number` | `number` | Credit-weighted semester grade point average. |
| `calculateCGPA` | `semesterGrades: Array<{sgpa: number, credits?: number} \| number>, precision?: number` | `number` | Cumulative grade point average across semesters. |

---

## Error Handling

All functions validate input types and boundary conditions defensively:

- **`TypeError`**: Thrown when arguments are missing, of the wrong type (e.g. strings instead of numbers), `NaN`, or `Infinity`.
- **`RangeError`**: Thrown when values violate logical domain limits:
  - Negative values for classes, marks, credits, or grade points.
  - `attended > total` or `obtainedMarks > totalMarks`.
  - `targetPercentage` not within `0` and `100`.
  - Empty arrays passed to `calculateSGPA` or `calculateCGPA`.
  - Grade points or SGPAs not within the valid range `[0, 10]`.
  - Non-positive credits (`credits <= 0`).

Example:
```javascript
try {
  calculateAttendance(55, 50);
} catch (error) {
  console.error(error.message); // "Attended classes (55) cannot exceed total classes (50)."
}
```

---

## Development and Testing

This repository uses [Vitest](https://vitest.dev/) for unit testing.

```bash
# Install dependencies
npm install

# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run example script
npm run example
```

---

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a pull request on the repository.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Run Tests (`npm test`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

---

## License

This project is licensed under the permissive ISC / MIT License. See [LICENSE](./LICENSE) for details.
