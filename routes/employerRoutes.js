const express = require("express");
const router = express.Router();
const Employer = require("../models/employer.model");

router.get("/today", async (req, res) => {
  try {
    const employers = await Employer.find();

    const now = new Date();
    const currentHour = now.getHours();

    // ✅ যদি সময় 6:00am এর আগে হয় → আগের দিন
    let customToday = new Date(now);
    if (currentHour < 6) {
      customToday.setDate(customToday.getDate() - 1);
    }

    const year = customToday.getFullYear();
    let month = customToday.getMonth() + 1;
    let date = customToday.getDate();

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;

    const formattedToday = `${date}-${month}-${year}`;

    const result = employers.filter((user) =>
      user.duty.some((d) => d.date === formattedToday)
    );

    const data = result.map((user) => {
      const duty = user.duty.find((d) => d.date === formattedToday);
      return {
        name: user.name,
        ID: user.ID,
        phone: user.phone,
        line: user.line,
        group: user.group,
        date: duty.date,
        shift: duty.shift,
        OT: duty.OT,
      };
    });

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No duty found for today", date: formattedToday });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All employers
router.get("/", async (req, res) => {
  try {
    const employers = await Employer.find();
    const data = employers.toSorted((a, b) => a.someField - b.someField); // Replace `someField` with a real field
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Employer
router.post("/", async (req, res) => {
  try {
    const newEmployer = new Employer(req.body);

    const existingEmployer = await Employer.findOne({ ID: req.body.ID });
    if (existingEmployer) {
      return res.status(400).json({ message: "Employer ID already exists" });
    }

    const savedEmployer = await newEmployer.save();
    res.status(201).json(savedEmployer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Employer
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

// Update Employer
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

// Delete Employer
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
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const existingDuty = employer.duty.find(
      (duty) => duty.date === req.body.date
    );

    if (existingDuty) {
      return res.status(400).json({ message: "Duty already exists" });
    }

    // Push new duty if it doesn't exist
    employer.duty.push(req.body);
    const savedEmployer = await employer.save();
    res.status(201).json(savedEmployer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update Duty

router.put("/update-duty/:id", async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const existingDuty = employer.duty.find(
      (duty) => duty.date === req.body.date
    );

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

    const existingDuty = employer.duty.find(
      (duty) => duty.date === req.body.date
    );

    if (!existingDuty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    employer.duty.pull(existingDuty);
    const savedEmployer = await employer.save();
    res
      .status(203)
      .json({ date: existingDuty.date, message: "Duty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get today all  employees

module.exports = router;
