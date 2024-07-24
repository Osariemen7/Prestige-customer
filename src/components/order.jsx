import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {ChakraProvider, Card, Button, Box, Image, Stack, CardBody, Heading, Text } from '@chakra-ui/react';
import { Nav } from './nav.jsx'
const Order = () => {
    const [info, setInfo] = useState('')
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
    let refresh = terms(tok)
    

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
      let response = await fetch(`https://api.prestigedelta.com/customerbopis/`,{
      method: "GET",
      headers:{'Authorization': `Bearer ${bab}`},
      })
      
      if (response.status === 401) {
        navigate('/components/login');
      } else {  
      response = await response.json();}
      setInfo(response)
      setLoading(false)
      }
           useEffect(() => {
        fetchInfo()
        }, [])

   if(loading) {
            return(
            <p>Loading...</p>)}
            else if (info.length < 1)        
                return(
            <ChakraProvider>
            <div>
            <Nav/>
             <p>No order made yet</p>
            </div>
            </ChakraProvider>  )
    return(
        <div>
        <Nav/>
            <ChakraProvider>
            {info.map((obj, index) => (
                <Card key={index} m={3} boxShadow='6px 3px green' backgroundColor='darkgreen' color='#fff'>
                    <CardBody>
                     <Text>Amount: {obj.amount}</Text>
                     <Heading fontSize='14px'>OTP: {obj.otp_code}</Heading>
            {obj.sold_products.map((prod, inde) =>(
                <div key={inde}>
                <Text>{prod.product_name}: {prod.sold_quantity}</Text>
                <Text>{prod.quantity_type}</Text>
                <Text>Purchased Amount: {prod.sold_amount}</Text>
                </div>
            ))}
                    </CardBody>
                </Card>
            ))}
            </ChakraProvider>
        </div>
    )

}
export default Order