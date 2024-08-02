import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
  ChakraProvider,
  Card,
  Button,
  Stack,
  CardBody,
  Heading,
  Text,
  Image,
  Radio,
  RadioGroup,
  IconButton,
  Box,  useDisclosure, Spinner, Textarea 
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Typography, TextField,} from '@mui/material';
import { BootstrapButton, ValidationTextField} from './material.js'
import good from './images/good.svg';


const Checkout = () => {
 const [messag, setMessag] = useState('')
 const [buttonVisible, setButtonVisible] = useState(true);
 const [pick_up, setTime] = useState('')
 const [sale_id, setSales] = useState('')
 const [fun, setFun] = useState('')
 const [inputV, setInputV] = useState('')
  const location = useLocation();
  const { isOpen, onOpen,  onClose } = useDisclosure()
  const initialItems = location.state.data.productsToCheckout;
  const business = location.state.data.store
  const [selectedProducts, setSelectedProducts] = useState(
    initialItems.reduce((acc, item) => {
      acc[item.id] = { ...item, count: item.count || 1, priceType: 'Item' };
      return acc;
    }, {})
  );
  const [value, setValue] = useState('')

  let handleInputChange = (e) => {
    let inputValue = e.target.value
    setValue(inputValue)
  }

  const handleClick = () => {
    // When the button is clicked, setButtonVisible to false
    setButtonVisible(false);
    setTimeout(() => {
      setButtonVisible(true);
    }, 20000);
  };
  
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

const handleDob =(event)=>{
    setTime(event.target.value)
}
  async function aprod() {
     handleClick()     
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
     let payment_method = "BOPIS";
     let business_id = business.business_id;
     let pick_up_time = (new Date(pick_up)).toLocaleString('en-GB');
     
     let products = Object.values(selectedProducts).map((product) => ({
       name: product.name,
       price: parseInt(product.price),
       quantity: product.count,
       quantity_type: product.priceType,  // Ensure this is correctly mapped to either 'Unit' or 'Pack'
       pack_size: product.pack_size,
       product_type: 'PRODUCT',
     }));
 
     let ite = { payment_method, products, pick_up_time, business_id };
   try {
     let result = await fetch(`https://api.prestigedelta.com/bopis/`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'accept': 'application/json',
         'Authorization': `Bearer ${bab}`
       },
       body: JSON.stringify(ite)
     });
           if (result.status !== 200) {
       const errorResult = await result.json();
       setMessag(JSON.stringify(errorResult));
     } else {
        result =await result.json();
       setMessag(JSON.stringify(result.message))
       setSales(result)
        } 
   } catch (error) {
     // Handle fetch error
     console.error(error);
   };
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
     let rating = inputV
     let review = value
     
     let ite = { sale_id, rating, review };
   try {
     let result = await fetch(`https://api.prestigedelta.com/ratings/`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'accept': 'application/json',
         'Authorization': `Bearer ${bab}`
       },
       body: JSON.stringify(ite)
     });
           if (result.status !== 200) {
       const errorResult = await result.json();
       setMessag(JSON.stringify(errorResult));
     } else {
        result =await result.json();
       setFun(result)
       
        } 
   } catch (error) {
     // Handle fetch error
     console.error(error);
   };
 }

 const optio = [0, 1, 2, 3, 4, 5];
    const opt = optio.map((p) => ({
      label: p,
      value: p,
    }));

 const handleInputCha = (inputV) => {
  setInputV(inputV)
}
 async function otp() {
          
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
   
   
   let ite = { sale_id };
 try {
   let result = await fetch(`https://api.prestigedelta.com/businessbopis/`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'accept': 'application/json',
       'Authorization': `Bearer ${bab}`
     },
     body: JSON.stringify(ite)
   });
         if (result.status !== 200) {
     const errorResult = await result.json();
     setMessag(JSON.stringify(errorResult));
   } else {
      result =await result.json();
     setMessag('Get OTP from the order list page, which is to be given to the vendor upon delivery!')
     
      } 
 } catch (error) {
   // Handle fetch error
   console.error(error);
 };
}


 useEffect(() => {
    if (sale_id !== '') {
      otp();
    }
  }, [sale_id]);
  

  const changeProductCount = (productId, amount) => {
    setSelectedProducts((prevSelectedProducts) => {
      const updatedProduct = {
        ...prevSelectedProducts[productId],
        count: prevSelectedProducts[productId].count + amount
      };
      if (updatedProduct.count <= 0) {
        const { [productId]: _, ...rest } = prevSelectedProducts;
        return rest;
      }
      return { ...prevSelectedProducts, [productId]: updatedProduct };
    });
  };

  const changePriceType = (productId, type) => {
    setSelectedProducts((prevSelectedProducts) => ({
      ...prevSelectedProducts,
      [productId]: { ...prevSelectedProducts[productId], priceType: type }
    }));
  };

  const calculateTotal = () => {
    return Object.values(selectedProducts).reduce((total, product) => {
      const price = product.priceType === 'Item' ? product.price : product.pack_price;
      return total + price * product.count;
    }, 0);
  };

  return (
    <div>
    <Link to='/components/test'>
          <i className="fa-solid fa-chevron-left bac"></i>
        </Link>
      <ChakraProvider>
      <Heading fontSize='18px'>Checkout Page</Heading>
        {Object.values(selectedProducts).map((obj, index) => (
          <Card key={index}>
            <CardBody padding={2}>
              <Heading size='xs'>{obj.name}</Heading>
              <Image
                boxSize='150px'
                objectFit='cover'
                src={`${obj.image}`}
                alt={`${obj.name}`}
              />
              <Text>Pack Price: {obj.pack_price}</Text>
              <Text>Unit Price: {obj.price}</Text>
              <RadioGroup
                onChange={(value) => changePriceType(obj.id, value)}
                value={obj.priceType}
              >
                <Stack direction='row' align='center' justify='center' display='flex'>
                  <Radio value='Item'>Unit</Radio>
                  <Radio value='Pack'>Pack</Radio>
                </Stack>
              </RadioGroup>
              <Stack direction="row" align="center" justify='center' display='flex'>
                <IconButton
                  aria-label="Decrease count"
                  icon={<MinusIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeProductCount(obj.id, -1);
                  }}
                  size="sm"
                />
                <Box>{obj.count}</Box>
                <IconButton
                  aria-label="Increase count"
                  icon={<AddIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeProductCount(obj.id, 1);
                  }}
                  size="sm"
                />
              </Stack>
              <Typography textAlign='left' marginLeft='7%'>Set time to pick up goods</Typography>         
    <ValidationTextField
           onChange={handleDob}
        label=""
        type='date'
        required
        variant="outlined"
        id="validation-outlined-input"
      /> </CardBody>
          </Card>
        ))} 
        <Typography textAlign='left' marginLeft='7%'>Set time to pick up goods</Typography>         
    <ValidationTextField
           onChange={handleDob}
        label=""
        type='date'
        required
        variant="outlined"
        id="validation-outlined-input"
      />
        <Heading fontSize='16px'>Total: ₦{(parseInt(calculateTotal().toFixed(2))).toLocaleString('en-US')}</Heading>
       <br/> {buttonVisible && ( <Button colorScheme='green' onClick={aprod}>Purchase</Button>
        )}
        {!buttonVisible && <Spinner/>}
        <Text>{messag}</Text>
        {sale_id ? (<Button colorScheme='blue' onClick={onOpen}>Review Merchant</Button>): null}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
          
            <ModalHeader>Review and Rate</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
      {fun === '' ? (
      <div>
      <Textarea
        value={value}
        onChange={handleInputChange}
        placeholder='Write a review'
        size='sm'
      />
       <Select
        onChange={handleInputCha}
        className="pne"
        placeholder="Select a Rating"
        options={opt}
        value={inputV} /><br/>
       <br/>   <br/> {fun ? <p>{fun}</p> : null} 
                {buttonVisible && (  <Button  colorScheme='blue' variant='solid' onClick={fproj}>Submit</Button> 
                )}
      {!buttonVisible && <p>Processing...</p>}
            
            </div>) :
            <div>
          
          <img className='goo' src={good} alt="" />
          <Heading fontSize='14px' className="hoo">Review and Rating Submitted!</Heading>  
      </div>}
      </ModalBody>
              </ModalContent>
      
            </Modal>
      </ChakraProvider>
    </div>
  );
};

export default Checkout;
