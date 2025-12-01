import React, { useState, useEffect } from 'react';
import '../styles/Explorer.css';

function PackageExplorer() {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    // Mock data with popular packages
    const mockPackages = [
      {
        name: 'axios',
        tier: 'Popular',
        securityScore: 92,
        bountyPool: 50,
        totalFindings: 3,
        lastAudit: '2 days ago'
      },
      {
        name: 'zod',
        tier: 'Enterprise',
        securityScore: 95,
        bountyPool: 100,
        totalFindings: 1,
        lastAudit: '1 week ago'
      },
      {
        name: 'express',
        tier: 'Popular',
        securityScore: 88,
        bountyPool: 75,
        totalFindings: 5,
        lastAudit: '3 days ago'
      },
      {
        name: 'lodash',
        tier: 'Enterprise',
        securityScore: 90,
        bountyPool: 120,
        totalFindings: 4,
        lastAudit: '5 days ago'
      },
      {
        name: 'react',
        tier: 'Enterprise',
        securityScore: 94,
        bountyPool: 200,
        totalFindings: 2,
        lastAudit: '1 day ago'
      },
      {
        name: 'typescript',
        tier: 'Enterprise',
        securityScore: 96,
        bountyPool: 150,
        totalFindings: 1,
        lastAudit: '4 days ago'
      },
      {
        name: 'shelby',
        tier: 'Popular',
        securityScore: 93,
        bountyPool: 60,
        totalFindings: 2,
        lastAudit: '6 hours ago'
      },
      {
        name: 'risein',
        tier: 'Enterprise',
        securityScore: 97,
        bountyPool: 85,
        totalFindings: 1,
        lastAudit: '2 days ago'
      },
      {
        name: 'quicky',
        tier: 'Basic',
        securityScore: 100,
        bountyPool: 30,
        totalFindings: 0,
        lastAudit: '1 day ago'
      }
    ];
    
    // Merge with user-registered packages from localStorage
    const storedPackages = localStorage.getItem('chainaudit_packages');
    if (storedPackages) {
      const userPackages = JSON.parse(storedPackages);
      const tierNames = ['Basic', 'Popular', 'Enterprise'];
      
      userPackages.forEach(pkg => {
        if (!mockPackages.find(p => p.name === pkg.name)) {
          mockPackages.push({
            name: pkg.name,
            tier: tierNames[pkg.tier] || 'Basic',
            securityScore: pkg.acceptedFindings > 0 ? Math.max(0, 100 - (pkg.acceptedFindings * 10)) : 100,
            bountyPool: pkg.bountyPool,
            totalFindings: pkg.totalFindings || 0,
            lastAudit: 'Recently'
          });
        }
      });
    }
    
    setPackages(mockPackages);
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
