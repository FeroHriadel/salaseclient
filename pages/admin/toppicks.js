import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Popup from '../../components/Popup';
import Header from '../../components/Header';
import { isAuth, getCookie } from '../../actions/authActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getTopPicks, deleteFromTopPicks } from '../../actions/topPickActions';



const toppicks = () => {
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



    //GET TOP PICKS
    const [topPicks, setTopPicks] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTopPicks()
            .then(data => {
                if (data.error || !data) {
                    setLoading(false);
                    showPopup(data.error || `Top Picks failed to load`);
                    return
                }

                setTopPicks(data);
                setLoading(false);
            });
    }, []);



    //RENDER
    return (
        <Popup popupShown={popupShown} popupText={popupText}>

            <Header />

            <div className='admin-top-picks-screen'>

                <div className="card">
                    <div className="title">
                        <h1>Top Picks</h1>

                        <button title='Add to Top Picks' onClick={() => {Router.push('/admin/toppicksadd')}}>
                            <FontAwesomeIcon icon={faPlus} className='icon'/>
                        </button>
                    </div>

                    <div className="instructions">
                        <p style={{marginBottom: '2rem'}}>There can be maximum 9 huts in Top Picks. If the list if full and you'd like to add a hut; please, remove some huts from the list by clicking the trash button on the right. Click the + button in the top right-hand corner to add a hut to Top Picks.</p>
                    </div>

                    {
                        loading
                        ?
                        <h2>Getting Top Picks...</h2>
                        :
                        !topPicks
                        ?
                        <h2>Top Picks failed to load</h2>
                        :
                        topPicks.length < 1
                        ?
                        <h2>There are currently no hut in the 'Top Picks' list</h2>
                        :
                        topPicks.map((topPick, index) => (
                            <div className="line" key={topPick._id}>
                                <p>{index + 1}. <span>{topPick.name.name}</span> </p>
                                <button 
                                    title='Remove from Top Picks' 
                                    onClick={() => {
                                        deleteFromTopPicks(topPick._id)
                                            .then(data => {
                                                if (data.error || !data) {
                                                    return showPopup(data.error || `Hut could not be removed from Top Picks`);
                                                }

                                                showPopup(`Hut Removed from Top Picks`);
                                                let filteredTopPicks = topPicks.filter(tp => tp._id !== topPick._id);
                                                setTopPicks(filteredTopPicks);
                                            })
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} className='icon'/>
                                </button>
                            </div>
                        ))
                    }
                </div>

                

            </div>

        </Popup>

    )
}

export default toppicks
