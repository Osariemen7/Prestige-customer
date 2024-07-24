import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import {
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Button,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { Nav } from './nav.jsx'

const containerStyle = {
  width: '100%',
  height: '100vh'
};


const defaultCenter = {
  lat: -34.397,
  lng: 150.644
};

const Map = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [query, setQuery] = useState('');
  const [price, setPrice] = useState('');
  const [directions, setDirections] = useState(null);
  const navigate = useNavigate();

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: index + 1, // Assuming the index can serve as a unique id
      name: item.business_name,
      icon: 'src/components/images/cart-shopping-solid.svg', // Replace with actual icon URL if available in your data
      location: { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) },
      pack_price: parseFloat(item.pack_price),
      unit_price: parseFloat(item.unit_price)
    }));
  };

  const onLoad = useCallback(function callback(map) {
    setMap(map);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentPosition(pos);
        map.panTo(pos);
      });
    }
  }, []);

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

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

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

    const response = await fetch(`https://api.prestigedelta.com/productsearch/?product_name=${query}&max_price=${price}&lng=${currentPosition.lng}&lat=${currentPosition.lat}&max_distance=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bab}`
      }
    });
    const data = await response.json();
    const filteredData = data.filter(place => place.latitude !== null && place.longitude !== null);
    const transformedData = transformData(filteredData);
    console.log('Transformed Data:', transformedData);
    setPlaces(transformedData);
  };
  

  const handleShop = (place) => {
    // Redirect to the shop page with place data
    navigate('/components/shop', { state: {place } });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchPlaces();
    onClose();
  };

  const handleShowDirections = () => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: currentPosition,
        destination: selectedPlace.location,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  return (
    <ChakraProvider>
    <Nav />
      <div>
       
        <LoadScript googleMapsApiKey="AIzaSyCP4llmkll6GKy5NZ9RdmR3-U5paXEi4ug" libraries={['places']}>
          <Button colorScheme='green' mb={2} onClick={onOpen}>Search Product</Button>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <Marker
              position={currentPosition}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }}
            />
            {places.map((place, index) => (
              <Marker
                key={index}
                title={place.name}
                icon={{
                  url: place.icon, // Custom cart icon URL
                  scaledSize: new window.google.maps.Size(32, 32) // Adjust size if needed
                }}
                position={place.location}
                onClick={() => setSelectedPlace(place)}
              />
            ))}

            {directions && (
              <DirectionsRenderer directions={directions} />
            )}
            {selectedPlace && (
              <InfoWindow
                position={selectedPlace.location}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div>
                  <h2>{selectedPlace.name}</h2>
                  <p>Unit Price: ₦{selectedPlace.unit_price}</p>
                  <p>Pack Price: ₦{selectedPlace.pack_price}</p>
                  <Stack direction='row' spacing={1} justify='center' mt={2}>
                    <Button colorScheme='green' onClick={() => handleShop(selectedPlace)}>Shop</Button>
                    <Button colorScheme='blue' onClick={handleShowDirections}>Direction</Button>
                  </Stack>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Search for Product</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleSearch}>
                  <Input
                    type="text"
                    w={293}
                    size='md'
                    m={3}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a product"
                  /><br />
                  <Input
                    placeholder='Maximum Price'
                    w={293}
                    m={3}
                    size='md'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  /><br /><br />
                  <Button colorScheme='blue' type="submit">Search</Button>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </LoadScript>
      </div>
    </ChakraProvider>
  );
};

export default Map;
