process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const should = chai.should()
const app = require("../app.js")
const assert = chai.assert

require('dotenv').config()

describe('GET members-list /:courseId/members-list', () => {
    it('should return a status code of 200', (done) => {
        chai.request(app)
            .get('/1/members-list')
            .end((err, res) => {
                res.should.have.status(200)
            })

        chai.request(app)
            .get('/5/members-list')
            .end((err, res) => {
                res.should.have.status(200)
            })

        chai.request(app)
            .get('/9/members-list')
            .end((err, res) => {
                res.should.have.status(200)
            })

        chai.request(app)
            .get('/1200/members-list')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it('should get an object back', (done) => {
        chai.request(app)
            .get('/1/members-list')
            .end((err, res) => {
                res.body.should.be.a('object')
            })

        chai.request(app)
            .get('/5/members-list')
            .end((err, res) => {
                res.body.should.be.a('object')
            })

        chai.request(app)
            .get('/9/members-list')
            .end((err, res) => {
                res.body.should.be.a('object')
            })

        chai.request(app)
            .get('/1200/members-list')
            .end((err, res) => {
                res.body.should.be.a('object')
                done()
            })
    })

    it('should get members data back', (done) => {
        chai.request(app)
            .get('/11/members-list')
            .end((err, res) => {
                const data = JSON.parse(res.text)
                data.should.haveOwnProperty('instructors')
                data.should.haveOwnProperty('students')
                done()
            })
    })
})

describe('POST members-list /:courseId/members-list', () => {
    it('should send a status code of 200', (done) => {
        chai.request(app)
            .post('/1/members-list')
            .send({"addRole":"student","addEmail":"student@nyu.edu"})
            .end((err, res) => {
                res.should.have.status(200)

            })

        chai.request(app)
            .post('/3/members-list')
            .send({deleteName: "D. E.", deleteEmail: "de111@nyu.edu"})
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it('should send a status of 400 if there are missing fields', (done) => {
        chai.request(app)
            .post('/5/members-list')
            .send({"addRole":"student","addEmail":""})
            .end((err, res) => {
                res.should.have.status(400)
            })

        chai.request(app)
            .post('/5/members-list')
            .send({"addRole":"","addEmail":"role@nyu.edu"})
            .end((err, res) => {
                res.should.have.status(400)
                done()
            })
    })
})