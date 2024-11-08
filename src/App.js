import React from 'react';
import logo from './img/logo.png';
import Popup from './Popup';
import './App.css'; // Assuming the CSS file is the same

const data = [
  { id: 1, title: 'Job Title 1', description: 'This is a job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 2, title: 'Job Title 2', description: 'This is another job description 1' },
  { id: 3, title: 'Job Title 3', description: 'This is a third job description' },
  // Add more data as needed
];

function App() {
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
            {data.map((item) => (
              <div key={item.id} className="card">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
