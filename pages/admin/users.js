import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Header from '../../components/Header';
import Popup from '../../components/Popup';
import { isAuth, getCookie } from '../../actions/authActions';
import { searchUsers, deleteUser, changeUsersRole } from '../../actions/authActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from '../../components/ConfirmModal';
import moment from 'moment';
import UserSearch from '../../components/UserSearch';




const users = () => {
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



    //GET USERS
    const [values, setValues] = useState({
        users: [],
        loading: true,
        searchword: '',
        role: '',
        sortby: '',
        page: 1,
        numberOfPages: 1,
    });

    const { users, loading, searchword, role, sortby, page, numberOfPages } = values;

    const initialLoad = () => {
        setValues({
            users: [],
            loading: true,
            searchword: '',
            role: '',
            sortby: '',
            page: 1,
            numberOfPages: 1,
        });

        searchUsers()
            .then(data => {
                if (data.error || !data) {
                    showPopup(data.error || `Users could not be fetched`);
                    setValues({...values, loading: false});
                    return;
                }

                setValues({...values, users: data.users, loading: false, numberOfPages: data.numberOfPages});
            });
    }

    useEffect(() => {
        initialLoad();
    }, []);



    //USERS HTML
    const showUsers = () => (
        <React.Fragment>
            <div className="title">
                <h1>User List</h1>
            </div>

            {loading ? <p style={{fontFamily: 'Fondamento, cursive'}}>Getting users...</p> :
                users && users.length > 0 ?

                users.map((user) => (                      
                        <div className="user-line" key={user._id}>
                            <p className='user-details'>{user.email}</p>
                            <p className='user-details'>{user.role}</p>
                            <p className='user-details'>{moment(user.createdAt).fromNow()}</p>
                            <div className='buttons'>
                                <button 
                                    title='Change users privileges (user/admin)'
                                    onClick={() => {
                                        changeUsersRole(user._id)
                                            .then(data => {
                                                if (data.error || !data) {
                                                    return showPopup(data.error || `User's role change failed`)
                                                }

                                                showPopup(`User's role changed`);
                                                initialLoad();
                                            })
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserLock} className='icon'/>
                                </button>
                                <button 
                                    title='Delete User' 
                                    onClick={() => {
                                        setShowModal(true);
                                        setUserData({
                                            userId: user._id
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
                    <h2 style={{fontFamily: 'Fondamento', marginBottom: '1rem'}}>No Users found</h2>
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
            searchUsers(searchword, role, sortby, page + 1)
            .then(data => {
                if (data.error) {
                    showPopup(`Could not load more users`);
                    return;
                }

                setValues({...values, ...data, users: [...users, ...data.users]});
            });
        }        
    }



    //DELETE USER
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (actionConfirmed) {
            deleteUser(userData.userId)
                .then(data => {
                    if (data.error) {
                        return showPopup(data.error);
                    }

                    showPopup(`User deleted`);
                })
                        
            setActionConfirmed(false);

            const remainingUsers = users.filter(user => user._id !== userData.userId);
            setValues({...values, users: remainingUsers});
            setUserData({});
        }
    }, [actionConfirmed]);



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>
            
            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <section className="admin-user-list-screen">
                <div className="card-container">        
                    <div className="card">
                        <div className='front'>
                            <div 
                                className='list-wrapper'
                                onScroll={loadMore}
                            >
                                <UserSearch 
                                    values={values} 
                                    setValues={setValues} 
                                    showPopup={showPopup}
                                />
                                {showUsers()}
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
                modalText='Are you sure you want to delete this user?'
            />
        
        </Popup>
    )
}

export default users
