import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Popup from '../components/Popup';
import { Map, ZoomControl, MouseControl, MarkerLayer, Marker } from 'react-mapycz';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getLocations } from '../actions/locationActions';
import { getHutsByLocation } from '../actions/hutActions';
import Link from 'next/link';



const map = () => {
    console.log(Marker)

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



    //GET LOCATIONS (FOR BUTTONS)
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        getLocations()
            .then(data => {
                if (data.error) {
                    return showPopup(`Failed to fetch locations`);
                }

                setLocations(data);
            })
    }, [])



    //HUTS
    const [huts, setHuts] = useState(null);



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header />

            <div className='map-page-container'>
                <ul className="buttons-container">
                    <li className='button'> <FontAwesomeIcon icon={faArrowLeft} className='icon'/> {' '} Go Back </li>
                    {
                        locations
                        &&
                        locations.map((location) => (
                            <li key={location._id} className='button' onClick={() => {
                                showPopup(`Getting huts in ${location.name}`);
                                getHutsByLocation(location._id)
                                    .then(data => {
                                        if (data.error) {
                                            return showPopup(`Fetching huts failed`)
                                        }

                                        setHuts(data);
                                    })
                            }}>
                                {location.name}
                            </li>
                        ))
                    }
                </ul>

                <div className="map-container">
                    <Map height='100%' center={{lat: 49.020606517888275, lng: 19.603840559810987}} zoom={8}>
                        <ZoomControl />
                        <MouseControl zoom={true} pan={true} wheel={true} />
                        <MarkerLayer>
                            {
                                huts && huts.map((hut) => (
                                    <Marker
                                        title={hut.name}
                                        key={hut._id} 
                                        coords={{lat: hut.latitude, lng: hut.longitude}} 
                                    />
                                ))
                            }
                        </MarkerLayer>
                    </Map>
                </div>
            </div>
        
        </Popup>
    )
}



export default map
