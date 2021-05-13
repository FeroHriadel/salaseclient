import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Header from '../../components/Header';
import { isAuth, getCookie } from '../../actions/authActions';
import { createType} from '../../actions/typeActions';
import Popup from '../../components/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";



//FORM - INITIAL STATE
const initialState = {
    name: ''
}



const typeCreate = () => {
    //REDIRECT AWAY AFTER SIGNOUT
    const [loggedOut, setLoggedOut] = useState(false);

    useEffect(() => {
        if (loggedOut) {
            Router.push('/controls');
        }
    }, [loggedOut]);



    //REDIRECT NON-ADMINS AWAY
    useEffect(() => {
        if (isAuth().role !== 'admin') {
            Router.push('/controls');
        }
    }, []);



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
      //state
    const [values, setValues] = useState(initialState);

      //change handler
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

      //submit handler
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!values.name) {
            showPopup(`Name is required`);
            return;
        }

        createType(values)
            .then(data => {
                if (data.error) {
                    showPopup(data.error)
                } else {
                    showPopup('Type created');
                    setValues(initialState);
                }
            });
    }



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <section className="admin-type-create-screen">
                <button className="go-back-btn" onClick={() => {Router.push('/admin/typelist')}}>
                    <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                    {' '}
                    Go Back
                </button>

                <form className="form-container" onSubmit={handleSubmit}>
                    <h2>Add New Type</h2>
                    <input 
                        type="text"
                        name='name'
                        value={values.name}
                        onChange={handleChange}
                        placeholder='...'
                    />
                    <button type='submit'>add Type</button>



                </form>
            </section>

        </Popup>
    )
}

export default typeCreate;
