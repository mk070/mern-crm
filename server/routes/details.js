const router = require("express").Router();
// In your route file
const { Employee } = require("../models/employee"); // Destructure to get User

router.get('/details', async (req, res) => {
    try {
        const users = await Employee.find(); // Use User here, not EmployeeDetails
        res.json(users);
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports=router;