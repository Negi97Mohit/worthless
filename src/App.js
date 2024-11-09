import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import logo from './img/logo.png';
import Popup from './components/Popup';
import { database } from './firebaseConfig'; // Import database from firebaseConfig
import { ref, onValue, update } from 'firebase/database'; // Import update from Firebase
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  // Fetch posts from Firebase
  useEffect(() => {
    const postsRef = ref(database, 'posts'); // Reference to 'posts' node in Firebase
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      const postList = [];
      for (let id in data) {
        postList.push({ id, ...data[id], liked: false }); // Initialize 'liked' to false locally
      }

      // Sort posts by timestamp in descending order to show the latest post first
      postList.sort((a, b) => b.timestamp - a.timestamp);

      setPosts(postList); // Update state with sorted posts
      setLoading(false); // Set loading to false once data is fetched
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle Like Toggle - Update both local state and Firebase
  const handleLikeToggle = (id) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === id) {
          const isLiked = post.liked;
          const currentLikeCount = post.likes || 0;
          const newLikeCount = isLiked ? currentLikeCount - 1 : currentLikeCount + 1;

          // Ensure newLikeCount is not negative
          const validLikeCount = newLikeCount >= 0 ? newLikeCount : 0;

          // Update the like count in Firebase if it's a valid number
          if (!isNaN(validLikeCount)) {
            const postRef = ref(database, `posts/${id}`);
            update(postRef, { likes: validLikeCount })
              .then(() => {
                console.log(`Post ${id} like count updated to ${validLikeCount}`);
              })
              .catch((error) => {
                console.error("Error updating like count: ", error);
              });
          } else {
            console.error("Invalid like count value:", newLikeCount);
          }

          return {
            ...post,
            liked: !isLiked,
            likes: validLikeCount
          };
        }
        return post;
      })
    );
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading text while fetching data
  }

  return (
    <div className="AppContainer">
      <div className="AppGrid">
        <div className="logo-column">
          <img src={logo} alt="logo" className="AppLogo" />
        </div>
        <div className="content-column">
          <Popup />
          <div className="card-container">
            {posts.map((post) => (
              <div key={post.id} className="tweet-card">
                <div className="card-content">
                  <p className="tweet-text">{post.text}</p>
                  {post.images.image1 && (
                    <img
                      src={post.images.image1}
                      alt="PostImage1"
                      className="tweet-image"
                    />
                  )}
                  {post.images.image2 && (
                    <img
                      src={post.images.image2}
                      alt="PostImage2"
                      className="tweet-image"
                    />
                  )}
                  <div className="likes-section">
                    <button className="like-button" onClick={() => handleLikeToggle(post.id)}>
                      <FontAwesomeIcon
                        icon={post.liked ? solidHeart : regularHeart}
                        className={`icon ${post.liked ? 'liked' : ''}`}
                      />
                    </button>
                    <span className="likes">
                      {post.likes || 0} {post.likes === 1 ? 'Like' : 'Likes'}
                    </span>
                  </div>
                  <p className="timestamp">
                    Posted on: {new Date(post.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
  