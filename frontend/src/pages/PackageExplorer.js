import React, { useState, useEffect } from 'react';
import '../styles/Explorer.css';

function PackageExplorer() {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    // Mock data - in real implementation, query blockchain
    setPackages([
      {
        name: 'express',
        tier: 'Popular',
        securityScore: 75,
        bountyPool: 50,
        totalFindings: 5,
        lastAudit: '3 days ago'
      },
      {
        name: 'lodash',
        tier: 'Enterprise',
        securityScore: 90,
        bountyPool: 100,
        totalFindings: 2,
        lastAudit: '1 week ago'
      }
    ]);
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="explorer">
      <h2>Package Explorer</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="packages-grid">
        {filteredPackages.map((pkg, index) => (
          <div key={index} className="package-card">
            <div className="package-header">
              <h3>{pkg.name}</h3>
              <span className="tier-badge">{pkg.tier}</span>
            </div>
            
            <div className="security-score">
              <div className="score-circle">
                <span className="score">{pkg.securityScore}</span>
                <span className="label">/100</span>
              </div>
            </div>

            <div className="package-info">
              <div className="info-row">
                <span>Bounty Pool:</span>
                <strong>{pkg.bountyPool} APT</strong>
              </div>
              <div className="info-row">
                <span>Findings:</span>
                <strong>{pkg.totalFindings}</strong>
              </div>
              <div className="info-row">
                <span>Last Audit:</span>
                <strong>{pkg.lastAudit}</strong>
              </div>
            </div>

            <button className="btn btn-secondary">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PackageExplorer;
