import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { withRouter } from 'next/router';
import { isAuth, getCookie } from '../../actions/authActions';
import { getHutById , updateHut } from '../../actions/hutActions';
import Popup from '../../components/Popup';
import Header from '../../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import HutFileUpdate from '../../components/HutFileUpdate';
import HutEditForm from '../../components/HutEditForm';



//FORM - INITIAL STATE
const initialState = {
    name: '',
    latitude: '',
    longitude: '',
    location: {},
    type: '',
    image: {},
    where: '',
    objectdescription: '',
    water: '',
    warning: '',
    addedby: ''
};





const hutedit = ({ router }) => {
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
        // <HutFileUpload /> needs originalImg id (for deletion from Cloudinary) when replacing old img for new one
    const [originalImage, setOriginalImage] = useState('');

      //pre-fill form
    const [values, setValues] = useState(initialState);
    const hutId = router.query.hutId;

    useEffect(() => {
        getHutById(hutId)
            .then(data => {
                if (data.error) {
                    showPopup(data.error);
                } else {
                    setValues({...data, location: data.location._id, type: data.type._id}); //got rid of location.name & type.name 'cos HutEditForm and hutController expect a string => location: '15dd16194sxsac85', not an object location: {_id, name}. Same for type.
                    setOriginalImage(data.image.public_id); //so Cloudinary can delete old image if new one is added
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

        if (!values.latitude || !values.longitude) {
            showPopup(`Lat and Long are required`);
            return;
        }

        if (!values.location || !values.type) {
            showPopup(`Location and Type are required`);
            return;
        }

        if (!values.image.public_id || !values.image.url) {
            showPopup(`Image upload is required`);
            return;
        }

        updateHut(hutId, values)
            .then(data => {
                if (data.error) {
                    return showPopup(data.error);
                }

                showPopup(`Hut updated`);
            });
    }



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <section className="admin-hut-edit-screen">
                <button className="go-back-btn" onClick={() => {Router.push('/admin/hutlist')}}>
                    <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                    {' '}
                    Go Back
                </button>

                <div className="form-container">
                    
                    <HutEditForm 
                        values={values}
                        setValues={setValues}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                    >
                            <HutFileUpdate 
                                values={values}
                                setValues={setValues}
                                showPopup={showPopup}
                                originalImage={originalImage}
                                setOriginalImage={setOriginalImage}
                                hutId={hutId}
                            />
                    </HutEditForm>

                </div>
            </section>

        </Popup>
    )
}



export default withRouter(hutedit);
