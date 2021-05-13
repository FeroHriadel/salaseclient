import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { signup, signin, authenticate, isAuth } from '../actions/authActions';
import Router from 'next/router';



const signinpage = () => {
    //REDIRECT LOGGED-IN USER
    useEffect(() => {
        isAuth() && Router.push('/controls');
    }, [])



    //MESSAGE
    const [message, setMessage] = useState('');



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



    //SIGNUP WITH EMAIL & PASSWORD
    const [signupValues, setSignupValues] = useState({signupEmail: '', signupPassword: ''});
    const { signupEmail, signupPassword} = signupValues;

    const signupChangeHandler = (e) => {
        setMessage('');
        setSignupValues({...signupValues, [e.target.name]: e.target.value})
    }

    const signupSubmitHandler = (e) => {
        e.preventDefault();
        if (!signupEmail || !signupPassword) {
            return setMessage('Email and Password are required')
        }
        
        signup(signupEmail, signupPassword)
            .then(data => {
                if (data.error) {
                    return setMessage(data.error)
                }

                authenticate(data, () => {
                    setMessage('Signed up. Redirecting...')
                    setTimeout(() => {
                        setMessage('')
                        Router.push('/controls')
                    }, 3000)
                })
            })
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
                        Router.push('/controls')
                    }, 3000)
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
                                <button type='submit'>Sign Up</button>
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
                                <p className='turn-card-over'>Don't have an account? <span onClick={() => {
                                    setMessage('');
                                    flipCard();
                                }}>Sign up</span></p>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default signinpage
