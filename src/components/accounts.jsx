import {useState, useEffect} from 'react'
import {Link, useNavigate} from "react-router-dom";
import { Helmet } from "react-helmet"
import { ChakraProvider } from '@chakra-ui/react';
import { Card, Heading, Stack, Input, Button } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Nav } from './nav.jsx'

const Accounts =()=> {
  const [info, setInfo] = useState('')
  const [users, setUsers] = useState('');
  const [hidden, setHidden] = useState("******");
  const [data, setData] = useState('')
  const navigate= useNavigate()
  const [loading, setLoading] = useState(true)
  const [sidebar, setSidebar] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState(new Date())
  const [buttonEnabled, setButtonEnabled] = useState(false);


  const begin =(event)=>{
    setStart(event.target.value)
  }
  const conc =(event)=>{
    setEnd(event.target.value)
  }

  const showSidebar = () => setSidebar(!sidebar)
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
    let refresh = terms(tok)

    const send = ()=>{
      if (tok.user.paystack_verify_status === 'NOT_VERIFIED' ){
        navigate('/components/update')
      } else {
        navigate('/components/fund')
      }
    }
    const read = info.transactions
    const receipt =(index)=>{
      if (buttonEnabled) {
      const ite = read[index]      
      navigate('/components/Receipt', {state:{ite}} )}
    }
   
    const currentDate = new Date(); // Get the current date

    const thirtyDaysBefore = new Date(); // Create a new Date object
    thirtyDaysBefore.setDate(currentDate.getDate() - 30)  

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
  let response = await fetch("https://api.prestigedelta.com/accounts/",{
  method: "GET",
  headers:{'Authorization': `Bearer ${bab}`},
  })
  response = await response.json()
  localStorage.setItem('user-info', JSON.stringify(tok))
//   if (data.code === 'token_not_valid'){
//     navigate('/components/token')
//   } else {
 setUsers(response)
 setLoading(false)
  }

useEffect(() => {
  fetchData()
}, [])
let wark =users[0]

const toggleHidden =()=>{
           if(hidden==="******")
           {let gal =(wark.main_balances.available_balance).toLocaleString('en-US')
             
            setHidden(`₦${gal}`)
            return;
           }
           setHidden("******")
         }
         
         const fetchInfo = async () => {
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
        let response = await fetch(`https://api.prestigedelta.com/transactionlist/?start_date=${thirtyDaysBefore.toLocaleDateString('en-US')}&end_date=${(new Date()).toLocaleDateString('en-US')}`,{
        method: "GET",
        headers:{'Authorization': `Bearer ${bab}`},
        })
        
        if (response.status === 401) {
          navigate('/components/login');
        } else {  
        response = await response.json();}
        
        setInfo(response)
      
        }
             useEffect(() => {
          fetchInfo()
          }, [])

          useEffect(() => {
            const timer = setTimeout(() => {
              setButtonEnabled(true);
            }, 15000)
            return () => clearTimeout(timer);
          }, [])
  

          const Infow = async () => {
          
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
          let response = await fetch(`https://api.prestigedelta.com/transactionlist/?start_date=${(new Date(start)).toLocaleDateString('en-US')}&end_date=${(new Date(end)).toLocaleDateString('en-US')}`,{
          method: "GET",
          headers:{'Authorization': `Bearer ${bab}`},
          })
          
          if (response.status === 401) {
            navigate('/components/login');
          } else {  
          response = await response.json();}
          
          setInfo(response)
        
          }
     
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
      
          const handleShare = (refresh) => {
            if (navigator.share) {
              navigator.share({
                title: 'Daily Transactions',
                text: `View transactions for today`,
                url: 'https://prestigefinance.app/components/customer/custlog',
                code: refresh
              })
                .then(() => console.log('App shared successfully.'))
                .catch((error) => console.log('Error sharing app:', error));
            } else {
              console.log('Web Share API is not supported in this browser.');
            }
          };;
        
        const transfer= ()=>{
         let fifo = {name:'main_account'}
          const mata = fifo
             navigate('/components/getgroup', {state:{mata}})
        }

        const airtime= ()=>{
              navigate('/components/airtime')
         }
       
console.log(info)
if(loading) {
  return(
  <p>Loading...</p>)} 
else if (info.length < 1)        
return(
     
        <div>
        <Helmet>
            
            <title>Account</title>
            
        </Helmet>
        <Nav />
            <ChakraProvider>
           <div className="dash">
              <h3 className="h1">Collection Account</h3>
              <p className='dp'>Total Balance</p>
              { hidden ? <i onClick={toggleHidden} class="fa-regular fa-eye-slash see"></i> : <i class="fa-regular fa-eye see" onClick={toggleHidden}></i>}
              <h1 className="h1">{hidden}</h1>
              <div>
              <Stack direction='row'm={3} spacing={3} justify='center'>
                <Button mb={2} colorScheme='blue' variant='solid' onClick={send} >Add Fund</Button>
               <Button mb={2} colorScheme='blue' variant='solid' onClick={transfer}>Transfers</Button>
               <Button mb={2} colorScheme='blue' variant='solid' onClick={airtime}>Buy Airtime</Button>
               </Stack>
       
              </div>
           </div>
           
            
           </ChakraProvider>
            <p className='l'>RECENT TRANSACTIONS</p>
              <p className='ad'>No Transaction Yet</p>

         
        </div>
    )
    return(
      <div>
      <ChakraProvider>
      <Nav />
      <div className='mobile-view'>
             <div className="dash">
                <h3 className="h1">Collection Account</h3>
                <p className='dp'>Total Balance</p>
                { hidden ? <i onClick={toggleHidden} class="fa-regular fa-eye-slash see"></i> : <i class="fa-regular fa-eye see" onClick={toggleHidden}></i>}
                <Heading size='lg' mt={0} color='#fff'>{hidden}</Heading>
                <div >
                <Stack direction='row'm={3} spacing={3} justify='center'>
               <Button mb={2} colorScheme='blue' variant='solid' onClick={send} >Add Fund</Button>
               <Button mb={2} colorScheme='blue' variant='solid' onClick={transfer}>Transfers</Button>
               <Button mb={2} colorScheme='blue' variant='solid' onClick={airtime}>Buy Airtime</Button>
               </Stack>
                </div>
             </div>
             
               <Tabs isFitted variant='enclosed'>
<TabList mb='1em'>
    <Tab>Activity </Tab>
    <Tab>Cash Flow</Tab>
  </TabList>
  <TabPanels>
    <TabPanel p={0}>
               
    <Stack direction='row' spacing={1} justify='center' >
<div>
         <Heading fontSize='12px'>Start Date</Heading>
        <Input placeholder='' defaultValue={(thirtyDaysBefore).toISOString().slice(0, 10)}  size='md' type='date' onChange={begin} width={173} ml={3}/><br/><br/>
        </div> 
        <div>
        <Heading fontSize='12px'>End Date</Heading>
        <Input placeholder='Date' size='md' defaultValue={new Date().toISOString().slice(0, 10)} type='date' onChange={conc} width={173} ml={2}/><br/><br/>
        </div></Stack> 
        <Button colorScheme='blue' variant='outline' 
         w='230px' onClick={() => Infow()}>Filter</Button>
        {info.transactions.map((obj, index) => 
          <Card m={3} backgroundColor='#F0F8FF'>
                  <div className='td'  onClick={() => receipt(index)}>
                  <div className='tl'>
                       <p key={index}>{obj.classification}</p>
                       <Heading fontSize='15px' key={index}>₦{(obj.amount).toLocaleString('en-US')}</Heading>
                  </div>
                  <div className='tg'>
                       <p  key={index}>{obj.status}</p>
                       <p key={index}>{(new Date(obj.time)).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                  </div>
                  {obj.transaction_type === 'CLOSE_PROJECT' || obj.transaction_type ==='NIPCR' ? (
                       <p className='tm' key={index}>{obj.narration}</p>) : <p className='tm' key={index}>Beneficiary: {obj.beneficiary.account_name} {obj.beneficiary.bank_name}</p>}
                  <div ><i class="fa-solid fa-file-export"></i></div>    
                  </div>
               </Card>)}
         </TabPanel>
<TabPanel>
<Card justify='center' ml='40px' backgroundColor='#9fc5e8' w='250px' p={2}>
               <Stack direction='row' gap='50px' spacing={5} justify='center'>
                 <Stack direction='column'  spacing={2} >
                  <Heading fontSize='15px' textAlign='center'>Inflow</Heading>
                  <p>₦{(info.inflow).toLocaleString('en-US')}</p>
                 </Stack>
                 <Stack direction='column'>
                  <Heading fontSize='15px'>Outflow</Heading>
                  <p>₦{(info.outflow).toLocaleString('en-US')}</p>
                 </Stack>
                 </Stack>
             </Card>
           
 
</TabPanel>
</TabPanels>
                </Tabs>
                </div>
                <div className='desktop-view'>
                <div className='content'>
                <div className="dash">
                <h3 className="h1">Collection Account</h3>
                <p className='dp'>Total Balance</p>
                { hidden ? <i onClick={toggleHidden} class="fa-regular fa-eye-slash see"></i> : <i class="fa-regular fa-eye see" onClick={toggleHidden}></i>}
                <Heading size='lg' mt={0} color='#fff'>{hidden}</Heading>
                <div >
                <Stack direction='row'm={3} spacing={3} justify='center'>
               <Button mb={2} colorScheme='blue' variant='solid' onClick={send} >Add Funds</Button>
               <Button mb={2} colorScheme='blue' variant='solid' onClick={transfer}>Buy Items</Button>
               <Button mb={2} colorScheme='blue' variant='solid' onClick={airtime}>Buy Airtime</Button>
               </Stack>
                </div>
             </div>
             
               <Tabs isFitted variant='enclosed'>
<TabList mb='1em'>
    <Tab>Activity </Tab>
    <Tab>Cash Flow</Tab>
  </TabList>
  <TabPanels>
    <TabPanel p={0}>
               
    <Stack direction='row' spacing={1} justify='center' >
<div>
         <Heading fontSize='12px'>Start Date</Heading>
        <Input placeholder='' defaultValue={(thirtyDaysBefore).toISOString().slice(0, 10)}  size='md' type='date' onChange={begin} width={173} ml={3}/><br/><br/>
        </div> 
        <div>
        <Heading fontSize='12px'>End Date</Heading>
        <Input placeholder='Date' size='md' defaultValue={new Date().toISOString().slice(0, 10)} type='date' onChange={conc} width={173} ml={2}/><br/><br/>
        </div></Stack> 
        <Button colorScheme='blue' variant='outline' 
         w='230px' onClick={() => Infow()}>Filter</Button>
        {info.transactions.map((obj, index) => 
          <Card m={3} backgroundColor='#F0F8FF'>
                  <div className='td'  onClick={() => receipt(index)}>
                  <div className='tl'>
                       <p key={index}>{obj.classification}</p>
                       <Heading fontSize='15px' key={index}>₦{(obj.amount).toLocaleString('en-US')}</Heading>
                  </div>
                  <div className='tg'>
                       <p  key={index}>{obj.status}</p>
                       <p key={index}>{(new Date(obj.time)).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                  </div>
                  {obj.transaction_type === 'CLOSE_PROJECT' || obj.transaction_type ==='NIPCR' ? (
                       <p className='tm' key={index}>{obj.narration}</p>) : <p className='tm' key={index}>Beneficiary: {obj.beneficiary.account_name} {obj.beneficiary.bank_name}</p>}
                  <div ><i class="fa-solid fa-file-export"></i></div>    
                  </div>
               </Card>)}
         </TabPanel>
<TabPanel>
<Card justify='center' ml='40px' backgroundColor='#9fc5e8' w='250px' p={2}>
               <Stack direction='row' gap='50px' spacing={5} justify='center'>
                 <Stack direction='column'  spacing={2} >
                  <Heading fontSize='15px' textAlign='center'>Inflow</Heading>
                  <p>₦{(info.inflow).toLocaleString('en-US')}</p>
                 </Stack>
                 <Stack direction='column'>
                  <Heading fontSize='15px'>Outflow</Heading>
                  <p>₦{(info.outflow).toLocaleString('en-US')}</p>
                 </Stack>
                 </Stack>
             </Card>
           
 
</TabPanel>
</TabPanels>
                </Tabs></div>
                </div>
                </ChakraProvider>               
      </div>
   )
}
export default Accounts