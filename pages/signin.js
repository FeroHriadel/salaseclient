import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { presignup, signup, signin, authenticate, isAuth, getGoogleClientId } from '../actions/authActions';
import Router from 'next/router';
import { withRouter } from 'next/router';
import GoogleButton from '../components/GoogleButton';



const signinpage = ({ router }) => {
    //REDIRECT LOGGED-IN USER
    useEffect(() => {
        isAuth() && Router.push(router.query.redirect ? router.query.redirect : '/controls');
    }, [])



    //MESSAGE
    const [message, setMessage] = useState('');



    //GET GOOGLE CLIENT ID (to show google btn)
    const [googleClientId, setGoogleClientId] = useState(null);

    useEffect(() => {
        getGoogleClientId()
            .then(data => {
                if (data.error) {
                    return console.log(data.error)
                }

                setGoogleClientId(data);
            });
    }, []);



    //FLIP CARD
    const [frontCardStyle, setFrontCardStyle] = useState({transform: 'translate(-50%, -50%) perspective(30cm) rotateY(0deg)'});
    const [backCardStyle, setBackCardStyle] = useState({transform: 'translate(-50%, -50%) perspective(30cm) rotateY(-180deg)'});
    const [frontShown, setFrontShown] = useState(true)

    const flipCard = () => {
        setFrontShown(!frontShown);
        if (frontShown) {
            setFrontCardStyle({transform: 'translate(-50%, -50%) perspective(30cm) rotateY(180deg)'});
            setBackCardStyle({transform: 'translate(-50%, -50%) perspective(30cm) rotateY(0deg)'});
        } else {
            setFrontCardStyle({transform: 'translate(-50%, -50%) perspective(30cm) rotateY(0deg)'});
            setBackCardStyle({transform: 'translate(-50%, -50%) perspective(30cm) rotateY(-180deg)'});
        }
    }



    //SIGNUP WiTH EMAIL AND PASSWORD
    const [signupValues, setSignupValues] = useState({signupEmail: '', signupPassword: ''});
    const { signupEmail, signupPassword} = signupValues;
    const [blockSubmit, setBlockSubmit] = useState(false);

    const signupChangeHandler = (e) => {
        setMessage('');
        setSignupValues({...signupValues, [e.target.name]: e.target.value})
    }

    const signupSubmitHandler = (e) => {
        e.preventDefault();
        if (!signupEmail || !signupPassword) {
            return setMessage('Email and Password are required')
        }
        
        presignup(signupEmail, signupPassword)
            .then(data => {
                if (data.error) {
                    return setMessage(data.error)
                }

                setMessage(`Please check your email to sign up`);
                setBlockSubmit(true);
            });
    }



    //SIGNIN WITH EMAIL AND PASSWORD
    const [signinValues, setSigninValues] = useState({signinEmail: '', signinPassword: ''});
    const { signinEmail, signinPassword} = signinValues;

    const signinChangeHandler = (e) => {
        setMessage('');
        setSigninValues({...signinValues, [e.target.name]: e.target.value})
    }

    const signinSubmitHandler = (e) => {
        e.preventDefault();
        if (!signinEmail || !signinPassword) {
            return setMessage('Email and Password are required')
        }

        signin(signinEmail, signinPassword)
            .then(data => {
                if (data.error) {
                    return setMessage(data.error);
                }

                authenticate(data, () => {
                    setMessage('Logged in. Redirecting...');
                    setTimeout(() => {
                        setMessage('')
                        Router.push(router.query.redirect ? router.query.redirect : '/controls')
                    }, 2000);
                })
            })
    }



    //RENDER
    return (
        <React.Fragment>

            <Header></Header>

            <div className='signin-container'>
                <div className="card-container">        
                    <div className="card">

            {/*********************************CARD BACK => SIGNUP *******************************/}
                        <div className='back' style={backCardStyle}>
                            <FontAwesomeIcon icon={faChevronLeft} onClick={() => {
                                setMessage('');
                                flipCard();
                            }} className='turn-card-icon'/>
                            <form onSubmit={signupSubmitHandler}>
                                <h1>Sign up</h1>
                                {message && <p className='message' style={{color: 'orangered'}}>{message}</p>}
                                <div className="form-group">
                                    <p>Email: </p>
                                    <input type="email" name='signupEmail' value={signupEmail} onChange={signupChangeHandler} placeholder='Please enter your email'/>
                                </div>
                                <div className="form-group">
                                    <p>Password: </p>
                                    <input type="password" name='signupPassword' value={signupPassword} onChange={signupChangeHandler} placeholder='Please enter a password'/>
                                </div>
                                <button type='submit' disabled={blockSubmit}>Sign Up</button>
                            </form>
                        </div>



            {/*********************************CARD FRONT => SIGNIN *******************************/}
                        <div className='front' style={frontCardStyle}>
                            <form onSubmit={signinSubmitHandler}>
                                <h1>Sign in</h1>
                                {message && <p className='message' style={{color: 'orangered'}}>{message}</p>}
                                <div className="form-group">
                                    <p>Email: </p>
                                    <input type="email" name='signinEmail' value={signinEmail} onChange={signinChangeHandler} placeholder='Please enter your email'/>
                                </div>
                                <div className="form-group">
                                    <p>Password: </p>
                                    <input type="password" name='signinPassword' value={signinPassword} onChange={signinChangeHandler} placeholder='Please enter your password'/>
                                </div>
                                <button type='submit'>Sign In</button>

                                {googleClientId && <GoogleButton googleClientId={googleClientId} setMessage={setMessage}/>}

                                <p className='turn-card-over'>Don't have an account? <span onClick={() => {
                                    setMessage('');
                                    flipCard();
                                }}>Sign up</span></p>                             
                                <p className='forgot-password-btn'>I <span onClick={() => Router.push('/forgotpassword')}>forgot</span> my password</p>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default withRouter(signinpage)
