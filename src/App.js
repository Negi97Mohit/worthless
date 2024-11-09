import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faHeart as regularHeart } from '@fortawesome/free-solid-svg-icons';
import logo from './img/logo.png';
import Popup from './components/Popup';
import { database } from './firebaseConfig'; // Import database from firebaseConfig
import { ref, onValue } from 'firebase/database';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  // Fetch posts from Firebase
  useEffect(() => {
    const postsRef = ref(database, 'posts'); // Reference to 'posts' node in Firebase
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      const postList = [];
      for (let id in data) {
        postList.push({ id, ...data[id] });
      }
      setPosts(postList); // Update state with fetched posts
      setLoading(false); // Set loading to false once data is fetched
    });
  }, []);

  const handleLikeToggle = (id) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id
          ? { ...post, liked: !post.liked }
          : post
      )
    );
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading text while fetching data
  }

  return (
    <div className="AppContainer">
      <div className="AppGrid">
        <div className="logo-column">
          <img src={logo} alt="Logo" className="AppLogo" />
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
                      alt="Post Image 1"
                      className="tweet-image"
                    />
                  )}
                  {post.images.image2 && (
                    <img
                      src={post.images.image2}
                      alt="Post Image 2"
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
                    <span className="likes">{post.liked ? 'Liked' : 'Like'}</span>
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
