
import { getCookie } from './authActions';



//CREATE LOCATION
export const createLocation = (values) => {
    const config = {
        body: JSON.stringify(values),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`
        },
        method: 'POST'
    }

    return fetch(`${process.env.api}/addlocation`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



//CREATE LOCATION IMG
  //is handled in components/FileUpload



//GET ALL LOCATIONS
export const getLocations = () => {
    return fetch(`${process.env.api}/getlocations`)
        .then(res => {
            return res.json();
        })
        .catch (err => {
            console.log(err);
        })
}



//DELETE LOCATION IMAGE
export const deleteLocationImage = (public_id) => {
    return fetch(`${process.env.api}/removeimage/${public_id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getCookie('token')}`
        }})
};




//DELETE LOCATION
export const deleteLocation = (locationId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
            'Content-Type': 'application/json',
        },
        method: 'DELETE'
    };

    return fetch(`${process.env.api}/deletelocation/${locationId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}



//GET LOCATION BY ID
export const getLocationById = (locationId) => {
    return fetch(`${process.env.api}/getlocation/${locationId}`)
        .then (res => {
            return res.json()
        })
        .catch(err => {
            console.log(err)
        })
}



//UPDATE LOCATION
export const updateLocation = (locationId, values) => {
    const config = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(values)
    };

    return fetch(`${process.env.api}/updatelocation/${locationId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}


