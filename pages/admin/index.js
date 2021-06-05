import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Link from 'next/link';
import { isAuth } from '../../actions/authActions';
import Router from 'next/router';



const admin = () => {
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
    }, [])



    //RENDER
    return (
        <React.Fragment>

            <Header setLoggedOut={setLoggedOut} protectedRoute={true} />

            <section className='admin-page-container'>
                <h2>Admin Dashboard</h2>

                <Link href='/admin/locationlist'>
                    <a>Manage Locations</a>
                </Link>
                <Link href='/admin/typelist'>
                    <a>Manage Types</a>
                </Link>
                <Link href='/admin/hutlist'>
                    <a>Manage Huts</a>
                </Link>
                <Link href='/admin/users'>
                    <a>Manage Users</a>
                </Link>
                <Link href='/admin/toppicks'>
                    <a>Manage Top Picks</a>
                </Link>
            </section>

        </React.Fragment>
    )
}

export default admin
