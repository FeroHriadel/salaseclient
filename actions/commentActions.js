import { getCookie } from './authActions';



//GET COMMENTS BY HUTID + PAGE
export const getComments = (hutid, page) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({page})
    };

    return fetch(`${process.env.api}/getcomments/${hutid}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        })
}