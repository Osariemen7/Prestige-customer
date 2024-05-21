import { ChakraProvider, Stack } from '@chakra-ui/react';
import { Heading,Card} from '@chakra-ui/react';
import { Nav } from './nav.jsx'
import { ShareApp } from './nav.jsx';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Referral =()=>{
  const [info, setInfo] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  let tok= JSON.parse(localStorage.getItem("user-info"));
  const terms = (tok) => {
    let refreshval;
  
    if (tok === null || typeof tok === 'undefined') {
      refreshval = 0;
    } else {
      refreshval = tok.refresh_token;
    }
  
    return refreshval;
  };
  
  let refresh = terms(tok);  
 const getAccessToken = async (refresh) => {
    // Function to fetch access token using refresh token
    let item = { refresh };
    let rep = await fetch('https://api.prestigedelta.com/refreshtoken/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(item)
    });
  
    rep = await rep.json();
    return rep.access_token; // Return the access token
  };
 const fetchDat = async () => {
    try {
       const bab = await getAccessToken(refresh)
  let response = await fetch("https://api.prestigedelta.com/referrals/",{
  method: "GET",
  headers:{'Authorization': `Bearer ${bab}`},
  })
  response = await response.json()
  if (response.status === 401) {
    navigate('/components/login');
  } else {  
  setInfo(response)
  setLoading(false)
  }
  
   }catch (error) {
    console.error("Error fetching products:", error);
    // Handle error
  }
  }
  useEffect(() => {
    fetchDat()
  }, [])
  console.log(info)

  if(loading) {
    return(
    <p>Loading...</p>)} 
    return(
        <div style={{backgroundColor:'#F0F8FF', maxHeight:'100%', height: '100vh', paddingTop:'3%', zIndex:'0', alignItems: 'center', justifyContent: 'center'}}>
        <Nav />
        <div className='mobile-view'>
        <ChakraProvider>
          <Heading fontSize='15px' textAlign='left' marginLeft='7%' marginTop='2%'>Hi {tok.user.first_name}</Heading>
          <p>Referral bonuses are paid on Mondays</p>
    
             <Card m='5%' mt={2} backgroundColor='#F0F8FF' p='3%'>
              <Stack direction='row' spacing={1} align='center' justify='center'>
              <Card m={2} backgroundColor='#2E5894' color='#fff' p='3%'>
                <p>Available Invite Slot for the Month</p>
                <p>{info[0].invite_count}</p>
              </Card>
              <Card m={2} backgroundColor='#2E5894' color='#fff' p='3%'>
                <p>Number of people Invited</p>
                <p>{info[0].invitee_count}</p>
              </Card>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Card m={2} backgroundColor='#2E5894' color='#fff' p='3%'>
                  <p>Cash Inflow of People Invited</p>
                  <p>₦{parseFloat(info[0].invitee_inflow).toLocaleString('en-US')}</p>
                </Card>
                <Card m={2} backgroundColor='#2E5894' color='#fff' p='3%' >
                  <p>Invite Bonus</p>
                  <p>₦{parseFloat(info[0].invitee_bonus).toLocaleString('en-US')}</p>
                </Card>
              </Stack>
             </Card>
             <Card m='5%' mt={2} backgroundColor='#F0F8FF' p='3%'>
            <Heading fontSize='18px'>Referral</Heading>
            <div style={{justifyContent:'center'}}>
            <p>Send an invite, get businesses to sign up and earn 0.5% of their first 180 day sales <br/>using your referral code and get a reward</p>
            <p style={{fontWeight: 'bold'}}>{info[0].referral_code}</p><br/>
            <ShareApp inviteCode={info[0].referral_code}/>
            </div></Card>
           
             {info[0].invitees.map((obj, index) => ( 
              <Card key={index} m='5%' mt={3} backgroundColor='#008080' p='3%' color='#fff'>
                 <p>{obj.first_name}</p>
                 <p>{obj.phone_no}</p>
                 {obj.referee_trans_amount? (<div>
                 <p>NO of transaction done: {obj.referee_trans_count}</p>
                 <p>Total Amount of Transation: ₦{parseFloat(obj.referee_trans_amount).toLocaleString('en-US')}</p>
                 </div>): null}</Card> ))}          
          </ChakraProvider> 
        </div>
        <div className='desktop-view'>
        <div className='content'>
        <ChakraProvider>
          <Heading fontSize='15px' textAlign='left' marginLeft='7%' marginTop='2%'>Hi {tok.user.first_name}</Heading>
          <p>Referral bonuses are paid on Mondays</p>
    
             <Card m='5%' mt={2} backgroundColor='#F0F8FF' p='3%'>
              <Stack direction='row' spacing={1} align='center' justify='center'>
              <Card m={2} backgroundColor='#2E5894' color='#fff' p='3%'>
                <p>Available Invite Slot for the Month</p>
                <p>{info[0].invite_count}</p>
              </Card>
              <Card m={2} backgroundColor='#2E5894' color='#fff' p='3%'>
                <p>Number of people Invited</p>
                <p>{info[0].invitee_count}</p>
              </Card>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Card m={2} backgroundColor='#2E5894' color='#fff' p='3%'>
                  <p>Cash Inflow of People Invited</p>
                  <p>₦{parseFloat(info[0].invitee_inflow).toLocaleString('en-US')}</p>
                </Card>
                <Card m={2} backgroundColor='#2E5894' color='#fff' p='3%' >
                  <p>Invite Bonus</p>
                  <p>₦{parseFloat(info[0].invitee_bonus).toLocaleString('en-US')}</p>
                </Card>
              </Stack>
             </Card>
             <Card m='5%' mt={2} backgroundColor='#F0F8FF' p='3%'>
            <Heading fontSize='18px'>Referral</Heading>
            <div style={{justifyContent:'center'}}>
            <p>Send an invite, get businesses to sign up and earn 0.5% of their first 180 day sales <br/>using your referral code and get a reward</p>
            <p style={{fontWeight: 'bold'}}>{info[0].referral_code}</p><br/>
            <ShareApp inviteCode={info[0].referral_code}/>
            </div></Card>
           
             {info[0].invitees.map((obj, index) => ( 
              <Card key={index} m='5%' mt={3} backgroundColor='#008080' p='3%' color='#fff'>
                 <p>{obj.first_name}</p>
                 <p>{obj.phone_no}</p>
                 {obj.referee_trans_amount? (<div>
                 <p>NO of transaction done: {obj.referee_trans_count}</p>
                 <p>Total Amount of Transation: ₦{parseFloat(obj.referee_trans_amount).toLocaleString('en-US')}</p>
                 </div>): null}</Card> ))}          
          </ChakraProvider>
        </div>

        </div>
          
        </div>
    )

}
export default Referral