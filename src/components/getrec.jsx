import { useState, useEffect } from 'react';
import {  useLocation, Link, useNavigate } from "react-router-dom";
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';
import Logo from './images/Logo.png';
import jsPDF from 'jspdf';
const Receipt=()=> {
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

let refresh = terms(tok)
    const fetchData = async () => {
        let item ={refresh}
        let rep = await fetch ('https://sandbox.prestigedelta.com/refreshtoken/',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
              'accept' : 'application/json'
         },
         body:JSON.stringify(item)
        });
        
        rep = await rep.json();
        let bab = rep.access_token
      let response = await fetch("https://sandbox.prestigedelta.com/businessprofile/",{
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
    pdf.save('download.pdf');
}
    console.log(meal)
    if(loading) {
      return(
      <p>Loading...</p>)}
    return(
        <div>
        <Link to='/components/accounts'><i class="fa-solid fa-chevron-left bac"></i></Link>
            <main id="main-element">
            <img src={Logo} alt="logo" className="frame1"/>

                <div>
                <h4 className='jos'>{list[0].business_name}</h4>
                </div>
                
                <h3 className='minus'>- ₦{(parseInt(meal.amount)).toLocaleString('en-US')} </h3>
                 <p className='ld'>{(new Date()).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true})}</p>
                <div className='box'>
                <div className='dasa'>
                  <p>Sub-Account debited:</p>
                  <p>{meal.sub_account}</p>
                </div>
                <div className='rasa'>
                  <p>Beneficiary: </p>
                  <p>{meal.account_name}</p>
                </div>
                <div className="vasa3">
                <p>Receiver Account</p>
              <p>{meal.nuban}</p>
                </div>
                <div className="vasa3">
               <p>Receiver Bank</p>
               <p>{meal.bank}</p>
           </div>
              <div className="vasa3">
                <p>Narration</p>
                <p>{meal.narration}</p>
              </div>
                </div>
                
           <div className="space">

           </div>
            </main>
            <button className="logb" onClick={handleCaptureClick}>Save</button>
        </div>
    )
}
export default Receipt