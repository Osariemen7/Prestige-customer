import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {ChakraProvider, Card, Button, Box, Image, Stack, CardBody, Heading, Text } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'; // Import the icons
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'


const Shop =() => {
const [place, setPlaces] = useState('')
const [ratings, setRatings] = useState('')
const [loading, setLoading] = useState(true)
const location = useLocation()
const navigate = useNavigate()
let store = location.state.place
const [selectedProducts, setSelectedProducts] = useState([]);

const toggleSelectProduct = (product) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts[product.id]) {
        const { [product.id]: _, ...rest } = prevSelectedProducts;
        return rest;
      } else {
        return { ...prevSelectedProducts, [product.id]: { ...product, count: 1 } };
      }
    });
  };

  const changeProductCount = (productId, amount) => {
    setSelectedProducts((prevSelectedProducts) => {
      const updatedProduct = { ...prevSelectedProducts[productId], count: prevSelectedProducts[productId].count + amount };
      if (updatedProduct.count <= 0) {
        const { [productId]: _, ...rest } = prevSelectedProducts;
        return rest;
      }
      return { ...prevSelectedProducts, [productId]: updatedProduct };
    });
  };

  const goToCheckout = () => {
    const productsToCheckout = Object.values(selectedProducts);
    let data = {productsToCheckout, store}
    navigate('/components/checkout', { state: {data} });
    // history.push('/checkout', { selectedProducts });
  };

const tok = JSON.parse(localStorage.getItem("user-info"));
  const terms = (tok) => {
    let refreshval;
    if (tok === null || typeof tok === 'undefined') {
      refreshval = 0;
    } else {
      refreshval = tok.refresh_token;
    }
    return refreshval;
  };
  const refresh = terms(tok);

const fetchPlaces = async () => {
    let ite = { refresh };
    let rep = await fetch('https://api.prestigedelta.com/refreshtoken/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(ite)
    });
    rep = await rep.json();
    let bab = rep.access_token;

    const response = await fetch(`https://api.prestigedelta.com/businessproducts/?business_id=${store.business_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bab}`
      }
    });
    const data = await response.json();
    setPlaces(data);
    setLoading(false)
    fetchRatings()
  };
  
  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchRatings = async () => {
    let ite = { refresh };
    let rep = await fetch('https://api.prestigedelta.com/refreshtoken/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(ite)
    });
    rep = await rep.json();
    let bab = rep.access_token;

    const response = await fetch(`https://api.prestigedelta.com/ratings/?business_id=${store.business_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bab}`
      }
    });
    const data = await response.json();
    setRatings(data);
  
  };
  
  useEffect(() => {
    if(place !== ''){
    fetchRatings()}
  }, [place])
  console.log(place)

  if(loading) {
    return(
    <p>Loading...</p>)
  }
return(
    <div>
    <Link to='/components/map'>
          <i className="fa-solid fa-chevron-left bac"></i>
        </Link>
    <ChakraProvider>
    <Heading fontSize='19px' m={2}>{store.name}</Heading>
    <Text>{store.phone_no}</Text>
        <Text>{store.address}</Text>
    <Box onClick={goToCheckout} left='70%' bottom='40%' position='fixed' zIndex='1' backgroundColor='#fcfbfc'
     border='1px solid lightblue' padding='2%' boxShadow= '5px 5px lightblue'>
        <Heading fontSize='14px' color='darkgreen'>Checkout</Heading>
        <i className="fa-solid fa-cart-shopping"></i>
    </Box>
    <Tabs isFitted variant='enclosed'>
<TabList mb='1em'>
    <Tab>Shop </Tab>
    <Tab>Ratings and Reviews</Tab>
  </TabList>
  <TabPanels>
    <TabPanel p={0}>

    <div className="card-container">
    {place.products.map((obj, index) => (
        <Card key={index}
         onClick={() => toggleSelectProduct(obj)}
         className={`card ${selectedProducts[obj.id] ? 'selected' : ''}`}
            m={3}
            style={{ cursor: 'pointer', backgroundColor: selectedProducts[obj.id] ? 'lightgreen' : 'white' }}>
          <CardBody padding={2} >
          <Stack display='flex' justify='center' flexDirection='row'>
          <Image 
    boxSize='150px'
    objectFit='cover'
    src={`${obj.image}`} alt={`${obj.name}`} />
    </Stack>
       <Heading size='xs'>{obj.name}</Heading>
            <Text>Available Packs: {obj.pack_count}</Text>
            <Text>Price of Pack: {obj.pack_price}</Text>
            <Text>Unit Price: {obj.price}</Text>
            <Stack direction="row" align="center">
                {selectedProducts[obj.id] ? (
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
                    <Box>{selectedProducts[obj.id].count}</Box>
            
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
                ) : (
                  <>
                    <Text >Add to Cart</Text>
                    <i className="fa-solid fa-cart-shopping ca"></i>
                  </>
                )}
              </Stack>
          </CardBody>
        </Card>
      ))}
      </div>
      <Button colorScheme='blue' onClick={goToCheckout} mt={4}>Proceed to Checkout</Button>
      </TabPanel>
      <TabPanel>
      {ratings ?
        <div className="reviews-container">
      {ratings.map((review, index) => (
        <div key={index} className="review-card">
          <div className="review-rating">
            Rating: {review.rating} / 5
          </div>
          <div className="review-text">
            {review.review}
          </div>
          <div className="review-date">
            Reviewed on: {new Date(review.created).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div> : null }
      </TabPanel>
</TabPanels>
                
</Tabs>
    </ChakraProvider>
        
    </div>
)

}
export default Shop
