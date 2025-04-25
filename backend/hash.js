import bcrypt from "bcrypt";

const password = "Nina80120+";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) throw err;
  console.log("Mot de passe haché :", hash);
});
