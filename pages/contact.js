import React, { useState, useEffect } from 'react';
import Router, { withRouter } from 'next/router';
import Header from '../components/Header';
import Popup from '../components/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { sendForm } from '../actions/contactActions';




const contact = ({ router }) => {
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
      const [values, setValues] = useState({email: '', message: ''});
      const { email, message } = values;

      //change handler
      const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

      //submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!email || !message) {
            return showPopup(`Email and Message are required`);
        }

        sendForm(values)
            .then(data => {
                if (data.error || !data) {
                    return showPopup(data.error || `Email failed`)
                }

                showPopup(`Email sent. Thank you for contacting us`);
                setValues({email: '', message: ''});
            });
    }



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header />

            <div className='contact-container'>

                <button className="go-back-btn" onClick={() => {Router.push(router.query.redirect ? router.query.redirect : '/controls')}}>
                    <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                    {' '}
                    Go Back
                </button>
                
                <div className="card-container">
                    <div className="card">
                        <div className='front'>

                            <h2>Contact Us</h2>
                            <form onSubmit={handleSubmit}>

                                <div className="form-group">
                                    <label>What email address can we reply to? </label>
                                    <input type="email" name='email' value={email} placeholder='Your email address' onChange={handleChange} autoComplete='off' />
                                </div>

                                <div className="form-group">
                                    <label>Your message: </label>
                                    <textarea 
                                        placeholder='Your message...'
                                        name='message'
                                        value={message}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <button type="submit">Send Message</button>
                                </div>
                            </form>
                            

                        </div>
                    </div>
                </div>
            </div>

        </Popup>
    )
}

export default withRouter(contact)
