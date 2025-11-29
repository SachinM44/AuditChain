import React from 'react';
import './PackageCard.css';

function PackageCard({ audit }) {
  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getRiskClass = (category) => {
    return category ? category.toLowerCase() : 'low';
  };

  return (
    <div className="package-card">
      <div className="package-header">
        <div className="package-info">
          <div className="package-name">{audit.name}</div>
          <div className="package-version">v{audit.version}</div>
        </div>
        <div className={`risk-badge ${getRiskClass(audit.category)}`}>
          <span className="risk-badge-dot"></span>
          {audit.category}
        </div>
      </div>

      <div className="package-details">
        <div className="detail-item">
          <span className="detail-label">Risk Score</span>
          <span className={`detail-value ${getRiskClass(audit.category)}`}>
            {audit.riskScore}/100
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Auditors</span>
          <span className="detail-value">1</span>
        </div>
      </div>

      <div className="package-meta">
        <div className="meta-item">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{formatTime(audit.timestamp)}</span>
        </div>
        
        <div className="meta-item">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <span>Verified on Aptos</span>
        </div>
      </div>
    </div>
  );
}

export default PackageCard;
