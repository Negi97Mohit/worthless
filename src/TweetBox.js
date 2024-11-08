// TweetBox.js
import React, { useState, useRef } from 'react';
import './TweetBox.css';

const TweetBox = () => {
  const maxLength = 100;
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showCounter, setShowCounter] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [overText, setOverText] = useState('');
  
  const editableRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    setShowPlaceholder(false);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setShowPlaceholder(inputText.length === 0);
  };

  const handleInput = (e) => {
    const currentText = e.target.innerText;
    const currentLength = currentText.length;

    setInputText(currentText);
    setShowCounter(currentLength > 0);
    setButtonActive(currentLength > 0 && currentLength <= maxLength);

    if (currentLength > maxLength) {
      setOverText(currentText.substr(maxLength));
      setButtonActive(false);
    } else {
      setOverText('');
    }
  };

  return (
    <div className="wrapper">
      <div className="input-box">
        <div className="tweet-area">
          {showPlaceholder && <span className="placeholder">What's happening?</span>}
          <div
            className="input editable"
            contentEditable
            spellCheck="false"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={handleInput}
            ref={editableRef}
          />
          {overText && (
            <div
              className="input readonly"
              dangerouslySetInnerHTML={{
                __html: inputText.substr(0, maxLength) + `<span class="highlight">${overText}</span>`,
              }}
            />
          )}
        </div>
        <div className="privacy">
          <i className="fas fa-globe-asia"></i>
          <span>Everyone can reply</span>
        </div>
      </div>
      <div className="bottom">
        <ul className="icons">
          <li><i className="uil uil-capture"></i></li>
          <li><i className="far fa-file-image"></i></li>
          <li><i className="fas fa-map-marker-alt"></i></li>
          <li><i className="far fa-grin"></i></li>
          <li><i className="far fa-user"></i></li>
        </ul>
        <div className="content">
          {showCounter && <span className="counter" style={{ color: inputText.length > maxLength ? '#e0245e' : '#333' }}>
            {maxLength - inputText.length}
          </span>}
          <button className={buttonActive ? 'active' : ''}>Tweet</button>
        </div>
      </div>
    </div>
  );
};

export default TweetBox;
