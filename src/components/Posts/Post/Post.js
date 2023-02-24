import React, { useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, CardActionArea } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {useState} from 'react'

import { deletePost, likePost } from '../../../action/post';
import useStyles from './style';


const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('profile'));
  
  const [likes, setLikes] = useState(post?.likes);
  const userId = user?.result.NT || user?.result?._id;
  
  
  const hasLikedPost = post.likes.find((like) => like === userId)
  


  const handleLike = async () => {
    dispatch(likePost(post._id));
   
    if (Boolean(hasLikedPost)) {
      setLikes(post.likes.filter((id) => id !== userId))
    } else {
      setLikes([...post.likes, userId]);
    }
  };
 

  const Likes = () => {
    if (likes?.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <><ThumbUpAltIcon fontSize='small' /> {'\u00A0'}{likes.length > 2 ? `You and ${likes.length - 1} other` : `${likes.length} like ${likes.length > 1 ? 's' : ''}`} </>
        )
        :
        (
          <><ThumbUpAltIcon fontSize='small' />{'\u00A0'}{likes.length} {likes.length === 1 ? 'Like' : 'Likes'} </>
        )
    }
    return <><ThumbUpAltIcon fontSize='small' /> {'\u00A0'}Like </>;
};
 
  const openPost = () => history.push(`/posts/${post._id}`);



  return (
    <Card className={classes.card} raised elevation={6}>

      <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
      <div className={classes.overlay}>
        <Typography variant="h6">{post.creator}</Typography>
        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
      </div>
      {(user?.result?.rV === post?.name)
        && (
          <div className={classes.overlay2}>
            <Button style={{ color: 'white' }} size="large" onClick={() => setCurrentId(post._id)} ><MoreHorizIcon fontSize="medium" /></Button>
          </div>
        )}
      <CardActionArea onClick={openPost}>
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">{post.message.substr(0, 150)}...</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button>

        {(user?.result?.rV === post?.name)
          && (
            <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))} >
              <DeleteIcon fontSize="small" />
              Delete
            </Button>)}
      </CardActions>
    </Card>
  );
}

export default Post;