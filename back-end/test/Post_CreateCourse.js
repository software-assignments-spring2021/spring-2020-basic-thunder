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

describe('POST /create-courses', () => {
    before((done) => {
        mockDb.connect()
            .then(() => {
                this.kkk = 4;
                done()
            })
            .catch((err) => done(err));
    });

    after((done) => {
        mockDb.close()
            .then(() => done())
            .catch((err) => done(err));
    });

    it("should be a protected path", (done) => {
        chai.request(app)
            .post("/create-courses")
            .end((err,res)=>{
                res.should.have.status(401);
                done();
            });
    });

    it("should reject request from authenticated user but with missing fields", (done) => {
        const payload = {uid:1};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});

        chai.request(app)
            .post("/create-courses")
            .set("Authorization",`Bearer ${token}`)
            .end((err,res)=>{
                it("should reject such reuqests",()=> {
                    res.should.have.status(401);
                });
                done();
            });
    });

    it("should return appropriate json to authenticated user with appropriate fields", (done) => {
        const payload = {uid:1};
        const token = jwt.sign(payload, jwtOptions.secretOrKey,{expiresIn: 300});
        chai.request(app)
            .post("/create-courses")
            .set("Authorization",`Bearer ${token}`)
            .send({course_name:"Agile",term:"Spring 2020"})
            .end((err,res)=>{
                res.should.have.status(200);
                const data = JSON.parse(res.text);
                data.should.haveOwnProperty("message");
                data.message.should.be.equal("success");
                done();
            });
    });

});
