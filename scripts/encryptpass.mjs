import * as bcrypt from 'bcrypt';

const saltRounds = 10;
const plainTextPassword = 'admin';

bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);
    // Use this hash in the JSON document
  }
});