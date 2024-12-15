const express=require("express")
const cors = require('cors')
const connectDb=require("./config/db")
const CustomerRouter=require("./routes/customerRoute")

const app=express();

connectDb();


app.use(express.json());
app.use(cors());

app.use("/api/customer",CustomerRouter );

const port=3000;
app.listen(port,()=>{
     console.log(`Server running at http://localhost:${port}`)
})