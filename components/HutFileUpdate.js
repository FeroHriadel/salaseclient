import React from 'react';
import Resizer from "react-image-file-resizer";
import { isAuth, getCookie } from '../actions/authActions';
import axios from 'axios'; //axios is here 'cos I am an idiot and cannot tell fetch to send a file. Axios somehow takes care of that.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { deleteLocationImage} from '../actions/locationActions'; //misplaced and misnamed, but I'm rolling with it
import { updateHutImage } from '../actions/hutActions';



const HutFileUpdate = ({ values, setValues, showPopup, originalImage, setOriginalImage, hutId }) => {
    //UPLOAD & RESIZE IMGS
    const fileUploadAndResize = (e) => {
        showPopup(`Uploading Image`);

        let file = e.target.files[0];
        if (file) {

            //resize
            Resizer.imageFileResizer(file, 720, 720, 'JPEG', 100, 0, (uri) => {

                //save img to cloudinary
                axios.post(`${process.env.api}/uploadimages`, {image: uri}, {headers: {Authorization: `Bearer ${getCookie('token')}`}})
                        .then(res => {

                                //save new img to mongodb
                                updateHutImage(hutId, {image: res.data})
                                        .then(data => {
                                            if (data.error) {
                                                return showPopup(data.error);
                                            }

                                            //set values.image
                                            setValues({...values, image: data.image});

                                            //delete old image from Cloudinary
                                            deleteLocationImage(originalImage);

                                            //set new img as originalImage in case it needs to get deleted again
                                            setOriginalImage(data.image.public_id);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            showPopup('Saving image to db failed (updateHutImage error)')
                                        })
                        })
                        .catch(err => {
                            showPopup(`Image could not be resized (Resizer error)`)
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

export default HutFileUpdate;