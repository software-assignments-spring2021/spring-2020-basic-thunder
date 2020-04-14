process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const should = chai.should()
const app = require("../app.js")
const assert = chai.assert

require('dotenv').config()

describe('GET settings /settings', () => {
    it('should return a status code of 200', (done) => {
        chai.request(app)
            .get('/settings')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it('should get an object back', (done) => {
        chai.request(app)
            .get('/settings')
            .end((err, res) => {
                res.body.should.be.a('object')
                done()
            })
    })
})

describe('POST settings /settings', () => {
    it('should send a status code of 200', (done) => {
        chai.request(app)
            .post('/settings')
            .send({newEmail: "new@nyu.edu"})
            .end((err, res) => {
                res.should.have.status(200)

            })

        chai.request(app)
            .post('/settings')
            .send({currPw: "123456", newPw: "654321"})
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it('shoud send a status code of 400 if there are missing fields', (done) => {
        chai.request(app)
            .post('/settings')
            .send({newEmail: ""})
            .end((err, res) => {
                res.should.have.status(400)
            })

        chai.request(app)
            .post('/settings')
            .send({currPw: "", newPw: ""})
            .end((err, res) => {
                res.should.have.status(400)
            })

        chai.request(app)
            .post('/settings')
            .send({currPw: "123456", newPw: ""})
            .end((err, res) => {
                res.should.have.status(400)
            })

        chai.request(app)
            .post('/settings')
            .send({currPw: "", newPw: "654321"})
            .end((err, res) => {
                res.should.have.status(400)
                done()
            })
    })
})