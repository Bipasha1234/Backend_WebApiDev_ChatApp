const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app"); 
const { expect } = chai;

chai.use(chaiHttp);

describe("Protected Routes", () => {
  let authToken = "";

  // Step 1: Get a valid token before running protected route tests
  before((done) => {
    chai
      .request(server)
      .post("/api/auth/login") 
      .send({ email: "bladhhvdfdj@gmail.com", password: "123456" }) 
      .end((err, res) => {
        expect(res).to.have.status(200);
        authToken = res.body.token;
        done();
      });
  });

  // Test 1: Access protected users list
  it("should fetch users for sidebar with valid token", (done) => {
    chai
      .request(server)
      .get("/api/messages/users")
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array"); 
        done();
      });
  });


  it("should fetch messages with valid token", (done) => {
    chai
      .request(server)
      .get(`/api/messages/67beed80bd998c2b5a77fa53`) 
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        console.log("Messages Response:", res.body); 
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array"); 
        done();
      });
});

  it("should mark messages as seen", (done) => {
    chai
      .request(server)
      .post("/api/messages/mark-seen")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ userId: "123" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message").that.includes("Messages marked as seen");
        done();
      });
  });
});
