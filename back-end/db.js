const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    "uid":{type: Number},
    "email": {type: String, unique:true, required: true},
    "firstname": {type:String,required:true},
    "lastname": {type:String,required:true},
    "password": {type: String, required: true},
    "role": {type:String,required:true}, // "Student" or "Instructor"
    "courses": [{"course_id":Number,"course_name":String}],
},{collection:'User'});

UserSchema.plugin(AutoIncrement, {inc_field: 'uid'});
mongoose.model('User', UserSchema);

const CourseSchema = new mongoose.Schema({
    "course_id":{type:Number},
    "course_name":{type:String,required:true},
    "term": {type:String,required:true},
    "syllabus":{type:String},
    "creator_uid":{type:Number,required:true},
    "list_of_posts":[
        {
            "topic":String,
            "preview":String,
            "resolved":Boolean,
            "post_id":Number,
            "replies":Number,
        }]
},{collection:'Course'});

CourseSchema.plugin(AutoIncrement, {inc_field: 'course_id'});
mongoose.model('Course', CourseSchema);

const PostSchema = new mongoose.Schema({
    "post_id":{type:Number,unique:true,required:true},
    'topic':{type:String,required:true},
    'content':{type:String,required:true},
    "resolved":{type:Boolean,required:true},
    "replies":{type:Number,required:true},
    "time":{type:Number,required:true},
    "author": {type:String,required:true},
    "uid": {type:Number,required:true}, // author id
    'reply_details':[{
        "reply_id":Number,
        "has_voted":Boolean,
        "uid":Number,
        "is_official_ans":Boolean,
        "time":Number,
        "up_vote":Number,
        "content":String
    }],
},{collection:'Post'});

PostSchema.plugin(AutoIncrement, {inc_field: 'post_id'});
mongoose.model('Post', PostSchema);

const ReplySchema = new mongoose.Schema({
    "reply_id":{type:Number,unique:true,required:true},
    "uid":{type:Number,required:true},
    "is_official_ans":{type:Boolean,required:true},
    "time":{type:Number,required:true},
    "up_vote":{type:Number,required:true},
    "content":{type:String},
},{collection:'Post'});

ReplySchema.plugin(AutoIncrement, {inc_field: 'reply_id'});
mongoose.model('Reply', ReplySchema);

mongoose.connect('mongodb://localhost/test');
