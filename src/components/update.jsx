import { useState, useEffect } from "react"
import { Helmet } from "react-helmet";
import Select from 'react-select';
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ChakraProvider, InputGroup, Spinner } from '@chakra-ui/react';
import { Input, InputRightElement, Button, Heading, Text } from '@chakra-ui/react'
import { Typography, TextField, Autocomplete } from '@mui/material';
import { BootstrapButton, ValidationTextField } from "./material";

 
const Update =()=>{
const [info, setInfo] = useState([])
const [loading, setLoading] = useState(true)
const [nuban, setNuban] = useState('')
const [selectedOption, setSelectedOption] = useState(null)
const [users, setUsers] = useState('')
const [messag, setMessag] = useState('')
const [bvn, setBvn] = useState('')
const [first_name, setFirstname] = useState(' ');
const [last_name, setLastname] = useState('');
const [middle_name, setMiddlename] = useState('null')
const [buttonVisible, setButtonVisible] = useState(true);
   
 
const navigate = useNavigate()

const handleFirstChange = (event)=>{
    setFirstname(event.target.value)
}
const handleLastname = (event)=> {
    setLastname(event.target.value)
}
const handleMiddlename = (event)=>{
    setMiddlename(event.target.value)
}
const handleBank = (event, newValue) => {
  setSelectedOption(newValue);}
;
const handleBvn = (event) => {
    setBvn(event.target.value)
}

const handleNuban =(evnt)=>{
        
    setNuban(evnt.target.value);
}
const handleClick = () => {
  // When the button is clicked, setButtonVisible to false
  setButtonVisible(false);
  setTimeout(() => {
    setButtonVisible(true);
  }, 5000);
};
console.log(info)
let tok= JSON.parse(localStorage.getItem("user-info"));
  let refresh = tok.refresh_token
const fetchDa = async () => {
    let item ={refresh}
    let rep = await fetch ('https://api.prestigedelta.com/refreshtoken/',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'accept' : 'application/json'
     },
     body:JSON.stringify(item)
    });
    
    rep = await rep.json();
    let bab = rep.access_token
  let response = await fetch("https://api.prestigedelta.com/getbanklist/",{
  method: "GET",
  headers:{'Authorization': `Bearer ${bab}`},
  })
  //localStorage.setItem('user-info', JSON.stringify(tok))
  
  if (response.status === 401) {
    navigate('/components/login');
  } else { 
  response = await response.json();
  setLoading(false)
  setInfo(response)
    }}
    useEffect(() => {
      fetchDa()
    }, [])
    const options = info.map((item) => ({
        label: item.bank_name,
        value: item.bank_code,
      }));
      const teams = (selectedOption) => {
        let ref;
  
          if ( selectedOption === null || typeof selectedOption === 'undefined') {
             ref = 10;
              }
               else {
             ref= selectedOption.value;
           }
            return ref}
         let bank_code = teams(selectedOption)
        
         async function bus(e) {
          e.preventDefault();
          let account_name = users.account_name
          let is_customer = false
          let ite ={refresh}
          let rep = await fetch ('https://api.prestigedelta.com/refreshtoken/',{
              method: 'POST',
              headers:{
                'Content-Type': 'application/json',
                'accept' : 'application/json'
           },
           body:JSON.stringify(ite)
          });
          rep = await rep.json();
          let bab = rep.access_token
          
        
            console.warn(first_name, last_name, middle_name, bvn,  nuban, bank_code)
            let item = {first_name, last_name, is_customer, middle_name, account_name, bvn, nuban, bank_code};
            let result = await fetch ('https://api.prestigedelta.com/updateuser/',{
                method: 'POST',
                headers:{
                  'Content-Type': 'application/json',
                  'accept' : 'application/json',
                  'Authorization': `Bearer ${bab}`
             },
             body:JSON.stringify(item)
            });
          
            if (result.status !== 201) {
              result = await result.json()
              setMessag(JSON.stringify(result));
            } else {
              result = await result.json();
            localStorage.setItem('user-info', JSON.stringify(tok)) 
            navigate('/components/accounts')
            }
          }
      
async function ema(e) {
      e.preventDefault();
      
      if(users !== ''){
        bus()} else{
          setMessag('Account not verified')
        }
        
      }
      const fetchData = async () => {
        let item ={refresh}
        let rep = await fetch ('https://api.prestigedelta.com/refreshtoken/',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
              'accept' : 'application/json'
         },
         body:JSON.stringify(item)
        });
        rep = await rep.json();
        let bab = rep.access_token
      let response = await fetch(`https://api.prestigedelta.com/banktransfer/?bank_code=${bank_code}&nuban=${nuban}`,{
      method: "GET",
      headers:{'Authorization': `Bearer ${bab}`},
      })
      response = await response.json()
      localStorage.setItem('user-info', JSON.stringify(tok))
    //   if (data.code === 'token_not_valid'){
    //     navigate('/components/token')
    //   } else {
     setUsers(response)
     
      }
    
    useEffect(() => {
    if (selectedOption !== '' && nuban.length=== 10) {
      fetchData();
    }
  }, [selectedOption, nuban]);
  
  if(loading) {
    return(
    <p>Loading...</p>)
  }
    return(
        <div>
         <Helmet>
            <title>Set up Page</title>
            
        </Helmet>
        
         <Link to='/components/accounts'>
      <i className="fa-solid fa-chevron-left bac"></i>
    </Link>
    
         <h3 style={{textAlign:'left',fontSize:'20px',fontWeight:'bold', marginLeft:'50px', color:'blue'}}>Account details were not verified</h3>
            <Typography textAlign='left' ml='50px' fontSize='14px'>Please Fill in your details!</Typography>
          <br/>
          <ValidationTextField

  onChange={handleFirstChange}
label="Enter First Name"
type='text'
required
variant="outlined"
id="validation-outlined-input"
/> <br/><br/>
<ValidationTextField
  onChange={handleLastname}
label="Enter Last Name"
type='text'
required
variant="outlined"
id="validation-outlined-input"
/> <br/><br/>
<ValidationTextField
  onChange={handleMiddlename}
label="Enter Middle Name"
type='text'
variant="outlined"
id="validation-outlined-input"
/> <br/><br/>
<ValidationTextField
  onChange={handleBvn}
label="Enter BVN"
type='number'
required
variant="outlined"
id="validation-outlined-input"
/> <br/><br/>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Autocomplete
      
      id="combo-box-demo"
      value={selectedOption}
      options={options}
      onChange={handleBank}
      sx={{ width: '88%', maxWidth:'100%', align: 'center' }}
      renderInput={(params) => <TextField {...params} label="Select Bank" />}
        
    /> </div>
    <br/>    
      
     <ValidationTextField
  onChange={handleNuban}
label="Account Number"
type='number'
required
variant="outlined"
id="validation-outlined-input"
/> 
         <br/><br/>
          <div >{users ? <div><p className="me">{users.account_name}</p><br/></div> : null}</div>
<br/>              
{buttonVisible && (<BootstrapButton variant="contained" onClick={bus} disableRipple>
                   Next
      </BootstrapButton>
)}<ChakraProvider>
      {!buttonVisible && <Spinner />}  </ChakraProvider>    <div className="message">{messag ? <p>{messag}</p> : null}</div>
     
        
        </div>
    )
}
export default Update