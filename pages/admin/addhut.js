import React from 'react';
import Header from '../../components/Header';
import { isAuth } from '../../actions/authActions';



const addhut = () => {
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

            <div className='addhut-container'>
                <div className="card-container">        
                    <div className="card">
                        <div className='front'>
                            
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default addhut
