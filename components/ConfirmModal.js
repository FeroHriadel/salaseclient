import React, { useState, useRef, useEffect } from 'react';



const ConfirmWithPassword = ({ showModal, setShowModal, actionConfirmed, setActionConfirmed, modalText = 'Are you sure?' }) => {
    //CLOSE MODAL
    const modalContainer = useRef();

    useEffect(() => {
        const closeModal = e => {
            //console.log(e.target.className);
            if (e.target.className.includes('confirm-modal-container')) {
                setShowModal(false);
            }
        }

        modalContainer.current.addEventListener('click', closeModal);
        return () => {
            if (modalContainer.current) {
            modalContainer.current.removeEventListener('click', closeModal)
            }
        };
    }, []);

   

    //RENDER
    return (
        <div 
            ref={modalContainer}
            className= "confirm-modal-container"
            style={showModal ? {opacity: '1', pointerEvents: 'auto'} : {opacity: '0', pointerEvents: 'none'}}
        >
            <div className="dialogue-box">
                <img src="/images/logoNoDecoration.png" className="logo" />
                <p>{modalText}</p>
                <div className="btn-wrapper">
                    <button onClick={() => {setActionConfirmed(true); setShowModal(false)}}>Confirm</button>
                    <button onClick={() => {setShowModal(false)}}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmWithPassword
