import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, Box, Button, Heading, Stack, SimpleGrid,  Input, Text } from '@chakra-ui/react'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { Nav } from './nav.jsx'


const Chat = () => {
  const [info, setInfo] = useState()
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true)
  const [isload, setIsLoad] =useState(false)
  const [sidebar, setSidebar] = useState('')
  const [rightbar, setRightbar] = useState('')
  const [list, setList] = useState('')
  const [con, setCon] =useState([])
  const [thread, setThread] = useState('')
  const [selectedMessage, setSelectedMessage] = useState('');
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu state
  };

  let tok= JSON.parse(localStorage.getItem("user-info"));
  let refresh = tok.refresh_token
  const data = location.state && location.state.data;
useEffect(()=>{
  setThread(data ? data.thread_id  : '');
},[])
  

  const showSidebar = () => setSidebar(!sidebar && !rightbar)

  const showRighbar = ()=> setRightbar(!rightbar)
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
  setInfo(response)
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
      let response = await fetch("https://api.prestigedelta.com/getgptmessages/",{
      method: "GET",
      headers:{'Authorization': `Bearer ${bab}`},
      })
      response = await response.json()
    
    //   if (data.code === 'token_not_valid'){
    //     navigate('/components/token')
    //   } else {
      let  lastThread = response[0].thread_id;

      setThread(response? lastThread : '')
     setCon(response)
     
      }
      useEffect(() => {
        fetchDat()
      }, [])
    
    const creat = async() => {
      if (newMessage.trim() === '') return;
      const newMessages = [...messages, { text: newMessage, sender: 'user' }];
      setMessages(newMessages);
      setNewMessage('');

     setIsLoad(true)   
    let ite ={refresh}
    let rep = await fetch ('https://api.prestigedelta.com/refreshtoken/',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'accept' : 'application/json'
     },
     body:JSON.stringify(ite)
    });
    rep = await rep.json();
    let bab = rep.access_token
    
    
      console.warn(newMessage)
      let thread_id = thread
      let message = newMessage
      let item = {message, thread_id};
      let result = await fetch ('https://api.prestigedelta.com/sendgptmessage/',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
            'accept' : 'application/json',
            'Authorization': `Bearer ${bab}`
       },
       body:JSON.stringify(item)
      });
    
      if (result.status !== 200) {
    
      } else {
        result = await result.json();
        setList(result)
    
      }   
    }
    
    console.log(thread)
    const handleSendMessage = async () => {
       
       
        // Simulate a response from the assistant after posting the user's message
        setTimeout(async () => {
          try {
            // Fetch the updated messages from the API
            let item = { refresh };
            let rep = await fetch('https://api.prestigedelta.com/refreshtoken/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
              },
              body: JSON.stringify(item),
            });
            rep = await rep.json();
            let bab = rep.access_token;
            const response = await fetch(
              'https://api.prestigedelta.com/getgptmessages/',
              {
                method: 'GET',
                headers: { Authorization: `Bearer ${bab}` },
              }
            );
            const result = await response.json();
        
            setIsLoad(false);
        
            // Find the latest assistant message
            const latestAssistantMessage = result.find(
              (result) =>
                result.conversation.length > 0 &&
                result.conversation[0].role === 'assistant'
            );
        
            // Define matchingThread outside the setTimeout block
            let matchingThread;
        
            // If a specific thread is specified, find it
            if (thread) {
              matchingThread = result.find((threads) => threads.thread_id === thread);
            }
        
            // Extract the latest message_value if the matchingThread is found
            const responseMessage = {
              text: matchingThread
                ? matchingThread?.conversation[0]?.message_value || 'No messages found'
                : latestAssistantMessage?.conversation[0]?.message_value || 'No response',
              sender: 'assistant',
            };
        
            // Update the messages state with the user's and assistant's messages
            setMessages((prevMessages) => [...prevMessages, responseMessage]);
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        }, 1000);
         }
         const send = async () => {
          try {
            await creat(); // Wait for creat() to complete
        
            // Check if creat() was successful and produced a response
            
              handleSendMessage(); // Call handleSendMessage only when there is a response
            
          } catch (error) {
            console.error('Error in send:', error);
          }
        };
   const mappedMessages = con.map(thread => {
    const lastConversation = thread;
    return lastConversation ? lastConversation : null;
  });
  let sub_account = tok.user.has_default_sub_accounts
  const subAccount = () => {
    const redirectTo = sub_account ? '/components/savings' : '/components/reboard';
    navigate(redirectTo);
  };
  
   console.log(list)
console.log(messages)
console.log(selectedMessage)
  if(loading) {
    return(
    <p>Loading...</p>)}   
          
    const formatMessage = (text) => {
      // Check if the message contains ** or newline characters
      if (text.includes('**') || text.includes('\n')) {
        // Format the message with ** replaced by <strong> and split into sentences
        const formattedMessage = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return formattedMessage.split('\n');
      } else {
        // Return the message as plain text
        return [text];
      }
    };

  return (
    <div style={{backgroundColor:'#F0F8FF', maxHeight:'100%', height: '100vh', paddingTop:'3%', zIndex:'0', alignItems: 'center', justifyContent: 'center'}}>
    <ChakraProvider>
     <Nav />
     <div className='mobile-view'>
    <div className='fl'>
    <div className="menu-button" style={{ margin: '0' }} >
        <i onClick={toggleMenu} className="fa-solid fa-square-caret-down"></i>
        <Heading fontSize="14px">Previous Chat</Heading>
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="slide-in-menu">
          <ul>
            <Heading fontSize="15px" color="white" mt={3}>
              Previous Chat
            </Heading>
            {mappedMessages.map((message, index) => (
              <div key={index}>
                <li
                  onClick={() => {
                    setSelectedMessage(message.conversation.slice().reverse());
                    setThread(message.thread_id);
                    showRighbar();
                    setMessages([]);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <p>{message.conversation[message.conversation.length - 1].message_value}</p>
                </li>
              </div>
            ))}
          </ul>
        </div>
      )}
</div>
    <div className="App">
      <div className="chat-container">
      
      <Heading fontSize='18px'>Business Assistant for {info[0].business_name}</Heading>
      <Text fontSize='14px' p={3}>Hi {info[0].owner_name}, I am your business assistant!<br/> Ask me any question about your business</Text>
      <Text fontSize='14px' m={2}>once you have reached the allotted number of free responses, you will be charged ₦1,500 for 30 responses</Text>
      <Card m='19px' backgroundColor='#F0F8FF' p={3}>
      {selectedMessage && (
        <div>
          {selectedMessage.map((message, index) => (
            <div
              key={index}
              style={{
                justifyContent: message.role === 'user' ? 'right' : 'left',
              }}
            >
              <div
                className={`message ${message.role}`}
                style={{ textAlign: message.role === 'user' ? 'right' : 'left',
                  backgroundColor: message.role === 'user' ? '#5cb85c' : '#337ab7',
                  color: 'white',
                  maxWidth: 'fit-content',
                  borderRadius: '5px',
                  padding: '5px',
                  margin: '8px',
                  marginLeft: message.role === 'user' ? 'auto' : '0',
                  marginRight: message.role === 'user' ? '0' : 'auto',
                  justifySelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Text className="message-content">{message.message_value}</Text>
              </div>
            </div>
          ))}
        </div>
      )}
    
        <div   >
        
         {messages.map((message, index) => (
      <div
        key={index}
        style={{
          justifyContent: message.sender === 'user' ? 'right' : 'left',
        }}
      >
        {formatMessage(message.text).map((formattedSentence, sentenceIndex) => (
          <div
   key={sentenceIndex}
            className={`message ${message.sender}`}
            style={{
              textAlign: message.sender === 'user' ? 'right' : 'left',
              backgroundColor: message.sender === 'user' ? '#5cb85c' : '#337ab7',
              color: 'white',
              maxWidth: 'fit-content',
              borderRadius: '5px',
              padding: '5px',
              margin: '8px',
              marginLeft: message.sender === 'user' ? 'auto' : '0',
              marginRight: message.sender === 'user' ? '0' : 'auto',
              justifySelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Text className="message-content" dangerouslySetInnerHTML={{ __html: formattedSentence }} />
          </div>
        ))}
      </div>
    ))}
{isload && (
      // Show 'loading...' only for incoming assistant messages
      <Skeleton  height="15px" mb="2" />
    ) }
        </div>   
    </Card>
        
    <div className="">
        <Input
          mt='12px'
          ml='5px'
           w='220px'
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button mb='6px' onClick={send}  colorScheme='blue' variant='solid' >Send</Button>
       
          </div>
      </div>
      </div>
    </div>
    <div className='desktop-view'>
      <div className='content'>
      <div className='fl'>
    <div className="menu-button" style={{ margin: '0' }} >
        <i onClick={toggleMenu} className="fa-solid fa-square-caret-down"></i>
        <Heading fontSize="14px">Previous Chat</Heading>
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="slide-in-menu">
          <ul>
            <Heading fontSize="15px" color="white" mt={3}>
              Previous Chat
            </Heading>
            {mappedMessages.map((message, index) => (
              <div key={index}>
                <li
                  onClick={() => {
                    setSelectedMessage(message.conversation.slice().reverse());
                    setThread(message.thread_id);
                    showRighbar();
                    setMessages([]);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <p>{message.conversation[message.conversation.length - 1].message_value}</p>
                </li>
              </div>
            ))}
          </ul>
        </div>
      )}
</div>
    <div className="App">
      <div className="chat-container">
      
      <Heading fontSize='18px'>Business Assistant for {info[0].business_name}</Heading>
      <Text fontSize='14px' p={3}>Hi {info[0].owner_name}, I am your business assistant!<br/> Ask me any question about your business</Text>
      <Text fontSize='14px' m={2}>once you have reached the allotted number of free responses, you will be charged ₦75 per response</Text>
      <Card m='19px' backgroundColor='#F0F8FF' p={3}>
      {selectedMessage && (
        <div>
          {selectedMessage.map((message, index) => (
            <div
              key={index}
              style={{
                justifyContent: message.role === 'user' ? 'right' : 'left',
              }}
            >
              <div
                className={`message ${message.role}`}
                style={{ textAlign: message.role === 'user' ? 'right' : 'left',
                  backgroundColor: message.role === 'user' ? '#5cb85c' : '#337ab7',
                  color: 'white',
                  maxWidth: 'fit-content',
                  borderRadius: '5px',
                  padding: '5px',
                  margin: '8px',
                  marginLeft: message.role === 'user' ? 'auto' : '0',
                  marginRight: message.role === 'user' ? '0' : 'auto',
                  justifySelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Text className="message-content">{message.message_value}</Text>
              </div>
            </div>
          ))}
        </div>
      )}
    
        <div   >
        
         {messages.map((message, index) => (
      <div
        key={index}
        style={{
          justifyContent: message.sender === 'user' ? 'right' : 'left',
        }}
      >
        {formatMessage(message.text).map((formattedSentence, sentenceIndex) => (
          <div
   key={sentenceIndex}
            className={`message ${message.sender}`}
            style={{
              textAlign: message.sender === 'user' ? 'right' : 'left',
              backgroundColor: message.sender === 'user' ? '#5cb85c' : '#337ab7',
              color: 'white',
              maxWidth: 'fit-content',
              borderRadius: '5px',
              padding: '5px',
              margin: '8px',
              marginLeft: message.sender === 'user' ? 'auto' : '0',
              marginRight: message.sender === 'user' ? '0' : 'auto',
              justifySelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Text className="message-content" dangerouslySetInnerHTML={{ __html: formattedSentence }} />
          </div>
        ))}
      </div>
    ))}
{isload && (
      // Show 'loading...' only for incoming assistant messages
      <Skeleton  height="15px" mb="2" />
    ) }
        </div>   
    </Card>
        
    <div className="">
        <Input
          mt='12px'
          ml='5px'
           w='220px'
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button mb='6px' onClick={send}  colorScheme='blue' variant='solid' >Send</Button>
       
          </div>
      </div>
      </div>
      </div>
    </div>
    </ChakraProvider>
    </div>
  );
}
 
export default Chat;
