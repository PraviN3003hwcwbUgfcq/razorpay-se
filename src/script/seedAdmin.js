const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connected");

    const email = "admin@test.com";
    const password = "123456";

    // check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true
    });

    console.log("Admin created successfully:");
    console.log({
      email: admin.email,
      password: password
    });

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();