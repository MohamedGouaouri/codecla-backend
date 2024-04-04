const request = require('supertest')
const {insertDummyData, removeAllData, connectDatabase} = require("./utils.js");
const mongoose = require("mongoose");

describe('API testing', () => {
    const baseUrl = 'http://localhost:3333'
    beforeAll(async () => {
        await connectDatabase('mongodb://localhost:/test')
        await insertDummyData()
    })
    it('Should return unauthorized when user not logged in', async () => {
        request(baseUrl)
            .get('/api/challenges')
            .end(function (err, res) {
                expect(res.statusCode).toEqual(401)
            })

    })
    it('Should return unauthorized when user passes invalid token', async () => {
        request(baseUrl)
            .get('/api/challenges')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZmU5MDMzM2UzMDkwNzlhMTk1N2NkYyIsInJvbGUiOiJjb2RlciIsImlhdCI6MTcxMjE1Mzc3OCwiZXhwIjoxNzEyMTg5Nzc4fQ.abE2H1GNdpn_Z6UgTnNjNYIpgIhV9Rscf97KQOa2pU54')
            .end(function (err, res) {
                expect(res.statusCode).toEqual(403)
            })
    })

    it('POST /api/auth/coders/login should return valid token when correct credentials passed', (done) => {
        request(baseUrl)
            .post('/api/auth/coders/login')
            .send({
                email: 'john.doe@example.com',
                password: '123456'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function (err, res) {
                expect(res.statusCode).toEqual(200)
                expect(res.body).toHaveProperty('token')
                done()
            })
    })

    it('GET /api/challenges should return all the challenges', async () => {
        let response = await request(baseUrl)
            .post('/api/auth/coders/login')
            .send({
                email: 'john.doe@example.com',
                password: '123456'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
        const token = response.body.token
        response = await request(baseUrl)
            .get('/api/challenges')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')

        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data.length).toBe(2)
    })


    afterAll(async () => {
        await removeAllData()
        return mongoose.disconnect()
    })
})

