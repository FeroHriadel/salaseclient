import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getLocations } from '../actions/locationActions';
import { getHutsByLocation } from '../actions/hutActions';
import Link from 'next/link';

import dynamic from "next/dynamic"; //enable importing w/o ssr
import { Router } from 'next/router';




const map = () => {
    //IMPORT MAP W/O SSR => SO IT HAS ACCESS TO WINDOW
    const MapWithNoSSR = dynamic(() => import("../components/Map"), {
        ssr: false
    });



    //MESSAGE
    const [messageShown, setMessageShown] = useState(false);
    const [messageText, setMessageText] = useState('');

    const showMessage = (text) => {
        setMessageText(text);
        setMessageShown(!messageShown);
        setTimeout(() => {
            setMessageShown(messageShown);
        }, 3000);
    }



    //GET LOCATIONS (FOR BUTTONS)
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        getLocations()
            .then(data => {
                if (data.error) {
                    return showMessage(`Failed to fetch locations`);
                }

                setLocations(data);
            })
    }, [])



    //HUTS
    const [huts, setHuts] = useState(null); //huts get set by onClick (see: RENDER/buttons-container section)

    //RENDER
    return (
        <React.Fragment>

            <Header />

            <div className='map-page-container'>

                <ul className="buttons-container">
                    <Link href='/controls'>
                        <li className='button'>
                            <FontAwesomeIcon icon={faArrowLeft} className='icon' />Go Back
                        </li>
                    </Link>
                    {
                        locations
                        &&
                        locations.map((location) => (
                            <li key={location._id} className='button' onClick={() => {
                                showMessage(`Getting huts in ${location.name}`);
                                getHutsByLocation(location._id)
                                    .then(data => {
                                        if (data.error) {
                                            return showMessage(`Fetching huts failed`)
                                        }

                                        setHuts(data);
                                    })
                            }}>
                                {location.name}
                            </li>
                        ))
                    }

                    {
                        messageShown
                        ?
                        <p style={{
                            color: '#ddd',
                            fontFamily: 'MateSC',
                            fontSize: '1rem',
                            marginTop: '2rem'
                        }}
                        >
                            {messageText}
                        </p>
                        :
                        ''
                    }
                </ul>


                <main className='map-container'>
                    <div id="map" style={{width: '100%', height: '100%'}}>
                        <MapWithNoSSR huts={huts} />
                    </div>
                </main>
            
            </div>

        </React.Fragment>

    )
}

export default map
