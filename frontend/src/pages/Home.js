import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import { getStats, getAllAudits } from '../utils/aptos';
import './Home.css';
import '../styles/loading.css';

function Home() {
  const [stats, setStats] = useState({
    totalAudits: 0,
    activeAuditors: 0,
    packagesScanned: 0
  });

  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, auditsData] = await Promise.all([
          getStats(),
          getAllAudits()
        ]);
        
        setStats(statsData);
        setRecentAudits(auditsData.slice(0, 4)); // Show only 4 most recent
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span>Live on Aptos Testnet</span>
        </div>
        
        <h1 className="hero-title">
          Secure Your Dependencies
        </h1>
        
        <p className="hero-subtitle">
          Decentralized security auditing for npm packages. 
          Powered by blockchain, protected by consensus.
        </p>
        
        <div className="hero-cta">
          <Link to="/search" className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            Search Packages
          </Link>
          
          <a 
            href="https://github.com/sachinm/chainaudit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            View on GitHub
          </a>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.totalAudits}</div>
          <div className="stat-label">Total Audits</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.activeAuditors}</div>
          <div className="stat-label">Active Auditors</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.packagesScanned}</div>
          <div className="stat-label">Packages Scanned</div>
        </div>
      </section>

      <section className="recent-audits">
        <div className="section-header">
          <h2 className="section-title">Recent Audits</h2>
          <Link to="/search" className="section-link">
            View all →
          </Link>
        </div>
        
        {loading ? (
          <div className="loading">Loading audits from blockchain...</div>
        ) : recentAudits.length > 0 ? (
          <div className="audit-grid">
            {recentAudits.map((audit, index) => (
              <PackageCard key={index} audit={audit} />
            ))}
          </div>
        ) : (
          <div className="no-audits">No audits found yet</div>
        )}
      </section>
    </div>
  );
}

export default Home;
