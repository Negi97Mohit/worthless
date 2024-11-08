import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faHeart as regularHeart } from '@fortawesome/free-solid-svg-icons';
import logo from './img/logo.png';
import Popup from './Popup';
import './App.css'; // Assuming the CSS file is the same

const data = [
  { id: 1, title: 'Job Title 1', description: 'This is a job description 1', location: 'New York', company: 'Company A' },
  { id: 2, title: 'Job Title 2', description: 'This is a job description 2', location: 'San Francisco', company: 'Company B' },
  // Add more job data as needed
];

function App() {
  const [jobs, setJobs] = useState(data);

  const handleLikeToggle = (id) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === id
          ? { ...job, liked: !job.liked }
          : job
      )
    );
  };

  return (
    <div className="AppContainer"> {/* Container for the whole app */}
      {/* Main Content Section */}
      <div className="AppGrid">
        {/* Column 1 (Logo) */}
        <div className="logo-column">
          <img src={logo} alt="Logo" className="AppLogo" /> {/* Logo Image */}
        </div>

        {/* Column 2 (Job Listings & Popup) */}
        <div className="content-column">
          <Popup /> {/* Your existing Popup component */}

          {/* Card Container */}
          <div className="card-container">
            {jobs.map((job) => (
              <div key={job.id} className="tweet-card">
                <div className="card-content">
                  <h3 className="tweet-title">{job.title}</h3>
                  <p className="tweet-company">{job.company}</p>
                  <p className="tweet-description">{job.description}</p>
                  <p className="tweet-location">Location: {job.location}</p>

                  <div className="likes-section">
                    <button className="like-button" onClick={() => handleLikeToggle(job.id)}>
                      <FontAwesomeIcon
                        icon={job.liked ? solidHeart : regularHeart}
                        className={`icon ${job.liked ? 'liked' : ''}`}
                      />
                    </button>
                    <span className="likes">{job.liked ? 'Liked' : 'Like'}</span>
                  </div>
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
