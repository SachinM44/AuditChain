import React, { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function OwnerDashboard() {
  const { account, connected } = useWallet();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && account) {
      loadPackages();
    }
  }, [connected, account]);

  const loadPackages = async () => {
    setLoading(true);
    
    try {
      // Get registered packages from localStorage (demo mode)
      const storedPackages = localStorage.getItem('chainaudit_packages');
      let userPackages = storedPackages ? JSON.parse(storedPackages) : [];
      
      // Filter packages for current user
      userPackages = userPackages.filter(pkg => pkg.owner === account.address);
      
      // Get findings to update package stats
      const storedFindings = localStorage.getItem('chainaudit_findings');
      const findings = storedFindings ? JSON.parse(storedFindings) : [];
      
      // Update each package with real finding counts
      userPackages = userPackages.map(pkg => {
        const pkgFindings = findings.filter(f => f.package === pkg.name);
        const accepted = pkgFindings.filter(f => f.status === 1).length;
        const total = pkgFindings.length;
        
        return {
          ...pkg,
          totalFindings: total,
          acceptedFindings: accepted
        };
      });
      
      // If no packages, show example
      if (userPackages.length === 0) {
        userPackages = [
          {
            name: 'my-awesome-package',
            owner: account.address,
            tier: 1,
            bountyPool: 50,
            credibility: 85,
            totalFindings: 5,
            acceptedFindings: 4
          }
        ];
      }
      
      setPackages(userPackages);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierName = (tier) => {
    const tiers = ['Basic', 'Popular', 'Enterprise'];
    return tiers[tier] || 'Unknown';
  };

  const getPendingCount = (packageName) => {
    const storedFindings = localStorage.getItem('chainaudit_findings');
    if (!storedFindings) return 0;
    
    const findings = JSON.parse(storedFindings);
    return findings.filter(f => f.package === packageName && f.status === 0).length;
  };

  const viewFindings = (packageName) => {
    // Store selected package and navigate to review page
    localStorage.setItem('selected_package', packageName);
    navigate(`/review/${packageName}`);
  };

  if (!connected) {
    return (
      <div className="dashboard">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h2>Connect Your Wallet</h2>
          <p>Please connect your Petra wallet to access the owner dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>📦 My Packages</h2>
          <p className="subtitle">Manage your registered packages and review findings</p>
        </div>
        <Link to="/register" className="btn btn-primary">
          ➕ Register New Package
        </Link>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your packages...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Packages Yet</h3>
          <p>Register your first npm package to start receiving security audits</p>
          <Link to="/register" className="btn btn-primary">
            Register Your First Package
          </Link>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>{packages.length}</h3>
                <p>Total Packages</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>{packages.reduce((sum, pkg) => sum + pkg.bountyPool, 0).toFixed(1)}</h3>
                <p>Total Bounty Pool</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔍</div>
              <div className="stat-content">
                <h3>{packages.reduce((sum, pkg) => sum + pkg.totalFindings, 0)}</h3>
                <p>Total Findings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{Math.round(packages.reduce((sum, pkg) => sum + pkg.credibility, 0) / packages.length)}</h3>
                <p>Avg Credibility</p>
              </div>
            </div>
          </div>

          <div className="package-list">
            {packages.map((pkg, index) => (
              <div key={index} className="package-card">
                <div className="package-header">
                  <div>
                    <h3>{pkg.name}</h3>
                    <span className={`tier-badge tier-${pkg.tier}`}>
                      {getTierName(pkg.tier)}
                    </span>
                  </div>
                  <div className="credibility-badge">
                    ⭐ {pkg.credibility}/100
                  </div>
                </div>

                <div className="package-stats">
                  <div className="stat">
                    <span className="label">💰 Bounty Pool:</span>
                    <span className="value">{pkg.bountyPool.toFixed(1)} APT</span>
                  </div>
                  <div className="stat">
                    <span className="label">🔍 Total Findings:</span>
                    <span className="value">{pkg.totalFindings}</span>
                  </div>
                  <div className="stat">
                    <span className="label">✅ Accepted:</span>
                    <span className="value">{pkg.acceptedFindings}</span>
                  </div>
                  <div className="stat">
                    <span className="label">⏳ Pending:</span>
                    <span className="value">{pkg.totalFindings - pkg.acceptedFindings}</span>
                  </div>
                </div>

                <div className="package-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => viewFindings(pkg.name)}
                  >
                    📋 View Findings ({getPendingCount(pkg.name)})
                  </button>
                  <button className="btn btn-outline">
                    💰 Add Bounty
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default OwnerDashboard;
