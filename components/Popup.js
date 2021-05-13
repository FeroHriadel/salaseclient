import React, { useState, useEffect } from 'react';



export default function Popup({ children, popupShown = false, popupText = '' }) {
    


    //RENDER
    return <React.Fragment>
        <div className="popup-container">
            <div className={`popup ${popupShown && 'active'}`}>
                <p>{popupText}</p>
            </div>
        </div>
        {children}
    </React.Fragment>
}
