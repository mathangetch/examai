const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
   userEmail: {
      type: String,
      require: true
   },
   userPassword: {
      type: String,
      require: true
   }
})

const users = mongoose.model("users", userSchema);

module.exports = users;