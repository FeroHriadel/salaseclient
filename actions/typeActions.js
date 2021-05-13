import { getCookie } from './authActions';



//GET ALL TYPES
export const getTypes = () => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    };

    return fetch(`${process.env.api}/gettypes`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



//GET TYPE BY ID
export const getTypeById = (typeId) => {
    return fetch(`${process.env.api}/gettype/${typeId}`)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



//DELETE TYPE BY ID
export const deleteType = (typeId) => {
    const config = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`
        },
    }

    return fetch(`${process.env.api}/deletetype/${typeId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



//UPDATE TYPE
export const updateType = (typeId, values) => {
    const config = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}` 
        },
        body: JSON.stringify(values)
    };

    return fetch(`${process.env.api}/updatetype/${typeId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



export const createType = (values) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}` 
        },
        body: JSON.stringify(values)
    };

    return fetch(`${process.env.api}/addtype`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}
