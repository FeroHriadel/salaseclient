import { getCookie } from './authActions';



//GET COMMENTS BY HUTID + PAGINATION
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



//ADD COMMENT
export const addComment = (values) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(values)
    };

    return fetch(`${process.env.api}/addcomment`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}



//DELETE COMMENT IMAGE
export const deleteImage = (public_id) => {
    return fetch(`${process.env.api}/removecommentimage/${public_id}`, {method: 'DELETE'});
};



//DELETE COMMENT
export const deleteComment = (commentId) => {
    const config = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getCookie('token')}`
        }
    };

    return fetch(`${process.env.api}/deletecomment/${commentId}`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}