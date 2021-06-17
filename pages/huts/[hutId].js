
/************ styled in _hutdetails.scss ********************/

import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { getHutById } from '../../actions/hutActions';
import { getNumberOfComments } from '../../actions/commentActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import HutMapModal from '../../components/HutMapModal';
import CommentsModal from '../../components/CommentsModal'
import Head from 'next/head';
import Header from '../../components/Header';




const hutdetails = ({ hut, error }) => {
    //MAP MODAL
    const [modalShown, setModalShown] = useState(false);



    //COMMENTS
      //state
    const [commentsShown, setCommentsShown] = useState(false);
    const [numberOfComments, setNumberOfComments] = useState(0);
    const [reloadNumberOfComments, setReloadNumberOfComments] = useState(true);

      //get number of comments
    useEffect(() => {
        if (reloadNumberOfComments && hut) {
            getNumberOfComments(hut._id)
            .then(data => {
                if (data.error || !data) {
                    return console.log(data.error || `getNumberOfComments returned no data`);
                }

                setNumberOfComments(data);
                setReloadNumberOfComments(false);
            })
        }
    }, [reloadNumberOfComments]);



    //RENDER
    return (
    <React.Fragment>

        <Head>
            <title>{hut && hut.name ? `Salase | ${hut.name}` : 'Salase'}</title>
            <meta name='description' content='Bivy and Huts in Slovak Mountains' />
            <link rel="icon" href="/favicon.png" />
        </Head>

        <Header />

        <div className="hut-details-container">

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
                    Sorry, something went wrong and the hut didn't load
                </h2>
                :
                <div className="card">
                    <div className="wrapper-for-scroll">
                        <div className="image" style={{background: `url(${hut.image.url}) no-repeat center center/cover`}} />
                        <div className="text-container">

                            {/* SHOW COMMENTS BUTTON */}
                            <div className="show-comments-btn" onClick={() => {setCommentsShown(true);}}>
                                <FontAwesomeIcon icon={faComments} title='Show Comments' className='icon' />
                                <h3>{numberOfComments ? numberOfComments : 0}</h3>
                            </div>

                            {/* HUT INFO (TEXT) */}
                            <p>Name: <span>{hut.name}</span></p>
                            {
                                hut.type && hut.type.name
                                ?
                                <p>Type: <span>{hut.type.name}</span></p>
                                :
                                <p>Type: <span>deleted type</span></p>
                            }
                            {
                                hut.location && hut.location.name
                                ?
                                <p>Mountain Range: <span>{hut.location.name}</span></p>
                                :
                                <p>Mountain Range: <span>deleted mountain range</span></p>
                            }
                            <p>GPS: <span>Lat: {hut.latitude} & Long: {hut.longitude}</span></p>
                            {hut.where ? <p>Where: <span>{hut.where}</span></p> : <p>Where: <span>No location description provided</span></p>}
                            {hut.objectdescription ? <p>Description: <span>{hut.objectdescription}</span></p> : <p>Description: <span>No hut description provided</span></p>}
                            {hut.water ? <p>Water: <span>{hut.water}</span></p> : <p>Water Source: <span>Unknown</span></p>}
                            {hut.warning ? <p>Warning: <span>{hut.warning}</span></p> : <p>Warning: <span>No warnings given for this hut</span></p>}
                            {hut.addedby && hut.addedby.email && <p>Added by: <span>{hut.addedby.email.split('@')[0]}</span></p>}
                            
                            {/* SHOW MAP BUTTON */}
                            <p className='button' onClick={() => setModalShown(true)}>
                                Show on Map
                                {' '}
                                <FontAwesomeIcon icon={faMapSigns}/>
                            </p>

                        </div>
                    </div>
                </div>
            }



            {/**********  ORIGINAL LAYOUT *******************
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
                    <li>
                        <FontAwesomeIcon icon={faScroll} className='icon' />{' '}
                        <Link href='/list'><a>Hut List</a></Link>
                    </li>
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

                            <p 
                                className='number-of-comments'
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    color: '#ddd',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem',
                                    textShadow: '0px 0px 2px black',
                                    cursor: 'pointer',
                                    fontFamily: 'MateSC',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => {
                                    setCommentsShown(true);
                                }}
                            >
                                {numberOfComments ? numberOfComments : 0}
                            </p>

                            <p style={{marginTop: '4rem'}}>Name: <span>{hut.name}</span></p>
                            {
                                hut.type && hut.type.name
                                ?
                                <p>Type: <span>{hut.type.name}</span></p>
                                :
                                <p>Type: <span>deleted type</span></p>
                            }
                            {
                                hut.location && hut.location.name
                                ?
                                <p>Mountain Range: <span>{hut.location.name}</span></p>
                                :
                                <p>Mountain Range: <span>deleted mountain range</span></p>
                            }
                            <p>GPS: <span>Lat: {hut.latitude} & Long: {hut.longitude}</span></p>
                            {hut.where ? <p>Where: <span>{hut.where}</span></p> : <p>Where: <span>No location description provided</span></p>}
                            {hut.objectdescription ? <p>Description: <span>{hut.objectdescription}</span></p> : <p>Description: <span>No hut description provided</span></p>}
                            {hut.water ? <p>Water: <span>{hut.water}</span></p> : <p>Water Source: <span>Unknown</span></p>}
                            {hut.warning ? <p>Warning: <span>{hut.warning}</span></p> : <p>Warning: <span>No warnings given for this hut</span></p>}
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

            */}
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
            <CommentsModal setCommentsShown={setCommentsShown} hut={hut} setReloadNumberOfComments={setReloadNumberOfComments} />
        }

    </React.Fragment>
    )
}



hutdetails.getInitialProps = ({ query }) => {
    return getHutById(query.hutId)
        .then(data => {
            if (data.error || !data) {
                return {hut: null, error: data.error || 'Something went wrong in [hutId] getInitialProps'}
            }

            return {hut: data, error: null};
        });
}


export default hutdetails;
