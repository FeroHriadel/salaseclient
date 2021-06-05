import { getCookie } from './authActions';



//GET ALL TOP PICKS
export const getTopPicks = () => {
    return fetch(`${process.env.api}/gettoppicks`)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        }); 
}



//ADD TO TOP PICKS
export const addTopPick = (hutId) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify({hutId})
    };

    return fetch(`${process.env.api}/addtoppick`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//DELETE FROM TOP PICKS
export const deleteFromTopPicks = (topPickId) => {
    const config = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}` 
        }
    };

    return fetch(`${process.env.api}/deletetoppick/${topPickId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}