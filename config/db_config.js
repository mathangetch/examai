const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/exaidb", {
}).then(() => {
     console.log('Connection successful!');
}).catch((e) => {
     console.log('Connection failed!');
})