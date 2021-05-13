import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Header from '../../components/Header';
import Popup from '../../components/Popup';
import { isAuth, getCookie } from '../../actions/authActions';
import { getLocations } from '../../actions/locationActions';
import { deleteLocation, deleteLocationImage } from '../../actions/locationActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from '../../components/ConfirmModal';



const locationlist = () => {
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



    //MODAL
    const [showModal, setShowModal] = useState(false);
    const [actionConfirmed, setActionConfirmed] = useState(false);



    //GET LOCATIONS
      //get locations from db
    const [locations, setLocations] = useState(null);
    const [locationsLoading, setLocationsLoading] = useState(true);

    const loadLocations = () => {
        setLocationsLoading(true);

        getLocations()
            .then(data => {
                if (data && data.error) {
                    showPopup(data.error);
                    setLocationsLoading(false);
                } else {
                    setLocations(data);
                    setLocationsLoading(false);
                }
            })
    }

    useEffect(() => {
        loadLocations();
    }, []);



    //DELETE LOCATION
    const [locationData, setLocationData] = useState({});

    useEffect(() => {
        if (actionConfirmed) {
            deleteLocation(locationData.locationId)
                .then(data => {
                    if (data.error) {
                        return showPopup(data.error);
                    }

                    showPopup(`Location deleted`);
                })
                      
            deleteLocationImage(locationData.imageId);
            setActionConfirmed(false);

            const remainingLocations = locations.filter(location => location._id !== locationData.locationId);
            setLocations(remainingLocations);
            setLocationData({});
        }
    }, [actionConfirmed])



    //LOCATIONS HTML
    const showLocations = () => (
        <React.Fragment>
            <div className="title">
                <h1>Locations List</h1>
                <button title='Add Location' onClick={() => {Router.push('/admin/locationcreate')}}>
                    <FontAwesomeIcon icon={faPlus} className='icon'/>
                </button>
            </div>
            {
                locations && locations.length > 0 ?
                locations.map((location) => (
                    <div className="location-line" key={location._id}>
                        <p className='location-name'>{location.name}</p>
                        <div className='buttons'>
                            <button 
                                title='Edit'
                                onClick={() => {
                                    Router.push({
                                        pathname: '/admin/locationedit',
                                        query: {
                                            locationId: location._id
                                        }
                                    })
                                }}
                            >
                                <FontAwesomeIcon icon={faEdit} className='icon'/>
                            </button>
                            <button 
                                title='Delete' 
                                onClick={() => {
                                    setShowModal(true);
                                    setLocationData({
                                        locationId: location._id,
                                        imageId: location.image.public_id
                                    })
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} className='icon'/>
                            </button>
                        </div>
                    </div>
                ))
                :
                <h2 style={{fontFamily: 'Fondamento'}}>No locations</h2>
            }
        </React.Fragment>
    )

    

    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>
        
            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <section className="admin-location-list-screen">
                <div className="card-container">        
                    <div className="card">
                        <div className='front'>
                            <div className='list-wrapper'>
                                {
                                    locationsLoading ?
                                        <p style={{fontFamily: 'Fondamento'}}>Getting Locations...</p>
                                    :
                                        showLocations()
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        <ConfirmModal 
            showModal={showModal} 
            setShowModal={setShowModal} 
            actionConfirmed={actionConfirmed}
            setActionConfirmed={setActionConfirmed}
            modalText='This will also delete all huts within the Location. Are you sure?'
        />
        
        </Popup>
    )
}

export default locationlist;
