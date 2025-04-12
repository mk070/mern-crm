const express = require("express");
const Lead = require("../models/lead");
const router = express.Router();

// Create a lead
router.post('/lead', async (req, res) => {
  try {
    let newLead = new Lead({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      source: req.body.source,
      status: req.body.status || "new",
      budget: req.body.budget,
      notes: req.body.notes
    });

    newLead = await newLead.save();
    res.send(newLead);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get All Leads
router.get('/lead', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.send(leads);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a Single Lead
router.get('/lead/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).send('Lead not found');
    res.send(lead);
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
});

// Update a Lead
router.put('/lead/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        source: req.body.source,
        status: req.body.status,
        budget: req.body.budget,
        notes: req.body.notes
      },
      { new: true }
    );

    if (!lead) return res.status(404).send('Lead not found');
    res.send(lead);
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
});

// Delete a Lead
router.delete('/lead/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).send('Lead not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
