import React, { useState, useEffect, useRef } from 'react';
import './CompanySelector.css';

const CompanySelector = ({ onCompanySelect }) => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [logoUrl, setLogoUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch('/companies.json')
      .then((response) => response.json())
      .then((data) => {
        setCompanies(data);
        setFilteredCompanies(data);
      })
      .catch((error) => console.error("Error loading companies:", error));
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleCompanyChange = (company) => {
    setSelectedCompany(company.name);
    setLogoUrl(`https://logo.clearbit.com/${company.domain}`);
    onCompanySelect(company);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <div className="company-selector" ref={dropdownRef}>
      <button 
        type="button" 
        className="dropdown-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
      >
        {selectedCompany ? (
          <>
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt={`${selectedCompany} logo`} 
                className="dropdown-logo"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <span className="selected-company-name">{selectedCompany}</span>
            <span className="dropdown-arrow">▼</span>
          </>
        ) : (
          <>
            <span className="placeholder-text">Select a company</span>
            <span className="dropdown-arrow">▼</span>
          </>
        )}
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a company..."
            value={searchQuery}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()} // Prevents closing on input click
          />
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div
                key={company.name}
                className="dropdown-item"
                onClick={() => handleCompanyChange(company)}
              >
                <img
                  src={`https://logo.clearbit.com/${company.domain}`}
                  alt={`${company.name} logo`}
                  className="dropdown-logo"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="company-name">{company.name}</span>
              </div>
            ))
          ) : (
            <div className="no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
