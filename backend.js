const express=require ('express')
const {sendotp,verifyotp}=require('./otpcontrol')
const cors = require("cors");
const app = express()
app.use(cors());
app.use(express.json())
app.post('/send-otp',sendotp)
app.post('/verify-otp',verifyotp)
app.listen(3001,(err)=>{
    if(err) 
    console.log(err);
    else
    console.log('Server is running on port 3001');
})