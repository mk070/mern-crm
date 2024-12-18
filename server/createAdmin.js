const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { User } = require("./models/admin"); // Adjust the path if necessary

async function createAdminUser() {
    await mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const password = "admin";
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
        id: "admin01",
        name: "Admin User",
        email: "admin@gmail.com",
        password: hashedPassword,
        confirmpassword: hashedPassword,
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    mongoose.disconnect();
}

createAdminUser().catch(console.error);
