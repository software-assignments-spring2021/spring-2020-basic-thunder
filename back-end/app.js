/*
// database related
// require("./db"); // schema
// const mongoose = require('mongoose');
// const User = mongoose.model('User');
// const Course = mongoose.model("Course");
// const Post = mongoose.model("Post");
// const Reply = mongoose.model("Reply");
*/

// hardcoded database (no real database involved)
// User Collection
// const User = [
//         {
//             "email": "o@o",
//             "firstname": "Jiaqi",
//             "lastname": "Liu",
//             "role": "Student",
//             "password": "ooo",
//             "uid": 2,
//             "courses": [{"course_id": 1, "course_name": "Agile"}],
//         },
//         {
//             "email": "p@p",
//             "firstname": "Amos",
//             "lastname": "Bloomberg",
//             "role": "Instructor",
//             "password": "ppp",
//             "uid": 1,
//             "courses": [{"course_id": 1, "course_name": "Agile"}],
//         }
//     ],

// const Courses = {
//     data: [
//         {
//             "course_id" : 1,
//             "instructor_uids" : [ 1 ],
//             "creator_uid" : 1,
//             "course_name" : "Agile",
//             "term" : "Spring 2020",
//             "syllabus" : null,
//             "list_of_posts" : [
//                 { "post_id" : 1 },
//                 { "post_id" : 2 },
//                 {"post_id" : 3 },
//                 {"post_id" : 4 },
//                 { "post_id" : 5 }
//             ],
//         }
//     ],
//     findOne(queryWithOneProp,cb){
//         for(const prop in queryWithOneProp){
//             const res = this.data.find(e=>e[prop]===queryWithOneProp[prop]);
//             if(res !== undefined) return cb(null,res);
//             else return cb({"err_msg":'obj not find'},undefined);
//         }
//     }
// };

// configuration secrets
require('dotenv').config();

// authentication related
// Note: we are going to use JWT (json web token) to perform authentication
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const jwtOptions = {
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY,
};

//temp code begin
let course_id_counter = 1;
const User = [
    {
    "email": "p@p",
    "firstname": "Amos",
    "lastname": "Bloomberg",
    "role": "Instructor",
    "password": "ppp",
    "uid": 1,
    "courses": [
        {"course_id": 1, "course_name": "Agile"},
    ]},
    {
        "email": "o@o",
        "firstname": "Jiaqi",
        "lastname": "Liu",
        "role": "Student",
        "password": "ooo",
        "uid": 2,
        "courses": [
            {"course_id": 1, "course_name": "Agile"},
        ]},
    ];

const Course =[
    {
        "instructor_uids" : [ 1 ],
        "creator_uid" : 1,
        "course_name" : "Agile",
        "term" : "Spring 2020",
        "syllabus" : null,
        "list_of_posts" : [ { "post_id" : 1 }, {"post_id" : 2 }, {"post_id" : 3 }, {"post_id" : 4 }, {"post_id" : 5 } ],
        "course_id" : 1
    }];

const post = [
    { "topic" : "sad s adsad ", "content" : "sad sad sa ", "resolved" : true, "time" : 1586198271976, "author" : "Anonymous to Classmates", "uid" : 50, "course_id" : 1, "reply_details" : [ { "reply_id" : 1, "is_official_ans" : false, "upvote" : 0 }, { "reply_id" : 2, "is_official_ans" : false, "upvote" : 1 }, {"reply_id" : 4, "is_official_ans" : true, "upvote" : 0 } ], "firstname" : "Chenyu", "lastname" : "Liu", "post_id" : 1 },
    {  "topic" : "asdsadasdsa", "content" : "v21savd", "resolved" : true, "time" : 1586198871973, "author" : "Anonymous to Everyone", "uid" : 50, "course_id" : 1, "reply_details" : [ { "reply_id" : 3, "is_official_ans" : true, "upvote" : 0 } ], "firstname" : "Chenyu", "lastname" : "Liu", "post_id" : 2 },
    { "topic" : "sadjksjahk jdsjahjk as", "content" : "kjsjkaljdkl jsalkjd skaj jsa lkjdl sa", "resolved" : false, "time" : 1586198997223, "author" : "Chenyu Liu", "uid" : 50, "course_id" : 1, "reply_details" : [ ], "firstname" : "Chenyu", "lastname" : "Liu", "post_id" : 3},
    {  "topic" : "asdkjsad", "content" : "dkslajdklasd sad sadasda", "resolved" : false, "time" : 1586405507913, "author" : "Anonymous to Classmates", "uid" : 50, "course_id" : 1, "reply_details" : [ ], "firstname" : "Chenyu", "lastname" : "Liu", "post_id" : 4},
    { "topic" : "sadasdasd sa", "content" : "asd sad asd", "resolved" : false, "time" : 1586405521879, "author" : "Anonymous to Everyone", "uid" : 50, "course_id" : 1, "reply_details" : [ ], "firstname" : "Chenyu", "lastname" : "Liu", "post_id" : 5},
];

const reply = [
    { "voter_uid" : [ ], "author" : "Anonymous to Classmates", "post_id" : 1, "uid" : 50, "is_official_ans" : false, "time" : 1586198296486, "content" : "sxzc,mzxcskd lsajd sad", "firstname" : "Chenyu", "lastname" : "Liu", "reply_id" : 1},
    { "voter_uid" : [ 1 ], "author" : "Anonymous to Everyone", "post_id" : 1, "uid" : 50, "is_official_ans" : false, "time" : 1586198311332, "content" : "version 222222222", "firstname" : "Chenyu", "lastname" : "Liu", "reply_id" : 2},
    { "voter_uid" : [ ], "author" : "Jiaqi Liu", "post_id" : 2, "uid" : 1, "is_official_ans" : true, "time" : 1586198909390, "content" : "iijidhasdsadasdsacxzc", "firstname" : "Jiaqi", "lastname" : "Liu", "reply_id" : 3},
    { "voter_uid" : [ ], "author" : "Jiaqi Liu", "post_id" : 1, "uid" : 1, "is_official_ans" : true, "time" : 1586198930648, "content" : "xskdsld jsakjdlk ", "firstname" : "Jiaqi", "lastname" : "Liu", "reply_id" : 4},
    { "voter_uid" : [ ], "author" : "Jiaqi Liu", "post_id" : 1, "uid" : 1, "is_official_ans" : true, "time" : 1586625700825, "content" : "ok", "firstname" : "Jiaqi", "lastname" : "Liu", "reply_id" : 8}];
// temep code end

const strategy = new JwtStrategy(jwtOptions,(jwt_payload,next)=>{
    //extract user from DB
    // temp code begin
    const u = User.find(e=>e.uid === jwt_payload.uid);
    if(u)
        next(null,u);
    else
        next(null,false);

    // temp code end
    /*
    // preserve for future use
    User.findOne({uid:jwt_payload.uid},(err,user)=>{
        if(err) {
            next(null,false);
        }
        else {
            next(null,user);
        }
    });
    // preserve for future use
    */
});
passport.use(strategy);
const bcrypt = require('bcryptjs'); // password encryption and decryption


// express related
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');

// middleware begin
const allowedOrigins = ['http://localhost:3000','http://127.0.0.1:3000'];

app.use(
    cors({
        origin: (origin, cb)=>{
            // allow requests with no origin
            if(!origin) return cb(null, true);
            if(allowedOrigins.indexOf(origin) === -1){
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return cb(new Error(msg), false);
            }
            return cb(null, true);
        }
    })
);

app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// middleware end

app.get("/my-courses",passport.authenticate('jwt',{session:false}),(req,res)=> {
    const user = req.user;

    // temp code begin
    res.send(
        {
            'courses': user['courses'],
            'role': user['role'],
        });

    // temp code end

    /*
    // - - preserved for future use - -
    res.send(
        {
            'courses': user['courses'],
            'role': user['role'],
        });
    // - - preserved for future use - -
    */
});

app.post("/create-courses",passport.authenticate('jwt',{session:false}),(req,res)=> {
    const user = req.user;
    if(user.role==='Instructor'&&req.body && req.body.course_name && req.body.term){
        // temp code begin

        user['courses'].push({"course_id": ++course_id_counter, "course_name": req.body.course_name},);
        res.json({"message":"success"});

        // temp code end

        /*
        // - - preserved for future use - -
        new Course({
            creator_uid: user.uid,
            firstname:user.firstname,
            lastnname:user.lastname,
            course_name:req.body.course_name,
            term:req.body.term,
            syllabus:null,
            list_of_posts:[],
            instructor_uids:[user.uid]
        }).save((err,course,count)=>{
            if(err){
                // database error
                res.status(401).json({err_message:"document save error"});
            }
            else{
                // add course to current instructor's field
                user['courses'].push({
                        "course_id":course['course_id'],
                        "course_name":course['course_name'],
                    });
                user.save((err)=>{
                    if(err){
                        res.status(401).json({err_message:"document save error"});
                    }
                    else{
                        res.json({"message":"success"});
                    }
                });
            }
        });
        // - - preserved for future use - -
        */
    }
    else{
        res.status(401).json({err_message:"you are not an instructor or incomplete request (missing fields)"})
    }
});

// login
app.post("/login", (req, res)=>{
    if(req.body && req.body.email && req.body.password){
        const email = req.body.email;
        const password = req.body.password;

        // temp code begin
        if ((email === 'p@p' && password === 'ppp') || (email==='o@o' && password==='ooo') ){
            let payload = {uid:2};
            if (email === 'p@p'){
                payload = {uid:1};
            }
            const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: '7d'}); //{expiresIn: 60} 30m
            res.json({"access-token": token});
        }

        else{
            res.status(401).json({err_message:"incorrect email or password"});
        }
        // temp code end

        /*
        // - - preserved for future use - -
        const user = User.findOne({"email":email},(err,user,count)=>{
            // user not found
            if(!user){
                res.status(401).json({err_message:"no such user found"});
            }
            // no error, user found
            else if(!err && user){
                bcrypt.compare(password, user.password, (err, passwordMatch) => {
                    // correct password, issue access token
                    if(passwordMatch===true){
                        const payload = {
                            "uid": user.uid,
                        };
                        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: '7d'}); //{expiresIn: 60} 30m
                        res.json({"access-token": token});
                    }
                    // password do not match with the database record
                    else{
                        res.status(401).json({err_message:"incorrect email or password"});
                    }
                });
            }
        });
        // - - preserved for future use - -
        */

    }
    else{
        res.status(401).json({err_message:"request does not contain email or password."});
    }
});

// register
app.post("/register", (req, res)=> {
    if(req.body&&req.body.email&&req.body.password&&req.body.firstname&&req.body.lastname&&req.body.role){
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const role = req.body.role;

        if (!(email.length>=3) || !(password.length>=3)){
            res.status(401).json({err_message:"email or password is too short"});
        }
        else{
            // temp code begin
            let payload = {uid:2};
            if(role === 'Instructor'){
                payload = {uid:1};
            }
            const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: '7d'}); //{expiresIn: '30m'}
            res.json({"access-token": token});
            // temp code end

            /*
            // - - preserved for future use - -
            const user_obj = {email:email};
            User.findOne(user_obj,(err,result)=>{
                if(result){
                    res.status(401).json({err_message:"email already exist"});
                }
                else{
                    const saltRounds = 10;
                    bcrypt.hash(password,saltRounds,(err,hash)=>{
                        new User({
                            email: email,
                            firstname: firstname,
                            lastname: lastname,
                            role: role,
                            password: hash,
                            courses: [],
                        }).save((err,user,count)=>{
                            if(err){
                                // database error
                                res.status(401).json({err_message:"document save error"});
                            }
                            else{
                                // registration complete: issue payload to user
                                const payload = {
                                    "uid": user.uid,
                                };
                                const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: '7d'}); //{expiresIn: '30m'}
                                res.json({"access-token": token});
                            }
                        });
                    });
                }
            });
            // - - preserved for future use - -
            */
        }
    }
    else{
        res.status(401).json({err_message:"incomplete request (missing fields)"});
    }
});


// delete reply request
app.delete('/:courseId/Forum/:postId/post/:replyId/DeleteReply',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const postId = parseInt(req.params.postId);
    const replyId = parseInt(req.params.replyId);
    const user = req.user;

    // temp code begin

    if(user.role !== 'Student'){
        res.json({
            'deleteSuccess':true
        })
    }
    else{
        res.json({
            'deleteSuccess':false
        })
    }
    // temp code end

    /*
    // preserved for future use
    const enrolledData = isEnrolled(user,courseId);
    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Post.findOne({post_id:postId},(err,post)=>{
           if(err || !post || !(post.reply_details.find(elem=>elem.reply_id === replyId))){
               res.status(401).json({err_message:"unable to find the given post id"});
           }
           else{
               Reply.findOneAndDelete({reply_id:replyId},(err)=>{
                   if(err){
                       console.log(err);
                       res.status(401).json({err_message:"database error (reply collection)"});
                   }
                   else{
                       post.reply_details = post.reply_details.filter(elem=>elem.reply_id!==replyId);
                       post.save((err)=>{
                           res.json({
                               'deleteSuccess':true
                           })
                       });
                   }
               })
           }
        });
    }
    // preserved for future use
    */
});


app.get('/:courseId/course/:replyId/reply-detail',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const user = req.user;
    const replyId = parseInt(req.params.replyId);
    const courseId = parseInt(req.params.courseId);

    // temp code begin

    const ins_mode = user.uid === 1;
    const r = reply.find(e=>e.reply_id === replyId);
    res.json({
        has_voted: r.voter_uid.indexOf(user.uid) !== -1,
        instructor_mode: ins_mode,
        upvote_count: r.voter_uid.length,
        is_my_reply: r.uid === user.uid,
        time: r.time,
        content: r.content,
        author:"Anonymous to Everyone",
    });
    // temp code end

    /*
    const enrolledData = isEnrolled(user,courseId);

    // preserved for future use
    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Course.findOne({"course_id":courseId},(err,course)=>{

            Reply.findOne({"reply_id":replyId},(err,reply)=> {
                if(!reply){
                    res.status(401).json({err_messagee:"reply do not exist"});
                }
                else{
                    const ins_mode = course.instructor_uids.indexOf(user.uid)!==-1;
                    let author_name = reply.author;
                    if(ins_mode && reply.author === 'Anonymous to Classmates'){
                        author_name += " (" + reply.firstname + " " + reply.lastname + ")";
                    }
                    else if(reply.uid===user.uid){
                        author_name += " (me)"
                    }
                    res.json({
                        has_voted: reply.voter_uid.indexOf(user.uid) !== -1,
                        instructor_mode: ins_mode,
                        upvote_count: reply.voter_uid.length,
                        is_my_reply: reply.uid === user.uid,
                        time: reply.time,
                        content: reply.content,
                        author:author_name,
                    })
                }
            });
        });
    }
    // preserved for future use
    */
});

// handle upvote
app.get('/:replyId/add-upvote',passport.authenticate('jwt',{session:false}),(req,res)=> {
    const user = req.user;
    const replyId = parseInt(req.params.replyId);
    const r = reply.find(e=>e.reply_id === replyId);
    if (r.voter_uid.indexOf(user.uid) === -1){
        r.voter_uid.push(user.uid);
    }
    res.json({
        upvote: r.voter_uid.length,
        hasVoted: true,
    });
    /*
    // preserved for future
    Reply.findOne({reply_id:replyId},(err,reply)=>{
        if(!reply || err){
            res.status(401).json({err_meessage:"reply not found!"})
        }
        else{
            if (reply.voter_uid.indexOf(user.uid) !== -1){
                res.json({
                    upvote: reply.voter_uid.length,
                    hasVoted: true,
                })
            }
            else{
                reply.voter_uid.push(user.uid);
                reply.save((err)=>{
                    if(err){
                        res.status(401).json({err_message:"document save error"});
                    }
                    else{
                        Post.findOne({post_id:reply.post_id},(err,post)=>{
                            ++(post['reply_details'].find(elem=>elem.reply_id === reply.reply_id)['upvote']);
                            post.save((err)=>{
                                if(err){
                                    res.status(401).json({err_message:"document save error"});
                                }
                                else{
                                    res.json({
                                        upvote: reply.voter_uid.length,
                                        hasVoted: true,
                                    })
                                }
                            });
                        });
                    }
                });
            }
        }
    })
    // preserved for future
    */
});

// handle cancel upvote
app.get('/:replyId/cancel-upvote',passport.authenticate('jwt',{session:false}),(req,res)=> {
    const user = req.user;
    const replyId = parseInt(req.params.replyId);

    // temp begin
    const r = reply.find(e=>e.reply_id === replyId);
    const index = r.voter_uid.indexOf(user.uid);
    r.voter_uid.splice(index,1);
    res.json({
        upvote: r.voter_uid.length,
        hasVoted: false,
    })
    // temp end
    /*
    // preserved for future
    Reply.findOne({reply_id:replyId},(err,reply)=>{
        if(!reply || err){
            res.status(401).json({err_meessage:"reply not found!"})
        }
        else{
            const index = reply.voter_uid.indexOf(user.uid);
            if (index === -1){
                res.json({
                    upvote: reply.voter_uid.length,
                    hasVoted: false,
                })
            }
            else{
                Post.findOne({post_id:reply.post_id},(err,post)=>{
                    --(post['reply_details'].find(elem=>elem.reply_id === reply.reply_id)['upvote']);
                    post.save((err)=>{
                        if(err){
                            res.status(401).json({err_message:"document save error"});
                        }
                        else{
                            reply.voter_uid.splice(index,1);
                            reply.save((err)=>{
                                if(err){
                                    res.status(401).json({err_message:"document save error"});
                                }
                                else{
                                    res.json({
                                        upvote: reply.voter_uid.length,
                                        hasVoted: false,
                                    })
                                }
                            });
                        }
                    });
                });
            }
        }
    })
    // preserved for future
    */
});

// get Reply Post view
app.get('/:courseId/Forum/:postId/post/ReplyPost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;

    // temp begin
    const c = Course.find(e=>e.course_id === courseId);
    const p = post.find(e=>e.post_id === postId);

    res.json(
        {
            'is_instructor': c.instructor_uids.indexOf(user.uid)!==-1,
            'CourseName': c['course_name'],
            'author_name': user.firstname + " " + user.lastname,
            'postid': p.post_id,
            'topic': p.topic,
            'content': p.content,
            "resolved": p.resolved,
            'replies': p.reply_details.length,
            "time": p.time,
            "author": p.author,
            "authorId": user.uid,
        });
    // temp end

    /*
    // -- preserved from future use
    const enrolledData = isEnrolled(user,courseId);

    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Post.findOne({post_id:postId},(err,post)=> {
            if(!post || err){
                res.status(401).json({err_message:"unable to find the post"});
            }
            else{
                Course.findOne({course_id:courseId},(err,course)=> {
                    res.json(
                        {
                            'is_instructor': course.instructor_uids.indexOf(user.uid)!==-1,
                            'CourseName': enrolledData['courseName'],
                            'author_name': user.firstname + " " + user.lastname,
                            'postid': post.post_id,
                            'topic': post.topic,
                            'content': post.content,
                            "resolved": post.resolved,
                            'replies': post.reply_details.length,
                            "time": post.time,
                            "author": post.author,
                            "authorId": user.uid,
                        }
                    )
                });
            }
        });
    }
    // -- preserved from future use
    */
});



// handle reply posts from Reply Post View
app.post('/:courseId/Forum/:postId/post/ReplyPost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;

    // temp begin
    res.json({"message":"success"});
    // temp end
    /*
    // preserved for future use
    const enrolledData = isEnrolled(user,courseId);
    if(!req.body||!req.body.reply||!req.body.post_as){
        res.status(401).json({err_message:"incomplete request (missing fields)"});
    }
    else if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else {
        Post.findOne({post_id: postId}, (err, post) => {
            if (!post || err) {
                res.status(401).json({err_message: "unable to find the post"});
            }
            else{
                Course.findOne({course_id:courseId},(err,course)=>{
                    const is_official_ans = course.instructor_uids.indexOf(user.uid)!==-1;
                    let author_name = req.body.post_as;
                    if(is_official_ans){
                        author_name = user.firstname + " " + user.lastname;
                    }
                    new Reply({
                        "author": author_name,
                        "post_id":post.post_id,
                        "uid":user.uid,
                        "is_official_ans":is_official_ans,
                        "time":Date.now(),
                        "content":req.body.reply,
                        "firstname":user.firstname,
                        "lastname":user.lastname,
                        'voter_uid':[],
                    }).save((err,reply)=>{
                        if(err){
                            // database error
                            res.status(401).json({err_message:"document save error"});
                        }
                        else{
                            post['reply_details'].push({
                                "reply_id":reply["reply_id"],
                                "is_official_ans":reply['is_official_ans'],
                                "upvote":reply['voter_uid'].length
                            });
                            if(reply['is_official_ans']){
                                post['resolved'] = true;
                            }
                            post.save();
                            res.json({"message":"success"});
                        }
                    });
                });
            }
        });
    }
    // preserved for future use
    */
});

// create a post preview for forum view
app.get("/:courseId/Forum/:postId/PostPreview",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    // temp begin
    let preview = post[postId-1].content.replace(/(\r\n|\n|\r|\t)/gm, "");
    if(preview.length > 122){
        preview = preview.slice(0,122);
    }
    res.json(
        {
            'preview':preview,
            'topic': post[postId-1].topic,
            "resolved": post[postId-1].resolved,
            'replies': post[postId-1].reply_details.length,
        }
    );
    // temp end
    /*
    // preserved for future use
    const enrolledData = isEnrolled(user,courseId);
    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Post.findOne({post_id:postId},(err,post)=> {
            if(!post || err || post.course_id!==courseId){
                res.status(401).json({err_message:"unable to find the post"});
            }
            else{
                let preview = post.content.replace(/(\r\n|\n|\r|\t)/gm, "");
                if(preview.length > 122){
                    preview = preview.slice(0,122);
                }
                res.json(
                    {
                        'preview':preview,
                        'topic': post.topic,
                        "resolved": post.resolved,
                        'replies': post.reply_details.length,
                    }
                )
            }
        });
    }
    // preserved for future use
    */
});

// post detail page
app.get('/:courseId/Forum/:postId/post',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    // temp begin
    const p = post.find(e=>e.post_id === postId);
    res.json(
        {
            'CourseName':"Agile [Spring 2020]",
            'postid': p.post_id,
            'topic': p.topic,
            'content': p.content,
            "resolved": p.resolved,
            'replies': p.reply_details.length,
            "time": p.time,
            "author": "John Doe",
            "authorId": p.uid,
            'reply_details':p['reply_details'],
            'myId':user.uid,
        });
    // temp end
    /*
    // preserved for future use
    const enrolledData = isEnrolled(user,courseId);
    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Post.findOne({post_id:postId},(err,post)=> {
            if(!post || err){
                res.status(401).json({err_message:"unable to find the post"});
            }
            else{
                let author_name = post.author;
                if(post.author !== 'Anonymous to Classmates'){
                    if(post.uid === user.uid){
                        author_name += " (me)";
                    }
                    res.json(
                        {
                            'CourseName':enrolledData['courseName'],
                            'postid': post.post_id,
                            'topic': post.topic,
                            'content': post.content,
                            "resolved": post.resolved,
                            'replies': post.reply_details.length,
                            "time": post.time,
                            "author": author_name,
                            "authorId": post.uid,
                            'reply_details':post['reply_details'],
                            'myId':user.uid,
                        }
                    )
                }
                else{
                    Course.findOne({course_id:courseId},(err,course)=>{
                        if (course.instructor_uids.indexOf(user.uid)!==-1){
                            author_name += " (" + post.firstname + " " + post.lastname + ")";
                        }
                        else if(post.uid === user.uid){
                            author_name += " (me)";
                        }
                        res.json(
                            {
                                'CourseName':enrolledData['courseName'],
                                'postid': post.post_id,
                                'topic': post.topic,
                                'content': post.content,
                                "resolved": post.resolved,
                                'replies': post.reply_details.length,
                                "time": post.time,
                                "author": author_name,
                                "authorId": post.uid,
                                'reply_details':post['reply_details'],
                                'myId':user.uid,
                            }
                        )
                    });
                }
            }
        });
    }
    // preserved for future use
    */
});

// get create post data: course name and user name
app.get('/:courseId/Forum/CreatePost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    // temp start
    res.json({
        'course_name': "Agile [Spring 2020]",
        'username':user.firstname + ' ' + user.lastname,
    });
    // temp end

    /*
    // -- preserved for later
    if(!isEnrolled(user,courseId)['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Course.findOne({"course_id":courseId},(err,course)=> {
            res.json({
                'course_name': course.course_name + " [" + course.term + "]",
                'username':user.firstname + ' ' + user.lastname,
            });
        });
    }
    // -- preserved for later
    */
});

// handle user post
app.post('/:courseId/Forum/CreatePost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    res.json({'postid':5});
    /*
    // -- preserved for later
    if(!isEnrolled(user,courseId)['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else if(!req.body || !req.body['title'] || !req.body['content'] ||!req.body['post_as']){
        res.status(401).json({err_message:"missing fields"})
    }
    else{
        let post_as = null;
        if (req.body.post_as !== 'Anonymous to Classmates' && req.body.post_as !== 'Anonymous to Everyone'){
            post_as = user.firstname + ' ' + user.lastname;
        }
        else{
            post_as = req.body.post_as;
        }
        const new_post = new Post({
            'topic':req.body.title,
            'content':req.body.content,
            "resolved":false,
            "replies":0,
            "time":Date.now(),
            "author": post_as,
            "uid": user.uid, // author id
            'course_id':courseId,
            'reply_details':[],
            "firstname":user.firstname,
            "lastname":user.lastname,
        });

        new_post.save((err,post)=>{
            if(err){
                // database error
                res.status(401).json({err_message:"document save error"});
            }
            else{
                Course.findOne({"course_id":courseId},(err,course)=> {
                    let preview = post.content;
                    if(preview.length > 122){
                        preview = preview.slice(0,122);
                    }
                    course.list_of_posts.push(
                        {
                            "topic":post.topic,
                            "preview":preview,
                            "resolved":post.resolved,
                            "post_id":post.post_id,
                            "replies":post.reply_details.length,
                        }
                    );
                    course.save((err)=>{
                        res.json({'postid':post['post_id']});
                    });

                });
            }
        });
    }
    // -- preserved for later
    */
});

// forum view
app.get("/:courseId/Forum",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    // temp begin

    const course = Course[0];
    res.json({
        'CourseName': course.course_name + " [" + course.term + "]",
        'ListOfPosts':course.list_of_posts,
    });

    // temp end
    // preserved for future
    /*
    if(!isEnrolled(user,courseId)['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Course.findOne({"course_id":courseId},(err,course)=> {
            res.json({
                'CourseName': course.course_name + " [" + course.term + "]",
                'ListOfPosts':course.list_of_posts,
            });
        });
    }
    // preserved for future
    */
});



app.get("/:courseId/Syllabus",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    // tmep code begin

    const course = Course.find(e=>e.course_id === courseId);
    res.json(
        {
            'courseId':course.course_id,
            'courseName':course.course_name + " [" + course.term + "]",
            'syllabus':course.syllabus,
            'isInstructor':course.creator_uid === user.uid,
        });


    // temp code end
    /*
    // - - preserved for future
    // check if the user is in the class
    // invalid course id or user not in the class
    if(!isEnrolled(user,courseId)['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Course.findOne({"course_id":courseId},(err,course)=> {
            res.json(
                {
                    'courseId':course.course_id,
                    'courseName':course.course_name + " [" + course.term + "]",
                    'syllabus':course.syllabus,
                    'isInstructor':course.creator_uid === user.uid,
                }
            )
        });
    }
    // - - preserved for future
    */
});



app.post("/:courseId/Syllabus",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    // check fields
    if(!req.body || !req.body.syllabus){
        res.status(401).json({err_message:"incomplete request (missing fields)"});
    }
    // temp begin
    course.syllabus = req.body.syllabus;
    res.json({'message':'success'});
    // temp end

    /*
    // - - preserved for future
    // check if the user is in the class
    // invalid course id or user not in the class
    else if(!isEnrolled(user,courseId)['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Course.findOne({"course_id":courseId},(err,course)=> {
            if(course['creator_uid'] !== user.uid){
                res.status(401).json({err_message:"only the creator of this course can modify syllabus"});
            }
            else{
                course.syllabus = req.body.syllabus;
                course.save((err)=>{
                    if(err){
                        // database error
                        res.status(401).json({err_message:"document save error"});
                    }
                    else{
                        res.json({'message':'success'});
                    }
                })
            }
        });
    }
    // - - preserved for future
    */
});

// preserved for future use
/*
const isEnrolled = (user,course_id)=>{
    const searchRes = user.courses.find(elem=>elem.course_id === course_id);
    if(searchRes === undefined){
    return {'isEnrolled':false,'courseName':null};
    }
    return {'isEnrolled':true,'courseName':searchRes['course_name']};
};
// preserved for future use
*/


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

