import React from 'react';
import Resizer from "react-image-file-resizer";
import { isAuth, getCookie } from '../actions/authActions';
import axios from 'axios'; //axios is here 'cos I am an idiot and cannot tell fetch to send a file. Axios somehow takes care of that.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { deleteLocationImage, updateLocation } from '../actions/locationActions';



const FileUpdate = ({ values, setValues, showPopup, originalImage, setOriginalImage, locationId }) => {

    //UPLOAD & RESIZE IMGS
    const fileUploadAndResize = (e) => {
        showPopup(`Uploading Image`);

        //resize
        let file = e.target.files[0];
        if (file) {
            Resizer.imageFileResizer(file, 720, 720, 'JPEG', 100, 0, (uri) => {
                //upload img to cloudinary
                axios.post(`${process.env.api}/uploadimages`, {image: uri}, {headers: {Authorization: `Bearer ${getCookie('token')}`}})
                .then(res => {
                    //put new img details in values
                    setValues({...values, image: res.data});
                    //delete the original image from Cloudinary
                    deleteLocationImage(originalImage);
                    setOriginalImage(res.data.public_id); //set new img as originalImg in case it needs to be deleted

                    //make api update call to update the img url in mongodb
                    updateLocation(locationId, {image: res.data})
                        .then(data => {
                            if (data.error) {
                                return showPopup(data.error)
                            }
                            setValues({...values, image: data.image});
                        }).catch(err => {
                            console.log(err);
                            showPopup(`Writing img in db failed`);
                        })

                }).catch(err => {
                    console.log(err);
                    showPopup(`Image could not be resized (Resizer error)`);
                })
            }, 'base64');
        } else {
            showPopup(`No image to upload found`);
        }
    }



    //RENDER
    return (
        <div className='file-upload'>
            <label style={{cursor: 'pointer'}}>
                Upload Image <FontAwesomeIcon icon={faUpload} className='icon'/>
                <input 
                    type="file"
                    multiple
                    accept='images/*'
                    onChange={fileUploadAndResize}
                    hidden
                />
            </label>

            {values.image && <div className='img-preview' style={{background: `url(${values.image.url}) no-repeat center center/cover`}} /> }
        </div>
    )
}

export default FileUpdate;