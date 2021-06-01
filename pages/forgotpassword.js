import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Header from '../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Popup from '../components/Popup';
import { forgotPassword } from '../actions/authActions';



const forgotpassword = () => {
   //POPUP
   const [popupShown, setIsPopupShown] = useState(false);
   const [popupText, setPopupText] = useState('');

   const showPopup = (text) => {
       setPopupText(text);
       setIsPopupShown(!popupShown);
       setTimeout(() => {
           setIsPopupShown(popupShown);
       }, 5000); //extended time to 5000 so user can read the entire success message (data.message)
   }



    //FORM
      //values
    const [values, setValues] = useState({
        email: '',
        blockSubmit: false
    });

      //handler
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!values.email || values.email === '' || !values.email.includes('@') || !values.email.includes('.')) {
            return showPopup(`Please enter a valid email`);
        }

        forgotPassword(values.email)
            .then(data => {
                if (data.error) {
                    return showPopup(data.error);
                }

                showPopup(data.message);
            });
        
        setValues({...values, blockSubmit: true});
    }



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header />

            <section className="forgot-password-screen"> 
                <button className="go-back-btn" onClick={() => {Router.push('/signin')}}>
                    <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                    {' '}
                    Go Back
                </button>

                <form className="form-container" onSubmit={handleSubmit}>
                    <h2>Please enter your email where we can send you a new password:</h2>
                    <input 
                        type="text"
                        name='email'
                        value={values.email}
                        onChange={(e) => {setValues({...values, email: e.target.value})}}
                        placeholder='.......'
                    />
                    <button type='submit' disabled={values.blockSubmit}>Confirm Email</button>
                </form>
            </section>

        </Popup>
    )
}

export default forgotpassword;
