import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PasswordChecklist from "react-password-checklist"

function TokenPage() {
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [message, setMessage] = useState('')
    const [info, setInfo] = useState('')
    const [otp, setOtp] = useState('');
    const [passwordType, setPasswordType] = useState("password");
    const navigate = useNavigate()

    const nav=()=>{
      navigate('/components/login')
    }
   const otpChange =(event) =>{
      setOtp(event.target.value)
   }

   const togglePassword =()=>{
    if(passwordType==="password")
    {
     setPasswordType("text")
     return;
    }
    setPasswordType("password")
  }
  
const handlePasswordChange =(evnt)=>{
        
  setPassword1(evnt.target.value);
}
const handlePasswordConfirm =(evnt)=>{
        
  setPassword2(evnt.target.value);
}

async function passChange(e) {
  e.preventDefault();
  let new_password = password1
    console.warn( password1, password2)
    let item = {new_password, otp};
    let resut = await fetch ('https://sandbox.prestigedelta.com/resetpassword/',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'accept' : 'application/json'
     },
     body:JSON.stringify(item)
    });
    
    if (resut.status !== 200) {
      setMessage('Invalid Information');
    } else {
      resut = await resut.json();
      setInfo(JSON.stringify(resut))
    
    }
  }
   if (info=== '')
  return (
  

    <div>
        <Link to='/components/login'><i class="fa-solid fa-chevron-left bac"></i></Link>
     <p className="lp">Fill in new Password and OTP</p>

<form>
    <p className='sp'>OTP</p>
    <input className="lin"  onChange={otpChange} type="number" name="username"  required/><br/><br/>
    <p className="sp">Password</p>
    <input className="line" type={passwordType} onChange={handlePasswordChange}  name="password" required/>
    { passwordType==="password"?
             <i onClick={togglePassword} class="fa-regular fa-eye-slash ic"></i> : <i class="fa-regular fa-eye ic" onClick={togglePassword}></i>} <br/>
            <p className='sp'>Confirm Password</p>
            <input className="line" type={passwordType} onChange={handlePasswordConfirm} name='password2' />
            { passwordType==="password"?
             <i onClick={togglePassword} class="fa-regular fa-eye-slash ic"></i> : <i class="fa-regular fa-eye ic" onClick={togglePassword}></i>} <br/>
    <button className="logb" onClick={passChange} type="submit">Log in</button>
    <div className="message">{message ? <p>{message}</p> : null}</div>
    <PasswordChecklist
				rules={["minLength","specialChar","number","capital","match"]}
				minLength={8}
				value={password1}
				valueAgain={password2}
			/>
</form> 
    </div>
  );
  return(
     <div className='plus'>
           <p>Password reset successful!</p>
           <button className='logb' onClick={nav}>Login</button>
     </div>
  )
}

export default TokenPage;
