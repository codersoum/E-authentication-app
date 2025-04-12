import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState('');
  const [otp, setOTP] = useState("");
  const[message,Showmessage]=useState("")

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/send-otp', {email,password});

      if (response.data.message === "OTP sent successfully") {
        const generatedOtp=response.data.OTP
        console.log("Generating QR code", email, password);
        setShowQR(true);
        setQrData(`Email: ${email}\nOTP: ${generatedOtp}\n verify your login.`);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      //const errorMsg=error.response.data?.message 
      //Showmessage(errorMsg);
    }
  };

  const handleQRScanned = async () => {
    try {
      const response = await axios.post('http://localhost:3001/verify-otp', {email,otp});
        Showmessage(response.data.message);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      const errorMsg=err.response.data.message 
      Showmessage(errorMsg);
    }
  };

  return (
    <div>
    <div className="login-container">
      {!showQR && (
        <>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">LOGIN</button>
          </form>
        </>
      )}

      {showQR && (
        <div className="qr-container">
          <h3>Scan this QR Code</h3>
          <QRCodeCanvas value={qrData} size={200} />
          <input type="text"value={otp} placeholder="Enter OTP"onChange={(e) => setOTP(e.target.value)}/>
          <button onClick={handleQRScanned}>VERIFY</button>
        </div>
      )}
    </div>
      <div>
      {message==="OTP verified successfully" && (<p style={{ backgroundColor: "#14cc42" }} className="message-box">{message}</p> )}
      {message!=="" && message!=="OTP verified successfully" &&(<p style={{ backgroundColor: "#e90303" }} className="message-box">{message}</p>)}
      </div>
    </div>
  );
};

export default Login;
