
/************ styled in _hutdetails.scss ********************/

import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { getHutById } from '../../actions/hutActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import HutMapModal from '../../components/HutMapModal';
import CommentsModal from '../../components/CommentsModal'



const hutdetails = ({ hut, error }) => {
    //MAP MODAL
    const [modalShown, setModalShown] = useState(false);



    //COMMENTS
    const [commentsShown, setCommentsShown] = useState(false);



    //RENDER
    return (
    <React.Fragment>

        <div className="hut-details-container">

            <nav>
                <img src="/images/logo.png" className="logo" />

                {error 
                    ? 
                    <div className="error-contaier" style={{
                        width: '100%',
                        textAlign: 'center',
                    }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '3rem',
                            color: '#ddd',
                            fontFamily: 'Fondamento, cursive',
                            textShadow: '0 0 5px #333'
                        }}>
                            Sorry, something went wrong and the hut did not load
                        </h2>
                    </div>
                    :
                    ''
                }

                <ul className="navigation">
                    <li> <a href="list.html">Zoznam Salašov</a></li>
                    <li>
                        <FontAwesomeIcon icon={faQuestion} className='icon' />{' '}
                        <Link href='/about'><a>About</a></Link>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faLaptop} className='icon' />{' '}
                        <Link href='/controls'><a>Control Panel</a></Link>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faMapSigns} className='icon' />{' '}
                        <Link href='/map'><a>Map</a></Link>
                    </li>
                </ul>
            </nav>

            {error ?
            ''
            :
            <div className="card-container">        
                <div className="card">
                    <div className="back">
                        <div className="wrapper-for-scroll">
                            <FontAwesomeIcon 
                                icon={faComments} 
                                className='comments-icon'
                                title='Show Comments' 
                                onClick={() => {
                                setCommentsShown(true);
                            }} />
                            <p style={{marginTop: '2rem'}}>Name: <span>{hut.name}</span></p>
                            <p>Type: <span>{hut.type.name}</span></p>
                            <p>Mountain Range: <span>{hut.location.name}</span></p>
                            <p>GPS: <span>Lat: {hut.latitude} & Long: {hut.longitude}</span></p>
                            {hut.where ? <p>Where: <span>{hut.where}</span></p> : <p>Where: <span>No location description provided</span></p>}
                            {hut.objectdescription ? <p>Description: <span>{hut.objectdescription}</span></p> : <p>Description: <span>No hut description provided</span></p>}
                            {hut.water ? <p>Water: <span>{hut.water}</span></p> : <p>Water Source: <span>Unknown</span></p>}
                            {hut.warning ? <p>Warning: <span>{hut.warning}</span></p> : <p>Warning: <span>No warning given for this hut</span></p>}
                            {hut.addedby && hut.addedby.email && <p>Added by: <span>{hut.addedby.email.split('@')[0]}</span></p>}
                            <p className='button' onClick={() => setModalShown(true)}>
                                Show on Map
                                {' '}
                                <FontAwesomeIcon icon={faMapSigns} style={{color: "orangered"}}/>
                            </p>
                        </div>
                    </div>
                    <div className="front" style={{background: `url(${hut.image.url}) no-repeat center center/cover`}}>
                        <p>
                            details
                            {' '}
                            <FontAwesomeIcon icon={faCaretRight} style={{textShadow: '1px 1px 5px black', filter: 'drop-shadow(-1px -1px 10px black)'}} />
                        </p>
                    </div>
                </div>
            </div>
            }

        </div>


        {
            modalShown 
            && 
            <HutMapModal 
                latitude={hut.latitude} 
                longitude={hut.longitude} 
                setModalShown={setModalShown}
            />
        }

        {
            commentsShown
            &&
            <CommentsModal setCommentsShown={setCommentsShown} hut={hut} />
        }

    </React.Fragment>
    )
}



hutdetails.getInitialProps = ({ query }) => {
    return getHutById(query.hutId)
        .then(data => {
            if (data.error) {
                return {hut: null, error: data.error || 'Something went wrong in [hutId] getInitialProps'}
            }

            return {hut: data, error: null};
        });
}


export default hutdetails;
