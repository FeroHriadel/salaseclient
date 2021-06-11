import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";
import Popup from '../components/Popup';
import { getTopPicks } from '../actions/topPickActions';
import Head from 'next/head';




const list = ({ topPicks, error}) => { //this page is misnamed. Should have been 'toppicks'.
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



    //RENDER
    return (
        <React.Fragment>

            <Head>
                <title>Salase | Top Picks</title>
                <meta name='description' content='Bivy and Huts in Slovak Mountains' />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <Popup popupShown={popupShown} popupText={popupText}>
                <div className="list-page-container">

                    <nav>
                        <img src="/images/logo.png" className="logo" alt='site logo' />
                        <ul className="navigation">
                            <li className='current'>
                                <FontAwesomeIcon icon={faScroll} className='icon'/>{' '}
                                <Link href='/list'><a className='orange'>List of Huts</a></Link>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faQuestion} className='icon' />{' '}
                                <Link href='/about'><a>About</a></Link>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faLaptop} className='icon' />{' '}
                                <Link href='/controls'><a>Controls</a></Link>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faMapSigns} className='icon' />{' '}
                                <Link href='/map'><a>Map</a></Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="book-container">
                        {/*<button className="arrow left"><FontAwesomeIcon icon={faChevronLeft} /></button>
        <button className="arrow right"><FontAwesomeIcon icon={faChevronRight} /></button>*/}
                        <div className="book">
                            <div className="back">1</div>
                            <div className="page">2</div>
                            <div className="page">3</div>
                            <div className="page">4</div>
                            <div className="page">
                                {
                                    error
                                    ?
                                    <h2>{error}</h2>
                                    :
                                    topPicks && topPicks.length < 1
                                    ?
                                    <h2 style={{
                                        color: '#444',
                                        marginTop: '2rem',
                                        fontFamily: 'Fondamento, cursive',
                                        textAlign: 'center'
                                    }}>
                                        No huts have been added to Top Picks yet
                                    </h2>
                                    :
                                    topPicks.map(topPick => (
                                        <Link href={`/huts/${topPick.hutId}`} key={topPick._id}>
                                            <a>{topPick.name.name}</a>
                                        </Link>
                                    ))
                                }   
                                
                                <Link href={`/controls/#hut-list-section`}>
                                    <a style={{
                                        position: 'absolute',
                                        bottom: '15px',
                                        right: '15px',
                                        opacity: '0.7',
                                        fontSize: '1rem'
                                    }}
                                    >
                                        complete list of huts
                                    </a>
                                </Link>
                            </div>
                            <div className="front">
                                <p>Top Picks</p>
                                <p><FontAwesomeIcon icon={faBookOpen} /> open</p>
                            </div>
                        </div>
                    </div>

                </div>
            </Popup>
        </React.Fragment>
    )
}



list.getInitialProps = () => {
    return getTopPicks()
        .then(data => {
            if (data.error || !data) {
                return {topPicks: null, error: `Failed to load Top Picks`}
            }

            return {topPicks: data, error: null}
        });
}



export default list
