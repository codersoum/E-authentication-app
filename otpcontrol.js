const mailer= require('nodemailer');
const redis = require("redis"); 
const redisClient = redis.createClient(); 
  
(async () => { 
    await redisClient.connect(); 
})(); 
  
console.log("Connecting to the Redis"); 
  
redisClient.on("ready", () => { 
    console.log("Connected!"); 
}); 
  
redisClient.on("error", (err) => { 
    console.log("Error in the Connection"); 
}); 
function otpgenerator(password)
{
  let num = 1;
  for (let i = 0; i < password.length; i++) 
  {
    num = (num * 10) + password.charCodeAt(i);
  }
  const randomPart = Math.floor(Math.random() * 900000);
  return Math.floor(num + randomPart);
}
async function sendotp(req,res)
{
    const email=req.body.email
    const password=req.body.password
    const otp=otpgenerator(password)
    await redisClient.setEx(email,300,String(otp))
    const transporter = mailer.createTransport({
        service:"gmail",
        auth:
        {
            user:"22h51a0558@cmrcet.ac.in",
            pass:"yhsw fmgd cykw sssb"
        },
        tls:{
            rejectUnauthorized:false
          }
})
  const mailOptions = {
    from:"22h51a0558@cmrcet.ac.in",
    to:email,
    subject:'Your OTP code',
    text:`Your OTP code is ${otp}`
}
  try{
    transporter.sendMail(mailOptions)
    res.status(200).json({message:"OTP sent successfully",OTP:otp})
  }
  catch (err){
    console.log(err);
    res.status(500).json({message:"Error sending OTP"})
  }
}
async function verifyotp(req,res)
{
  const{email,otp}=req.body
  const storedotp= await redisClient.get(email)
  if(!storedotp)
  {
    return res.status(400).json({success:false,message:"OTP has expired or is invalid"})
  }
  if(storedotp!==otp)
  {
    return res.status(400).json({success:false ,message:"OTP is invalid"})
  }
    await redisClient.del(email)
   return  res.status(200).json({success:true ,message:"OTP verified successfully"})
}
module.exports={sendotp,verifyotp}