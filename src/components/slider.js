import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import pic2 from './images/pic2.svg';
import pic3 from './images/pic3.svg';
import pic1 from './images/pic1.svg';


const proprietes = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: false,
}

const SlidingPage =() => {
    const images = [pic1, 
        pic2,
        pic3
    ];
    return(
    <Slide {...proprietes} className="indicator" >
    <div className="each-slide-effect">
        <div >
            <img src={images[0]} alt=''/>
            
        </div>
    </div>
    <div className="each-slide-effect">
        <div >
            <img src={images[1]} alt=''/>
            
        </div>
    </div>
    <div className="each-slide-effect">
        <div>
            <img src={images[2]} alt=''/>
            
        </div>
    </div>
</Slide>
    )
}
export default SlidingPage