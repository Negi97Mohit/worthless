import React, { useState, useRef } from 'react';
import './Popup.css';
import { ref, set } from "firebase/database";
import { database } from "./firebaseConfig";  // Adjust path if needed

const Popup = () => {
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const editableRef = useRef(null);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setInputText('');
    setImage1(null);
    setImage2(null);
    setShowPlaceholder(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowPlaceholder(false);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setShowPlaceholder(inputText.length === 0);
  };

  const handleInput = (e) => {
    const text = e.target.innerText;
    setInputText(text);
  };

  const handlePostTweet = () => {
    const postId = `post_${Date.now()}`;

    const postData = {
      text: inputText,
      timestamp: Date.now(),
      images: {
        image1: image1 || null,
        image2: image2 || null,
      }
    };

    const postRef = ref(database, 'posts/' + postId);

    set(postRef, postData)
      .then(() => {
        console.log('Post uploaded successfully!');
        togglePopup();
        setInputText('');
        setImage1(null);
        setImage2(null);
      })
      .catch((error) => {
        console.error('Error uploading post:', error);
      });
  };

  const handleImageChange = (e, imageNumber) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (imageNumber === 1) {
        setImage1(reader.result);
      } else {
        setImage2(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageNumber) => {
    if (imageNumber === 1) {
      setImage1(null);
    } else {
      setImage2(null);
    }
  };

  const isButtonEnabled = inputText.length > 0 || image1 || image2;

  const toggleStyle = (style) => {

    document.execCommand(style);

  };
  return (
    <div className="PopupContainer">
      <a
        href="#"
        aria-label="Post"
        role="button"
        onClick={(e) => {
          e.preventDefault();
          togglePopup();
        }}
        className="popup-btn"
      >
        <div className="popup-btn-content">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="popup-icon">
            <g>
            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
            </g>
          </svg>
        </div>
      </a>

      {isOpen && (
        <div className="popup-overlay" onClick={togglePopup}>
          <div className="popup-inner-container" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <button onClick={togglePopup} className="close-btn" aria-label="Close popup">×</button>
            </div>

            <div className="tweet-popup-content">
              <div className="tweet-area">
                {showPlaceholder && <span className="placeholder">Who is it and why??</span>}
                <div
                  className="input editable"
                  contentEditable
                  spellCheck="false"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  ref={editableRef}
                />
              </div>

              {/* Text formatting toolbar */}

              <div className="toolbar">

                <button onClick={() => toggleStyle('bold')}><b>B</b></button>

                <button onClick={() => toggleStyle('italic')}><i>I</i></button>

                <button onClick={() => toggleStyle('underline')}><u>U</u></button>

                <button onClick={() => toggleStyle('strikeThrough')}><s>S</s></button>

              </div>
              <div className="image-upload">
                <label className="image-upload-label">
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 1)} />
                  <div className="custom-upload-button">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="custom-icon">
                      <g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path></g>
                    </svg>
                  </div>
                </label>
                {image1 && (
                  <div className="uploaded-image-container">
                    <img src={image1} alt="Uploaded 1" className="uploaded-image" />
                    <button className="remove-btn" onClick={() => removeImage(1)}>×</button>
                  </div>
                )}

                <label className="image-upload-label">
                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 2)} />
                  <div className="custom-upload-button">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="custom-icon">
                      <g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path></g>
                    </svg>
                  </div>
                </label>
                {image2 && (
                  <div className="uploaded-image-container">
                    <img src={image2} alt="Uploaded 2" className="uploaded-image" />
                    <button className="remove-btn" onClick={() => removeImage(2)}>×</button>
                  </div>
                )}
              </div>
            </div>

            <div className="popup-footer">
              <button
                className="post-btn"
                onClick={handlePostTweet} 
                disabled={!isButtonEnabled}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
