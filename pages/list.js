import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";
import Popup from '../components/Popup';
import { getTopPicks } from '../actions/topPickActions';
import { getHutById } from '../actions/hutActions';
import Head from 'next/head';
import Header from '../components/Header';





const list = ({ topPicks, error }) => { //this page is misnamed. Should have been 'toppicks'.
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



    //GET FIRST HUT TO DISPLAY
    const [currentHut, setCurrentHut] = useState(null); //hut details
    const [topPicksLength, setTopPicksLength] = useState(0);
    const [currentCount, setCurrentCount] = useState(0); //which hut in topPicks array is now chosen

    useEffect(() => {
        if (topPicks && topPicks.length > 0) {
            getHutById(topPicks[0].hutId)
                .then(data => {
                    if (data.error || !data) {
                        return showPopup(data.error || `Hut failed to load (list.js / useEffect)`);
                    }

                    setCurrentHut(data);
                    setTopPicksLength(topPicks.length);
                });
        }
    }, []);



    //HUT CARD HTML
    const showHut = () => (
        currentHut 
        &&
        <div className="card">
            <div className="wrapper-for-scroll">
                <div className="image" style={{background: `url(${currentHut.image.url}) no-repeat center center/cover`}} />
                <div className="text-container">
                    <h2>{currentHut.name}</h2>
                    {
                        currentHut.type && currentHut.type.name
                        ?
                        <p>
                            <span>a {currentHut.type.name}</span>
                            {
                                currentHut.location && currentHut.location.name
                                ?
                                <span> in {currentHut.location.name}</span>
                                :
                                <span> in deleted mountain range</span>
                            }
                        </p>
                        :
                        <p>
                            <span>deleted type</span>
                            {
                                currentHut.location && currentHut.location.name
                                ?
                                <span> in {currentHut.location.name}</span>
                                :
                                <span> in deleted mountain range</span>
                            }
                        </p>
                    }
                    {currentHut.objectdescription ? <p>{currentHut.objectdescription}</p> : <p>No hut description provided</p>}

                    <Link href={`/huts/${currentHut._id}`}>
                        <a>See more...</a>
                    </Link>
                </div>
            </div>
        </div>
    )



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Head>
                <title>Salase | Top Picks</title>
                <meta name='description' content='Bivy and Huts in Slovak Mountains' />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <Header />

            <div className='list-page-container'>
                {
                    error
                    ?
                    <h2 
                        className='error-message'
                        style={{
                            position: 'absolute',
                            left: '50%',
                            right: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#eee',
                            textShadow: '-1px 1px 3px #111',
                            textAlign: 'center',
                            fontFamily: 'Fondamento, cursive',
                            fontSize: '2rem',
                            width: '100vw'
                        }}
                    >
                        {error}
                    </h2>
                    :
                    topPicks && topPicks.length < 1
                    ?
                    <h2 
                        className='error-message'
                        style={{
                            position: 'absolute',
                            left: '50%',
                            right: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#eee',
                            textShadow: '-1px 1px 3px #111',
                            textAlign: 'center',
                            fontFamily: 'Fondamento, cursive',
                            fontSize: '2rem',
                            width: '100vw'
                        }}
                    >
                        No huts have been added to Top Picks yet.
                    </h2>
                    :
                    <React.Fragment>
                        {showHut()}

                        <div 
                            className="left-arrow"
                            onClick={() => {
                                if (currentCount === 0) {
                                    getHutById(topPicks[topPicksLength - 1].hutId)
                                        .then(data => {
                                            if (data.error || !data) {
                                                return showPopup(data.error || 'hut failed to load');
                                            }
                                            setCurrentHut(data);
                                            setCurrentCount(topPicksLength - 1);
                                        })
                                }
            
                                else {
                                    getHutById(topPicks[currentCount - 1].hutId)
                                        .then(data => {
                                            if (data.error || !data) {
                                                return showPopup(data.error || 'hut failed to load');
                                            }
                                            setCurrentHut(data);
                                            setCurrentCount(currentCount - 1);
                                        })
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faChevronLeft}/>   
                        </div>
            
                        <div 
                            className="right-arrow"
                            onClick={() => {
                                if (currentCount < topPicksLength - 1) {
                                    getHutById(topPicks[currentCount + 1].hutId)
                                        .then(data => {
                                            if (data.error || !data) {
                                                return showPopup(data.error || 'hut failed to load');
                                            }
                                            setCurrentHut(data);
                                            setCurrentCount(currentCount + 1);
                                        })
                                }
            
                                if (currentCount === topPicksLength - 1) {
                                    getHutById(topPicks[0].hutId)
                                        .then(data => {
                                            if (data.error || !data) {
                                                return showPopup(data.error || 'hut failed to load');
                                            }
                                            setCurrentHut(data);
                                            setCurrentCount(0);
                                        })
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faChevronRight}/>   
                        </div>

                        <Link href='/controls'>
                            <p className='go-back-btn'> <FontAwesomeIcon icon={faArrowLeft} className='icon' /> Go Back </p>
                        </Link>
                    </React.Fragment>
                    
                }
            </div>





    

        
        {/* ORIGINAL LAYOUT
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
                                        marginTop: '4rem',
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
            */}

        </Popup>
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
