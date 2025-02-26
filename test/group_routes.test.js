const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app"); 
const { expect } = chai;
const mongoose = require("mongoose");
const User = require("../model/credential"); 
const Group = require("../model/group"); 
const bcrypt = require("bcryptjs");
chai.use(chaiHttp);

describe("Group Routes", () => {
  let authToken = "";
  let userId = "";
  let groupId = "";
  let secondUserId = "";


  before(async () => {
      try {
          await User.deleteMany({});
          await Group.deleteMany({});
  
          const hashedPassword = await bcrypt.hash("password123", 10); // Hash password

          // Create test users with hashed passwords
          const user1 = new User({ 
              fullName: "User One", 
              email: "user1@example.com", 
              password: hashedPassword 
          });
  
          const user2 = new User({ 
              fullName: "User Two", 
              email: "user2@example.com", 
              password: hashedPassword 
          });
  
          await user1.save();
          await user2.save();
  
          userId = user1._id.toString();
          secondUserId = user2._id.toString();
  
          // Log in with correct credentials
          const res = await chai.request(server)
              .post("/api/auth/login")
              .send({ email: "user1@example.com", password: "password123" });

  
          if (res.status !== 200) {
              throw new Error("❌ Login failed: Invalid credentials.");
          }
  
          authToken = res.body.token;
          if (!authToken) {
              throw new Error("❌ Login failed: No token received.");
          }
  
      } catch (error) {
          console.error("❌ Error setting up test data:", error);
      }
  });
  

  it("should create a group successfully", (done) => {
    chai.request(server)
        .post("/api/groups/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            groupName: "Test Group",
            members: [secondUserId, userId], //  At least 2 members
            profilePic: "",
        })
        .end((err, res) => {
            expect(res).to.have.status(201);
            groupId = res.body.group?._id;
            done();
        });
});


  //  Test 2: Fetch Groups for the User
  it("should fetch groups the user is part of", (done) => {
    chai.request(server)
      .get("/api/groups/get")
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  // Test 3: Send a Message to the Group
  it("should send a group message", (done) => {
    chai.request(server)
      .post(`/api/groups/messages/${groupId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        text: "Hello, this is a test message!",
        image: "",
        audio: "",
        document: "",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message").that.includes("Message sent");
        done();
      });
  });

  // Test 4: Fetch Group Messages
  it("should fetch messages from a group", (done) => {
    chai.request(server)
      .get(`/api/groups/messages/${groupId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("messages").that.is.an("array");
        done();
      });
  });


  //  Test 6: Leave Group
  it("should allow a user to leave the group", (done) => {
    chai.request(server)
      .post(`/api/groups/leave/${groupId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message").that.includes("Successfully left the group");
        done();
      });
  });


  //  Test 8: Update Group Name
  it("should update the group name", (done) => {
    chai.request(server)
      .put(`/api/groups/update-group-name/${groupId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        groupName: "Updated Test Group",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message").that.includes("Group name updated successfully");
        done();
      });
  });

  after(async () => {
    await User.deleteMany({});
    await Group.deleteMany({});
  });
});
