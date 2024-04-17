import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';


const Overdraft = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState('');
    const navigate = useNavigate()
    

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
    let response = await fetch("https://api.prestigedelta.com/accounts/",{
    method: "GET",
    headers:{'Authorization': `Bearer ${bab}`},
    })
    response = await response.json()
    localStorage.setItem('user-info', JSON.stringify(tok))
  //   if (data.code === 'token_not_valid'){
  //     navigate('/components/token')
  //   } else {
   setUsers(response)
   setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, []);
    
    let tok= JSON.parse(localStorage.getItem("user-info"));
    const terms = (tok) => {
      let refreshval;
    
      if (tok === null || typeof tok === 'undefined') {
        refreshval = 0;
      } else {
        refreshval = tok.refresh_token;
      }
    
      return refreshval;
    };
    let refresh = terms(tok)

    const currentDate = new Date(); // Get the current date

    const thirtyDaysBefore = new Date(); // Create a new Date object
    thirtyDaysBefore.setDate(currentDate.getDate() - 30)  

  
  
  if(loading) {
    return(
    <p>Loading...</p>)} 
    return(
        <div>
            <Link to='/components/accounts'><i class="fa-solid fa-chevron-left bac"></i></Link>
             <h4 className="oveh">Overdraft</h4>
             <h5 className="ove">Overdraft Balance</h5>
             <h1 className="oveh">₦{(users[0].overdraft.balance).toLocaleString('en-US')}</h1>
             <div className="pd">
               <div className="ovp">
                  <p>Overdraft Limit</p>
                  <h4>₦{(users[0].overdraft.limit).toLocaleString('en-US')}</h4>
               </div> 
               <div className="ovpi">
                    <p>Activated</p>
                    <h4>{(users[0].overdraft.activated).toLocaleString()}</h4>
               </div>
               <div className="opp">
                   <p>Daily Interest</p>
                   <p>0.1%</p>
               </div>
             </div>
             <p className="ov">{users[0].overdraft.message}</p>
        </div>
    )
}
export default Overdraft