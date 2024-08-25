import React, { useState, useCallback, useEffect } from 'react';
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
  Stack,
  Heading
} from '@chakra-ui/react';
import { Nav } from './nav.jsx'
import Select from 'react-select';

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
  const [message, setMessage] = useState('')
  const [directions, setDirections] = useState(null);
  const [type, setType] = useState('item');
  const navigate = useNavigate();

  const optio = ['item', 'pack'];
    const opt = optio.map((p) => ({
      label: p,
      value: p,
    }));

    const handleInput = (input) => {
      setType(input)
    }
  const transformData = async (data) => {
    const geocodedPlaces = await Promise.all(
      data.map(async (item, index) => {
        if (item.latitude && item.longitude) {
          return {
            id: index + 1,
            name: item.business_name,
            icon: 'https://myprest.s3.eu-west-2.amazonaws.com/icart.jpeg', // Standard Google Maps cart-like icon
            location: { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) },
            pack_price: parseFloat(item.pack_price),
            unit_price: parseFloat(item.unit_price),
            business_id: item.business_id,
            available_pack: item.packs_in_stock,
            available: item.units_in_stock,
            phone_no: (item.phone_number).replace('234', '0'),
          address: item.address
          };
        } else {
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(item.address)}&key=YOUR_GOOGLE_MAPS_API_KEY`);
          const geocodeData = await response.json();
          if (geocodeData.results.length > 0) {
            const { lat, lng } = geocodeData.results[0].geometry.location;
            return {
              id: index + 1,
              name: item.business_name,
              icon: 'https://myprest.s3.eu-west-2.amazonaws.com/icart.jpeg', // Standard Google Maps cart-like icon
              location: { lat, lng },
              pack_price: parseFloat(item.pack_price),
              unit_price: parseFloat(item.unit_price),
              business_id: item.business_id
            };
          } else {
            return null;
          }
        }
      })
    );

    return geocodedPlaces.filter(place => place !== null);
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

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const fetchPlaces = async () => {
    let tok = JSON.parse(localStorage.getItem("user-info"));
    let refresh = tok?.refresh_token ?? 0;

    let rep = await fetch('https://api.prestigedelta.com/refreshtoken/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ refresh })
    });
    rep = await rep.json();
    let bab = rep.access_token;

    const response = await fetch(`https://api.prestigedelta.com/productsearch/?product_name=${query}&max_price=${price}&lng=${currentPosition.lng}&lat=${currentPosition.lat}&max_distance=1&quantity_type=${type.value}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bab}`
      }
    });
    if (response.status === 401) {
      navigate('/components/login');}
      else {
    const data = await response.json();
    const filteredData = data.filter(place => place.latitude !== null && place.longitude !== null);
    const transformedData = await transformData(filteredData);
    setPlaces(transformedData);}
  };

  const handleShop = (place) => {
    // Redirect to the shop page with place data
    navigate('/components/shop', { state: { place } });
     console.log(place)
  };

  const handleSearch = () => {
    if (places === '' || price === '') {
        setMessage('All fields must be filled')
    }
    else{
    fetchPlaces();
    onClose();}
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

  const handleMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setCurrentPosition({ lat: newLat, lng: newLng });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching the geolocation: ", error);
        }
      );
    }
  }, []);

  
  return (
    <ChakraProvider>
      <div>
        <Nav/>
        <LoadScript googleMapsApiKey="AIzaSyCP4llmkll6GKy5NZ9RdmR3-U5paXEi4ug" libraries={['places']}>
      
        <div className='mobile-view'>
        <Heading fontSize='18px'>Find Nearby Products at the Best Prices</Heading>
        <Button colorScheme='green' mb={2} onClick={onOpen}>Search Product</Button>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
           {window.google && (
            <Marker
              position={currentPosition}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
              label={{
                text: "You",
                color: "blue",
                fontSize: "16px",
                fontWeight: "bold"
              }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                labelOrigin: new window.google.maps.Point(0, -20)
              }}
            />
             )}
            {places.map((place) => (
              <Marker
                key={place.business_id}
                title={place.name}
                label={{
                  text: `₦${place.unit_price}`,
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
                icon={{
                  url: place.icon,
                  scaledSize: new window.google.maps.Size(42, 42),
                  labelOrigin: new window.google.maps.Point(24, -10)
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
                  <p>
  Unit Price: ₦{selectedPlace.unit_price}, 
  <span style={{ color: selectedPlace.available < 5 ? 'red' : 'black' }}>
    {selectedPlace.available} left
  </span> 
</p>
<p>
  Pack Price: ₦{selectedPlace.pack_price}, 
  <span style={{ color: selectedPlace.available_pack < 5 ? 'red' : 'black' }}>
    {selectedPlace.available_pack} left
  </span>
</p>
                  <Stack direction='row' spacing={1} justify='center' mt={2}>
                    <Button colorScheme='green' onClick={() => handleShop(selectedPlace)}>Shop</Button>
                    <Button colorScheme='blue' onClick={handleShowDirections}>Direction</Button>
                  </Stack>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

        </div>
        <div className='desktop-view'>
          <div className='content'>
          <Heading fontSize='18px'>Buy Nearby Products at the Best Prices</Heading>
          <Button colorScheme='green' mb={2} onClick={onOpen}>Search Product</Button>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
           {window.google && (
            <Marker
              position={currentPosition}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
              label={{
                text: "You",
                color: "blue",
                fontSize: "16px",
                fontWeight: "bold"
              }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                labelOrigin: new window.google.maps.Point(0, -20)
              }}
            />
             )}
            {places.map((place) => (
              <Marker
                key={place.business_id}
                title={place.name}
                label={{
                  text: `₦${place.unit_price}`,
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
                icon={{
                  url: place.icon,
                  scaledSize: new window.google.maps.Size(42, 42),
                  labelOrigin: new window.google.maps.Point(24, -10)
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
                  <p>Unit Price: ₦{selectedPlace.unit_price},{selectedPlace.available} available</p>
                  <p>Pack Price: ₦{selectedPlace.pack_price}, {selectedPlace.available_pack} available: </p>
                  <Stack direction='row' spacing={1} justify='center' mt={2}>
                    <Button colorScheme='green' onClick={() => handleShop(selectedPlace)}>Shop</Button>
                    <Button colorScheme='blue' onClick={handleShowDirections}>Direction</Button>
                  </Stack>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
          </div>
        </div>
          
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Search for Product</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                  <Input
                    type="text"
                    w={293}
                    size='md'
                    m={3}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Product Name"
                  /><br />
                   <Select
        onChange={handleInput}
        className='mop'
        placeholder="Quantity Type"
        options={opt}
        value={type} />
                  <Input
                    placeholder='Maximum Price'
                    w={293}
                    m={3}
                    size='md'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  /><br /><br />
                  <Button colorScheme='blue' onClick={handleSearch}>Search</Button>
                  <p>{message}</p>
              </ModalBody>
            </ModalContent>
          </Modal>
        </LoadScript>
      </div>
    </ChakraProvider>
  );
};

export default Map;
