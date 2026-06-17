import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.DB_URL);
} catch (err) {
  console.log(console.log(err));
}
