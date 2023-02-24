import React, { useRef } from "react";
import { Typography, TextField, Button, Divider } from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useStyles from './styles';
import {commentPost}  from '../../action/post';

const CommentSection = ({ post }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [Comments, setComments] = useState(post?.comments);
    const [commentMessage, setCommentMessage] = new useState("");
    const commentRefs = useRef();

    const handleClick = async () => {
        const finalComment = `${user.result.rV}: ${commentMessage}`;
        const newComments = await dispatch(commentPost(finalComment, post._id));

        setComments(newComments);
        setCommentMessage('');
        commentRefs.current.scrollIntoView({ behavior: 'smooth' });
    }  
    if(!Comments) return null;

    return (
        <div>
            <div className={classes.commentOuterContainer}>
                <div className={classes.commentInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {Comments.map((value, id) => (
                        <Typography key={id} gutterBottom variant='subtitle1'>
                            <strong>{String(value).split(': ')[0]}</strong>
                            {String(value).split(':')[1]}
                        </Typography>
                         ))}
                    <div ref={commentRefs} />
                </div>
                {user?.result?.rV && (

                    <div style={{ width: '70%' }}>
                        <Typography gutterBottom variant="h6">Write a Comment</Typography>
                        <TextField
                            fullWidth
                            minrows={4}
                            variant="outlined"
                            label="comment"
                            multiline
                            value={commentMessage}
                            onChange={(e) => setCommentMessage(e.target.value)}
                        />
                        <Button style={{ marginTop: '10px' }} fullWidth disabled={!commentMessage} color='primary' variant="contained" onClick={handleClick}>
                            Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )

}

export default CommentSection;