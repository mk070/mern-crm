const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const adminSchema = new mongoose.Schema({
    id:{type:String,required: true},
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	confirmpassword:{ type: String, required: true },
});

adminSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("admin", adminSchema);

const validate = (data) => {
	const schema = Joi.object({
        
		id: Joi.string().required().label("Id"),
		name: Joi.string().required().label("Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		confirmpassword:passwordComplexity().required().label("Confirm Password")
	});
	return schema.validate(data);
};

module.exports = { User, validate };
