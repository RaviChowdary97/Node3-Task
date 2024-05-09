const express = require("express");
const router = express.Router();
const Mentor = require("../models/mentor");
const Student = require("../models/student");

// Create Mentor
router.post("/mentor", async (req, res) => {
  const { name } = req.body;
  const mentor = new Mentor({ name });
  await mentor.save();
  res.json(mentor);
});

// Create Student
router.post("/student", async (req, res) => {
  const { name } = req.body;
  const student = new Student({ name });
  await student.save();
  res.json(student);
});

// Assign a student to a mentor
router.post("/assign-student", async (req, res) => {
  const { mentorId, studentIds } = req.body;
  const mentor = await Mentor.findById(mentorId);
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });

  for (let studentId of studentIds) {
    const student = await Student.findById(studentId);
    if (student) {
      student.previousMentors.push(student.mentor);
      student.mentor = mentorId;
      await student.save();
      mentor.students.push(studentId);
    }
  }
  await mentor.save();
  res.json(mentor);
});

// Get all students for a particular mentor
router.get("/mentor/:mentorId/students", async (req, res) => {
  const { mentorId } = req.params;
  const mentor = await Mentor.findById(mentorId).populate("students");
  if (!mentor) return res.status(404).json({ error: "Mentor not found" });
  res.json(mentor.students);
});

// Change Mentor for a particular student
router.post("/change-mentor", async (req, res) => {
  const { studentId, newMentorId } = req.body;
  const student = await Student.findById(studentId);
  const newMentor = await Mentor.findById(newMentorId);

  if (!student || !newMentor) {
    return res.status(404).json({ error: "Student or Mentor not found" });
  }

  const oldMentor = await Mentor.findById(student.mentor);

  student.previousMentors.push(student.mentor);
  student.mentor = newMentorId;
  await student.save();

  if (oldMentor) {
    oldMentor.students.pull(studentId);
    await oldMentor.save();
  }

  newMentor.students.push(studentId);
  await newMentor.save();

  res.json(student);
});

// Get previous mentors for a student
router.get("/student/:studentId/previous-mentors", async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId).populate("previousMentors");
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student.previousMentors);
});

// Get students without mentors
router.get("/students-without-mentors", async (req, res) => {
  const students = await Student.find({ mentor: { $exists: false } });
  res.json(students);
});

module.exports = router;
