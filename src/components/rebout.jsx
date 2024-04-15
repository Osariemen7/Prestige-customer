import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";

const Business=()=>{
    const [message, setMessage] = useState("");
    const [business_name, setBusinessname] = useState('');
    const [business_type, setBusinesstype] = useState('');
    const [create_anchor_user, setCreateanchoruser] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const locs = location.state.data

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
  const term = (tok) => {
    let banes 
    if (typeof tok === 'undefined' || tok === null) {
    
     banes = "";
    } else {
      banes = tok.last_name;
    }
  
    return banes;
  };
  let bane = term(tok)

    const handleBusiness=(event) =>{
        setBusinessname(event.target.value)
    }
    const handleBusinesstype =(event) => {
        setBusinesstype(event.target.value)
    }

    async function bus(e) {
        e.preventDefault();
        let gender =locs.pers.gender
        let address = locs.address
        let dob = locs.pers.dob
        let bvn = locs.pers.bvn
        let state = locs.state
        let city = locs.city
        let ite ={refresh}
        let rep = await fetch ('https://sandbox.prestigedelta.com/refreshtoken/',{
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
          console.warn(gender, address, dob, bvn, city, state, business_name, business_type, create_anchor_user)
          let item = {gender, address, dob, bvn, city, state, business_name, business_type, create_anchor_user};
          let result = await fetch ('https://sandbox.prestigedelta.com/updateuser/',{
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
            setMessage(JSON.stringify(result));
          } else {
            result = await result.json();
          localStorage.setItem('user-info', JSON.stringify(tok)) 
          navigate('/components/reboard')
          }
        }
     console.log(tok)
    return(
        <div>
            <h2>Hi {bane}, tell us about<br /> your business</h2>
            <p>Prestige finance is legally required to collect this information</p>
            
                <p className='sp'>Business Name</p>
                <input type="text" onChange={handleBusiness} className="line" />
                <p className='sp'>Type of Business</p>
                <select className="line" onChange={handleBusinesstype}>
                    <option> </option>
                    <option>Agency Banking</option>
                    <option>Fast Food Restuarants</option>
                    <option>Pharmacies</option>
                    <option>Health and Beauty Spas</option>
                    <option>Retail Merchant</option>
                    <option>Barber and Beauty Spas</option>
                    <option>Electrical delivery business</option>
                    <option>Car Washes</option>
                    <option>Stationaries/Office Supplies</option>
                    <option>Others</option>
                </select>
                <div className="message">{message ? <p>{message}</p> : null}</div>
                <button className='pog' onClick={bus} type="submit">Next</button>
        </div>
    )
}
export default Business