import React, { useState } from 'react'; // Import useState here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faHeart as regularHeart } from '@fortawesome/free-solid-svg-icons';
import './TweetFeed.css'; // Optional, for styling

const Tweet = ({ tweet, onLikeToggle }) => {
  return (
    <div className="tweet-card">
      <div className="card-content">
        <p className="tweet-text">
          {tweet.tweet}
        </p>
        {/* Render images if provided */}
        {tweet.images && tweet.images.length > 0 && (
          <div className="tweet-images">
            {tweet.images.map((image, index) => (
              <img key={index} src={image} alt={`Tweet Image ${index + 1}`} className="tweet-image" />
            ))}
          </div>
        )}
        <div className="likes-section">
          <button className="like-button" onClick={() => onLikeToggle(tweet.id)}>
            <FontAwesomeIcon
              icon={tweet.liked ? solidHeart : regularHeart}
              className={`icon ${tweet.liked ? 'liked' : ''}`}
            />
          </button>
          <span className="likes">{tweet.likes}</span>
        </div>
      </div>
    </div>
  );
};

const TweetFeed = () => {
  const [tweets, setTweets] = useState([
    {
      id: 1,
      tweet: "If you don't succeed, dust yourself off and try again.",
      likes: 10,
      liked: false,
      images: ['https://via.placeholder.com/150'] // Example image
    }
  ]);

  const handleLikeToggle = (id) => {
    setTweets(prevTweets =>
      prevTweets.map(tweet =>
        tweet.id === id
          ? {
              ...tweet,
              liked: !tweet.liked,
              likes: tweet.liked ? tweet.likes - 1 : tweet.likes + 1,
            }
          : tweet
      )
    );
  };

  return (
    <div id="app" className="columns">
      <div className="column">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} onLikeToggle={handleLikeToggle} />
        ))}
      </div>
    </div>
  );
};

export default TweetFeed;
