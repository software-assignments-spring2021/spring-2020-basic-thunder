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

describe('GET add upvote: /:replyId/add-upvote', () => {
    before((done) => {
        mockDb.connect()
            .then(() => {
                new User({
                    email: "get_upvote_test_userA@nyu.edu",
                    firstname: "Davi",
                    lastname: "Geiger",
                    role: "Instructor",
                    password: "xxx",
                    courses: [],
                }).save((err,user)=>{
                    new User({
                        email: "get_upvote_test_userB@nyu.edu",
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
                                            post.reply_details.push(
                                                {
                                                "reply_id":reply.reply_id,
                                                "is_official_ans":true,
                                                "upvote": 0,
                                                });
                                            post.save((err)=>{
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
            .get("/1/add-upvote")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/123/add-upvote")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/0/add-upvote")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/4321/add-upvote")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/2222/add-upvote")
            .end((err,res)=>{
                res.should.have.status(401);
                done();
            });
    });

    it("should verify whether the target reply exist",(done)=> {
        const payload = {uid:this.instructor_user.uid};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});
        chai.request(app)
            .get(`/${this.reply.reply_id+123}/add-upvote`)
            .set("Authorization",`Bearer ${token}`)
            .end((err,res)=> {
                res.should.have.status(401);
                done()
            });
    });


    it("should allow upvotes for user that never voted for it",(done)=>{
        const payload = {uid:this.instructor_user.uid};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});

        chai.request(app)
            .get(`/${this.reply.reply_id}/add-upvote`)
            .set("Authorization",`Bearer ${token}`)
            .end((err,res)=>{
                res.should.have.status(200);
                const data = JSON.parse(res.text);
                data.should.haveOwnProperty("upvote");
                data.should.haveOwnProperty("hasVoted");
                data.upvote.should.be.equal(1);
                data.hasVoted.should.equal(true);

                //
                // data.has_voted.should.equal(false);
                // data.instructor_mode.should.equal(true);
                // data.upvote_count.should.equal(0);
                // data.is_my_reply.should.equal(true);
                // data.time.should.equal(this.reply.time);
                // data.content.should.equal(this.reply.content);
                // data.author.should.equal(`${this.instructor_user.firstname} ${this.instructor_user.lastname} (me)`);

                done();
            });
    });



});
