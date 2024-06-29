const router = require("express").Router();
const { Client } = require("../models/user"); // Updated import
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const client = await Client.findOne({ email: req.body.email }); // Changed user to client
		if (!client)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			client.password // Changed user to client
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const clienttoken = client.generateAuthToken(); // Changed user to client
		const clientDetail = {
            _id: client._id,
			id: client.id,
            name: client.name,
            email: client.email,
        };

		res.status(200).send({ data: clienttoken, client:clientDetail, message: "Logged in successfully" }); // Changed user to client
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
