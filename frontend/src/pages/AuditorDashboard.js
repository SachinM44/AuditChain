import React, { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function AuditorDashboard() {
  const { account, connected } = useWallet();
  const [findings, setFindings] = useState([]);
  const [stats, setStats] = useState({ totalEarned: 0, pending: 0, accepted: 0 });

  useEffect(() => {
    if (connected && account) {
      loadFindings();
    }
  }, [connected, account]);

  const loadFindings = async () => {
    // Load findings from localStorage
    const storedFindings = localStorage.getItem('chainaudit_findings');
    if (storedFindings) {
      const allFindings = JSON.parse(storedFindings);
      // Filter by current user
      const userFindings = allFindings.filter(f => f.auditor === account.address);
      
      // Map to display format
      const displayFindings = userFindings.map(f => ({
        id: f.id,
        package: f.package,
        title: f.title,
        severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][f.severity],
        status: ['PENDING', 'ACCEPTED', 'REJECTED'][f.status],
        reward: f.reward
      }));
      
      setFindings(displayFindings);
      
      // Calculate stats
      const accepted = displayFindings.filter(f => f.status === 'ACCEPTED');
      const pending = displayFindings.filter(f => f.status === 'PENDING');
      const totalEarned = accepted.reduce((sum, f) => sum + f.reward, 0);
      
      setStats({ 
        totalEarned, 
        pending: pending.length, 
        accepted: accepted.length 
      });
    }
  };

  if (!connected) {
    return (
      <div className="dashboard">
        <h2>Auditor Dashboard</h2>
        <p>Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>My Findings</h2>
        <Link to="/submit" className="btn btn-primary">Submit New Finding</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalEarned} APT</h3>
          <p>Total Earned</p>
        </div>
        <div className="stat-card">
          <h3>{stats.accepted}</h3>
          <p>Accepted Findings</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending Review</p>
        </div>
      </div>

      <div className="findings-list">
        {findings.map((finding) => (
          <div key={finding.id} className="finding-card">
            <div className="finding-header">
              <h3>{finding.title}</h3>
              <span className={`badge badge-${finding.severity.toLowerCase()}`}>
                {finding.severity}
              </span>
            </div>
            <p>Package: {finding.package}</p>
            <div className="finding-footer">
              <span className={`status status-${finding.status.toLowerCase()}`}>
                {finding.status}
              </span>
              {finding.reward && <span className="reward">{finding.reward} APT</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditorDashboard;
