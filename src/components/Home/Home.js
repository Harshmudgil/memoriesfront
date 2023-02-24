import React from 'react'
import { useEffect, useState } from 'react';
import { Container, Grid, Grow, Paper, AppBar, TextField, Button } from '@material-ui/core';
import ChipInput from 'material-ui-chip-input'
import { useHistory, useLocation } from 'react-router-dom';
import Posts from '../Posts/Posts'
import Form from '../Form/Form'
import { getPosts, getPostsBySearch } from '../../action/post'
import { useDispatch } from 'react-redux';
import useStyles from './style';
import Pagination from '../pagination';

function Query() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const query = Query();
    const [currentId, setCurrentId] = useState(0);
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState([]);

    const classes = useStyles();
    const history = useHistory();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const dispatch = useDispatch();

    const handleAdd = (tag) => setTags([...tags, tag]);
    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

    const searchPost = () => {
        if (tags || search.trim()) {
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        } else {
            history.push('/')
        }
    };
    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            searchPost();
        }
    }

    return (
        <Grow in>
            <Container maxWidth='xl'>
                <Grid className={classes.gridContainer} container justifyContent="space-between" alignItems="stretch" spacing={3}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                            <TextField
                                name='search'
                                variant='outlined'
                                label='Search Memories'
                                onKeyPress={handleKeyPress}
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <ChipInput
                                style={{ margin: '10px 0' }}
                                value={tags}
                                onAdd={handleAdd}
                                onDelete={handleDelete}
                                label='Search Tags'
                                variant='outlined'
                            />
                            <Button onClick={searchPost} varient="contained" className={classes.searchButton} color='primary'>Search</Button>
                        </AppBar>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        {(!searchQuery && !tags.length) && (
                            <Paper elevation={6} className = {classes.pagination}>
                                <Pagination page={page} />
                            </Paper>
                        )}
                    </Grid>
                </Grid>

            </Container>
        </Grow>
    )
}

export default Home