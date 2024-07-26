import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Typography, Autocomplete, TextField } from '@mui/material';
import { BootstrapButton,  ValidationTextField} from './material.js'


const Resident =()=>{
    const [message, setMessage] = useState("");
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [address, setAddress] = useState('');
    const [category, setCategory] = useState('')
    const [business_name, setBusiness] = useState('')
    const [account, setAccount] = useState('')
    
    const [business_type, setBustype] = useState('')
    const [create_anchor_user, setCreateanchoruser] = useState(true);
    
    const navigate = useNavigate();
    const location = useLocation()

    const pers = location.state.data
    const options = ['Abia', 'Adamawa', 'Akwa-ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross-Rivers', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Kastina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 
   'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'River', 'Sokoto', 'Taraba','Yobe', 'Zamafara'  ]

   const opt = ['Business Owner', 'Customer']
    const handleCity =(event)=>{
        setCity(event.target.value)
    }
      
    const handleState = (event, newValue) => {
      setState(newValue);}
    
    const handleAddress =(event)=>{
        setAddress(event.target.value)
    }
    const handleCategory = (event) =>{
        setCategory(event.target.value)
    }
    let tok = JSON.parse(localStorage.getItem("user-info"));
    const terms = (tok) => {
        let refreshval;
      
        if ( typeof tok ==='undefined' || tok === null) {
          refreshval = 0;
        } else {
          refreshval = tok.refresh_token;
        }
      
        return refreshval;
      };
      let refresh = terms(tok)
    
        async function fetchData(){
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
            
            let item = {   
            };
            let result = await fetch ('https://api.prestigedelta.com/createaccount/',{
                method: 'POST',
                headers:{
                  'Content-Type': 'application/json',
                  'accept' : 'application/json',
                  'Authorization': `Bearer ${bab}`
             },
             body:JSON.stringify(item)
            });
            if (result.status !== 201 ) {
              result = await result.json()
              setMessage(JSON.stringify(result.message));
            } else {
              result = await result.json();
            localStorage.setItem('user-info', JSON.stringify(tok)) 
            navigate('/cashback')
            }
        }
        useEffect(() => {
          if (account !== '') {
            fetchData();
          }
        }, [account]);
       
    const handleSubmit=(e)=>{
        e.preventDefault()
        let data ={city, state, address, pers}
        if ( city.length < 1 || state.length < 1 || address.length < 1){
          setMessage('All Fields must be Filled')
        }
        else { 
        navigate('/components/last', {state:{data}})
      }}
    return(

        <div>
            <h2>Enter your Residential Address</h2>
            <br/>
            <ValidationTextField
  
  onChange={handleAddress}
label="Enter Residential Address"
type='text'
required
variant="outlined"
id="validation-outlined-input"
/><br/><br/><br/>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
<Autocomplete
      id="combo-box-demo"
      value={state}
      options={options}
      onChange={handleState}
      sx={{ width: '88%', maxWidth:'100%', align: 'center' }}
      renderInput={(params) => <TextField {...params} label="Select State" />}    
    /> </div>
                 <br/><br/>
<ValidationTextField
  
  onChange={handleCity}
label="Enter City"
type='text'
required
variant="outlined"
id="validation-outlined-input"
/><br/><br/><br/>
                 <div className="message">{message ? <p>{message}</p> : null}</div>
               :  <BootstrapButton variant="contained" onClick={handleSubmit} disableRipple>
                   Next
      </BootstrapButton>
                      </div>
    )
}
export default Resident