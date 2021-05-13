import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Header from '../../components/Header';
import Popup from '../../components/Popup';
import { isAuth, getCookie } from '../../actions/authActions';
import { getTypes, deleteType } from '../../actions/typeActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from '../../components/ConfirmModal';



const typelist = () => {
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



    //GET TYPES
      //get types from db
    const [types, setTypes] = useState(null);
    const [typesLoading, setTypesLoading] = useState(true);

    const loadTypes = () => {
        setTypesLoading(true);

        getTypes()
            .then(data => {
                if (data && data.error) {
                    showPopup(data.error);
                    setTypesLoading(false);
                } else {
                    setTypes(data);
                    setTypesLoading(false);
                }
            })
    }

    useEffect(() => {
        loadTypes();
    }, []);



    //DELETE TYPE
    const [typeData, setTypeData] = useState({});

    useEffect(() => {
        if (actionConfirmed) {
            deleteType(typeData.typeId)
                .then(data => {
                    if (data && data.error) {
                        return showPopup(data.error);
                    }

                    showPopup(`Type deleted`);
                })
                      
            setActionConfirmed(false);

            const remainingTypes = types.filter(type => type._id !== typeData.typeId);
            setTypes(remainingTypes);
            setTypeData({});
        }
    }, [actionConfirmed])



    //TYPES HTML
    const showTypes = () => (
        <React.Fragment>
            <div className="title">
                <h1>Types List</h1>
                <button title='Add Type' onClick={() => {Router.push('/admin/typecreate')}}>
                    <FontAwesomeIcon icon={faPlus} className='icon'/>
                </button>
            </div>
            {
                types && types.length > 0 ?
                types.map((type) => (
                    <div className="type-line" key={type._id}>
                        <p className='type-name'>{type.name}</p>
                        <div className='buttons'>
                            <button 
                                title='Edit'
                                onClick={() => {
                                    Router.push({
                                        pathname: '/admin/typeedit',
                                        query: {
                                            typeId: type._id
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
                                    setTypeData({
                                        typeId: type._id,
                                    })
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} className='icon'/>
                            </button>
                        </div>
                    </div>
                ))
                :
                <h2 style={{fontFamily: 'Fondamento'}}>No types</h2>
            }
        </React.Fragment>
    )

    

    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>
        
            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <section className="admin-type-list-screen">
                <div className="card-container">        
                    <div className="card">
                        <div className='front'>
                            <div className='list-wrapper'>
                                {
                                    typesLoading ?
                                        <p style={{fontFamily: 'Fondamento'}}>Getting Types...</p>
                                    :
                                        showTypes()
                                }
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
            modalText='Huts might be paired with this type. Are you sure?'
        />
        
        </Popup>
    )
}

export default typelist;
