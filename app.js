const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db');
const CustomerRouter = require('./routes/userRoute');
const CustomerProfileRouter = require('./routes/userProfileRoute');
const AuthRouter = require('./routes/authRoute');
const ChatRouter = require('./routes/chatRoute'); 
const app = express();

connectDb();

app.use(express.json());
app.use(cors());

app.use('/api/user', CustomerRouter);
app.use('/api/user/profile', CustomerProfileRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/chat', ChatRouter);  

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
