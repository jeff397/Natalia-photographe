import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/user.js"; // adapte le chemin si besoin

dotenv.config(); // pour utiliser MONGO_URI depuis ton .env

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = "jeffdelmotte@gmail.com";
    const plainPassword = "Teddy80120+";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Utilisateur déjà existant");
      await mongoose.disconnect();
      return;
    }

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ Utilisateur créé avec succès !");
    console.log(`Email : ${email}`);
    console.log(`Mot de passe : ${plainPassword}`);
  } catch (err) {
    console.error("❌ Erreur lors de la création :", err);
  } finally {
    await mongoose.disconnect();
  }
}

createUser();
