import React, { useState } from 'react';
import PackageCard from '../components/PackageCard';
import { getAudit, getAllAudits } from '../utils/aptos';
import './Search.css';
import '../styles/loading.css';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      // Try to parse package@version format
      const parts = searchQuery.split('@');
      let packageName, version;
      
      if (parts.length === 2) {
        packageName = parts[0];
        version = parts[1];
      } else if (parts.length === 3 && parts[0] === '') {
        // Scoped package: @scope/package@version
        packageName = `@${parts[1]}`;
        version = parts[2];
      } else {
        // Just package name, search all audits
        const allAudits = await getAllAudits();
        const results = allAudits.filter(audit => 
          audit.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
        return;
      }

      // Search for specific package@version
      const audit = await getAudit(packageName, version);
      if (audit && audit.exists) {
        setSearchResults([{
          name: packageName,
          version: version,
          ...audit
        }]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">Search Packages</h1>
        <p className="search-subtitle">
          Find security audits for any npm package
        </p>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search for packages... (e.g., react, express, lodash)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        <button type="submit" className="search-button" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h2 className="results-title">
              Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
            </h2>
          </div>
          <div className="results-grid">
            {searchResults.map((audit, index) => (
              <PackageCard key={index} audit={audit} />
            ))}
          </div>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="no-results">
          <svg className="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 className="no-results-title">No audits found</h3>
          <p className="no-results-text">
            No audits found for "{searchQuery}". Try searching for another package.
          </p>
        </div>
      )}

      {!searchQuery && searchResults.length === 0 && (
        <div className="search-empty">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <h3 className="empty-title">Start searching</h3>
          <p className="empty-text">
            Enter a package name to find its security audit
          </p>
        </div>
      )}
    </div>
  );
}

export default Search;
