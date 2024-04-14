import { useState, useEffect } from 'react';
import {  useLocation, Link, useNavigate } from "react-router-dom";
import html2canvas from 'html2canvas';
import Logo from './images/Logo.png';
import jsPDF from 'jspdf';
const Recdet = () =>{
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true);
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
const credit =()=>{
  const ite = meal
  navigate('/components/credit', {state:{ite}} )
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
    // const handleShare = ()=> {
    //     if (navigator.share) {
    //         const pdfURL = 'https://prestigefinance.ppp/src/components/Receipt.pdf'; // Replace with the actual URL of your PDF
    //         navigator.share({
    //           title: 'Receipt.pdf',
    //           text: 'Check out this receipt',
    //           url: pdfURL,
    //         })
    //           .then(() => {
    //             console.log('Successfully shared the PDF.');
    //           })
    //           .catch((error) => {
    //             console.error('Error sharing the PDF:', error);
    //           });
    //       } else {
    //         console.log('Web Share API is not supported in this browser.');
    //       }
          
    // }
        console.log(meal)
        if(loading) {
          return(
          <p>Loading...</p>)}
    return(
        <div>
            <Link to='/components/accounts'><i class="fa-solid fa-chevron-left bac"></i></Link>
            <main id="main-element">
            <img src={Logo} alt="logo" className="frame1"/>

            
                <h4 >{list[0].business_name}</h4>
              
                {meal.transaction_type === 'NIPCR' || meal.transaction_type ==='CLOSE_PROJECT'?(<h3 className='minus'>+ ₦{(parseInt(meal.amount)).toLocaleString('en-US')} </h3>):<h3 className='minus'>- ₦{(parseInt(meal.amount)).toLocaleString('en-US')} </h3>}
                
                 <p className='ld'>{(new Date(meal.time)).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true})}</p>
                 
                <div className='box'>
                <div className='vasa3'>
                  <p>Transaction type:</p>
                  <p>{meal.transaction_type}</p>
                </div>
                <div className='rasa'>
                  <p>Beneficiary: </p>
                  <p>{meal.beneficiary.account_name}</p>
                </div>
                <div className="vasa3">
                <p>Receiver Account:</p>
              <p>{meal.beneficiary.account_number}</p>
                </div>
                <div className="vasa3">
               <p>Receiver Bank:</p>
               <p>{meal.beneficiary.bank_name}</p>
           </div>
           <div className='vasa3'>
               <p className=''>Status:</p>
               <p>{meal.status}</p>
           </div>
              <div className="vasa4">
              <p className='dnc'>Session Id:</p>
                    <p>{meal.session_id}</p>
              </div>
                </div><br></br>
                <div className='box'>
                    <p className='dnc'>Narration:</p>
                <p className='dnc'>{meal.narration}</p>
                </div>
                <p className='w'>prestigefinance.app</p>
                </main>
                {meal.transaction_type ==='NIPCR' ?  (
                    <button className='logb' onClick={credit}>Generate Receipt</button>
                    ): <button className='logb' onClick={handleCaptureClick}>Download</button>}
                    
                
        </div>
    )
}
export default Recdet