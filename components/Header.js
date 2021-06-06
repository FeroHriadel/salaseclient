import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { isAuth, signout } from '../actions/authActions';



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
                                <a>Admin</a>
                            </Link>
                        )
                    }
                </li>
                <li>
                    <Link href='/controls'>
                        <a>Controls</a>
                    </Link>
                </li>
                <li>
                    {
                        loggedIn ?
                            <a onClick={() => {
                                signout();
                                setIsLoggedIn(false);
                                if (protectedRoute) {
                                    setLoggedOut(true);
                                }
                            }}>Sign out</a>
                        :
                            <Link href='/signin'>
                                <a>Log in</a>
                            </Link>
                    }
                </li>
                <li>
                    <Link href='/contact'>
                        <a>Contact</a>
                    </Link>
                </li>
                <li>
                    <Link href='/map'>
                        <a>Map</a>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Header;
