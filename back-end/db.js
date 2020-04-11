// const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);
//
// const UserSchema = new mongoose.Schema({
//     "uid":{type: Number},
//     "email": {type: String, unique:true, required: true},
//     "firstname": {type:String,required:true},
//     "lastname": {type:String,required:true},
//     "password": {type: String, required: true},
//     "role": {type:String,required:true}, // "Student" or "Instructor"
//     "courses": [{"course_id":Number,"course_name":String}],
// },{collection:'User'});
//
// UserSchema.plugin(AutoIncrement, {inc_field: 'uid'});
// mongoose.model('User', UserSchema);
//
// const CourseSchema = new mongoose.Schema({
//     "course_id":{type:Number},
//     "course_name":{type:String,required:true},
//     "term": {type:String,required:true},
//     "syllabus":{type:String},
//     "creator_uid":{type:Number,required:true},
//     "instructor_uids":[Number],
//     "list_of_posts":[
//         {
//             "post_id":Number,
//         }]
// },{collection:'Course'});
//
// CourseSchema.plugin(AutoIncrement, {inc_field: 'course_id'});
// mongoose.model('Course', CourseSchema);
//
// const PostSchema = new mongoose.Schema({
//     "post_id":{type:Number},
//     'topic':{type:String},
//     'content':{type:String},
//     "resolved":{type:Boolean},
//     "time":{type:Number},
//     "author": {type:String},
//     "uid": {type:Number}, // author id
//     "course_id":{type:Number}, // course id
//     "firstname":{type:String},
//     "lastname":{type:String},
//     'reply_details':[{
//         "reply_id":Number,
//         "is_official_ans":Boolean,
//         "upvote": Number,
//     }],
// },{collection:'Post'});
//
// PostSchema.plugin(AutoIncrement, {inc_field: 'post_id'});
// mongoose.model('Post', PostSchema);
//
// const ReplySchema = new mongoose.Schema({
//     "reply_id":{type:Number},
//     "post_id":{type:Number},
//     "firstname":{type:String}, // replier's first name
//     "lastname":{type:String}, // replier's last name
//     "author": {type:String}, // the author name that the replier wants to show other people.
//     "uid":{type:Number,required:true},
//     "is_official_ans":{type:Boolean,required:true},
//     "time":{type:Number,required:true},
//     "content":{type:String},
//     "voter_uid":[Number],
// },{collection:'Reply'});
//
// ReplySchema.plugin(AutoIncrement, {inc_field: 'reply_id'});
// mongoose.model('Reply', ReplySchema);
//
// mongoose.connect('mongodb://localhost/test');
