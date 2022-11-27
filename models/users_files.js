const mongoose = require('mongoose');
const users_file = mongoose.Schema({
   id: {
      type: String,
      require: true
   },
   file_name: {
      type: String,
      require: true
   },
   file_size: {
      type: String,
      require: true
   },
   file_path: {
      type: String,
      require: true
   }
})

const file_model = mongoose.model("users_file", users_file);

module.exports = file_model;