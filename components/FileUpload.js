import React from 'react';
import Resizer from "react-image-file-resizer";
import { isAuth, getCookie } from '../actions/authActions';
import axios from 'axios'; //axios is here 'cos I am an idiot and cannot tell fetch to send a file. Axios somehow takes care of that.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";



const FileUpload = ({ values, setValues, showPopup, formSubmitObserver, setFormSubmitObserver }) => {

    //UPLOAD & RESIZE IMGS
    const fileUploadAndResize = (e) => {
        showPopup(`Uploading Image`);

        //resize
        let file = e.target.files[0];
        if (file) {
            Resizer.imageFileResizer(file, 720, 720, 'JPEG', 100, 0, (uri) => {
                //make api call
                  //console.log(uri)
                axios.post(`${process.env.api}/uploadimages`, {image: uri}, {headers: {Authorization: `Bearer ${getCookie('token')}`}})
                .then(res => {
                      // console.log(res.data);
                    setValues({...values, image: res.data});
                    setFormSubmitObserver({formSubmitted: false , imgId: res.data.public_id});
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

export default FileUpload;