import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faHeart as regularHeart } from '@fortawesome/free-solid-svg-icons';
import logo from './img/logo.png';
import Popup from './components/Popup';
import { database } from './firebaseConfig'; // Import database from firebaseConfig
import { ref, onValue, update } from 'firebase/database'; // Import update from Firebase
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

  // Fetch posts from Firebase
  useEffect(() => {
    const postsRef = ref(database, 'posts'); // Reference to 'posts' node in Firebase
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      const postList = [];
      for (let id in data) {
        postList.push({ id, ...data[id] });
      }

      // Sort posts by timestamp in descending order to show the latest post first
      postList.sort((a, b) => b.timestamp - a.timestamp);

      setPosts(postList); // Update state with sorted posts
      setLoading(false); // Set loading to false once data is fetched
    });
  }, []);

  const handleLikeToggle = (id) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === id) {
          // Initialize likes to 0 if it's undefined
          const currentLikeCount = post.likes || 0;
          const newLikeCount = post.liked ? currentLikeCount - 1 : currentLikeCount + 1;
  
          const updatedPost = {
            ...post,
            liked: !post.liked,
            likes: newLikeCount
          };
  
          // Update the likes count in Firebase if it's a valid number
          if (!isNaN(newLikeCount)) {
            const postRef = ref(database, `posts/${id}`);
            update(postRef, { likes: newLikeCount, liked: !post.liked });
          } else {
            console.error("Invalid like count value:", newLikeCount);
          }
  
          return updatedPost;
        }
        return post;
      })
    );
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); // Set the selected image
  };

  const handleOverlayClose = () => {
    setSelectedImage(null); // Close the overlay
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
                      onClick={() => handleImageClick(post.images.image1)} // Click to open image in overlay
                    />
                  )}
                  {post.images.image2 && (
                    <img
                      src={post.images.image2}
                      alt="PostImage2"
                      className="tweet-image"
                      onClick={() => handleImageClick(post.images.image2)} // Click to open image in overlay
                    />
                  )}
                  <div className="likes-section">
                    <button className="like-button" onClick={() => handleLikeToggle(post.id)}>
                      <FontAwesomeIcon
                        icon={post.liked ? solidHeart : regularHeart}
                        className={`icon ${post.liked ? 'liked' : ''}`}
                      />
                    </button>
                    <span className="likes">{post.likes || 0} {post.likes === 1 ? 'Like' : 'Likes'}</span>
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

      {/* Image Overlay Modal */}
      {selectedImage && (
        <div className="image-overlay" onClick={handleOverlayClose}>
          <img src={selectedImage} alt="Selected" className="overlay-image" />
        </div>
      )}
    </div>
  );
}

export default App;
