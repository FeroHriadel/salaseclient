import { getCookie } from './authActions';



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