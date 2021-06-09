import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, signout } from '../actions/authActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { faUsersSlash } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";



const Header = ({ setLoggedOut = false, protectedRoute = false }) => {
    //SHOW LOGIN /OR SIGNOUT
    const [loggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userInLS = isAuth();

        if (userInLS) {
            setIsLoggedIn(true);
        }

        if (userInLS && userInLS.role === 'admin' ) {
            setIsAdmin(true);
        }

    }, [loggedIn])



    //RENDER
    return (
        <nav className='main-nav'>
            <Link href='/'>
                <img src='/images/logoNoDecoration.png' alt='site logo' />
            </Link>

            <ul className='main-nav-links'>
                <li>
                    {
                        isAdmin && (
                            <Link href='/admin'>
                                <React.Fragment>
                                    <a onClick={() => {Router.push('/admin')}}>Admin</a>
                                    <FontAwesomeIcon icon={faUserCog} className='icon' onClick={() => {Router.push('/admin')}} title='admin' />
                                </React.Fragment>
                            </Link>
                        )
                    }
                </li>
                <li>
                    <Link href='/controls'>
                        <React.Fragment>
                            <a onClick={() => {Router.push('/controls')}}>Controls</a>
                            <FontAwesomeIcon icon={faGamepad} className='icon' onClick={() => {Router.push('/controls')}} title='controls' />
                        </React.Fragment>
                    </Link>
                </li>
                <li>
                    {
                        loggedIn ?
                            <React.Fragment>
                                <a onClick={() => {
                                    signout();
                                    setIsLoggedIn(false);
                                    setIsAdmin(false);
                                    if (protectedRoute) {
                                        setLoggedOut(true);
                                    }
                                }}>
                                    Sign out
                                </a>
                                <FontAwesomeIcon 
                                    icon={faUsersSlash} 
                                    className='icon' onClick={() => {
                                    signout();
                                    setIsLoggedIn(false);
                                    setIsAdmin(false);
                                    if (protectedRoute) {
                                        setLoggedOut(true);
                                        }
                                    }}
                                    title='sign out'
                                />
                            </React.Fragment>
                        :
                            <Link href='/signin'>
                                <React.Fragment>
                                    <a onClick={() => {Router.push('/signin')}}>Login</a>
                                    <FontAwesomeIcon icon={faUser} className='icon' onClick={() => {Router.push('/signin')}} title='log in' />
                                </React.Fragment>
                            </Link>
                    }
                </li>
                <li>
                    <Link href='/contact'>
                        <React.Fragment>
                            <a onClick={() => {Router.push('/contact')}}>Contact</a>
                            <FontAwesomeIcon icon={faEnvelope} className='icon' onClick={() => {Router.push('/contact')}} title='contact' />
                        </React.Fragment>
                    </Link>
                </li>
                <li>
                    <Link href='/map'>
                        <React.Fragment>
                            <a onClick={() => {Router.push('/map')}}>Map</a>
                            <FontAwesomeIcon icon={faMapSigns} className='icon' onClick={() => {Router.push('/map')}} title='map' />
                        </React.Fragment>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Header;
