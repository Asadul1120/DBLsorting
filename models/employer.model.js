const mongoose = require("mongoose");

const dutySchema = new mongoose.Schema({
  date: { type: String, required: true, trim: true }, // ✅ unique: true সরিয়ে দেওয়া হলো
  shift: { type: String, required: true, uppercase: true },
  OT: { type: Number, required: true, min: 0 },
});

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], trim: true },
  ID: { type: String, required: true, unique: true }, 
  phone: { type: String },
  line: { type: String, required: true },
  group: { type: String, required: true },
  duty: { type: [dutySchema], default: [], index: false },
  createdAt: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
