import React, { useState, useEffect } from 'react';
import { getComments } from '../actions/commentActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import { isAuth, getCookie } from '../actions/authActions';
import { addComment } from '../actions/commentActions';
import { deleteImage, deleteComment } from '../actions/commentActions';
import Router from 'next/router';
import CommentImageUpload from '../components/CommentImageUpload';
import ConfirmModal from './ConfirmModal';



const CommentsModal = ({ hut, setCommentsShown }) => {
    //DELETE COMMENT & DELETE CONFIRM MODAL
    const [showModal, setShowModal] = useState(false);
    const [actionConfirmed, setActionConfirmed] = useState(false);
    const [commentData, setCommentData] = useState({});

    useEffect(() => {
        if (actionConfirmed) {
            deleteComment(commentData.commentId)
                .then(data => {
                    if (data.error) {
                        console.log(data.error); /////////////////////////////
                    }

                    console.log(`Comment deleted`); ////////////////////
                })
            
            if (commentData && commentData.imageId) {
                deleteImage(commentData.imageId);
            }

            setActionConfirmed(false);

            const remainingComments = values.comments.filter(comment => comment._id !== commentData.commentId);
            setValues({...values, comments: remainingComments});
            setCommentData({});
        }
    }, [actionConfirmed]);


    //GET COMMENTS - INITIAL LOAD
    const [values, setValues] = useState({loading: true, error: null});

    const initialLoad = () => {
        setValues({loading: true, error: null});
        getComments(hut._id, 1)
            .then (data => {
                if (data.error) {
                    setValues({error: data.error, loading: false});
                    return;
                }

                setValues({comments: data.comments, page: data.page, numberOfPages: data.numberOfPages, loading: false, error: null});
            });
    }

    useEffect(() => {
        initialLoad();
    }, []);



    //LOAD MORE ON SCROLL
    const loadMore = (e) => {
        const totalHeight = e.target.scrollHeight;
        const scrolledFromTop = e.target.scrollTop;
        const viewHeight = e.target.clientHeight;

        if (
            scrolledFromTop + viewHeight >= totalHeight * 0.9 &&
            values.page <= values.numberOfPages
        ) {
            getComments(hut._id, values.page + 1)
            .then(data => {
                if (data.error) {
                    setValues({loading: false, error: data.error});
                    return;
                }

               setValues({...values, page: data.page, numberOfPages: data.numberOfPages, comments: [...values.comments, ...data.comments]});
            });
        }        
    }





    //ADD COMMENT FORM
      //show-form switch
    const [formShown, setFormShown] = useState(false);

      //form message
    const [messageShown, setMessageShown] = useState(false);
    const [messageText, setMessageText] = useState('');
    const showMessage = (message) => {
        setMessageShown(true);
        setMessageText(message);
        setTimeout(() => {
            setMessageShown(false);
        }, 3000)
    }

      //form values
    const [formValues, setFormValues] = useState({
        formSubmitted: false, //in case user uploads an image but doesn't submit form => so image can be deleted
        hutid: hut._id,
        user: isAuth() ? isAuth()._id : null,
        text: '',
        image: null
    });


      //submit handler
    const submitHandler = (e) => {
        e.preventDefault();

        //redirect non-signedin user to '/signin'
        if (!formValues.user) {
            showMessage(`Please sign in before leaving a comment. Redirecting...`);
            setTimeout(() => {
                Router.push(`/signin?redirect=/huts/${hut._id}`)
            }, 2500);
            return;
        }

        //check if any text entered
        if (formValues.text === '') {
            showMessage(`Please enter some text`);
            return;
        }

        //make 'addComment' call
        addComment(formValues)
            .then(data => {
                if (data.error) {
                    return showMessage(data.error);
                }

                setFormValues({
                    formSubmitted: true,
                    hutid: hut._id,
                    user: isAuth() ? isAuth()._id : null,
                    text: '',
                    image: null
                })
                showMessage(`Comment added`);
                initialLoad();
            })
            .catch(err => {
                console.log(err);
                showMessage(`Something went wrong (CommentsModal.js/submitHandler)`);
            })
      }


      //delete Cloudinary img if form not submitted and user navigates away
    const removeUnsubmittedImg = () => {
        if (!formValues.formSubmitted && formValues.image.public_id) {
            deleteImage(formValues.image.public_id);
        }
    }

    useEffect(() => {
        Router.events.on('routeChangeStart', removeUnsubmittedImg);
        return () => {
            Router.events.off('routeChangeStart', removeUnsubmittedImg);
        }
    }, [formValues]);

      //form html
    const addCommentForm = () => (
                formValues.hutid 
                &&
                <div className='add-comment-container'>
                    <form className='add-comment-form' onSubmit={submitHandler}>

                        <p onClick={() => setFormShown(!formShown)}>
                            {
                                formShown ? 'Close' : 'Add Comment'
                            }
                        </p>

                        <textarea 
                            className='textarea' 
                            style={formShown ? {height: '200px', width: '100%', padding: '45px 15px 15px 15px'} : {height: '0px', width: '0%', padding: '0px'}}
                            placeholder='Please type your comment here...'
                            name='text'
                            value={formValues.text}
                            onChange={(e) => {setFormValues({...formValues, text: e.target.value})}}
                        />

                        <button type='submit' style={formShown ? {opacity: '1', pointerEvents: 'auto'} : {opacity: '0', pointerEvents: 'none'}}>
                            {
                                messageShown
                                ?
                                `${messageText}`
                                :
                                'Submit'
                            }
                        </button>

                        <CommentImageUpload formValues={formValues} setFormValues={setFormValues} formShown={formShown} showMessage={showMessage} />

                    </form>
                </div>            
    );





    //COMMENTS HTML
    const showComments = () => (
            values.error
            ?
                <div className="error-message">
                    <p className="close-comments-btn" onClick={() => {setCommentsShown(false);}}>Close</p>
                    <h2>Comments could not be loaded</h2>
                    {values.error && <p>{values.error}</p>}
                </div>
            :
            values.loading
            ?
                <div className="error-message">
                    <h2>Loading...</h2>
                </div>
            :
                <div className="comments-wrapper">
                    <p className="close-comments-btn" onClick={() => {
                        if (formValues.image && formValues.image.public_id) {
                            removeUnsubmittedImg(); //remove unsubmitted Cloudinary img on modal close
                        }
                        setCommentsShown(false);
                    }}>Close</p>
                    <div className="wrapper-for-scroll" onScroll={loadMore}>

                        {addCommentForm()}

                        {
                            values.comments && values.comments.length < 1
                            ?
                            <h2>There are no comments related to this hut</h2>
                            :
                            values.comments.map(comment => (
                                <div className="comment" key={comment._id}>
                                    <div className="comment-img" style={{
                                        width: '200px',
                                        height: '200px',
                                        background: comment.image ? `url(${comment.image.url}) no-repeat center center/cover` : `linear-gradient(to bottom right, rgb(241, 235, 201) 25%, #bbb)`
                                    }} />
                                    <p className='added-by'>
                                        Added by:
                                        {' '} 
                                        <span>{comment.user.email.split('@')[0]} / </span>
                                        {' '}
                                        <span>{moment(comment.createdAt).fromNow()}</span>
                                    </p>
                                    <p>{comment.text}</p>

                                    {
                                        isAuth && isAuth().role === 'admin'
                                        ?
                                        <FontAwesomeIcon 
                                            icon={faTimes} 
                                            className='delete-btn' 
                                            title='Remove this comment'
                                            onClick={() => {
                                                setShowModal(true);
                                                if (comment.image && comment.image.public_id) {
                                                    setCommentData({commentId: comment._id, imageId: comment.image.public_id});
                                                } else {
                                                    setCommentData({commentId: comment._id});
                                                }
                                            }}
                                        />
                                        :
                                        ''
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
    );




    //RENDER
    return (
        <div className='comments-modal'>

            {showComments()}

            <ConfirmModal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                actionConfirmed={actionConfirmed}
                setActionConfirmed={setActionConfirmed}
                modalText='Delete Comment?'
            />

        </div>

    )
}



export default CommentsModal
