import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import { signup } from '../../actions/authActions';



const activateaccount = ({ router }) => {
    //SCREEN TEXT & DISABLE BUTTON AFTER SUBMIT
    const [message, setMessage] = useState(null);
    const [blockButton, setBlockButton] = useState(false);



    //SUBMIT ACTIVATION
    const token = router.query.id;

    const submitActivation = () => {
        setMessage(`Verifying...`);
        signup(token)
            .then(data => {
                if(data.error) {
                    return setMessage(data.error);
                }

                setMessage(`Thank you for signing up. Signing you in and redirecting to Salase...`);
                setBlockButton(true);
            });
    }



    //RENDER
    return (
        <div className='activate-account-screen'>       
            <h2>Please, click activate to complete the signup process.</h2>
            {message && <h3>{message}</h3>}
            <button disabled={blockButton} onClick={() => {submitActivation()}}>Activate</button>
        </div>
    )
}

export default withRouter(activateaccount);
