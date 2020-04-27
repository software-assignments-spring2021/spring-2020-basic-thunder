// configuration secrets
require('dotenv').config();

// database related
require("./db"); // schema
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Course = mongoose.model("Course");
const Post = mongoose.model("Post");
const Reply = mongoose.model("Reply");
const Schedule = mongoose.model("Schedule");
const ScheduleDay = mongoose.model("ScheduleDay");

// configuration secrets
require('dotenv').config();

// nodemailer
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PW
    }
})

mongoose.set('useFindAndModify', false)

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

// business logic
const Biz = require('./lib');

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
    if(Biz.postCreateCourseFieldCheck(user,req)){
        new Course({
            creator_uid: user.uid,
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
                        // res.json({"message":"success"});
                        //Chris's creating new schema
                        new Schedule({
                            course_id: course['course_id'],
                            course_name: course['course_name']
                        }).save((err2,schedule,ct)=>{
                            if(err2){
                                res.status(401).json({err_message:"schedule save error"});
                            }
                            else{
                                res.json({"message":"success"});
                            }
                        });
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
    if(Biz.postLoginFieldCheck(req)){
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
                                const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: '7d'}); //{expiresIn: '30m'}
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
app.delete('/:courseId/Forum/:postId/post/:replyId/DeleteReply',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const postId = parseInt(req.params.postId);
    const replyId = parseInt(req.params.replyId);
    const user = req.user;
    const enrolledData = Biz.isEnrolled(user,courseId);
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
});


app.get('/:courseId/course/:replyId/reply-detail',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const user = req.user;
    const replyId = parseInt(req.params.replyId);
    const courseId = parseInt(req.params.courseId);
    const enrolledData = Biz.isEnrolled(user,courseId);

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
                    const [author_name,ins_mode] = Biz.getAutherNameAndSetMode(course,reply,user);
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
            if (Biz.hasVoted(reply,user)){
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
            const index = Biz.voterIndex(reply,user);
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
                            Biz.removeVoterUid(reply,index);
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
});

// get Reply Post view
app.get('/:courseId/Forum/:postId/post/ReplyPost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    const enrolledData = Biz.isEnrolled(user,courseId);

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
});



// handle reply posts from Reply Post View
app.post('/:courseId/Forum/:postId/post/ReplyPost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const postId = parseInt(req.params.postId);
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    const enrolledData = Biz.isEnrolled(user,courseId);
    if(Biz.replyPostFieldCheck(req)){
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
                    const is_official_ans = Biz.isInstructor(course,user);
                    const author_name = Biz.getReplyPostAuthorName(req,user,is_official_ans);

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
                            post.save((err)=>{
                                res.json({"message":"success"});
                            });
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
    const enrolledData = Biz.isEnrolled(user,courseId);
    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message:"unable to find the given course id"});
    }
    else{
        Post.findOne({post_id:postId},(err,post)=> {
            if(!post || err || post.course_id!==courseId){
                res.status(401).json({err_message:"unable to find the post"});
            }
            else{
                const preview = Biz.generatePostPreview(post);
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
    const enrolledData = Biz.isEnrolled(user,courseId);
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
});

// get create post data: course name and user name
app.get('/:courseId/Forum/CreatePost',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    if(!Biz.isEnrolled(user,courseId)['isEnrolled']){
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
    if(!Biz.isEnrolled(user,courseId)['isEnrolled']){
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
    if(!Biz.isEnrolled(user,courseId)['isEnrolled']){
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

// Schedule view
app.get("/:courseId/Schedule",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;

    if (!Biz.isEnrolled(user,courseId)['isEnrolled']){
        res.status(401).json({err_message: 'unable to find the given course id'})
    } else {
        Schedule.findOne({"course_id":courseId},(err,schedule)=> {
            if(err){
                res.status(401).json({err_message:"unable to find the schedule for the given course id"});
            }
            else{
                Course.findOne({"course_id":courseId},(err2,course)=>{
                    if(err2){
                        res.status(401).json({err_message:"unable to find the course on the schedule view"})
                    }
                    res.json(
                        {
                            "scheduleId":schedule.schedule_id,
                            "courseId": schedule.schedule_id,
                            "courseName":schedule.course_name,
                            "isInstructor": course.creator_uid === user.uid
                        })
                })
            }
        });
    }
});

app.get("/:courseId/Schedule/:scheduleId",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const schedule_id = req.params.scheduleId

    ScheduleDay.find({"schedule_id":schedule_id}, (err,scheduleDay)=>{
        if(err){
            res.status(401).json({err_message:"unable to find the dates for the given schedule id"});
        }
        else{
            let arr = []
            for(let i = 0; i < scheduleDay.length; i++){
                arr.push({
                    "schedule_id":scheduleDay[i].schedule_id,
                    "date":scheduleDay[i].date,
                    "topic":scheduleDay[i].topic,
                    "notes":scheduleDay[i].notes,
                    "assignment":scheduleDay[i].assignment,
                });
            }
            res.json({arr})
        }
    })
});

app.post("/:courseId/Schedule/:scheduleId",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const schedule_id = req.params.scheduleId
    const user = req.user;

    new ScheduleDay({
        schedule_id: schedule_id,
        date: req.body.date,
        topic: req.body.topic,
        notes: req.body.notes,
        assignment: req.body.assignment
    }).save((err,scheduleDay)=>{
        if(err){
            res.status(400).json({err_message:"date info save error"})
        }
        else{
            res.json({"message":"success"});
        }
    });
});

app.delete("/:courseId/Schedule/:scheduleId/Delete/:date",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const schedule_id = req.params.scheduleId
    const courseId = req.params.courseId
    const date = req.params.date

    console.log(schedule_id)
    console.log(courseId)
    console.log(date)

    console.log("Hey man I want to delete something")
    ScheduleDay.findOneAndDelete({"schedule_id":schedule_id, "date":date}, (err,scheduleDay)=>{
        if(err){
            res.status(401).json({err_message:"Could not delete file"})
            console.log(err)
        }
        else{
            console.log(scheduleDay)
            console.log("Match found?")
            res.json({"message":"success"})
        }
    })
});

app.put("/:courseId/Schedule/:scheduleId",passport.authenticate('jwt',{session:false}),(req,res)=>{
    console.log("Actually entered here. The PUT route that is")
    const schedule_id = req.params.scheduleId
    const user = req.user;

    ScheduleDay.findOne({"date": req.body.date}, (error, scheduleDay)=>{
        if(error){
            res.status(401).json({err_message: "Does not have access to update"})
        }
        else{
            if(scheduleDay === null){
                new ScheduleDay({
                    schedule_id: schedule_id,
                    date: req.body.date,
                    topic: req.body.topic,
                    notes: req.body.notes,
                    assignment: req.body.assignment
                }).save((err,scheduleDay)=>{
                    if(err){
                        res.status(400).json({err_message:"date info save error"})
                    }
                    else{
                        res.json({"message":"success"});
                    }
                });
            }
            else{
                scheduleDay.topic = req.body.topic
                scheduleDay.notes = req.body.notes
                scheduleDay.assignment = req.body.assignment
                scheduleDay.save((err) => {
                    if(err) {
                        res.status(400).json({err_message:"error updating existing date"})
                    }
                    else{
                        res.json({"message":"Successfully updated existing data"})
                    }
                })
            }
        }
    })
});


app.get("/:courseId/Syllabus",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const courseId = parseInt(req.params.courseId);
    const user = req.user;
    // check if the user is in the class
    // invalid course id or user not in the class
    if(!Biz.isEnrolled(user,courseId)['isEnrolled']){
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
    else if(!Biz.isEnrolled(user,courseId)['isEnrolled']){
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

/*
 *  Members List
 */

app.get('/:courseId/members-list',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const user = req.user
    const courseId = parseInt(req.params.courseId)

    const enrolledData = Biz.isEnrolled(user,courseId);
    if(!enrolledData['isEnrolled']){
        res.status(401).json({err_message: 'unable to find the given course id'})
        return
    }

    const data = {currEmail: user.email}
    const instructors = []
    const students  =[]

    Course.findOne({'course_id': courseId}, (err, course) => {
        if (err) {
            res.status(401).json({err_message: 'failed to load members data'})
        } else {
            data.courseId = course.course_id
            data.courseName = course.course_name
            data.isInstructor = course.instructor_uids.includes(user.uid)

            User.find().where('uid').in(course.instructor_uids).exec((err2, users1) => {
                if (err2) {
                    res.status(401).json({err_message: 'failed to load instructors data'})
                } else {
                    users1.forEach((instructor) => {
                        instructors.push(
                            {
                                'name': instructor.firstname + ' ' + instructor.lastname,
                                'email': instructor.email
                            }
                        )
                    })

                    data.instructors = instructors

                    User.find().where('uid').in(course.student_uids).exec((err3, users2) => {
                        if (err3) {
                            res.status(401).json({err_message: 'failed to load students data'})
                        } else {
                            users2.forEach((student) => {
                                students.push(
                                    {
                                        'name': student.firstname + ' ' + student.lastname,
                                        'email': student.email
                                    }
                                )
                            })
                            data.students = students
                            res.json(data)
                        }
                    })
                }
            })
        }
    })
})


app.post('/:courseId/members-list', passport.authenticate('jwt',{session:false}), (req, res) => {
    const currUser = req.user
    const courseId = parseInt(req.params.courseId)
    const query = {course_id: courseId}


    // data from the form to add new user
    const addRole = req.body.addRole
    const addEmail = req.body.addEmail
    const addFirstName = req.body.addFirstName
    const addLastName = req.body.addLastName

    // data from the form to delete a user
    const deleteName = req.body.deleteName
    const deleteEmail = req.body.deleteEmail


    if (addRole && addEmail && addFirstName && addLastName) {

        if (addRole !== 'Student' && addRole !== 'Instructor') {
            res.status(401).json({err_message: 'invalid role'})
            return
        }

        if (!Biz.isEmailValid(addEmail)) {
            res.status(401).json({err_message: 'invalid email'})
            return
        }

        // handle add a member (send invitation)
        // find course in database
        Course.findOne(query, (err, course) => {
            if (err) {
                res.status(401).json({err_message: 'unable to find the course'})
            } else {
                const courseName = course.course_name

                // generate random password string
                // reference: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
                let pw = ''
                while (pw.length < 3) {
                    pw = Math.random().toString(36).substring(7)
                }

                User.findOne({email: addEmail}, (err, result) => {
                    if (result) {
                        // user already exists
                        let enrolled = false
                        result.courses.forEach(c => {
                            if (c.course_id === courseId) {
                                enrolled = true
                            }
                        })

                        if (!enrolled) {
                            // enroll user to the course
                            result.courses.push({course_id: courseId, course_name: courseName})

                            const uid = result.uid

                            if (addRole === 'Instructor') {
                                course.instructor_uids.push(uid)

                            } else if (addRole === 'Student') {
                                course.student_uids.push(uid)
                            }
                            Course.findOneAndUpdate(query, course, {upsert: true}, (err, doc) => {
                                if (err) {
                                    res.status(401).json({err_message: 'database error'})

                                } else {
                                    User.findOneAndUpdate({email: addEmail}, result, (err2, doc2) => {
                                        if (err2) {
                                            res.status(401).json({err_message: 'database error'})

                                        } else {
                                            res.json({newUser: result})
                                        }
                                    })
                                }
                            })
                        }

                    } else {
                        // create a new user and save to database
                        const saltRounds = 10
                        bcrypt.hash(pw, saltRounds, (err, hash) => {
                            new User({
                                email: addEmail,
                                firstname: addFirstName,
                                lastname: addLastName,
                                role: addRole,
                                password: hash,
                                courses: [{course_id: courseId, course_name: courseName}]
                            }).save((err, user, count) => {
                                if (err) {
                                    console.log('document save error')
                                    res.status(401).json({err_message: 'document save error'})
                                } else {

                                    // update course
                                    const uid = user.uid
                                    let mail_text

                                    if (addRole === 'Instructor') {
                                        course.instructor_uids.push(uid)
                                        mail_text = 'Dear ' + addFirstName + ', \n\n'
                                            + currUser.firstname + ' ' + currUser.lastname + ' from ' +
                                            courseName + ' has created an account for you on Biazza and registered you as an instructor.\n'
                                            + 'Your temporary password is: ' + pw + '\n'
                                            + 'You may change your password anytime in Settings. \n\n'
                                            + 'Best, \n'
                                            + 'Biazza Team'

                                    } else if (addRole === 'Student') {
                                        course.student_uids.push(uid)
                                        mail_text = 'Dear ' + addFirstName + ', \n\n'
                                            + 'Your instructor ' + currUser.firstname + ' ' + currUser.lastname + ' from ' +
                                            courseName + ' has created an account for you on Biazza.\n'
                                            + 'Your temporary password is: ' + pw + '\n'
                                            + 'You may change your password anytime in Settings. \n\n'
                                            + 'Best, \n'
                                            + 'Biazza Team'
                                    }

                                    Course.findOneAndUpdate(query, course, {upsert: true}, (err, doc) => {
                                        if (err) {
                                            res.status(401).json({err_message: 'Database error'})
                                        } else {
                                            res.json({newUser: user})

                                            // send email to newly created user
                                            const mailOptions = {
                                                from: process.env.MAILER_USER,
                                                to: addEmail,
                                                subject: 'Welcome to Biazza',
                                                text: mail_text
                                            }

                                            transporter.sendMail(mailOptions, (error, info) => {
                                                if (error) {
                                                    console.log(error)
                                                    console.log('Failed to send email')
                                                    res.status(401).json({err_message: 'Failed to send email'})
                                                } else {
                                                    console.log('Message sent: %s', info.messageId)
                                                    res.json({success_message: 'Invitation sent'})
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        })
                    }
                })
            }
        })
    }

    else if (addRole || addEmail || addFirstName || addLastName) {
        // if there are missing fields
        // console.log('missing fields')
        res.status(400).json({err_message: 'missing fields'})
    }

    else if (deleteName && deleteEmail) {
        // handle delete a member

        if (deleteEmail === currUser.email) {
            res.status(401).json({err_message: 'cannot delete oneself'})
            return
        }

        if (!Biz.isEmailValid(deleteEmail)) {
            res.status(401).json({err_message: 'invalid email'})
            return
        }

        // find the course in database
        Course.findOne(query, (err, course) => {
            if (err) {
                console.log('unable to find the course')
                res.status(401).json({err_message: 'unable to find the course'})
            } else {
                // find the user in database
                User.findOne({email: deleteEmail}, (err2, user) => {
                    if (err2) {
                        console.log('unable to find the user')
                        res.status(401).json({err_message: 'unable to find the user'})
                    } else {
                        user.courses = user.courses.filter(c => c.course_id !== courseId)

                        // update user
                        User.findOneAndUpdate({email: deleteEmail}, user, {upsert: true}, (err3, user2) => {
                            if (err3) {

                            } else {

                                // update course
                                const role = user.role
                                const uid = user.uid

                                if (role === 'Instructor') {
                                    course.instructor_uids = course.instructor_uids.filter(id => id !== uid)

                                } else if (role === 'Student') {
                                    course.student_uids = course.student_uids.filter(id => id !== uid)
                                }

                                Course.findOneAndUpdate(query, course, {upsert: true}, (err4, doc) => {
                                    if (err4) {
                                        res.status(401).json({err_message: 'Database error'})

                                    } else {
                                        res.json({deletedUser: user})
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})




/*
 *  Settings
 */

app.get('/settings', passport.authenticate('jwt',{session:false}), (req, res) => {
    const user = req.user

    if (!user) {
        res.status(401).json({err_message: 'not logged in'})
        return
    }

    const data = {
        'email': 'user001@nyu.edu'
    }
    res.json(data)
})


app.post('/settings', passport.authenticate('jwt',{session:false}), (req, res) => {
    const newEmail = req.body.newEmail
    const currPw = req.body.currPw
    const newPw = req.body.newPw

    if (newEmail) {
        // handle change email
        // console.log(newEmail)
    }

    else if (currPw && newPw) {
        // handle change password
        // compare with encrypted current pw in database
        // console.log(currPw, newPw)
    }

    else {
        // if there are missing fields
        res.status(400).send()
    }

    res.status(200).send()
})


module.exports = app;
