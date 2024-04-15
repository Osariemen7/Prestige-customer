import { useState, useEffect } from 'react';
import {  useLocation, Link, useNavigate } from "react-router-dom";
import html2canvas from 'html2canvas';
import Logo from './images/Logo.png';
import jsPDF from 'jspdf';
import Modal from 'react-modal';


const Credit =()=> {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true);
    const [quantity, setQuatity] = useState([]);
    const [price, setPrice] = useState([]);
    const [type, setType] = useState([]);
    const [item, setItem] = useState([])
    const [inputVal, setInputVal] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [inputVa, setInputVa] = useState('')
    const [inputV, setInputV] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [customer, setCustomer] = useState('');
    const [inpu, setInpu] = useState('');
    const [number, setNumber] = useState('')
    const [val, setVal] = useState('')
    const location = useLocation()
    const navigate = useNavigate()
    let meal = location.state.ite

    let tok= JSON.parse(localStorage.getItem("user-info"));
    const terms = (tok) => {
       let refreshval;

  if ( tok === null || typeof tok === "undefined" ) {
    refreshval = 0;
  } else {
    refreshval = tok.refresh_token;
  }
  return refreshval;
};
const handleFormSubmit = (event) => {
    event.preventDefault();
    const newCustomer = customer || inpu;
    const newNumber = number || val
    setQuatity([...quantity, inputValue]);
    setInputValue("");
    setPrice([...price, inputVal]);
    setInputVal('');
    setItem([...item, inputVa]);
    setInputVa('');
    setType([...type, inputV])
    setInputV('');
    setCustomer(newCustomer)
    setInpu('')
    setNumber(newNumber)
    setVal('')
    closeModal()
  }
  let tota =(price.reduce((total, to) => {
    return total + parseFloat (to);
  }, 0));
  let total = (tota).toLocaleString('en-US')

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleCust = (event) =>{
    setInpu(event.target.value)
  }
   const handlePhone =(event) => {
    setVal(event.target.value)
   }
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleInputChang = (event) => {
    setInputVal(event.target.value);
    
  };
  const handleInputchan = (event) => {
    setInputVa(event.target.value)
  }
  const handleInputCha = (event) => {
    setInputV(event.target.value)
  }
  function toSentenceCase(inputString) {
    if (!inputString) return inputString; // Handle empty or null input
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

let refresh = terms(tok)
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
      setList(response)
        }}
        useEffect(() => {
          fetchData()
        }, [])
    
        const handleCaptureClick = async () => {
            const mainElement = document.getElementById('main-element');
            const canvas = await html2canvas(mainElement);
            const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for millimeters, 'a4' for page size
    
        // Calculate the width and height to fit the whole canvas on the PDF
        const imgWidth = 210; // A4 page width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        // Add the captured image to the PDF
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
    
        // Save the PDF
        pdf.save('Receipt.pdf');
    }
    console.log(meal)
        if(loading) {
          return(
          <p>Loading...</p>)}
    return(
        <div>
        <Link to='/components/accounts'><i class="fa-solid fa-chevron-left bac"></i></Link>
            <main id="main-element">
            <div className='rax'><h4 className='shi'>{toSentenceCase(list[0].business_name)}</h4></div> 
            <h5 className='invo'>INVOICE</h5> 
            <h6 className='saed'>Bill To: {customer} -<span> {number}</span></h6>
            <p className='ld'>{(new Date(meal.time)).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true})}</p>
               
            <hr className='hr'></hr>
                        
          <div className='grn'>
            <div className='cule'>
                <h4>Item</h4>
                <h4>Quantity</h4>
                <h4>Amount</h4>
                <h4>Quantity Type</h4>
            </div>
    
            <div className='cul'>
                 <ul className="au">
                    {item.map((todo, index) => (
                     <p key={index}>{todo}</p>))}
                 </ul>
                 <ul className="aul">
                     {quantity.map((to, index1) => (
                    <p key={index1}>{to}</p>
                  ))}
                 </ul>
                 <ul className="aul">
                     {price.map((t, index1) => (
                    <p key={index1}>₦{parseFloat(t).toLocaleString('en-US')}</p>
                  ))}
                 </ul>
                 <ul className="aul">
                     {type.map((tod, index1) => (
                    <p key={index1}>{tod}</p>
                  ))}
                 </ul></div>
                    <p className='cveh'>Total: ₦{total}</p>
                    
                <div className='cule'>
                <p>Received:</p>
                <p></p>
                <p>₦{(meal.amount).toLocaleString()}</p>
                </div>
                </div> 
                <p className='font'>Thank you for your Patronage!!!</p>
                <p className='font'>Phone No: {list[0].owner_phone}</p>
                <p className='font'>{list[0].owner_email}</p>
                <p className='font'>{list[0].address}</p>
                <img src={Logo} alt="logo" className="frame2"/>
                </main>
            {tota ===parseFloat(meal.amount)  ? (<button className='logb' onClick={handleCaptureClick}>Download</button>) : <button className='logb' onClick={openModal}>Add Item</button> }
            <Modal
            className='modal'
            isOpen={isOpen}
             onRequestClose={closeModal}
               contentLabel="Example Popup">
        <i class="fa-solid fa-x mx" onClick={closeModal}></i>
           <h3 className='h4'>Add Items Purchased</h3>
            <form >
            {customer === ''? (<input type='text' className='mine' placeholder='Customer Name' onChange={handleCust} />): null}
            {number === ''? (<input type='number' className='mine' placeholder='Customer Number' onChange={handlePhone} />): null}
            
                <input type="text" className='mine' placeholder='Item' onChange={handleInputchan} /><br/>
                <input type="number" className='mine' placeholder='Amount' onChange={handleInputChang} /><br/>
                   <input type='number' className='mine' placeholder='Quantity'
                    onChange={handleInputChange}
                    /><br/>
                    <select className='mine' onChange={handleInputCha}>
                      <option>Quantity type</option>
                      <option>Unit</option>
                      <option>Pack</option>
                      <option>Carton</option>
                      <option>Bag</option>
                    </select>
                
                
                <button className='put' onClick={handleFormSubmit}>Add</button>
            </form>
            </Modal> 
        </div>
    )
}
export default Credit