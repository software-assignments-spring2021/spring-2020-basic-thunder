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

let get_uid;
let post_uid

describe('GET settings /settings', () => {
    before((done) => {
        mockDb.connect()
            .then(() => {
                new User({
                    email: 'get_settings@nyu.edu',
                    firstname: 'first',
                    lastname: 'last',
                    role: 'Student',
                    password: 'password',
                    courses: [],
                }).save((err, res)=>{
                    get_uid = res.uid
                    done()
                })
            })
            .catch((err) => done(err))
    })

    after((done) => {
        mockDb.close()
            .then(() => done())
            .catch((err) => done(err))
    })

    it('should be a protected path', (done) => {
        chai.request(app)
            .get('/settings')
            .end((err,res)=>{
                res.should.have.status(401)
                done()
            })
    })

    it("should return appropriate json to authenticated user", (done) => {
        User.findOne({uid: get_uid},(err, user)=>{
            const payload = {uid:user.uid}
            const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300})
            chai.request(app)
                .get('/settings')
                .set('Authorization',`Bearer ${token}`)
                .end((err,res)=>{
                    it('should return 200 with valid access token',()=> {
                        res.should.have.status(200)
                    })
                    const data = JSON.parse(res.text)
                    it('should contain email, first and last name',()=>{
                        data.should.haveOwnProperty('email')
                        data.should.haveOwnProperty('firstname')
                        data.should.haveOwnProperty('lastname')
                    })
                    done()
                })
        })
    })
})


describe('POST settings /settings', () => {
    before((done) => {
        mockDb.connect()
            .then(() => {
                new User({
                    email: 'post_setting@nyu.edu',
                    firstname: 'first',
                    lastname: 'last',
                    role: 'Student',
                    password: 'password',
                    courses: [],
                }).save((err, res)=>{
                    post_uid = res.uid
                    done();
                })
            })
            .catch((err) => done(err))
    })

    after((done) => {
        mockDb.close()
            .then(() => done())
            .catch((err) => done(err))
    })

    it('should be a protected path', (done) => {
        chai.request(app)
            .get('/settings')
            .end((err,res)=>{
                res.should.have.status(401)
                done()
            })
    })

    it('should reject requests with missing fields', (done) => {
        const payload = {uid: post_uid};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});
        chai.request(app)
            .post('/settings')
            .set("Authorization", `Bearer ${token}`)
            .send({currPw: 'password'})
            .end((err, res) => {
                res.should.have.status(400)
            })

        chai.request(app)
            .post('/settings')
            .set("Authorization", `Bearer ${token}`)
            .send({newLast: 'last_name'})
            .end((err, res) => {
                res.should.have.status(400)
                done()
            })
    })

    it('should accept requests with appropriate fields', (done) => {
        const payload = {uid: post_uid};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});
        chai.request(app)
            .post('/settings')
            .set("Authorization", `Bearer ${token}`)
            .send({currPw: 'password', newPw: 'new_password'})
            .end((err, res) => {
                res.should.have.status(200)
            })

        chai.request(app)
            .post('/settings')
            .set("Authorization", `Bearer ${token}`)
            .send({newFirst: 'first_name', newLast: 'last_name'})
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

