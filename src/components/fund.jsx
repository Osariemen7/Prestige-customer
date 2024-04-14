import { useState, useEffect, useRef } from 'react';
import account_balance from './images/account_balance.svg';
import user from './images/user.svg';
import f123 from './images/f123.svg';
import { Link, useNavigate } from 'react-router-dom'
import { BootstrapButton } from './material';



 
const FundPage =()=>{
  const [data, setData] = useState('')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const CopyButton = ({ textToCopy }) => {
    const textRef = useRef(null);
  
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(textToCopy);
        alert('Copied to clipboard!');
      } catch (err) {
        console.error('Unable to copy to clipboard.', err);
      }
    };
  
    return (
      <div>
        <button className='copy' onClick={copyToClipboard}>Copy</button>
      </div>
    );
  };
  let tok= JSON.parse(localStorage.getItem("user-info"));
const term = (tok) => {
  let refval;  
  if (tok === null || typeof tok === 'undefined') {
    refval = 0;
  } else {
    refval = tok.refresh_token;
  }

  return refval;
}
let refresh = term(tok)

const [name, setName] = useState([])

function toSentenceCase(inputString) {
    if (!inputString) return inputString; // Handle empty or null input
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
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
  let response = await fetch("https://api.prestigedelta.com/businessprofile/",{
  method: "GET",
  headers:{'Authorization': `Bearer ${bab}`},
  })
  //localStorage.setItem('user-info', JSON.stringify(tok))
  
  if (response.status === 401) {
    navigate('/components/login');
  } else { 
   
  response = await response.json();
   setLoading(false)
  setName(response)
    }}
    useEffect(() => {
      fetchData()
    }, [])

  
  const fetchDat = async () => {
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
  let response = await fetch("https://api.prestigedelta.com/virtualnuban/",{
  method: "GET",
  headers:{'Authorization': `Bearer ${bab}`},
  })
  response = await response.json()
  if (response.status !== 200) {
    navigate(window.location.pathname, { replace: true });
  } else {  
  response = await response.json();}

 setData(response)
  
}
useEffect(() => {
  fetchDat()
}, [])
console.log(tok)

if(loading) {
  return(
  <p>Loading...</p>)
} 
const shareText = `Pay ${toSentenceCase(name[0].business_name)} on:

  Account Number:
   ${data.account_number}
  
  Bank Name: 
  ${data.bank}
  
  Account Name:
  ${data.account_name}
  
  You will receive an instant cashback from ${toSentenceCase(name[0].business_name)} for this payment that you can claim on prestigefinance.app/cashback`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Account Details',
          text: shareText,
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
      // You can provide a fallback or inform the user if sharing fails
    }
  };

    return(
        <div style={{paddingLeft:'3%', paddingRight:'3%'}}>
           <Link to='/components/accounts'>
           <i class="fa-solid fa-chevron-left bac"></i>
           </Link> 
            <h2 className=''>Fund via bank transfer</h2>
            <p className='dfp2'>To add fund to your prestige account, make a transfer to the account below. Funds should reflect instantly</p>
            <div className="fflex">
                <img src={account_balance} alt=''/>
                <div>
                  <p className='fdiv'>Bank</p>
                  <h4 className='dh3'>{data.bank}</h4>
                </div>   
            </div>
            <div className="fflex">
                <img src={user} alt=''/>
                <div>
                  <p className='fdiv'>Account Name</p>
                  <h4 className='dh3'>{data.account_name}</h4>
                  
                </div>   
            </div>
            <div className="fflex">
                <img src={f123} alt=''/>
                <div>
                  <p className=''>Account Number</p>
                  <h4 className='dh3'>{data.account_number}</h4>
                  <CopyButton textToCopy={data.account_number} />
                </div> 
            </div><br/>
            <div style={{padding: '4%'}}>           
             <BootstrapButton variant="contained" onClick={handleShare} disableRipple>
              Share 
            </BootstrapButton></div>

        </div>
    )
}
export default FundPage
