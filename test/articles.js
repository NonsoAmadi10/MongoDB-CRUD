const chai = require('chai');
const app = require('../app');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const request = chai.request;

chai.use(chaiHttp)

describe('articles', ()=>{

    it('should get all articles from the database',(done)=>{
        setTimeout(done, 300);
        chai.request(app)
        .get('/')
        .end((err, res)=>{
            expect(res.status).to.equal(200)
            expect(res).to.be.json;
        });
    })
})