import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Vector from './images/Vector.svg';

let tok= JSON.parse(localStorage.getItem("user-info"));
const term = (tok) => {
  let refval;  
  if (tok === null || typeof tok === 'undefined') {
    refval = 0;
  } else {
    refval = tok.refresh_token;
  }

  return refval;
}
let refresh = term(tok)
const Select =()=> {
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const location = useLocation();
  let pane = location.state.pal
  const terms = (pane) => {
    let nam;  
    if (pane.length === 0) {
      nam = 'null';
    } else {
      nam = pane.pan.name;
    }
  
    return nam;
  };
  let name = terms(pane)
  let goal_amount = pane.pan.tick.payment_amount
  let goal_type = pane.pan.tick.often
  
  const term1 = (pane) => {
    let tots;  
    if (typeof pane === 'undefined' || pane === null || pane.length < 6) {
      tots = 0;
    } else {
      tots= pane.pan.tota;
    }
  
    return tots;
  }
  let tota = term1(pane)
  let total = (tota).toLocaleString('en-US')
  const term2 = (pane) => {
    let pay;  
    if (pane.length === 0) {
      pay = 0;
    } else {
      pay = pane.clickedItem;
    }
  
    return pay;
  }
  let payment_amount = term2(pane)
  const term3 = (pane) => {
    let pays;  
    if (pane.length === 0) {
      pays = 0;
    } else {
      pays = pane.often;
    }
  
    return pays;
  }
  let payment_frequency = term3(pane)
  const term4 = (pane) => {
    let ast;  
    if (pane.length === 0) {
      ast = 'null';
    } else {
      ast= pane.pan.assets;
    }
  
    return ast;
  }
  let assets = term4(pane);
  let thirty = parseInt(tota) * 30 / 100;
  let seventy = tota - thirty;
  let interest = seventy * 6 / 100;
  const targetAmount = thirty;
  const frequentSavings = payment_amount;
  let remain = Math.ceil(thirty / payment_amount);
  const paying = (payment_frequency, targetAmount, frequentSavings) => {
    let repayment_mat;
    const currentDate = new Date();
    const remain = Math.ceil(targetAmount / frequentSavings);
    switch (payment_frequency) {
      case 'Daily':
        let startDat = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        repayment_mat = new Date(startDat.getTime() + remain * 24 * 60 * 60 * 1000);
        break;
  
      case 'Weekly':
        let startDa = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        repayment_mat = new Date(startDa.getTime() + remain * 7 * 24 * 60 * 60 * 1000);
        break;
  
      default:
         let startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        );
        repayment_mat = new Date(startDate.setMonth(startDate.getMonth() + remain));
        break;
    }
  
    return repayment_mat;
  };
  
  let funding_dat = paying(payment_frequency, targetAmount, frequentSavings);
  
  let funding_date = (funding_dat).toLocaleDateString('en-GB')
   
  const pay = (payment_frequency, tota, frequentSavings) => {
    let repayment_mat;
    const currentDate = new Date();
    const remain = Math.ceil(tota / frequentSavings);
    switch (payment_frequency) {
      case 'Daily':
        let startDat = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        repayment_mat = new Date(startDat.getTime() + remain * 24 * 60 * 60 * 1000);
        break;
  
      case 'Weekly':
        let startDa = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        repayment_mat = new Date(startDa.getTime() + remain * 7 * 24 * 60 * 60 * 1000);
        break;
  
      default:
        let startDate = new Date(2023, 7, 9); // August is represented by month number 7
        repayment_mat = new Date(startDate.setMonth(startDate.getMonth() + remain));
        break;
    }
  
    return repayment_mat;
    
  };
  
  let repayment_mature = pay(payment_frequency, tota, frequentSavings);
  
  let repayment_maturity = (repayment_mature).toLocaleDateString('en-GB')
  
  // const remains = Math.ceil(seventy - frequentSavings) / frequentSavings
  // let repayment_mature = new Date(currentDate.setMonth(currentDate.getMonth() + remains + 1));
  // let repayment_maturity =(repayment_mature).toLocaleDateString('en-GB')
  
  async function agree(e) {
    e.preventDefault();
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
      console.warn(name, payment_amount, payment_frequency, repayment_maturity, funding_date, assets)
      let project = {name, goal_amount, goal_type, payment_amount, payment_frequency, repayment_maturity, funding_date, assets};
      let result = await fetch ('https://sandbox.prestigedelta.com/createproject/',{
          method: 'POST',
          headers:{
            'Authorization': `Bearer ${bab}`,
            'Content-Type': 'application/json',
            'accept' : 'application/json'
       },
       body:JSON.stringify(project)
      });
      if (result.status === 401) {
        navigate('/components/login');
      } else if (result.status === 500) { 
        setMessage('Click again!');
      } else {
        result = await result.json();
        navigate('/components/pro', { state: { name } });
      }
    }
    console.log(thirty)
    console.log(payment_amount)
 console.log(tota)
 console.log(remain)
 
 
  return(
        <div>
           <Link to='/components/createp'><i class="fa-solid fa-chevron-left bac"></i></Link>
            <h4>{name}</h4>
            <p className='rp'>Estimated Project amount</p>
            <h1 className='rh'>₦{total}</h1>
            <div className='rev'>
                <p>Saving target</p>
             <p className='revp'>₦{(thirty).toLocaleString('en-US')}</p>
            </div>
            <div className='rev'>
                <p>Recuring Savings</p>
                <p>₦{(parseInt(payment_amount)).toLocaleString('en-US')}/{payment_frequency}</p>
            </div>
            <div className='rev'>
                <p>Loan Amount</p>
                <p>₦{(seventy).toLocaleString('en-US')}</p>
            </div>
            <div className='rev'>
                <p>Interest value</p>
                <p className='revp'>₦{(interest).toLocaleString('en-US')}(2%p.a)</p>
            </div>
            <div className='rev'>
                <p>Est. Maturity date</p>
                <p>{funding_date}</p>
            </div>
            <div className='revd'>
                <p>Est. Repayment date</p>
                <p>{repayment_maturity}</p>
            </div>
            <div className='dflex'>
            <img src={Vector} alt=''/>
                <p className='rp'>Maturity date may depend on your ability to make the payment on schedule</p>
            </div>
            <div className="message">{message ? <p>{message}</p> : null}</div>
            <button onClick={agree} className='but1'>Agree & Continue</button>
          <Link to='/components/createp'><button className='but2'>Start over</button></Link>  
        </div>
    )
}
export default Select