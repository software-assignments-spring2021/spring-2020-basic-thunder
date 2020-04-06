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
                                const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: '30m'}); //{expiresIn: '30m'}
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


app.get('/:courseId/course/:replyId/reply-detail',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const user = req.user;
    const replyId = parseInt(req.params.replyId);
    const courseId = parseInt(req.params.courseId);
    const enrolledData = isEnrolled(user,courseId);

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
});

// handle upvote
app.get('/:replyId/add-upvote',passport.authenticate('jwt',{session:false}),(req,res)=> {
    const user = req.user;
    const replyId = parseInt(req.params.replyId);
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
                        res.json({
                            upvote: reply.voter_uid.length,
                            hasVoted: true,
                        })
                    }
                });
            }
        }
    })
});

// handle cancel upvote
app.get('/:replyId/cancel-upvote',passport.authenticate('jwt',{session:false}),(req,res)=> {
    const user = req.user;
    const replyId = parseInt(req.params.replyId);
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
        }
    })
});

// get Reply Post view
app.get('/:courseId/Forum/:postId/post/ReplyPost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    const enrolledData = isEnrolled(user,courseId);

    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Post.findOne({post_id:postId},(err,post)=> {
            if(!post || err){
                console.log("unable to find the post");
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
});



// handle reply posts from Reply Post View
app.post('/:courseId/Forum/:postId/post/ReplyPost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
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
                console.log("unable to find the post");
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
});

// create a post preview for forum view
app.get("/:courseId/Forum/:postId/PostPreview",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    const enrolledData = isEnrolled(user,courseId);
    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Post.findOne({post_id:postId},(err,post)=> {
            if(!post || err || post.course_id!==courseId){
                console.log("unable to find the post");
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
});

// post detail page
app.get('/:courseId/Forum/:postId/post',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    const enrolledData = isEnrolled(user,courseId);
    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Post.findOne({post_id:postId},(err,post)=> {
            if(!post || err){
                console.log("unable to find the post");
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
});

// get create post data: course name and user name
app.get('/:courseId/Forum/CreatePost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
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
});

// handle user post
app.post('/:courseId/Forum/CreatePost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
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
});

// forum view
app.get("/:courseId/Forum",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    if(!isEnrolled(user,courseId)['isEnrolled']){
        console.log("this path");
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
});



app.get("/:courseId/Syllabus",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
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
});


const isEnrolled = (user,course_id)=>{
    const searchRes = user.courses.find(elem=>elem.course_id === course_id);
    if(searchRes === undefined){
        return {'isEnrolled':false,'courseName':null};
    }
    return {'isEnrolled':true,'courseName':searchRes['course_name']};
};

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

