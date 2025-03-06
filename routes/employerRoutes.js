const express = require("express");
const router = express.Router();
const Employer = require("../models/employer.model");
const e = require("express");

router.get("/", async (req, res) => {
  try {
    const employers = await Employer.find();
    res.json(employers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newEmployer = new Employer(req.body);
    const savedEmployer = await newEmployer.save();
    res.status(201).json(savedEmployer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.json(employer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedEmployer = await Employer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.json(updatedEmployer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedEmployer = await Employer.findByIdAndDelete(req.params.id);
    if (!deletedEmployer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.json({ message: "Employer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});






router.post('/add-duty/:id', async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
   
    employer.duty.push(req.body);
    const updatedEmployer = await employer.save();
    res.json(updatedEmployer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = router;
