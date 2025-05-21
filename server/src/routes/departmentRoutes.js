const express = require("express");
const {
  getAllDepartmentsFromDB,
} = require("../controllers/designationController");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const depts = await getAllDepartmentsFromDB();
    res.json(depts.map((d) => ({ value: String(d.id), label: d.name })));
  } catch (err) {
    res.status(500).json({ message: "Could not load departments" });
  }
});
module.exports = router;
