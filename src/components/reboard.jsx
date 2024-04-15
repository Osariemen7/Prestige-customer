import { useState } from "react"
import { useNavigate } from "react-router-dom";

const Bud=()=>{
    const [message, setMessage] = useState('');
    const [budget1, setBudget1] = useState(0);
    const [budget2, setBudget2] = useState(0);
    const [budget3, setBudget3] = useState(0);
    const [budget4, setBudget4] = useState(0)
    const [total, setTotal] = useState(0)
    const navigate = useNavigate()

    

    let tok = JSON.parse(localStorage.getItem("user-info"));
    const terms = (tok) => {
        let refreshval;
      
        if ( typeof tok ==='undefined' || tok === null) {
          refreshval = 0;
        } else {
          refreshval = tok.refresh_token;
        }
      
        return refreshval;
      };
      let refresh = terms(tok)

    const handleBuget1 =(event)=> {
        setBudget1(event.target.value)
    
    }
    const handleBuget2 =(event)=> {
        setBudget2(event.target.value)

    }
    const handleBuget3 =(event)=> {
        setBudget3(event.target.value)
    }
    const handleBuget4 =(event)=> {
        setBudget4(event.target.value)
        
    }
    const updateTotal = (e) => {
        e.preventDefault();
        const newTotal =parseFloat(budget1) + (parseFloat(budget2) +parseFloat(budget3) + parseFloat(budget4)) ;
         
        setTotal(newTotal);
      };
console.log(parseFloat(budget2) + parseFloat(budget3) + parseFloat(budget4))
    async function bus(e) {
        e.preventDefault();
        let ite ={refresh}
        let rep = await fetch ('https://sandbox.prestigedelta.com/refreshtoken/',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
              'accept' : 'application/json'
         },
         body:JSON.stringify(ite)
        });
        rep = await rep.json();
        let bab = rep.access_token
          
          let item = {
            sub_accounts: [
                {
                  name: "GENERAL EXPENSE",
                  account_type: "EXPENSE",
                  budget: budget1, // Replace with the actual state variable for buget1
                },
                {
                  name: "SALARIES",
                  account_type: "EXPENSE",
                  budget: budget2, // Replace with the actual state variable for buget2
                },
                {
                    name: "TAXES",
                    account_type: "EXPENSE",
                    budget: budget3, // Replace with the actual state variable for buget3
                  },
                  {
                    name: "PROFIT",
                    account_type: "EXPENSE",
                    budget: budget4, // Replace with the actual state variable for buget4
                  },
                ],
          };
          let result = await fetch ('https://sandbox.prestigedelta.com/createaccount/',{
              method: 'POST',
              headers:{
                'Content-Type': 'application/json',
                'accept' : 'application/json',
                'Authorization': `Bearer ${bab}`
           },
           body:JSON.stringify(item)
          });
          if (result.status !== 201) {
            result = await result.json()
            setMessage(JSON.stringify(result.message));
          } else {
            result = await result.json();
          localStorage.setItem('user-info', JSON.stringify(tok)) 
          navigate('/components/thanks')
          }
        }

    return(
        <div>
        <h2>Set your Monthly Budget</h2>
        <form>
            <p className="sp">What is your profit target for the Month?</p>
            <input className="line" type='number' onChange={handleBuget1} /><br/><br/>
            <p className="sp">How much are you spending on salaries monthly?</p>
            <input className="line" type='number' onChange={handleBuget2} /><br/><br/>
            <p className="sp">How much do you pay for taxes and levies per month?</p>
            <input className="line" type='number' onChange={handleBuget3} /><br/><br/>
            <p className="sp">How much do spend on other expenses per month?</p>
            <input className="line" type='number' onChange={handleBuget4} /><br/><br/>
            <div className="message">{message ? <p>{message}</p> : null}</div>
           {total === 0 ? null:<h4 >Your target Monthly revenue is:<br/>₦{(total).toLocaleString('en-Us')}</h4>} 
            {total === 0 ?(
             <button onClick={updateTotal} className="pog">Next</button>):(
                <button className='pog' onClick={bus} type="submit">Next</button>
             )}
            
        </form>

        </div>
    )
}
export default Bud