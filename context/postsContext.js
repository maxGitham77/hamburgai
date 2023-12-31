import React, {useCallback, useState} from 'react';

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({ children }) => {
	const [posts, setPosts] = useState([]);
	
	const setPostsFromSSR = useCallback((postsFromSSR = []) => {
		console.log('POST FROM SSR: ', postsFromSSR);
		//setPosts(postsFromSSR);
		setPosts(value => {
			const newPosts = [...value];
			postsFromSSR.forEach(post => {
				const exists = newPosts.find((p) => p._id === post._id);
				if (!exists) {
					newPosts.push(post);
				}
			});
			return newPosts;
		});
	}, []);
	
	const getPosts = useCallback(async ({lastPostDate}) => {
		const result = await fetch('/api/getPosts', {
			method: "POST",
			headers: {
				'content-type': "application/json"
			},
			body: JSON.stringify({lastPostDate})
		});
		const json = await result.json();
		const postsResult = json.posts || [];
		console.log("POSTS RESULT: ", postsResult);
		setPosts(value => {
			const newPosts = [...value];
			postsResult.forEach(post => {
				const exists = newPosts.find((p) => p._id === post._id);
				if (!exists) {
					newPosts.push(post);
				}
			});
			return newPosts;
		});
	}, []);
	
	return <PostsContext.Provider value={{posts, setPostsFromSSR, getPosts}}>{children}</PostsContext.Provider>
}