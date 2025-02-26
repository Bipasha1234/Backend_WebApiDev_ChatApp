const chai = require('chai');
const chaiHttp = require('chai-http');
const  app  = require('../app');  // Adjust the path to your Express app file
const { expect } = chai;

chai.use(chaiHttp);

describe('Auth Routes', () => {
  let token; // To store the token for authentication

  // Test User data
  const user = {
    email: 'bladhhvdfdj@gmail.com',
    password: '123456',
    fullName: 'Test User'
  };

  // Test case: Register a new user
  describe('POST /register', () => {
    it('should register a new user', async () => {
      // Define a sample user object with the necessary fields for registration
      const user = {
        fullName: 'BBBB LLL',
        email: 'bladhhvdfdj@gmail.com',
        password: '123456',
        profilePic:''
      };
      console.log("Before making the request");
      // Make the request to register the user
      const res = await chai.request(app)
        .post('/api/auth/register')
        .send(user);  // Send the user object in the request body
  

        console.log(res.body);
      // Verify the response
      expect(res.status).to.equal(201);  // Ensure status is 201 Created
      expect(res.body.message).to.equal('User registered successfully');
    });

    it('should return an error for missing fields', async () => {
      const res = await chai.request(app)
        .post('/api/auth/register')
        .send({
          email: 'missingFullName@example.com',
          password: 'password123'
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('All fields are required');
    });
  });

  // Test case: Login the user
  describe('POST /login', () => {
    it('should log in and return a token', async () => {
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password
        });

      expect(res.status).to.equal(200);
      expect(res.body.token).to.be.a('string');
      token = res.body.token; // Save the token for further tests
    });

    it('should return an error for incorrect credentials', async () => {
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongPassword'
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Invalid credentials');
    });
  });

  // Test case: Check if the user is authenticated
  describe('GET /check', () => {
    it('should return user data for authenticated user', async () => {
      const res = await chai.request(app)
        .get('/api/auth/check')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('fullName');
      expect(res.body.email).to.equal(user.email);
    });

    it('should return an error for unauthenticated user', async () => {
      const res = await chai.request(app)
        .get('/api/auth/check');

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Unauthorized - No Token Provided'); 


    });
  });

  // Test case: Update user profile
  describe('PUT /update-profile', () => {
    // it('should update the user profile', async () => {
    //   const res = await chai.request(app)
    //     .put('/api/auth/update-profile')
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(updatedProfile);

    //   expect(res.status).to.equal(500);
    //   expect(res.body.message).to.equal('Profile updated successfully');
    //   expect(res.body.user.fullName).to.equal(updatedProfile.fullName);
    // });

    it('should return an error for missing fields', async () => {
      const res = await chai.request(app)
        .put('/api/auth/update-profile')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('No fields to update');
    });
  });

  // Test case: Upload image
  describe('POST /uploadImage', () => {
    it('should return an error for missing image', async () => {
      const res = await chai.request(app)
        .post('/api/auth/uploadImage')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Please upload a file');
    });
  });

  // Test case: Get current user
  describe('GET /get-user', () => {
    it('should return the current user data', async () => {
      const res = await chai.request(app)
        .get('/api/auth/get-user')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.email).to.equal(user.email);
    });
  });
});

