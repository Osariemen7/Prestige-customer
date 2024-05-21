import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Typography, TextField, Autocomplete } from '@mui/material';
import { BootstrapButton, ValidationTextField } from "./material";



  
const GetGroup =()=>{
  const [info, setInfo] = useState([])
  const [fun, setFun] = useState('');
  const [nuban, setNuban] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [narration, setNarration] = useState('')
  const [pin_id, setPinid] = useState('')
  const [message, setMessage] = useState('')
  const [ben, setBen] = useState([]);
  const [selected, setSelected] = useState('')
  const navigate = useNavigate();
  const location = useLocation();

  let selectedOptions = location.state.mata.name
  let subAccount = location.state.mata
  
  const opt = ben.map((item) => ({
    label: `${item.account_name}(${item.bank_name})`,
    value: item.account_number,
    team:   item.bank_code,
    code: item.bank_name
  }));
   
  
 const handleBank = (event, newValue) => {
    setSelectedOption(newValue);}
  
    const handleBen = (event, newValue) => {
      setSelected(newValue);
      setSelectedOption({ label: newValue.code, value: newValue.team });
      setNuban(newValue.value);
  }
    
  const handleBe = (selected) => {
    setSelected(selected);
    // Set the selected bank and account number in their respective fields
    setSelectedOption({ label: selected.code, value: selected.team });
    setNuban(selected.value);
  };
  const handleNote =(event)=>{
    setNarration(event.target.value)
  }

  const handleSubmit=(e)=>{
    e.preventDefault()
    let data ={amount, selectedOption, selectedOptions, nuban, users, narration, pin_id}
    if (users.account_name === undefined || narration.length < 1 || nuban.length < 1 || selectedOption.length < 1 || amount.length < 1){
      setMessage('All Fields must be Filled')
    }
    else {
    
    navigate('/components/getgrp2', {state:{data}})
  }}

  const handleAcct =(event)=> {
    setNuban(event.target.value)
}
const handleAmount=(event)=> {
  setAmount(event.target.value)
}

async function fproj() {
  
  let items ={refresh}
   let rep = await fetch ('https://api.prestigedelta.com/refreshtoken/',{
       method: 'POST',
       headers:{
         'Content-Type': 'application/json',
         'accept' : 'application/json'
    },
    body:JSON.stringify(items)
   });
   rep = await rep.json();
   let bab = rep.access_token 
   
   console.warn( amount)
   let item = { amount};
 

 try {
   let result = await fetch('https://api.prestigedelta.com/overdraftdrawdown/', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'accept': 'application/json',
       'Authorization': `Bearer ${bab}`
     },
     body: JSON.stringify(item)
   });

   if (result.status === 400) {
     const errorResult = await result.json();
     setMessage(JSON.stringify(errorResult.message));
   } else {
      result =await result.json();
      setFun((result))
   }
 } catch (error) {
   // Handle fetch error
   console.error(error);
 }
;
}

useEffect(() => {
 if(amount !== ''){
   fproj()
 }
}, [amount])


const fetchDap = async () => {
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

let respet = await fetch("https://api.prestigedelta.com/beneficiaries/",{
  method: "GET",
  headers:{'Authorization': `Bearer ${bab}`},
  })
  respet = await respet.json();
//localStorage.setItem('user-info', JSON.stringify(tok))

if (respet.status === 401) {
  navigate('/components/login');
} else { 
 

setLoading(false)
setBen(respet)

  }}
  useEffect(() => {
    fetchDap()
  }, [])

  let tok= JSON.parse(localStorage.getItem("user-info"));
    const terms = (tok) => {
       let refreshval;

  if ( tok === null || typeof tok === "undefined" ) {
    refreshval = 0;
  } else {
    refreshval = tok.refresh_token;
  }

  return refreshval;
};
// const debit = (selectedOptions) => {
//   let menu
//   if (selectedOptions.value === 'main'){
//       menu = true;
//   }else{
//       menu = false
//   }
//   return menu
// }
// let sub_account = debit(selectedOptions)

let refresh = terms(tok)

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
//  const trim = (selected) => {
//    let pip;
//    if (selected === null  ){
//      pip = 0;
//      else {}
//    }
//  }

   console.log(selectedOptions)
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
    let respet = await fetch("https://api.prestigedelta.com/transferpinid/",{
    method: "GET",
    headers:{'Authorization': `Bearer ${bab}`},
    })
    respet = await respet.json();
    response = await response.json()
    localStorage.setItem('user-info', JSON.stringify(tok))
  //   if (data.code === 'token_not_valid'){
  //     navigate('/components/token')
  //   } else {
   setUsers(response)
   setPinid(respet)
    }
  
  useEffect(() => {
  if (selectedOption !== '' && nuban.length=== 10) {
    fetchData();
  }
}, [selectedOption, nuban]);

   console.log(bank_code) 
   

    if(loading) {
      return(
      <p>Loading...</p>)
    } 

  return(
    <div style={{backgroundColor:'#F0F8FF', maxHeight:'100%', height: '100vh', paddingTop:'3%', zIndex:'0', alignItems: 'center', justifyContent: 'center'}}>
       <Link to='/components/accounts'><i class="fa-solid fa-chevron-left bac"></i></Link>
      
            <h3>Send Money</h3>
            {users.isMerchant === true ? (
              <div>
            {fun === ''? (null):
            <p>Overdraft status: {(fun.status).toLocaleString()} <br/>{fun.message}</p>
         }</div>): null}
          <form>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       <Autocomplete
      id="combo-box-demo"
      value={selected}
      options={opt}
      onChange={handleBen}
      sx={{
        width: '100%', // Default width for mobile
        maxWidth: '88%', // Max width for desktop
        align: 'center',
        '@media (min-width: 600px)': { // Adjustments for desktop view
          width: '40%', // Decrease width for larger screens
          maxWidth: 'none', // Remove maximum width for larger screens
        },
      }}
      renderInput={(params) => <TextField {...params} label="Select Beneficiary" />}
    /> </div>
    <br/>
                 
     {selected === '' ?(
      <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Autocomplete
      id="combo-box-demo"
      value={selectedOption}
      options={options}
      onChange={handleBank}
      sx={{
        width: '100%', // Default width for mobile
        maxWidth: '88%', // Max width for desktop
        align: 'center',
        '@media (min-width: 600px)': { // Adjustments for desktop view
          width: '40%', // Decrease width for larger screens
          maxWidth: 'none', // Remove maximum width for larger screens
        },
      }}
      renderInput={(params) => <TextField {...params} label="Select Bank" />}
    />
           </div>
    <br/>
    
    <ValidationTextField
  onChange={handleAcct}
label="Account Number"
type='number'
required
variant="outlined"
id="validation-outlined-input"
/>     
    
               </div>) :(
                  <div> 
  <ValidationTextField
  
  onChange={handleBank}
label="Select Bank"
type='text'
required
value={selected.code}
variant="outlined"
id="validation-outlined-input"
/><br/><br/>
                  <ValidationTextField
  
  onChange={handleAcct}
label="Account Number"
type='number'
value={selected.value}
required
variant="outlined"
id="validation-outlined-input"
/><br/>
                  </div>)}
                <div className="me">{users ? <p>{users.account_name}</p> : null}</div>
                <ValidationTextField
  
  onChange={handleAmount}
label="Amount"
type='number'
required
variant="outlined"
id="validation-outlined-input"
/><br/><br/>
                <ValidationTextField
  
  onChange={handleNote}
label="Add note"
type='text'
required
variant="outlined"
id="validation-outlined-input"
/> <br/><br/><br/>
                <BootstrapButton variant="contained" onClick={handleSubmit} disableRipple>
                   Next
      </BootstrapButton>
               
                <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  )
    
}
export default GetGroup
