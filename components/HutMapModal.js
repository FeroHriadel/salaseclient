import React from 'react';
import { Map, ZoomControl, MouseControl, MarkerLayer, Marker } from 'react-mapycz';



const HutMapModal = ({ latitude, longitude, setModalShown }) => {

    return (
        <div className='hut-map-modal'>
            <div className="map-container">
                <Map height="100%" center={{lat: latitude, lng: longitude}} zoom={15}>
                    <ZoomControl />
                    <MouseControl zoom={true} pan={true} wheel={true} />
                    <MarkerLayer>
                        <Marker coords={{lat: latitude, lng: longitude}} />
                    </MarkerLayer>
                </Map>
            </div>
            <p className='close-modal-btn' onClick={() => setModalShown(false)}>Close</p>
        </div>
    )
}

export default HutMapModal
