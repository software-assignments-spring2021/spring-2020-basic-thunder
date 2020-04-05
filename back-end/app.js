// database related
require("./db"); // schema
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Course = mongoose.model("Course");
const Post = mongoose.model("Post");
const Reply = mongoose.model("Reply");

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
const strategy = new JwtStrategy(jwtOptions,(jwt_payload,next)=>{
    //extract user from DB

    User.findOne({uid:jwt_payload.uid},(err,user)=>{
        if(err) {
            next(null,false);
        }
        else {
            next(null,user);
        }
    });
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

// note: testing code during development, no real use.
app.get("/verify-access-token",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const uid =  req.user.uid;
    res.send({uid:uid});
});

app.get("/my-courses",passport.authenticate('jwt',{session:false}),(req,res)=> {
    const user = req.user;
    res.send(
        {
            'courses': user['courses'],
            'role': user['role'],
        });
});

app.post("/create-courses",passport.authenticate('jwt',{session:false}),(req,res)=> {
    const user = req.user;
    if(user.role==='Instructor'&&req.body && req.body.course_name && req.body.term){
        new Course({
            creator_uid: user.uid,
            course_name:req.body.course_name,
            term:req.body.term,
            syllabus:null,
            list_of_posts:[],
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
                        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: '30m'}); //{expiresIn: 60}
                        res.json({"access-token": token});
                    }
                    // password do not match with the database record
                    else{
                        res.status(401).json({err_message:"incorrect email or password"});
                    }
                });
            }
        });
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
                                const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 60}); //{expiresIn: '30m'}
                                res.json({"access-token": token});
                            }
                        });
                    });
                }
            });
        }
    }
    else{
        res.status(401).json({err_message:"incomplete request (missing fields)"});
    }
});


// delete reply request
app.delete('/:courseId/Forum/:postId/post/:replyId/DeleteReply',(req,res)=>{
    const courseId = req.params.courseId;
    const postId = req.params.postId;
    const replyId = req.params.replyId;
    res.json(
        {
            'deleteSuccess':true,
        }
    )
});

// get Reply Post view
app.get('/:courseId/Forum/:postId/post/ReplyPost',(req,res)=>{
    const courseId = req.params.courseId;
    const postId = req.params.postId;

    res.json(
        {
            'postid': 1,
            'topic': "No graphs in output file?",
            'content': "I just got done with my job, and it does not look like the output file contains any graphs? \nOnly thing on there are my print statements.",
            "resolved": true,
            'replies': 2,
            "time": 1574313620213,
            "author": "Allan",
            "authorId": 2422,
        }
    );
});


// handle reply posts from Reply Post View
app.post('/:courseId/Forum/:postId/post/ReplyPost',(req,res)=>{
    const courseId = req.params.courseId;
    const postId = req.params.postId;

    res.json(
        {
            'postSuccess':true,
        }
    );
});


// post detail page
app.get('/:courseId/Forum/:postId/post',(req,res)=>{
    const courseId = req.params.courseId;
    const postId = req.params.postId;

    res.json(
        {
            'postid': 1,
            'topic': "No graphs in output file?",
            'content': "I just got done with my job, and it does not look like the output file contains any graphs? \nOnly thing on there are my print statements.",
            "resolved": true,
            'replies': 2,
            "time": 1574313620213,
            "author": "Allan",
            "authorId": 2422,
            'reply_details':[
                {
                    "has_voted": false,
                    "reply_id": 101,
                    "author":"Zeping Zhan",
                    "authorId":310,
                    "is_official_ans": true,
                    "time":1584329621216,
                    "up_vote":8,
                    "content":"It's essentially just a text file so you need to save the plot as a file."
                },
                {
                    "has_voted": true,
                    "reply_id": 132,
                    "author": "James",
                    "authorId": 201,
                    "is_official_ans": false,
                    "time": 1580300621000,
                    "up_vote": 23,
                    "content": "Try savefig() function",
                },
                {
                    "has_voted": false,
                    "reply_id": 210,
                    "author":"Anonymous",
                    "authorId": 472,
                    "is_official_ans":false,
                    "time": 1575300621000,
                    "up_vote": 1,
                    "content":"you should ask NYU hpc"
                },
            ],
        }
    );
});

// get create post data: course name and user name
app.get('/:courseId/Forum/CreatePost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    if(!isEnrolled(user,courseId)){
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
});

// handle user post
app.post('/:courseId/Forum/CreatePost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    if(!isEnrolled(user,courseId)){
        res.status(401).json({err_message:"unable to find the given course id"});
    }

    else if(!req.body || !req.body['title'] || !req.body['content'] ||!req.body['post_as']){
        console.log("test2");

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
        new Post({
            'topic':req.body.title,
            'content':req.body.content,
            "resolved":false,
            "replies":0,
            "time":Date.now(),
            "author": post_as,
            "uid": user.uid, // author id
            'reply_details':[],
        }).save((err,post)=>{
            if(err){
                // database error
                res.status(401).json({err_message:"document save error"});
            }
            else{
                res.json({'postid':post['post_id']});
            }
        });
    }
});

// forum view
app.get("/:courseId/Forum",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    if(!isEnrolled(user,courseId)){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Course.findOne({"course_id":courseId},(err,course)=> {
            res.json({
                'CourseName': course.course_name + " [" + course.term + "]",
                'ListOfPosts':course.list_of_posts,
            });
        });
        // res.json(
        //     {
        //         'CourseName': 'CS480 Computer Vision',
        //         'ListOfPosts': [
        //             {
        //                 'topic': 'No graphs in output file?',
        //                 'preview': 'I just got done with my job, and it does not look like the output file contains any graphs? Only thing on there are my pr',
        //                 'resolved': false,
        //                 'postid': 1,
        //                 'replies': 2
        //             },
        //             {
        //                 'topic': 'Understanding Learning Rate',
        //                 'preview': "I'm plotting accuracy and loss curves for each learning rate, and my graphs look a little unexpected (I might be nai",
        //                 'resolved': false,
        //                 'postid': 2,
        //                 'replies': 0
        //             },
        //             {
        //                 'topic': 'Prince Cluster Modules to Load',
        //                 'preview': "I've been getting erros with my python imports using the prince cluster for over an hour now. And at this point I am",
        //                 'resolved': true,
        //                 'postid': 3,
        //                 'replies': 2
        //
        //             },
        //             {
        //                 'topic': 'How to calculate loss for an epoch',
        //                 'preview': "One thing I am a little confused about is how to calculate the loss for each epoch. I calculate the loss on each sample",
        //                 'resolved': true,
        //                 'postid': 4,
        //                 'replies': 1
        //
        //             },
        //             {
        //                 'topic': "Clarification on part two's three different sets of hyperparameters",
        //                 'preview': "What does it mean by three sets of hyperparameters? If I choose three learning rate e.g. 0.5, 0.05 and 0.005, would this",
        //                 'resolved': true,
        //                 'postid': 5,
        //                 'replies': 3
        //
        //             },
        //             {
        //                 'topic': 'How to plot all learning rates on one plot',
        //                 'preview': "I've been getting erros with my python imports using the prince cluster for over an hour now. And at this point I am",
        //                 'resolved': true,
        //                 'postid': 6,
        //                 'replies': 4
        //             },
        //
        //         ],
        //     }
        // );
    }

});



app.get("/:courseId/Syllabus",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    // check if the user is in the class
    // invalid course id or user not in the class
    if(!isEnrolled(user,courseId)){
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
});



app.post("/:courseId/Syllabus",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    // check fields
    if(!req.body || !req.body.syllabus){
        res.status(401).json({err_message:"incomplete request (missing fields)"});
    }
    // check if the user is in the class
    // invalid course id or user not in the class
    else if(!isEnrolled(user,courseId)){
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
});


const isEnrolled = (user,course_id)=>{
    return user.courses.find(elem=>elem.course_id === course_id)!==undefined;
};

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

