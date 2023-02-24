import { combineReducers } from 'redux'
import posts from './posts'
import Auth from './Auth'

export const reducers =  combineReducers({posts , Auth})
