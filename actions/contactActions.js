export const sendForm = (values) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    };

    return fetch(`${process.env.api}/sendform`, config)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.log(err);
        });
}