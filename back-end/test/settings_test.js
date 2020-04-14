process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const should = chai.should()
const app = require("../app.js")
const assert = chai.assert

require('dotenv').config()

