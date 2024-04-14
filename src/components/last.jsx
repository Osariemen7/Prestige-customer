import { useState, useEffect } from "react"
import { Helmet } from "react-helmet";
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ChakraProvider, InputGroup, Spinner } from '@chakra-ui/react';
import { Input, InputRightElement, Button, Heading, Text } from '@chakra-ui/react';
import { Typography, TextField, Autocomplete } from '@mui/material';
import { BootstrapButton, ValidationTextField } from "./material";


const Last =()=>{
const [info, setInfo] = useState([])
const [loading, setLoading] = useState(true)
const [nuban, setNuban] = useState('')
const [selectedOption, setSelectedOption] = useState(null)
const [users, setUsers] = useState('')
const [messag, setMessag] = useState('')
const [buttonVisible, setButtonVisible] = useState(true);

const [create_anchor_user, setCreateanchoruser] = useState(true);
const location = useLocation();

const ans = location.state.data
 
const navigate = useNavigate()


  const handleBank = (event, newValue) => {
    setSelectedOption(newValue);}
  

const handleNuban =(evnt)=>{
        
    setNuban(evnt.target.value);
}
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
          handleClick()
          let gender =ans.pers.gender
          let address =ans.address
          let dob =ans.pers.dob
          let bvn = ans.pers.bvn
          let state = ans.state
          let city = ans.city
          let is_customer = true
          let business_name = ''
          let business_type = ''
          let account_name = users.account_name
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
          
            setCreateanchoruser(create_anchor_user)
            console.warn(gender, address, dob, is_customer, bvn, account_name, city, state, business_name, business_type, create_anchor_user, nuban, bank_code)
            let item = {gender, address, dob,is_customer, bvn, account_name, city, state, business_name, business_type, create_anchor_user, nuban, bank_code};
            let result = await fetch ('https://api.prestigedelta.com/updateuser/',{
                method: 'POST',
                headers:{
                  'Content-Type': 'application/json',
                  'accept' : 'application/json',
                  'Authorization': `Bearer ${bab}`
             },
             body:JSON.stringify(item)
            });
          
            if (result.status !== 200) {
              result = await result.json()
              setMessag(JSON.stringify(result));
            } else {
              result = await result.json();
            localStorage.setItem('user-info', JSON.stringify(tok)) 
            navigate('/components/Thanks')
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
      let response = await fetch(`https://api.prestigedelta.com/verifyaccount/?bank_code=${bank_code}&nuban=${nuban}&bank_name=${selectedOption.label}`,{
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
      const handleClick = () => {
        // When the button is clicked, setButtonVisible to false
        setButtonVisible(false);
        setTimeout(() => {
          setButtonVisible(true);
        }, 5000);
      };
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
        <div style={{padding: '3%'}}>
         <Helmet>
            <title>Set up Page</title>
            
        </Helmet>
         <ChakraProvider>
         <Link to='/components/signup'>
      <i className="fa-solid fa-chevron-left bac"></i>
    </Link>
    
         <Heading textAlign='left' ml='6%' fontSize='22px' mt='18px' color='blue'>Set up your Settlement Account</Heading>
            <Text textAlign='left' ml='6%' fontSize='16px'>Fill in your account details!</Text>
          <br/>
          </ChakraProvider>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Autocomplete
      
      id="combo-box-demo"
      value={selectedOption}
      options={options}
      onChange={handleBank}
      sx={{ width: '88%', maxWidth:'100%', align: 'center' }}
      renderInput={(params) => <TextField {...params} label="Select Bank" />}
        
    /> </div>
    <br/><br/>
             
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
       )}  <ChakraProvider>
       {!buttonVisible && <Spinner />} 
            <div className="message">{messag ? <p>{messag}</p> : null}</div>
     
          </ChakraProvider>
        </div>
    )
}
export default Last