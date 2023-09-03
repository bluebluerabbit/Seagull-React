import { configureStore, createSlice } from '@reduxjs/toolkit';
import hashtagName from './hashtag.js';

let hashtag = createSlice({
    name: "hashtag",
    initialState: {
		hashtagName
	},
})

export default configureStore({
	reducer: {
		hashtag: hashtag.reducer
	}
})