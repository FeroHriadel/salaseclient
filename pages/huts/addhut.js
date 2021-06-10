import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Header from '../../components/Header';
import Popup from '../../components/Popup';
import FileUpload from '../../components/FileUpload';
import { isAuth } from '../../actions/authActions';
import { getLocations } from '../../actions/locationActions';
import { getTypes } from '../../actions/typeActions';
import { deleteLocationImage } from '../../actions/locationActions'; //this should not have been called 'deleteLOCATIONimage' but just 'deleteImage' but I ain't gonna be rewritting the name all over the place.
import { addHut } from '../../actions/hutActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from 'next/router';



const addhut = ({ router }) => {
    //REDIRECT AWAY AFTER SIGNOUT
    const [loggedOut, setLoggedOut] = useState(false);

    useEffect(() => {
        if (loggedOut) {
            Router.push('/controls');
        }
    }, [loggedOut]);



    //REDIRECT NON-LOGGED-IN USERS AWAY
    useEffect(() => {
        if (!isAuth()) {
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



    //GET LOCATIONS AND TYPES
    const [locations, setLocations] = useState([]);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [types, setTypes] = useState([]);
    const [typesLoading, setTypesLoading] = useState(true);
    
    const fetchAllLocations = () => {
        setLocationsLoading(true);
        getLocations()
            .then(data => {
                if (data.error) {
                    showPopup(data.error);
                    setLocationsLoading(false);
                    return;
                }

                setLocations(data);
                setLocationsLoading(false);
            })
    };

    const fetchAllTypes = () => {
        setTypesLoading(true);
        getTypes()
            .then(data => {
                if (data.error) {
                    showPopup(data.error);
                    setTypesLoading(false);
                }

                setTypes(data);
                setTypesLoading(false);
            })
    };

    useEffect(() => {
        fetchAllLocations();
        fetchAllTypes();
    }, []);



    //FORM
      //fields values
    const [values, setValues] = useState({
        name: '',
        latitude: '',
        longitude: '',
        location: '',
        type: '',
        image: {},
        where: '',
        objectdescription: '',
        water: '',
        warning: '',
        addedby: ''
    });

    const { name, latitude, longitude, location, type, image, where, objectdescription, water, warning } = values;


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
        setValues({...values, [e.target.name]: e.target.value});
    }

      //submit handler
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !latitude || !longitude || !location || !type || !image) {
            return showPopup(`Please make sure name, lat, long, mountain range, type & image are filled in`);
        }

        let nameBig1stLetter = name.charAt(0).toUpperCase() + name.slice(1);

        addHut({...values, name: nameBig1stLetter })
            .then(data => {
                if (data.error) {
                    return showPopup(data.error);
                }
                showPopup(`Hut Created`);
            });

        setFormSubmitObserver({formSubmitted: true, imgId: null});
        setValues({
            name: '',
            latitude: '',
            longitude: '',
            location: '',
            type: '',
            image: {},
            where: '',
            objectdescription: '',
            water: '',
            warning: '',
            addedby: isAuth()._id
        });
    };

      //get user who's adding a hut
    useEffect(() => {
        const userId = isAuth()._id;
        setValues({...values, addedby: userId});
    }, []);



    //FORM HTML
    const showForm = () => (
        <React.Fragment>
            <h2>Add Hut</h2>

            {
                locationsLoading || typesLoading ?
                <p>Loading...</p>
                :
                locations.length < 1 || types.length < 1 ?
                    <p>Locations and Types could not be loaded. Either try reloading the page or make sure there is at least one Location and one Type created.</p>
                    :
                    <form onSubmit={handleSubmit}>

                        <FileUpload 
                            values={values}
                            setValues={setValues}
                            showPopup={showPopup}
                            formSubmitObserver={formSubmitObserver}
                            setFormSubmitObserver={setFormSubmitObserver}
                        />

                        <div className="form-group">
                            <label>Name: </label>
                            <input type="text" name='name' value={name} placeholder='e.g.: Plch' onChange={handleChange} autoComplete='off' />
                        </div>

                        <div className="form-group">
                            <label>Latitude: </label>
                            <input type="number" name="latitude" value={latitude} placeholder='e.g: 49.033544' onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Longitude: </label>
                            <input type="number" name="longitude" value={longitude} placeholder='e.g.: 19.210097' onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Mountain Range: </label>
                            <select name="location" value={location} onChange={handleChange}>
                                <option value='' disabled>Please choose a location</option>
                                {locations.map(location => (
                                    <option key={location._id} value={location._id}>{location.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Hut Type: </label>
                            <select name="type" value={type} onChange={handleChange}>
                                <option value='' disabled>Please choose a type</option>
                                {types.map(type => (
                                    <option key={type._id} value={type._id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Where: </label>
                            <textarea 
                                placeholder='e.g.: Situated in Velka Fatra at the end of Ciernavy (a fork of the Lubochnianska Dolina Valley) on the Southern slope of Madarova Hill. Getting there involves approximately an hour of off-trail hiking.'
                                name='where'
                                value={where}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Object Description: </label>
                            <textarea 
                                placeholder='e.g.: A small hunters hut with a stove, 4 beds, shelves with candles, matches, cups... Usually has a lot of firedwood stocked up on the porch. A small but really cozy place. Also has an attic should your party need more sleeping space.'
                                name='objectdescription'
                                value={objectdescription}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nearest Water Source: </label>
                            <textarea 
                                placeholder='e.g.: When your back is to the cabin door, just go left some 50m. Theres a spring that doesnt go dry.'
                                name='water'
                                value={water}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Any Warnings?: </label>
                            <textarea 
                                placeholder='e.g.: This cabin is open for hikers but wont stay that way if it becomes a weekend party spot. Please, leave it as tidy as you found it when you came and restock any wood you burn.'
                                name='warning'
                                value={warning}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <button type="submit">Add Hut</button>
                        </div>
                    </form>
            }

        </React.Fragment>
    );



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <div className='addhut-container'>

                <button className="go-back-btn" onClick={() => {Router.push(router.query.redirect)}}>
                    <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                    {' '}
                    Go Back
                </button>
                
                <div className="card-container">
                    <div className="card">
                        <div className='front'>

                            {showForm()}

                        </div>
                    </div>
                </div>
            </div>

        </Popup>
    )
}

export default withRouter(addhut)
