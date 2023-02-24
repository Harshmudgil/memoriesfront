import React from "react";
import useStyles from "./style";
import { Typography, TextField, Paper, Button } from "@material-ui/core";
import { useState,useEffect} from "react";
import FileBase from 'react-file-base64';
import { useDispatch , useSelector } from 'react-redux';
import { createPost , updatePost } from '../../action/post'
import { useHistory } from "react-router-dom";


const Form = ({currentId,setCurrentId}) => {
    const history = useHistory();
    const classes = useStyles();
    const [postData, setPostData] = useState({title: '', message: '', tags: '', selectedFile: '' });
    const dispatch = useDispatch();
    const posts = useSelector((state)=> (currentId ? state.posts.posts.find((p)=> p._id === currentId): null)); 
    const user = JSON.parse(localStorage.getItem('profile'));
    useEffect(()=>{
        if(posts) setPostData(posts)
    },[posts])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!currentId){
            dispatch(createPost({...postData, name : user?.result?.rV},history));
        }else{
        console.log('updating')
        dispatch(updatePost(currentId,{...postData, name : user?.result?.rV}));
    }
        clear();
   }

    const clear = () => {
        setCurrentId(null);
        setPostData({title: '', message: '', tags: '', selectedFile: '' });
    }

    if(!user?.result?.rV){
        return (
        <Paper className={classes.paper}>
            <Typography variant='h6' align='center'>
                Please signIn from creating a memories.
            </Typography>
        </Paper>
        )
    }



    return (
        <Paper className={classes.paper} elevation = {6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? 'Editing' : 'Creating' } a Memory</Typography>
                <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
                <TextField name="message" variant="outlined" label="Message" fullWidth multiline minRows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
                <TextField name="tags" variant="outlined" label="Tags (coma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
                <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper>
    )
}

export default Form;