import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Header from '../../components/Header';
import Popup from '../../components/Popup';
import { isAuth, getCookie } from '../../actions/authActions';
import { searchHuts, deleteHut } from '../../actions/hutActions';
import { deleteLocationImage } from '../../actions/locationActions'; //this is misplaced and misnamed. Deletes image. Ain't changing it.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from '../../components/ConfirmModal';
import moment from 'moment';
import HutsSearch from '../../components/HutsSearch';



const hutlist = () => {
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



    //MODAL
    const [showModal, setShowModal] = useState(false);
    const [actionConfirmed, setActionConfirmed] = useState(false);



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
                <h1>Hut List</h1>

                <button title='Add Hut' onClick={() => {Router.push('/admin/hutcreate')}}>
                    <FontAwesomeIcon icon={faPlus} className='icon'/>
                </button>
            </div>

            {loading ? <p style={{fontFamily: 'Fondamento, cursive'}}>Getting huts...</p> :
                huts && huts.length > 0 ?

                huts.map((hut) => (                      
                        <div className="hut-line" key={hut._id}>
                            <p className='hut-details'>{hut.name}</p>
                            <p className='hut-details'>{hut.location.name}</p>
                            <p className='hut-details'>{hut.type.name}</p>
                            <p className='hut-details'>{hut.addedby.email.split('@')[0]}</p>
                            <p className='hut-details'>{moment(hut.updatedAt).fromNow()}</p>
                            <div className='buttons'>
                                <button 
                                    title='Edit'
                                    onClick={() => {
                                        Router.push({
                                            pathname: '/admin/hutedit',
                                            query: {
                                                hutId: hut._id
                                            }
                                        })
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEdit} className='icon'/>
                                </button>
                                <button 
                                    title='Delete' 
                                    onClick={() => {
                                        setShowModal(true);
                                        setHutData({
                                            hutId: hut._id,
                                            imageId: hut.image.public_id
                                        })
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} className='icon'/>
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



    //DELETE HUT
    const [hutData, setHutData] = useState({});

    useEffect(() => {
        if (actionConfirmed) {
            deleteHut(hutData.hutId)
                .then(data => {
                    if (data.error) {
                        return showPopup(data.error);
                    }

                    showPopup(`Hut deleted`);
                })
                        
            deleteLocationImage(hutData.imageId);
            setActionConfirmed(false);

            const remainingHuts = huts.filter(hut => hut._id !== hutData.hutId);
            setValues({...values, huts: remainingHuts});
            setHutData({});
        }
    }, [actionConfirmed]);



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

        <ConfirmModal 
            showModal={showModal} 
            setShowModal={setShowModal} 
            actionConfirmed={actionConfirmed}
            setActionConfirmed={setActionConfirmed}
            modalText='Are you sure you want to delete this hut?'
        />
        
        </Popup>
    )
}

export default hutlist;
