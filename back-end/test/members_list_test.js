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
const Course = mongoose.model('Course');

let get_uid;
let get_courseId;
let post_uid;
let post_courseId;

describe('GET members-list /:courseId/members-list', () => {
    before((done) => {
        mockDb.connect()
            .then(() => {
                new User({
                    email: 'get_members@nyu.edu',
                    firstname: 'first',
                    lastname: 'last',
                    role: 'Instructor',
                    password: 'password',
                    courses: [],
                }).save((err, user)=>{
                    new Course({
                        creator_uid: user.uid,
                        firstname:user.firstname,
                        lastnname:user.lastname,
                        course_name: 'Test',
                        term:"Spring 2020",
                        syllabus: null,
                        list_of_posts: [],
                        instructor_uids:[user.uid]
                    }).save((err,course)=>{
                        user['courses'].push({
                            'course_id': course['course_id'],
                            'course_name': course['course_name'],
                        })
                        user.save((err, res) => {
                            get_uid = res.uid
                            get_courseId = res.courses[0]['course_id']
                            done()
                        })
                    })
                })
            })
            .catch((err) => done(err))
    })

    after((done) => {
        mockDb.close()
            .then(() => {
                done()
            })
            .catch((err) => done(err))
    })


    it("should be a protected path", (done) => {
        chai.request(app)
            .get('/1/members-list')
            .end((err,res)=>{
                res.should.have.status(401)
            })
        chai.request(app)
            .get('/99/members-list')
            .end((err,res)=>{
                res.should.have.status(401)
            })
        chai.request(app)
            .get('/1200/members-list')
            .end((err,res)=>{
                res.should.have.status(401)
                done()
            })
    })

    it('should reject requests from an un-enrolled user', (done) => {
        const payload = {uid: 1};
        const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: 300});

        chai.request(app)
            .get(`/${get_courseId}/members-list`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })

    it('should accept requests from an enrolled user', (done) => {
        const payload = {uid: get_uid}
        const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: 300});

        chai.request(app)
            .get(`/${get_courseId}/members-list`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

describe('POST members-list /:courseId/members-list', () => {
    before((done) => {
        mockDb.connect()
            .then(() => {
                new User({
                    email: 'post_members@nyu.edu',
                    firstname: 'first',
                    lastname: 'last',
                    role: 'Instructor',
                    password: 'password',
                    courses: [],
                }).save((err, user)=>{
                    new Course({
                        creator_uid: user.uid,
                        firstname:user.firstname,
                        lastname:user.lastname,
                        course_name: 'Test',
                        term:"Spring 2020",
                        syllabus: null,
                        list_of_posts: [],
                        instructor_uids:[user.uid]
                    }).save((err,course)=>{
                        user['courses'].push({
                            'course_id': course['course_id'],
                            'course_name': course['course_name'],
                        })
                        user.save((err, res) => {
                            post_uid = res.uid
                            post_courseId = res.courses[0]['course_id']
                            done()
                        })
                    })
                })
            })
            .catch((err) => done(err))
    })

    after((done) => {
        mockDb.close()
            .then(() => {
                done()
            })
            .catch((err) => done(err))
    })

    it('should be a protected path', (done) => {
        chai.request(app)
            .get('/1/members-list')
            .end((err,res)=>{
                res.should.have.status(401)
            })
        chai.request(app)
            .get('/99/members-list')
            .end((err,res)=>{
                res.should.have.status(401)
            })
        chai.request(app)
            .get('/1200/members-list')
            .end((err,res)=>{
                res.should.have.status(401)
                done()
            })
    })

    it('should reject requests with missing fields', (done) => {
        const payload = {uid: post_uid};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});
        chai.request(app)
            .post(`/${get_courseId}/members-list`)
            .set("Authorization", `Bearer ${token}`)
            .send({addRole: 'Instructor'})
            .end((err, res) => {
                res.should.have.status(400)
            })

        chai.request(app)
            .post(`/${get_courseId}/members-list`)
            .set("Authorization", `Bearer ${token}`)
            .send({addRole: 'Instructor', addFirstName: 'first_name'})
            .end((err, res) => {
                res.should.have.status(400)
                done()
            })
    })

})