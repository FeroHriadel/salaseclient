import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Link from 'next/link';
import Popup from '../components/Popup';
import { isAuth } from '../actions/authActions';
import { searchHuts } from '../actions/hutActions';
import { getLocations } from '../actions/locationActions';
import ControlsHutSearch from '../components/ControlsHutSearch';
import moment from 'moment';
import Router from 'next/router';



const controls = () => {

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



    //GET HUTS
    const [values, setValues] = useState({
        huts: [],
        loading: true,
        searchword: '',
        location: '',
        type: '',
        addedby: '',
        sortby: '',
        page: 1,
        numberOfPages: 1,
    });

    const { huts, loading, searchword, location, type, addedby, sortby, page, numberOfPages } = values;

    const initialLoad = () => {
        setValues({
            huts: [],
            loading: true,
            searchword: '',
            location: '',
            type: '',
            addedby: '',
            sortby: '',
            page: 1,
            numberOfPages: 1,
        });

        searchHuts()
            .then(data => {
                if (data.error) {
                    showPopup(data.error);
                    setValues({...values, loading: false});
                    return;
                }

               setValues({...values, huts: data.huts, loading: false, numberOfPages: data.numberOfPages}); 
            });
    }

    useEffect(() => {
        initialLoad();
      }, []);

    
    
    //GET LOCATIONS
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        getLocations()
            .then(data => {
                if (data.error) {
                    return console.log('Locations failed to fetch: ' + data.error)
                }

                setLocations(data);
            })
    }, [])



    //LOAD MORE & PAGINATION
    const showPagination = () => (
        <div className='pagination-container'>
            {
                numberOfPages > 1
                &&
                [...Array(numberOfPages).keys()].map((x, i) => (
                    <p 
                        key={i} 
                        className='page-button' 
                        onClick={() => {
                            searchHuts(searchword, location, type, addedby, sortby, x + 1)
                                .then(data => {
                                    if (data.error) {
                                        return showPopup(`Could not load more huts`);
                                    }

                                    setValues({...values, ...data});
                                })
                        }}
                        style={+values.page === (x + 1) ? {textDecoration: 'underline'} : {textDecoration: 'none'}}
                    >
                        Page {x + 1}
                    </p>
                ))

            }
        </div>
    
    )   
  


    //RENDER
    return (
        <React.Fragment>

            <Header />

            <div className="controls-container">
                
                <section className="section">
                    <div className="img-container one">
                        <div className="buttons-container">
                       <div className="search-container"> {/*this is named wrong => it's the first column with buttons*/}
                                <h2>Go to...</h2>
                                <Link href='/controls/#locations-section'>
                                    <a>Locations</a>
                                </Link>
                                <Link href='/list'>
                                    <a>Top Picks</a>
                                </Link>
                                <Link href='/contact'>
                                    <a>Contact</a>
                                </Link>
                            </div>


                            <div className="edit-container"> {/* this is named wrong => it's the 2nd column with buttons */}
                                <h2>Huts...</h2>
                                <Link href={isAuth() ? '/huts/addhut?redirect=/controls' : '/signin?redirect=/controls'}>
                                    <a>Add Hut</a>
                                </Link>
                                <Link href='/controls/#hut-list-section'>
                                    <a>Show Huts</a>
                                </Link>
                                <Link href='/map'>
                                    <a>Map</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='section' id="hut-list-section">
                    <img src="/images/logoHutList.png" alt="Hut List"/>
                    <ControlsHutSearch values={values} setValues={setValues} showPopup={showPopup}/>
                    <div className="controls-hut-list">
                        {
                            loading 
                            ?
                                <p>Getting Huts...</p>
                            :
                                !loading && huts.length < 1 
                            ?
                                <p>No huts found</p>
                            :
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
                                    <li>
                                        {
                                            hut.location && hut.location.name
                                            ?
                                            hut.location.name
                                            :
                                            'deletd location'
                                        }
                                    </li>
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
                    </div>

                    {showPagination()}
                </section>

                <section className='section' id="locations-section-img">
                    <div className="img-container-two" />
                </section>

                <section id='locations-section'>
                    <img src="/images/logoLocations.png" alt="Hut List"/>
                    {
                        locations && locations.length < 1 
                        ?
                        <h2>There're currently no locations to show</h2>
                        :
                        <React.Fragment>
                            <h2>Huts in the following locations have been mapped so far: </h2>

                            <div className="locations-list-container">
                                {
                                    locations.map(location => (
                                        <div 
                                            className='location-item'
                                            key={location._id}
                                            style={{
                                                height: '240px',
                                                width: '240px',
                                                background: `url(${location.image.url}) no-repeat center center/cover`,
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <div className="shade" />
                                            <p>{location.name}</p>
                                            <Link href={`/locations/${location._id}`}>
                                                <small>See huts in {location.name}</small>
                                            </Link>
                                        </div>
                                    ))
                                }
                            </div>
                        </React.Fragment>
                    }
                </section>
            </div>

        </React.Fragment>
    )
}

export default controls
