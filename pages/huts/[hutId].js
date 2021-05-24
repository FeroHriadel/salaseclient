import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { getHutById } from '../../actions/hutActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";



const hutdetails = ({ hut, error }) => {
    return (

        <div class="hut-details-container">

            <nav>
                <img src="/images/logo.png" class="logo" />

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

                <ul class="navigation">
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
            <div class="card-container">        
                <div class="card">
                    <div class="back">
                        <div className="wrapper-for-scroll">
                            <p style={{fontSize: '2rem'}}>{hut.name}</p>
                            <br />
                            <p>Type: <span>{hut.type.name}</span></p>
                            <p>Mountain Range: <span>{hut.location.name}</span></p>
                            <p>GPS: <span>Lat: {hut.latitude}; Long: {hut.longitude}</span></p>
                            {hut.where && <p>Where: <span>{hut.where}</span></p>}
                            {hut.objectdescription && <p>Description: <span>{hut.objectdescription}</span></p>}
                            {hut.water && <p>Water: <span>{hut.water}</span></p>}
                            {hut.warning && <p>Warning: <span>{hut.warning}</span></p>}
                            <p>Added by: <span>{hut.addedby.email.split('@')[0]}</span></p>
                            <button>GPS</button>
                        </div>
                    </div>
                    <div class="front" style={{background: `url(${hut.image.url}) no-repeat center center/cover`}}>
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
    )
}



hutdetails.getInitialProps = ({ query }) => {
    return getHutById(query.hutId)
        .then(data => {
            if (data.error) {
                return {hut: null, error: data.error}
            }

            return {hut: data, error: null};
        });
}


export default hutdetails;
