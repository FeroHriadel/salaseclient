
/*
    !!!

        HTML CLASSES HERE ARE ALL MISNAMED => I COPIED ALL FILE FROM HUTLIST.JS AND THIS PAGE IS ALSO STYLED BY THE SAME .SCSS THAT STYLES HUTLIST.JS. THAT'S WHY I DIDN'T RENAME THE CLASSES.

    !!!
*/

import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Header from '../../components/Header';
import Popup from '../../components/Popup';
import { isAuth, getCookie } from '../../actions/authActions';
import { searchHuts } from '../../actions/hutActions';
import { addTopPick } from '../../actions/topPickActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from '../../components/ConfirmModal';
import moment from 'moment';
import HutsSearch from '../../components/HutsSearch';



const toppicksadd = () => {
    //REDIRECT AWAY AFTER SIGNOUT
    const [loggedOut, setLoggedOut] = useState(false);

    useEffect(() => {
        if (loggedOut) {
            Router.push('/controls');
        }
    }, [loggedOut]);



    //REDIRECT NON-ADMINS AWAY
    useEffect(() => {
        if (isAuth().role !== 'admin') {
            Router.push('/controls');
        }
    }, []);



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
   


    //HUTS HTML
    const showHuts = () => (
        <React.Fragment>
            <div className="title">
                <h1>Add Hut to Top Picks</h1>
            </div>

            {loading ? <p style={{fontFamily: 'Fondamento, cursive'}}>Getting huts...</p> :
                huts && huts.length > 0 ?

                huts.map((hut) => (                      
                        <div className="hut-line" key={hut._id}>
                            <p className='hut-details'>{hut.name}</p>
                            {
                                hut.location && hut.location.name
                                ?
                                <p className='hut-details'>{hut.location.name}</p>
                                :
                                <p className='hut-details'>deleted location</p>
                            }
                            {
                                hut.type && hut.type.name
                                ?
                                <p className='hut-details'>{hut.type.name}</p>
                                :
                                <p className='hut-details'>deleted type</p>
                            }
                            {
                                hut.addedby && hut.addedby.email 
                                ?
                                <p className='hut-details'>{hut.addedby.email.split('@')[0]}</p>
                                :
                                <p className='hut-details'>deleted user</p>
                            }
                            <p className='hut-details'>{moment(hut.updatedAt).fromNow()}</p>
                            <div className='buttons'>
                                <button 
                                    title='Add hut to Top Picks'
                                    onClick={() => {
                                        addTopPick(hut._id)
                                            .then(data => {
                                                if (data.error || !data) {
                                                    return showPopup(data.error || `Could not add hut to Top Picks`)
                                                }

                                                showPopup(`Hut added to Top Picks`);
                                            });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} className='icon'/>
                                </button>
                            </div>
                        </div>
                ))
                :
                <React.Fragment>
                    <h2 style={{fontFamily: 'Fondamento', marginBottom: '1rem'}}>No Huts found</h2>
                    <p
                        onClick={() => {
                            initialLoad();
                        }}
                        style={{
                            fontFamily: 'Fondamento, cursive',
                            cursor: 'pointer'
                        }}
                    >
                        <span>&gt;</span> <span>&gt;</span> Try again <span>&lt;</span> <span>&lt;</span>
                    </p>
                </React.Fragment>
            }
        </React.Fragment>
    )



    //LOAD MORE ON SCROLL
    const loadMore = (e) => {
        const totalHeight = e.target.scrollHeight;
        const scrolledFromTop = e.target.scrollTop;
        const viewHeight = e.target.clientHeight;

        //console.table({totalHeight, scrolledFromTop, viewHeight, viewHeightPlusScrollTop: scrolledFromTop + viewHeight});

        if (
            scrolledFromTop + viewHeight >= totalHeight * 0.9 &&
            page <= numberOfPages
        ) {
            searchHuts(searchword, location, type, addedby, sortby, page + 1)
            .then(data => {
                if (data.error) {
                    showPopup(`Could not load more huts`);
                    return;
                }

               setValues({...values, ...data, huts: [...huts, ...data.huts]});
            });
        }        
    }

    

    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>
        
            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <section className="admin-hut-list-screen">

            <button 
                className="go-back-btn" 
                onClick={() => {Router.push('/admin/toppicks')}}
            >
                <FontAwesomeIcon icon={faArrowLeft} className='icon'/>
                {' '}
                Go Back
            </button>

                <div className="card-container">        
                    <div className="card">
                        <div className='front'>
                            <div 
                                className='list-wrapper'
                                onScroll={loadMore}
                            >
                                <HutsSearch 
                                    values={values} 
                                    setValues={setValues} 
                                    showPopup={showPopup}
                                />
                                {showHuts()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        
        </Popup>
    )
}

export default toppicksadd;
