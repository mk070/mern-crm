const router = require("express").Router();
const { Client, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const client = await Client.findOne({ email: req.body.email });
		if (client)
			return res
				.status(409)
				.send({ message: "Client with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new Client({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "Client created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


  module.exports = router;


