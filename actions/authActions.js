import cookie from 'js-cookie';



//PRE SIGNUP
export const presignup = (email, password) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({email, password})
    };

    return fetch(`${process.env.api}/presingup`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//SIGNUP
export const signup = (token) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token})
    }

    return fetch(`${process.env.api}/signup`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => console.log(err))
}



//SIGN IN
export const signin = (email, password) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    }

    return fetch(`${process.env.api}/signin`, config)
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))
}



//HELPERS
  //set cookie
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value);
    }
};

  //remove cookie
export const removeCookie = key => {
    if (process.browser) {
        cookie.remove(key);
    }
};

  //get cookie
export const getCookie = key => {
    if (process.browser) {
        return cookie.get(key);
    }
};



//AUTHENTICATE (SET TOKEN IN COOKIE AND USER DETAILS IN LS)
export const authenticate = (data, next) => { 
    setCookie('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); 
    next(); //executes callback
};



//CHECK IF AUTHENTICATED & RETURN USER DETAILS
export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user')); 
            }

        } else {
            return false;
        }
        }
}


//SIGN OUT
export const signout = () => {
    removeCookie('token');
    localStorage.removeItem('user');
}



//FORGOT PASSWORD
export const forgotPassword = (email) => {
    const config = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    };

    return fetch(`${process.env.api}/forgotpassword`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//RESET PASSWORD
export const resetPassword = (resetPasswordLink, newPassword) => {
    const config = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({resetPasswordLink, newPassword})
    }

    return fetch(`${process.env.api}/resetpassword`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//GET GOOGLE CLIENT ID FROM BACKEND
export const getGoogleClientId = () => {
    return fetch(`${process.env.api}/getgoogleclientid`)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//SIGNIN WITH GOOGLE
export const signinWithGoogle = (user) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    };

    return fetch(`${process.env.api}/googlesignin`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//SEARCH USERS
export const searchUsers = (searchword, role, sortby, page) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify({searchword, role, sortby, page})
    };

    return fetch(`${process.env.api}/searchusers`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//DELETE USER
export const deleteUser = (userId) => {
    const config = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getCookie('token')}`
        }
    };

    return fetch(`${process.env.api}/deleteuser/${userId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//CHANGE USER'S ROLE
export const changeUsersRole = (userId) => {
    const config = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getCookie('token')}`
        }
    };

    return fetch(`${process.env.api}/changeusersrole/${userId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}







