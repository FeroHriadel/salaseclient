import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Header from '../../components/Header';
import { isAuth, getCookie } from '../../actions/authActions';
import { createLocation, deleteLocationImage } from '../../actions/locationActions';
import FileUpload from '../../components/FileUpload';
import LocationCreateForm from '../../components/LocationCreateForm';
import Popup from '../../components/Popup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";



//FORM - INITIAL STATE
const initialState = {
    name: '',
    image: {},
    maxLong: '',
    minLong: '',
    maxLat: '',
    minLat: ''
}



const locationCreate = () => {
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

    
      //remove image from Cloudinary if form not submitted
    const [formSubmitObserver, setFormSubmitObserver] = useState({
        formSubmitted: false,
        imgId: null
    });

    useEffect(() => {
        const removeUnsubmittedImg = () => {
            if (!formSubmitObserver.formSubmitted && formSubmitObserver.imgId) {
                deleteLocationImage(formSubmitObserver.imgId);
            }
        }

        Router.events.on('routeChangeStart', removeUnsubmittedImg);
        return () => {
            Router.events.off('routeChangeStart', removeUnsubmittedImg);
        }
    }, [formSubmitObserver])
 

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

        if (!values.maxLong || !values.minLong || !values.maxLat || !values.minLat) {
            showPopup(`All 4 coordinates are required`);
            return;
        }

        if (!parseFloat(values.maxLong) || parseFloat(values.maxLong) > 22.602) { //westernmost point of Slovakia
            return showPopup(`maxLong ${values.maxLong} is not in Slovakia`);
        }

        if (!parseFloat(values.minLong) || parseFloat(values.minLong) < 16.830546090033035) { //easternmost point of Slovakia
                return showPopup(`minLong ${values.minLong} is not in Slovakia`)
            }

        if (!parseFloat(values.maxLat) || parseFloat(values.maxLat) > 49.61895903149497) { //northernmost point of Slovakia
            return showPopup(`maxLat ${values.maxLat} is not in Slovakia`);
        }

        if (!parseFloat(values.minLat) || parseFloat(values.minLat) < 47.7170790818681) { //southernmost point of Slovakia
            return showPopup(`minLat ${values.minLat} is not in Slovakia`);
        }

        createLocation(values)
            .then(data => {
                if (data.error) {
                    showPopup(data.error)
                } else {
                    showPopup('Location created');
                    setValues(initialState);
                    setFormSubmitObserver({formSubmitted: true, imgId: null});
                }
            });
    }



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <section className="admin-location-create-screen">
                <button className="go-back-btn" onClick={() => {Router.push('/admin/locationlist')}}>
                    <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                    {' '}
                    Go Back
                </button>

                <div className="form-container">
                    <h2>Add New Location</h2>

                    <FileUpload 
                        values={values}
                        setValues={setValues}
                        showPopup={showPopup}
                        formSubmitObserver={formSubmitObserver}
                        setFormSubmitObserver={setFormSubmitObserver}
                    />

                    <LocationCreateForm 
                        values={values}
                        setValues={setValues}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                    />

                </div>
            </section>

        </Popup>
    )
}

export default locationCreate;
