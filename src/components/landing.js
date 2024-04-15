import SlidingPage from "./slider";
import {Link} from "react-router-dom"


const LandPage = () => {
    return(
        <div>
           <SlidingPage/>
           <div >
           <Link to="components/signup">
              <button className="but1">
                 Create Account
              </button>
           </Link>
              
           </div>
           <div>
              <Link to="components/login">
                 <button className="but2">
                     Login to my account
                 </button>
              </Link>
               
           
           </div>
        </div>
        

    )
}    
export default LandPage