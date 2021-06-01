import { getCookie } from './authActions';



//CREATE HUT
export const addHut = (values) => {
    const config = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    };

    return fetch(`${process.env.api}/addhut`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



//SEARCH HUTS
export const searchHuts = (searchword, location, type, addedby, sortby, page) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({searchword, location, type, addedby, sortby, page})
    };

    return fetch(`${process.env.api}/searchhuts`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//DELETE HUT
export const deleteHut = (hutId) => {
    const config = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
            'Content-Type': 'application/json'
        }
    }

    return fetch(`${process.env.api}/deletehut/${hutId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//GET HUT BY ID
export const getHutById = (hutId) => {
    return fetch(`${process.env.api}/gethut/${hutId}`)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



//UPDATE HUT IMAGE
export const updateHutImage = (hutId, values) => {
    const config = {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    };

    return fetch(`${process.env.api}/updatehutimage/${hutId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//UPDATE HUT
export const updateHut = (hutId, values) => {
    const config = {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    }

    return fetch(`${process.env.api}/updatehut/${hutId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



//GET HUTS BY LOCATION
export const getHutsByLocation = (locationId) => {
    return fetch(`${process.env.api}/gethutsbylocation/${locationId}`)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



