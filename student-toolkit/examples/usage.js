import {
  calculateAttendance,
  requiredClasses,
  calculatePercentage,
  calculateSGPA,
  calculateCGPA
} from '../src/index.js';

console.log('=== Student Toolkit Usage Examples ===\n');

// 1. Attendance Calculation
const attendedClasses = 38;
const totalConducted = 48;
const attendance = calculateAttendance(attendedClasses, totalConducted);
console.log(`1. Current Attendance: ${attendance}% (${attendedClasses}/${totalConducted} classes)`);

// 2. Classes Needed for Target Attendance
const target = 75;
const classesNeeded = requiredClasses(30, 50, target);
console.log(`2. Consecutive classes required to reach ${target}% from 30/50: ${classesNeeded} classes`);

const alreadySafe = requiredClasses(42, 50, target);
console.log(`   Classes needed when already at 42/50 (84%): ${alreadySafe} classes`);

// 3. Exam Percentage Calculation
const marksObtained = 462;
const totalPossible = 500;
const percent = calculatePercentage(marksObtained, totalPossible);
console.log(`3. Examination Percentage: ${percent}% (${marksObtained}/${totalPossible} marks)`);

// 4. Semester SGPA Calculation
const semesterSubjects = [
  { credits: 4, gradePoint: 9 }, // Data Structures
  { credits: 4, gradePoint: 8 }, // Discrete Mathematics
  { credits: 3, gradePoint: 10 }, // Computer Organization
  { credits: 2, gradePoint: 9 },  // Web Development Lab
  { credits: 1, gradePoint: 10 }  // Seminar
];
const sgpa = calculateSGPA(semesterSubjects);
console.log(`4. Semester SGPA: ${sgpa}`);

// 5. Cumulative CGPA Calculation
// Option A: Credit-weighted semesters
const semesterHistory = [
  { sgpa: 8.4, credits: 21 },
  { sgpa: 8.8, credits: 22 },
  { sgpa: 9.1, credits: 20 }
];
const weightedCGPA = calculateCGPA(semesterHistory);
console.log(`5. Weighted CGPA (3 semesters): ${weightedCGPA}`);

// Option B: Direct SGPA list (equal weight)
const unweightedCGPA = calculateCGPA([8.4, 8.8, 9.1]);
console.log(`   Unweighted CGPA: ${unweightedCGPA}`);

console.log('\nAll examples executed successfully!');
