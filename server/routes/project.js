const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const {Employee} = require('../models/employee');

// Get all employees
router.get('/emp', async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// POST route to assign a project to an employee
router.post('/assign-project', async (req, res) => {
  try {
    const { projectName, projectDescription, assignedEmployee, startDate, endDate, work, priority, budget } = req.body;

    // Create a new project instance
    const project = new Project({
      projectName,
      projectDescription,
      assignedEmployee,
      startDate,
      endDate,
      work,
      priority,
      budget
    });

    // Save the project to the database
    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error assigning project:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/assigned-projects/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find projects assigned to the employee
    const projects = await Project.find({ assignedEmployee: employeeId });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching assigned projects:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



  
module.exports = router;
