const chai = require('chai');
const app = require('../app');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const request = chai.request;

chai.use(chaiHttp)

describe('login', ()=>{
    it('should check  if user credentials exist in the database',(done)=>{
        let user = {
            id: 1,
            name: "Okeoghene",
            username: "jaycee",
            email: "nonso@aol.com",
            password: "123456"
        }
        setTimeout(done, 300)
            chai
            .request(app)
            .post('/users/login')
            .send(user)
            .end((err, res)=>{
                expect(res.status).to.equal(401);
                expect(res.body.message).to.equal('No user found');
                
            })
            
          
    })
})