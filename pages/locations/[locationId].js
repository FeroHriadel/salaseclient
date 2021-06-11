import React from 'react';
import { getHutsByLocation } from '../../actions/hutActions';
import moment from 'moment';
import Header from '../../components/Header';
import dynamic from "next/dynamic"; //enable importing w/o ssr
import Link from 'next/link';
import Router from 'next/router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Head from 'next/head';



const hutsinlocation = ({ huts, error }) => {
    //IMPORT MAP W/O SSR => SO IT HAS ACCESS TO WINDOW
    const MapWithNoSSR = dynamic(() => import("../../components/Map"), {
        ssr: false
    });



    //RENDER
    return (
        <React.Fragment>

            <Head>
                <title>{huts && huts[0] && huts[0].location.name ? `Salase | ${huts[0].location.name}` : 'Salase | Locations'}</title>
                <meta name='description' content='Bivy and Huts in Slovak Mountains' />
                <link rel="icon" href="/favicon.png" />
            </Head>
        
            <Header />

            <div className='huts-in-location-container'>

                <button className="go-back-btn" onClick={() => {Router.push('/controls/#locations-section')}}>
                    <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                    {' '}
                    Go Back
                </button>

                {
                    error 
                    ?
                    ''
                    :
                    huts.length < 1
                    ?
                    ''
                    :
                    <main className='map-container'>
                        <div id="map" style={{width: '100%', height: '100%'}}>
                            <MapWithNoSSR huts={huts} />
                        </div>
                    </main>
                }

                <div className="controls-hut-list">
                    {   
                        error
                        ?
                        <p style={{
                            fontFamily: 'Fondamento, cursive',
                            marginTop: '4rem',
                            color: "#ddd",
                            fontSize: '2rem'
                        }}>
                            {error}
                        </p>
                        :
                        huts.length < 1 
                        ?
                            <p style={{
                                fontFamily: 'Fondamento, cursive',
                                marginTop: '4rem',
                                color: "#ddd",
                                fontSize: '2rem'
                            }}>
                                No huts found
                            </p>
                        :
                        <React.Fragment>

                            <h2 style={{
                                fontFamily: 'Fondamento, cursive',
                                color: '#ddd',
                                textAlign: 'center',
                                marginBottom: '2rem',
                                marginTop: '0'
                            }}>
                                {
                                    huts[0].location.name 
                                    ?                               
                                    huts[0].location.name + ' has ' + huts.length + ' mapped objects: '
                                    :
                                    `This location has ${huts.length} mapped objects: `
                                }
                            </h2>
                            
                            <Link href='/controls/#hut-list-section'>
                                <p style={{
                                    fontFamily: 'Fondamento, cursive',
                                    color: "#ddd",
                                    fontSize: '1rem',
                                    marginTop: '0',
                                    transform: 'translateY(-15px)',
                                    marginBottom: '2rem',
                                    cursor: 'pointer'
                                }}>
                                    Take me to Hut Filter...
                                </p>
                            </Link>
                            
                            {
                                huts.map(hut => (
                                <ul className="item-box" key={hut._id} onClick={() => Router.push(`/huts/${hut._id}`)}>
                                    <div 
                                        className="item-img"
                                        style={{
                                            width: '75px',
                                            height: '75px',
                                            background: `url(${hut.image.url}) no-repeat center center/cover`
                                        }} 
                                    />
                                    <li>{hut.name}</li>
                                    <li>{hut.location.name}</li>
                                    <li>
                                        {
                                            hut.type && hut.type.name
                                            ?
                                            hut.type.name
                                            :
                                            'deleted type'
                                        }
                                    </li>
                                    <li>{moment(hut.updatedAt).fromNow()}</li>
                                </ul>
                                ))
                            }

                        </React.Fragment>
                    }
                </div>

            </div>

        </React.Fragment>
    )
}



hutsinlocation.getInitialProps = ({ query }) => {
    return getHutsByLocation(query.locationId)
            .then(data => {
                if (data.error || !data) {
                    return {huts: null, error: 'Huts in this location failed to load'}
                }

                return {huts: data, error: null}
            })
}

export default hutsinlocation;
