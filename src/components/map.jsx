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
} from '@chakra-ui/react';

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

  const transformData = async (data) => {
    const geocodedPlaces = await Promise.all(
      data.map(async (item, index) => {
        if (item.latitude && item.longitude) {
          return {
            id: index + 1,
            name: item.business_name,
            icon: 'https://myprest.s3.eu-west-2.amazonaws.com/shopping-cart_7835563.png', // Standard Google Maps cart-like icon
            location: { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) },
            pack_price: parseFloat(item.pack_price),
            unit_price: parseFloat(item.unit_price),
            business_id: item.business_id
          };
        } else {
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(item.address)}&key=YOUR_GOOGLE_MAPS_API_KEY`);
          const geocodeData = await response.json();
          if (geocodeData.results.length > 0) {
            const { lat, lng } = geocodeData.results[0].geometry.location;
            return {
              id: index + 1,
              name: item.business_name,
              icon: 'http://maps.google.com/mapfiles/kml/pal4/icon62.png', // Standard Google Maps cart-like icon
              location: { lat, lng },
              pack_price: parseFloat(item.pack_price),
              unit_price: parseFloat(item.unit_price)
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

    const response = await fetch(`https://api.prestigedelta.com/productsearch/?product_name=${query}&max_price=${price}&lng=${currentPosition.lng}&lat=${currentPosition.lat}&max_distance=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bab}`
      }
    });
    const data = await response.json();
    const filteredData = data.filter(place => place.latitude !== null && place.longitude !== null);
    const transformedData = await transformData(filteredData);
    setPlaces(transformedData);
  };

  const handleShop = (place) => {
    // Redirect to the shop page with place data
    navigate('/components/shop', { state: { place } });
     console.log(place)
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
        <Link to='/components/product'>
          <i className="fa-solid fa-chevron-left bac"></i>
        </Link>

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
                  url: place.icon,
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
