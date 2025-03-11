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


// Add Duty

router.post("/add-duty/:id", async (req, res) => {
  try {
    const { date, shift, ot } = req.body;
    const employer = await Employer.findById(req.params.id);

    if (!employer) {
      return res.status(404).json({ message: "❌ Employer not found" });
    }

    const formattedDate = formatDate(date);

    // Duty Exists Check (Case-insensitive)
    const existingDuty = employer.duty.find((duty) => duty.date.trim() === formattedDate);

    if (existingDuty) {
      return res.status(400).json({ message: "⚠️ Duty already exists for this date" });
    }

    // Push new duty
    employer.duty.push({ date: formattedDate, shift: shift.toUpperCase(), OT: Number(ot) || 0 });

    const savedEmployer = await employer.save();
    res.status(201).json({ success: true, data: savedEmployer });

  } catch (error) {
    console.error("❌ Error in /add-duty/:id", error);
    res.status(500).json({ message: "❌ Internal Server Error", error: error.message });
  }
});

// Date Format Function
const formatDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${day}-${month}-${year}`; // Ensure proper format
};

// update Duty

router.put("/update-duty/:id", async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const existingDuty = employer.duty.find((duty) => duty.date === req.body.date);

    if (!existingDuty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    existingDuty.shift = req.body.shift;
    existingDuty.OT = req.body.OT;

    const savedEmployer = await employer.save();
    res.status(202).json(savedEmployer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Duty

router.delete("/delete-duty/:id", async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const existingDuty = employer.duty.find((duty) => duty.date === req.body.date);

    if (!existingDuty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    employer.duty.pull(existingDuty);
    const savedEmployer = await employer.save();
    res.status(203).json({ date: existingDuty.date, message: "Duty deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// get today all  employees

router.get("/today-employees", async (req, res) => {

  try {
    const employers = await Employer.find();
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    const employees = employers.flatMap((employer) => employer.duty.filter((duty) => duty.date === formattedDate));
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


});










module.exports = router;
