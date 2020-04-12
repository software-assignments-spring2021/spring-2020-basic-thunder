const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    "email": {type: String, unique:true, required: true},
    "firstname": {type:String,required:true},
    "lastname": {type:String,required:true},
    "password": {type: String, required: true},
    "role": {type:String,required:true}, // "Student" or "Instructor"
    "courses": [{courseId:String,courseName:String}],
},{collection:'User'});

mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost/test');
