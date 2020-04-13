// boilerplate code begin
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const mockDb = require('../db.js');
const app = require("../app.js");
const assert = chai.assert;

require('dotenv').config();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
const jwtOptions = {
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY,
};


const mongoose = require('mongoose');
const User = mongoose.model('User');
const Course = mongoose.model("Course");
const Post = mongoose.model("Post");
const Reply = mongoose.model("Reply");
// boilerplate end

describe('GET reply detail: /:courseId/course/:replyId/reply-detail', () => {
    before((done) => {
        mockDb.connect()
            .then(() => {
                new User({
                    email: "get_reply_test_userA@nyu.edu",
                    firstname: "Davi",
                    lastname: "Geiger",
                    role: "Instructor",
                    password: "xxx",
                    courses: [],
                }).save((err,user)=>{
                    new User({
                        email: "get_reply_test_userB@nyu.edu",
                        firstname: "Davi",
                        lastname: "Doe",
                        role: "Student",
                        password: "xxx",
                        courses: [],
                    }).save((err,student_user)=>{
                        new Course({
                            creator_uid: user.uid,
                            firstname:user.firstname,
                            lastnname:user.lastname,
                            course_name:"Computer Vision",
                            term:"Spring 2020",
                            syllabus:null,
                            list_of_posts:[],
                            instructor_uids:[user.uid]
                        }).save((err,course)=>{
                            // add course to current instructor's field
                            user['courses'].push({
                                "course_id":course['course_id'],
                                "course_name":course['course_name'],
                            });
                            student_user['courses'].push({
                                "course_id":course['course_id'],
                                "course_name":course['course_name'],
                            });
                            user.save((err)=>{
                                student_user.save((err)=>{
                                    new Post({
                                        'topic':"How to process image",
                                        'content':"Can someone explain this topic?",
                                        "resolved":false,
                                        "replies":0,
                                        "time":Date.now(),
                                        "author": student_user.firstname +  " " + student_user.lastname,
                                        "uid": student_user.uid,
                                        'course_id':course.course_id,
                                        'reply_details':[],
                                        "firstname":student_user.firstname,
                                        "lastname":student_user.lastname,
                                    }).save((err,post)=>{
                                        new Reply({
                                            "author": user.firstname + " " + user.lastname,
                                            "post_id":post.post_id,
                                            "uid":user.uid,
                                            "is_official_ans":true,
                                            "time":Date.now(),
                                            "content":"checkout this book: XXX",
                                            "firstname":user.firstname,
                                            "lastname":user.lastname,
                                            'voter_uid':[],
                                        }).save((err,reply)=>{
                                            this.student_user = student_user;
                                            this.instructor_user = user;
                                            this.course = course;
                                            this.post = post;
                                            this.reply = reply;
                                            done()
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            })
            .catch((err) => done(err));
    });

    after((done) => {
        mockDb.close()
            .then(() => {
                done()
            })
            .catch((err) => done(err));
    });

    it("should be a protected path", (done) => {
        chai.request(app)
            .get("/1/course/1/reply-detail")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/1/course/199/reply-detail")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/2/course/199/reply-detail")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/99992/course/2/reply-detail")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/99992/course/123/reply-detail")
            .end((err,res)=>{
                res.should.have.status(401);
                done();
            });
    });


    it("should reject requests from un-enrolled user (regardless of user role)", (done) => {
        const payload = {uid: 1};
        const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: 300});

        chai.request(app)
            .get(`/${this.course.course_id}/course/${this.reply.reply_id}/reply-detail`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it("should show (me) at the end of the author for replier",(done)=>{
        const payload = {uid:this.instructor_user.uid};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});

        chai.request(app)
            .get(`/${this.course.course_id}/course/${this.reply.reply_id}/reply-detail`)
            .set("Authorization",`Bearer ${token}`)
            .end((err,res)=>{
                res.should.have.status(200);
                const data = JSON.parse(res.text);
                data.should.haveOwnProperty("has_voted");
                data.should.haveOwnProperty("instructor_mode");
                data.should.haveOwnProperty("upvote_count");
                data.should.haveOwnProperty("is_my_reply");
                data.should.haveOwnProperty("time");
                data.should.haveOwnProperty("content");
                data.should.haveOwnProperty("author");

                data.has_voted.should.equal(false);
                data.instructor_mode.should.equal(true);
                data.upvote_count.should.equal(0);
                data.is_my_reply.should.equal(true);
                data.time.should.equal(this.reply.time);
                data.content.should.equal(this.reply.content);
                data.author.should.equal(`${this.instructor_user.firstname} ${this.instructor_user.lastname} (me)`);

                done();
            });
    });

    it("should show normal data for other enrolled user",(done)=>{
        const payload = {uid:this.student_user.uid};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});

        chai.request(app)
            .get(`/${this.course.course_id}/course/${this.reply.reply_id}/reply-detail`)
            .set("Authorization",`Bearer ${token}`)
            .end((err,res)=>{
                res.should.have.status(200);
                const data = JSON.parse(res.text);
                data.should.haveOwnProperty("has_voted");
                data.should.haveOwnProperty("instructor_mode");
                data.should.haveOwnProperty("upvote_count");
                data.should.haveOwnProperty("is_my_reply");
                data.should.haveOwnProperty("time");
                data.should.haveOwnProperty("content");
                data.should.haveOwnProperty("author");

                data.has_voted.should.equal(false);
                data.instructor_mode.should.equal(false);
                data.upvote_count.should.equal(0);
                data.is_my_reply.should.equal(false);
                data.time.should.equal(this.reply.time);
                data.content.should.equal(this.reply.content);
                data.author.should.equal(`${this.instructor_user.firstname} ${this.instructor_user.lastname}`);

                done();
            });
    });

});
