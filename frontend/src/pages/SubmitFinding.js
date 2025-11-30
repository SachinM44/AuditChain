import React, { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';

function SubmitFinding() {
  const { account, connected } = useWallet();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    packageName: '',
    severity: '2',
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load available packages
    const storedPackages = localStorage.getItem('chainaudit_packages');
    if (storedPackages) {
      const allPackages = JSON.parse(storedPackages);
      setPackages(allPackages);
      // Auto-select first package if available
      if (allPackages.length > 0 && !formData.packageName) {
        setFormData(prev => ({ ...prev, packageName: allPackages[0].name }));
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected || !account) {
      setMessage({ type: 'error', text: '⚠️ Please connect your Petra wallet first!' });
      return;
    }

    if (!formData.packageName) {
      setMessage({ type: 'error', text: '⚠️ Please select a package' });
      return;
    }

    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: '⚠️ Please enter a title' });
      return;
    }

    if (!formData.description.trim()) {
      setMessage({ type: 'error', text: '⚠️ Please enter a description' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Submitting finding...', formData);

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage (demo mode)
      const newFinding = {
        id: Date.now(),
        package: formData.packageName,
        auditor: account.address,
        severity: parseInt(formData.severity),
        title: formData.title,
        description: formData.description,
        status: 0, // PENDING
        reward: 0,
        submittedAt: Date.now()
      };
      
      const storedFindings = localStorage.getItem('chainaudit_findings');
      const findings = storedFindings ? JSON.parse(storedFindings) : [];
      findings.push(newFinding);
      localStorage.setItem('chainaudit_findings', JSON.stringify(findings));
      
      setMessage({ 
        type: 'success', 
        text: `✅ Finding submitted successfully! (Demo Mode)` 
      });
      
      // Reset form
      setFormData({ 
        packageName: packages.length > 0 ? packages[0].name : '', 
        severity: '2', 
        title: '', 
        description: '' 
      });
      
      // Redirect to auditor dashboard after 2 seconds
      setTimeout(() => {
        navigate('/auditor');
      }, 2000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Error: ${error.message || 'Submission failed'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityLabel = (severity) => {
    const labels = {
      '0': 'LOW (1-5 APT)',
      '1': 'MEDIUM (5-20 APT)',
      '2': 'HIGH (20-50 APT)',
      '3': 'CRITICAL (50-100 APT)'
    };
    return labels[severity];
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>🔍 Submit Security Finding</h2>
        <p>Report vulnerabilities and earn APT rewards</p>
      </div>

      {!connected && (
        <div className="warning-box">
          <p>⚠️ Please connect your Petra wallet to continue</p>
        </div>
      )}

      {packages.length === 0 && (
        <div className="info-box" style={{ marginBottom: '2rem', background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
          <h4>⚠️ No Packages Available</h4>
          <p>There are no registered packages yet. Package owners need to register packages first before auditors can submit findings.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Package Name *</label>
          <select
            value={formData.packageName}
            onChange={(e) => setFormData({...formData, packageName: e.target.value})}
            required
            disabled={loading || packages.length === 0}
          >
            {packages.length === 0 ? (
              <option value="">No packages available</option>
            ) : (
              <>
                <option value="">Select a package...</option>
                {packages.map((pkg, index) => (
                  <option key={index} value={pkg.name}>
                    {pkg.name} (Bounty: {pkg.bountyPool} APT)
                  </option>
                ))}
              </>
            )}
          </select>
          <small>Select from registered packages available for auditing</small>
        </div>

        <div className="form-group">
          <label>Severity *</label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData({...formData, severity: e.target.value})}
            disabled={loading}
          >
            <option value="0">LOW (1-5 APT)</option>
            <option value="1">MEDIUM (5-20 APT)</option>
            <option value="2">HIGH (20-50 APT)</option>
            <option value="3">CRITICAL (50-100 APT)</option>
          </select>
          <small>Higher severity = Higher potential reward</small>
        </div>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g., SQL Injection in query builder"
            required
            disabled={loading}
          />
          <small>Clear, concise vulnerability name</small>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Detailed explanation with proof of concept, affected files, and suggested fix..."
            rows="10"
            required
            disabled={loading}
          />
          <small>Include: vulnerability details, proof of concept, affected files, impact, and suggested fix</small>
        </div>

        <button 
          type="submit" 
          disabled={loading || !connected || packages.length === 0} 
          className="btn btn-primary btn-large"
        >
          {loading ? '⏳ Submitting...' : '🚀 Submit Finding (Demo)'}
        </button>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}
      </form>

      <div className="info-box">
        <h4>💡 Tips for Successful Submissions</h4>
        <ul>
          <li>Provide clear proof of concept code</li>
          <li>Include specific file paths and line numbers</li>
          <li>Explain the security impact</li>
          <li>Suggest a fix or mitigation</li>
          <li>Be professional and detailed</li>
        </ul>
      </div>
    </div>
  );
}

export default SubmitFinding;
