// boilerplate code begin
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const mockDb = require('../db.js');
const app = require("../app.js");
const assert = chai.assert;

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Course = mongoose.model("Course");
const Post = mongoose.model("Post");
const Reply = mongoose.model("Reply");
// boilerplate end

describe('GET /my-courses', () => {
    before((done) => {
        mockDb.connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    after((done) => {
        mockDb.close()
            .then(() => done())
            .catch((err) => done(err));
    });

    it("should be a protected path", (done) => {
        chai.request(app)
            .get("/my-courses")
            .end((err,res)=>{
                res.should.have.status(401);
                done();
            });
    });

    it("should return appropriate json to authenticated user", (done) => {
        new User({
            email: "abc@nyu.edu",
            firstname: "Aaa",
            lastname: "Bbb",
            role: "Instructor",
            password: "xxx",
            courses: [],
        }).save((err,user)=>{
            chai.request(app)
                .get("/my-courses")
                .set("Authorization",'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU4Njc1MDg1NiwiZXhwIjoyNjE4Mjg2ODU2fQ.b_5mxdzfhMvEtFhkMGDUUu-QBhIowfxac4WqznO4lQg')
                .end((err,res)=>{

                    describe("request with an access token",()=>{
                        it("should return 200 with valid access token",()=> {
                            res.should.have.status(200);
                        });
                    });

                    const data = JSON.parse(res.text);
                    describe("should contain appropriate fields in the json data",()=>{
                        it("should contain role and courses",()=>{
                            data.should.haveOwnProperty("role");
                            data.should.haveOwnProperty("courses");
                            data.role.should.equal('Instructor');
                            assert.isArray(data.courses);
                            assert.notStrictEqual(data.courses,[])
                        });
                    });

                    done();
                });
        });
    });
});
