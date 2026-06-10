const Reminder = require('../models/Reminder');

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create({
      user: req.user.id,
      ...req.body,
    });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!reminder) return res.status(404).json({ message: 'Reminder not found.' });
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found.' });
    res.json({ success: true, message: 'Reminder deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
