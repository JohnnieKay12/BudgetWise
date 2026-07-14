const express = require("express");
const router = express.Router();

const {
  sendContactMessage,
} = require("../controllers/contactController");

router.get("/", (req, res) => {
  res.json({
    message: "Contact route is working!"
  });
});

router.post("/", sendContactMessage);

module.exports = router;