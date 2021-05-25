import React, { useState, useEffect } from 'react';
import { getComments } from '../actions/commentActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';



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
                        {
                            values.comments && values.comments.length < 1
                            ?
                            <h2>There are no comments about this hut</h2>
                            :
                            values.comments.map(comment => (
                                <div className="comment" key={comment._id}>
                                    <div className="comment-img" style={{
                                        width: '100px',
                                        height: '100px',
                                        background: '#888'
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
    )


    //RENDER
    return (
        <div className='comments-modal' >
            {showComments()}
        </div>

    )
}



export default CommentsModal
