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

    it('should get a JSON object back', (done) => {
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
})

describe('POST members-list /:courseId/members-list', () => {
    it ('')
})