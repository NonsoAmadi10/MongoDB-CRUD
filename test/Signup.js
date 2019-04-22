/*const chai = require('chai');
const app = require('../app');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const request = chai.request;

chai.use(chaiHttp)


describe('register', ()=>{

it('it should not register a user if the email exist', (done) => {
    let user = {
      id: 1,
      name: "Okeoghene",
      username: "jaycee",
      email: "nonso@aol.com",
      password: "123456"
      
    };
    
    chai
      .request(app)
      .post('/users/register')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).to.equal("Email Exist, Registration unsuccessful");
        
        
        
      });
})

})*/