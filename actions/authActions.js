import cookie from 'js-cookie';

//SIGNUP
export const signup = (email, password) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
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









