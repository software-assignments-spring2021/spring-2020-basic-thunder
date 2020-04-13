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

describe('GET syllabus: /:courseId/Syllabus', () => {
    before((done) => {
        mockDb.connect()
            .then(() => {
                new User({
                    email: "SyllabusIns@nyu.edu",
                    firstname: "John",
                    lastname: "King",
                    role: "Instructor",
                    password: "xxx",
                    courses: [],
                }).save((err,ins_user)=>{
                    new User({
                        email: "SyllabusStudent@nyu.edu",
                        firstname: "Nathan",
                        lastname: "Sam",
                        role: "Student",
                        password: "xxx",
                        courses: [],
                    }).save((err,student_user)=>{
                        new Course({
                            creator_uid: ins_user.uid,
                            firstname:ins_user.firstname,
                            lastnname:ins_user.lastname,
                            course_name:"Machine Learning",
                            term:"Spring 2020",
                            syllabus:null,
                            list_of_posts:[],
                            instructor_uids:[ins_user.uid]
                        }).save((err,course)=>{
                            // add course to current instructor's field
                            ins_user['courses'].push({
                                "course_id":course['course_id'],
                                "course_name":course['course_name'],
                            });
                            ins_user.save((err)=>{
                                student_user['courses'].push({
                                    "course_id":course['course_id'],
                                    "course_name":course['course_name'],
                                });
                                student_user.save((err)=>{
                                    this.instructor_user = ins_user;
                                    this.course = course;
                                    this.enrolled_student_user = student_user;
                                    done();
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
            .get(`/${this.course.course_id}/Syllabus`)
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get(`/999999/Syllabus`)
            .end((err,res)=>{
                res.should.have.status(401);
            });
        chai.request(app)
            .get(`/12345/Syllabus`)
            .end((err,res)=>{
                res.should.have.status(401);
                done();
            });
    });


    it("should reject requests from un-enrolled user (regardless of user role)", (done) => {
        const payload = {uid: 1};
        const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: 300});

        chai.request(app)
            .get(`/${this.course.course_id}/Syllabus`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it("should accept request from enrolled user and return proper data",(done)=>{
        const payload = {uid:this.instructor_user.uid};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});
        chai.request(app)
            .get(`/${this.course.course_id}/Syllabus`)
            .set("Authorization",`Bearer ${token}`)
            .end((err,res)=>{
                res.should.have.status(200);
                const data = JSON.parse(res.text);
                data.should.haveOwnProperty("courseId");
                data.should.haveOwnProperty("courseName");
                data.should.haveOwnProperty("syllabus");
                data.should.haveOwnProperty("isInstructor");
                data.courseId.should.equal(this.course.course_id);
                data.courseName.should.equal(`${this.course.course_name} [${this.course.term}]`);
                assert.equal(data.syllabus,this.course.syllabus);
                data.isInstructor.should.equal(true);

            });

        const student_payload = {uid:this.enrolled_student_user.uid};
        const student_token = jwt.sign(student_payload, jwtOptions.secretOrKey,{expiresIn: 300});
        chai.request(app)
            .get(`/${this.course.course_id}/Syllabus`)
            .set("Authorization",`Bearer ${student_token}`)
            .end((err,res)=>{
                res.should.have.status(200);
                const data = JSON.parse(res.text);
                data.should.haveOwnProperty("courseId");
                data.should.haveOwnProperty("courseName");
                data.should.haveOwnProperty("syllabus");
                data.should.haveOwnProperty("isInstructor");
                data.courseId.should.equal(this.course.course_id);
                data.courseName.should.equal(`${this.course.course_name} [${this.course.term}]`);
                assert.equal(data.syllabus,this.course.syllabus);
                data.isInstructor.should.equal(false);
                done();
            });

    });
});
