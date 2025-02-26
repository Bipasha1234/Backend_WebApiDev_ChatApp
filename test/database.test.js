const mongoose = require("mongoose");
const sinon = require("sinon");
const connectDB = require("../config/db.js"); 
const { expect } = require("chai"); 

describe("Database Connection", function () {
    afterEach(function () {
        // Reset the mock after each test to ensure independence
        sinon.restore();
    });

    it("should connect to MongoDB successfully", async function () {
        const mockConnect = sinon.stub(mongoose, "connect").resolves();
        await connectDB();
        expect(mockConnect.calledOnce).to.be.true;  
    });

    it("should fail to connect to MongoDB", async function () {
        const mockConnect = sinon.stub(mongoose, "connect").rejects(new Error("Connection failed"));
        try {
            await connectDB();  // This should throw an error due to rejection
        } catch (error) {
            expect(error.message).to.equal("Connection failed");  
        }
        expect(mockConnect.calledOnce).to.be.true;  
    });
});
