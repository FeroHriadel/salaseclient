import React, { useState, useEffect } from 'react'
import GoogleLogin from 'react-google-login';
import { authenticate, signinWithGoogle } from '../actions/authActions';
import Router from 'next/router';



const GoogleButton = ({ googleClientId, setMessage }) => {
    //BLOCK GOOGLEBTN AFTER LOGIN
    const [googleBtnBlocked, setGoogleBtnBlocked] = useState(false);


    //ON GOOGLEBTN CLICK
    const responseGoogle = (response) => {
        //response gives you response.tokenId
        const tokenId = response.tokenId;
        const user = { tokenId };

        //make a call to backend passing the tokenId you got from google button => it has name & email encoded in it
        signinWithGoogle(user)
            .then(data => {
                if (data.error) {
                    return setMessage('Google Signin failed')
                }

                authenticate(data, () => {
                    setMessage('Signed in. Redirecting...');
                    setTimeout(() => {
                        Router.push('/controls');
                    }, 2000)
                });
            });
    }


    return (
        <div className='google-btn-wrapper' style={googleBtnBlocked ? {pointerEvents: 'none', width: '100%'} : {pointerEvents: 'auto', width: '100%', textAlign: 'center'}}>
            <GoogleLogin
                clientId={googleClientId}
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                render={renderProps => (
                    <button onClick={renderProps.onClick} style={{height: '2rem', marginTop: '5px', marginBottom: '0px'}}>Sign in with Google</button>
                )}
        />

        </div>
    )
}



export default GoogleButton
