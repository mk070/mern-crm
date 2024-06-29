const express = require("express");
const Lead = require("../models/lead");  // Adjusted import to match lead model
const router = express.Router();

let leads = []; // Renaming array to 'leads' for clarity

// Create a lead
router.post('/lead', async (req, res) => {
  try {
    let newLead = new Lead({
      sno: req.body.sno, 
      name: req.body.name,
      email: req.body.email, 
      phone: req.body.phone, 
      address: req.body.address, 
      source: req.body.source
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
    const lead = await Lead.findByIdAndUpdate(req.params.id, { 
      sno: req.body.sno, 
      name: req.body.name,
      email: req.body.email, 
      phone: req.body.phone, 
      address: req.body.address, 
      source: req.body.source
    }, { new: true });
    if (!lead) return res.status(404).send('Lead not found');
    res.send(lead);
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
});

// Delete a Lead
router.delete('/lead/:id', async (req, res) => {
  try {
    const id = req.params.id; // Extracting the id from the request URL
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).send('Lead not found');
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;

module.exports = router;
