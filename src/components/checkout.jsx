import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Box,
  useDisclosure,
  Spinner,
  Textarea,
  Input,
  HStack,
  Grid,
  GridItem
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import good from './images/good.svg';

const Checkout = () => {
  const [message, setMessage] = useState('');
  const [buttonVisible, setButtonVisible] = useState(true);
  const [pickUpDate, setPickUpDate] = useState('');
  const [pickUpTime, setPickUpTime] = useState('');
  const [saleId, setSaleId] = useState('');
  const [review, setReview] = useState('');
  const [rat, setRating] = useState('');
  const [rev, setRev] = useState('');
  const location = useLocation();
  const [status, setStatus] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialItems = location.state.data.productsToCheckout;
  const business = location.state.data.store;
  const [selectedProducts, setSelectedProducts] = useState(
    initialItems.reduce((acc, item) => {
      acc[item.id] = { ...item, count: item.count || 1, priceType: 'Item' };
      return acc;
    }, {})
  );

  const handleInputChange = (e) => {
    setReview(e.target.value);
  };

  const handlePickUpDateChange = (event) => {
    setPickUpDate(event.target.value);
  };

  const handlePickUpTimeChange = (event) => {
    setPickUpTime(event.target.value);
  };

  const handleButtonClick = () => {
    setButtonVisible(false);
    setTimeout(() => {
      setButtonVisible(true);
    }, 20000);
  };

  let token = JSON.parse(localStorage.getItem("user-info"));
  const refreshToken = (token) => token ? token.refresh_token : 0;

  const refresh = refreshToken(token);

  const handlePurchase = async () => {
    handleButtonClick();
    let items = { refresh };
    let response = await fetch('https://api.prestigedelta.com/refreshtoken/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(items)
    });
    let data = await response.json();
    let accessToken = data.access_token;
    let paymentMethod = "BOPIS";
    let businessId = business.business_id;
    // Format the pick-up date and time manually
    const pickUpDateTime = new Date(`${pickUpDate}T${pickUpTime}`);
    const formattedPickUpDateTime = `${pickUpDateTime.getDate().toString().padStart(2, '0')}/${(pickUpDateTime.getMonth() + 1).toString().padStart(2, '0')}/${pickUpDateTime.getFullYear()} ${pickUpDateTime.getHours().toString().padStart(2, '0')}:${pickUpDateTime.getMinutes().toString().padStart(2, '0')}`;
    let products = Object.values(selectedProducts).map((product) => ({
      name: product.name,
      price: JSON.stringify(parseInt(product.price)),
      quantity: product.count,
      quantity_type: product.priceType,
      pack_size: product.pack_size,
      product_type: 'PRODUCT',
    }));

    let payload = { payment_method: paymentMethod, products, pick_up_time: formattedPickUpDateTime, business_id: businessId };

    try {
      let result = await fetch('https://api.prestigedelta.com/bopis/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (result.status !== 200) {
        const errorResult = await result.json();
        setMessage(JSON.stringify(errorResult));
      } else {
        const successRes = await result.json();
        setMessage(successRes.message, 'navigate to the page to view order');
        setStatus(successRes.status)
        setSaleId(successRes.sale_id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(business)
  const handleReviewSubmit = async () => {
    let items = { refresh };
    let response = await fetch('https://api.prestigedelta.com/refreshtoken/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(items)
    });
    let data = await response.json();
    let accessToken = data.access_token;
    let rating = rat.value
    let payload = { sale_id: saleId, rating, review };

    try {
      let result = await fetch('https://api.prestigedelta.com/ratings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (result.status !== 200) {
        const errorResult = await result.json();
      } else {
        const successResult = await result.json();
        setRev(successResult);
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleOtpRequest = async () => {
    let items = { refresh };
    let response = await fetch('https://api.prestigedelta.com/refreshtoken/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(items)
    });
    let data = await response.json();
    let accessToken = data.access_token;

    let payload = { sale_id: saleId };

    try {
      let result = await fetch('https://api.prestigedelta.com/businessbopis/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (result.status !== 200) {
        const errorResult = await result.json();
        setMessage(JSON.stringify(errorResult));
      } else {
        const successResult = await result.json();
        setMessage('Get OTP from the order list page, which is to be given to the vendor upon delivery!');
      }
    } catch (error) {
      console.error(error);
    }
  };
console.log(rev)
console.log(message)
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
console.log(selectedProducts)
const Purchase =()=>{
  if (pickUpDate === ''){
    setMessage('please set time to pick up goods')
  } else{
    handlePurchase()
  }
}

  return (
    <div>
      <Link to='/components/map'>
        <i className="fa-solid fa-chevron-left bac"></i>
      </Link>
      <ChakraProvider>
        <Heading fontSize='18px' mb={4}>Checkout Page</Heading>
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
          {Object.values(selectedProducts).map((product, index) => (
            <GridItem key={index}>
              <Card ml={7} mr={7} backgroundColor='#F3E5AB' >
                <CardBody padding={2}>
                  <Heading size='xs'>{product.name}</Heading>
                  <Stack display='flex' justify='center' flexDirection='row'>
                  <Image 
                    boxSize='150px'
                    objectFit='cover'
                    src={product.image}
                    alt={product.name}
                  />
                  </Stack>
                  <Text>Pack Price: {product.pack_price}</Text>
                  <Text>Unit Price: {product.price}</Text>
                  <RadioGroup
                    onChange={(value) => changePriceType(product.id, value)}
                    value={product.priceType}
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
                        changeProductCount(product.id, -1);
                      }}
                      size="sm"
                    />
                    <Box>{product.count}</Box>
                    <IconButton
                      aria-label="Increase count"
                      icon={<AddIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeProductCount(product.id, 1);
                      }}
                      size="sm"
                    />
                  </Stack>
                                  </CardBody>
                  </Card>
            </GridItem>
          ))}
        </Grid>
        <Text mt={2}>Set time to pick up goods</Text>
                  <HStack display='flex' justify='center'>
                    <Input
                      onChange={handlePickUpDateChange}
                      type='date'
                      width={135}
                    />
                    <Input
                      onChange={handlePickUpTimeChange}
                      type='time'
                      width={135}
                    />
                  </HStack>
                  <Heading fontSize='16px'>Total: ₦{(parseInt(calculateTotal().toFixed(2))).toLocaleString('en-US')}</Heading>
            
        <br />
        {buttonVisible ? (
          <Button colorScheme='green' onClick={Purchase}>Purchase</Button>
        ) : (
          <Spinner />
        )}
        <Text m={3}>{status} {message}</Text>
        {saleId && (
          <Button colorScheme='blue' onClick={onOpen}>Review Merchant</Button>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Review and Rate</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {rev === '' ? (
                <div>
                  <Textarea
                    value={review}
                    onChange={handleInputChange}
                    placeholder='Write a review'
                    size='sm'
                  /><br /> <br />
                  <Select
  onChange={(selectedOption) => setRating(selectedOption)}
  placeholder="Select a Rating"
  options={[0, 1, 2, 3, 4, 5].map((value) => ({
    label: value,
    value: value
  }))}
  value={rat}
/><br /><br />
                  {buttonVisible ? (
                    <Button colorScheme='blue' variant='solid' onClick={handleReviewSubmit}>Submit</Button>
                  ) : (
                    <p>Processing...</p>
                  )}
                </div>
              ) : (
                <div>
                  <img className='goo' src={good} alt="" />
                  <Heading fontSize='14px' className="hoo">Review and Rating Submitted!</Heading>
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    </div>
  );
};

export default Checkout;
