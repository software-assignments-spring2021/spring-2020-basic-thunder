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

describe('GET post detail: /:courseId/Forum/:postId/post', () => {
    before((done) => {
        mockDb.connect()
            .then(() => {
                new User({
                    email: "Amir@nyu.edu",
                    firstname: "Amir",
                    lastname: "Shiplka",
                    role: "Instructor",
                    password: "xxx",
                    courses: [],
                }).save((err,user)=>{
                    new Course({
                        creator_uid: user.uid,
                        firstname:user.firstname,
                        lastnname:user.lastname,
                        course_name:"Agile",
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
                        user.save((err)=>{
                            new Post({
                                'topic':"How to perform Unit Test",
                                'content':"Can someone explain this topic?",
                                "resolved":false,
                                "replies":0,
                                "time":Date.now(),
                                "author": user.firstname +  " " + user.lastname,
                                "uid": user.uid, // author id
                                'course_id':course.course_id,
                                'reply_details':[],
                                "firstname":user.firstname,
                                "lastname":user.lastname,
                            }).save((err,post)=>{
                                this.user = user;
                                this.course = course;
                                this.post = post;
                                done()

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
            .get("/1/Forum/1/post")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/1/Forum/2/post")
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get("/2/Forum/1/post")
            .end((err,res)=>{
                res.should.have.status(401);
                done();
            });
    });


    it("should reject requests from un-enrolled user", (done) => {
        const payload = {uid: 1};
        const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: 300});

        chai.request(app)
            .get(`/${this.course.course_id}/Forum/${this.post.post_id}/post`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it("should accept request from enrolled user with valid data",(done)=>{
        const payload = {uid:this.user.uid};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});

        chai.request(app)
            .get(`/${this.course.course_id}/Forum/${this.post.post_id}/post`)
            .set("Authorization",`Bearer ${token}`)
            .end((err,res)=>{
                res.should.have.status(200);
                const data = JSON.parse(res.text);
                data.should.haveOwnProperty("CourseName");
                data.should.haveOwnProperty("postid");
                data.should.haveOwnProperty("topic");
                data.should.haveOwnProperty("content");
                data.should.haveOwnProperty("resolved");
                data.should.haveOwnProperty("replies");
                data.should.haveOwnProperty("time");
                data.should.haveOwnProperty("author");
                data.should.haveOwnProperty("authorId");
                data.should.haveOwnProperty("reply_details");
                data.should.haveOwnProperty("myId");

                data.CourseName.should.equal(this.course.course_name);
                data.postid.should.equal(this.post.post_id);
                data.topic.should.equal(this.post.topic);
                data.content.should.equal(this.post.content);
                data.resolved.should.equal(this.post.resolved);
                data.time.should.equal(this.post.time);
                data.authorId.should.equal(this.user.uid);
                data.myId.should.equal(this.user.uid);

                done();
            });
    });

});
