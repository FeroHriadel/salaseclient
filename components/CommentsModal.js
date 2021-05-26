import React, { useState, useEffect } from 'react';
import { getComments } from '../actions/commentActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import { isAuth, getCookie } from '../actions/authActions';
import { addComment } from '../actions/commentActions';
import Router from 'next/router';
import CommentImageUpload from '../components/CommentImageUpload';



const CommentsModal = ({ hut, setCommentsShown }) => {
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
                    formSubmitted: true, //in case user uploads an image but doesn't submit form => so image can be deleted
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
                            style={formShown ? {height: '150px', width: '100%', padding: '40px 15px 15px 15px'} : {height: '0px', width: '0%', padding: '0px'}}
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

                        <CommentImageUpload formValues={formValues} setFormValues={setFormValues} formShown={formShown} />

                    </form>
                </div>            
    );



    //COMMENTS HTML
    const showComments = () => (
            values.error
            ?
                <div className="error-message">
                    <p className="close-comments-btn" onClick={() => {setCommentsShown(false)}}>Close</p>
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
                    <p className="close-comments-btn" onClick={() => {setCommentsShown(false)}}>Close</p>
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
                                    <FontAwesomeIcon 
                                        icon={faTimes} 
                                        className='delete-btn' 
                                        title='Remove this comment'
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
    );




    //RENDER
    return (
        <div className='comments-modal' >
            {showComments()}
        </div>

    )
}



export default CommentsModal
