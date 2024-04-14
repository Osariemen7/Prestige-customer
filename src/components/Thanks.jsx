import tick from './images/tick.svg';
import { useNavigate } from 'react-router-dom';

const ThankPage=()=>{

     const navigate= useNavigate()
    
  
      function create(e) {
        e.preventDefault();
        navigate('/components/login')
      }
        
    
    return(
        <div className='tha'>
           <div className=''>
              <img src={tick} alt=''/>
              <h2 className='tp'>Successful</h2>
              <p className='tp'>Click next to continue</p>
              <button className='tbut' onClick={create}>Next</button>
           </div>
            
        </div>
    )
}
export default ThankPage