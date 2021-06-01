import React from 'react';
import Resizer from "react-image-file-resizer";
import { isAuth, getCookie } from '../actions/authActions';
import { deleteImage } from '../actions/commentActions';
import axios from 'axios'; //axios is here 'cos I am an idiot and cannot tell fetch to send a file. Axios somehow takes care of that.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";



const CommentImageUpload = ({ formValues, setFormValues, formShown, showMessage }) => {

    //UPLOAD & RESIZE IMG
    const fileUploadAndResize = (e) => {       
        //resize
        showMessage('Uploading file');
        let file = e.target.files[0];
        if (file) {
            Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0, (uri) => {

                //upload resized img to cloudinary
                axios.post(`${process.env.api}/uploadimages`, {image: uri}, {headers: {Authorization: `Bearer ${getCookie('token')}`}})
                .then(res => {
                    //delete previously uploaded img from Cloudinary
                    if (formValues.image) {
                        deleteImage(formValues.image.public_id);
                    }

                    //put img.url & img.public_id in formValues & set form status to not submitted
                    setFormValues({...formValues, image: res.data, formSubmitted: false});
                }).catch(err => {
                    console.log(err);
                })
            }, 'base64');
        } else {
            showMessage(`No image to upload found`);
        }
    }



    //RENDER
    return (
        <div className='file-upload'>

            {
                formValues.image && <div className='img-preview' style={formShown ? {background: `url(${formValues.image.url}) no-repeat center center/cover`} : {background: '0'}} /> 
            }

            <label style={formShown ? {opacity: '1', pointerEvents: 'auto', transition: 'all 0.4s linear', transitionDelay: '0.4s'} : {opacity: '0', pointerEvents: 'none', transition: 'all 0.1s linear', transitionDelay: '0s'}}>
                Upload Image <FontAwesomeIcon icon={faUpload} className='icon'/>
                <input 
                    type="file"
                    multiple
                    accept='images/*'
                    onChange={fileUploadAndResize}
                    hidden
                />
            </label>
        
        </div>
    )
}

export default CommentImageUpload;