import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { withRouter } from 'next/router';
import { isAuth, getCookie } from '../../actions/authActions';
import { getLocationById, updateLocation } from '../../actions/locationActions';
import Popup from '../../components/Popup';
import Header from '../../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import FileUpdate from '../../components/FileUpdate';
import LocationEditForm from '../../components/LocationEditForm';



//FORM - INITIAL STATE
const initialState = {
    name: '',
    image: {},
    maxLong: '',
    minLong: '',
    maxLat: '',
    minLat: ''
}





const locationedit = ({ router }) => {
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
        // <FileUpload /> needs originalImg id (for deletion from Cloudinary) when replacing old for new
    const [originalImage, setOriginalImage] = useState('');


      //pre-fill form
    const [values, setValues] = useState(initialState);
    const locationId = router.query.locationId;

    useEffect(() => {
        getLocationById(locationId)
            .then(data => {
                if (data.error) {
                    showPopup(data.error);
                } else {
                    setValues(data);
                    setOriginalImage(data.image.public_id)
                }
            })
    }, []);


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

        if (
            !parseFloat(values.maxLong) ||
            parseFloat(values.maxLong) > 22.602 || //westernmost point of Slovakia
            !parseFloat(values.minLong) ||
            parseFloat(values.minLong) < 16.830546090033035 || //easternmost point of Slovakia
            parseFloat(values.maxLong) < parseFloat(values.minLong) || 
            !parseFloat(values.maxLat) ||
            parseFloat(values.maxLat) > 49.61895903149497 || //northernmost point of Slovakia
            !parseFloat(values.minLat) ||
            parseFloat(values.minLat) < 47.7170790818681 || //southernmost point of Slovakia
            parseFloat(values.maxLat) < parseFloat(values.minLat)
            ) {
                showPopup(`Error. Check: format(DD), coords within Slovakia, is max > min?`);
                return;
        };

        updateLocation(locationId, values)
            .then(data => {
                if (data.error) {
                    return showPopup(data.error);
                }

                showPopup(`Loacation Updated`);
            });
    }



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <section className="admin-location-edit-screen">
                <button className="go-back-btn" onClick={() => {Router.push('/admin/locationlist')}}>
                    <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                    {' '}
                    Go Back
                </button>

                <div className="form-container">
                    <h2>Update Location</h2>

                    <FileUpdate 
                        values={values}
                        setValues={setValues}
                        showPopup={showPopup}
                        originalImage={originalImage}
                        setOriginalImage={setOriginalImage}
                        locationId={locationId}
                    />

                    <LocationEditForm 
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



export default withRouter(locationedit);
