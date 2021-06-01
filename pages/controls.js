import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Link from 'next/link';
import Popup from '../components/Popup';
import { isAuth } from '../actions/authActions';
import { searchHuts } from '../actions/hutActions';
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
                            <div className="search-container">
                                <h2>Go to...</h2>
                                <Link href='/'>
                                    <a>Gallery</a>
                                </Link>
                                <Link href='/'>
                                    <a>Locations</a>
                                </Link>
                                <Link href='/'>
                                    <a>Types</a>
                                </Link>
                            </div>

                            <div className="edit-container">
                                <h2>Huts...</h2>
                                <Link href={isAuth() ? '/huts/addhut?redirect=/controls' : '/signin?redirect=/controls'}>
                                    <a>Add Hut</a>
                                </Link>
                                <Link href='/controls/#hut-list-section'>
                                    <a>Show Huts</a>
                                </Link>
                                <Link href='/map'>
                                    <a>Show Map</a>
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
                                    <li>{hut.location.name}</li>
                                    <li>{hut.type.name}</li>
                                    <li>{moment(hut.updatedAt).fromNow()}</li>
                                </ul>
                            ))
                        }
                    </div>

                    {showPagination()}
                </section>

                <section className='section' id="gallery-section">
                    <div className="img-container-two" />
                </section>
            </div>

        </React.Fragment>
    )
}

export default controls
