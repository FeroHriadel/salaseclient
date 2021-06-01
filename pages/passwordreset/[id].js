import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { withRouter } from 'next/router';
import Header from '../../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Popup from '../../components/Popup';
import { resetPassword } from '../../actions/authActions';


const passwordreset = ({ router }) => {
    //'RESETPASSWORDLINK' FROM URL
    const resetPasswordLink = router.query.id;



   //POPUP
   const [popupShown, setIsPopupShown] = useState(false);
   const [popupText, setPopupText] = useState('');

   const showPopup = (text) => {
       setPopupText(text);
       setIsPopupShown(!popupShown);
       setTimeout(() => {
           setIsPopupShown(popupShown);
       }, 3000);
   }



    //FORM
      //values
    const [values, setValues] = useState({
        newPassword: '',
        blockSubmit: false
    });

      //submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!values.newPassword || values.newPassword === '') {
            return showPopup(`Please enter your new password`);
        } 

        resetPassword(resetPasswordLink, values.newPassword)
            .then(data => {
                if (data.error) {
                    return showPopup(data.error);
                }

                showPopup(`You may now login with your new password`);
                setValues({...values, blockSubmit: true});
            })

    }



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header />

            <section className="password-reset-screen"> 
                <button className="go-back-btn" onClick={() => {Router.push('/signin')}}>
                    <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                    {' '}
                    Go to Login
                </button>

                <form className="form-container" onSubmit={handleSubmit}>
                    <h2>Please enter your new password:</h2>
                    <input 
                        type="text"
                        name='newPassword'
                        value={values.newPassword}
                        onChange={(e) => {setValues({...values, newPassword: e.target.value})}}
                        placeholder='.......'
                    />
                    <button type='submit' disabled={values.blockSubmit}>Confirm New Password</button>
                </form>
            </section>

        </Popup>
    )
}

export default withRouter(passwordreset);
