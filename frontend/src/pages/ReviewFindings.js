import React, { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AptosClient } from 'aptos';
import { MODULE_ADDRESS } from '../config/constants';
import '../styles/Review.css';

const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';
const client = new AptosClient(NODE_URL);

function ReviewFindings() {
  const { packageName } = useParams();
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const navigate = useNavigate();
  const [findings, setFindings] = useState([]);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [rewardAmount, setRewardAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (connected && account) {
      loadFindings();
    }
  }, [connected, account, packageName]);

  const loadFindings = () => {
    const storedFindings = localStorage.getItem('chainaudit_findings');
    if (!storedFindings) {
      setFindings([]);
      return;
    }

    const allFindings = JSON.parse(storedFindings);
    const pkgFindings = allFindings.filter(f => 
      f.package === (packageName || localStorage.getItem('selected_package'))
    );
    
    setFindings(pkgFindings);
  };

  const getSeverityLabel = (severity) => {
    return ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][severity];
  };

  const getSeverityColor = (severity) => {
    return ['#10b981', '#f59e0b', '#f97316', '#ef4444'][severity];
  };

  const getStatusLabel = (status) => {
    return ['PENDING', 'ACCEPTED', 'REJECTED'][status];
  };

  const getSuggestedReward = (severity) => {
    const rewards = [3, 10, 30, 70]; // LOW, MEDIUM, HIGH, CRITICAL
    return rewards[severity];
  };

  const handleReview = async (finding, accept) => {
    if (!accept) {
      // Reject finding
      if (!window.confirm(`Are you sure you want to REJECT this finding?\n\n"${finding.title}"\n\nThe auditor will not receive any reward.`)) {
        return;
      }
    } else {
      // Accept finding - need reward amount
      if (!rewardAmount || parseFloat(rewardAmount) <= 0) {
        setMessage({ type: 'error', text: '⚠️ Please enter a valid reward amount' });
        return;
      }
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Reviewing finding...', {
        findingId: finding.id,
        accept,
        reward: accept ? parseFloat(rewardAmount) : 0
      });

      // In production, this would call the smart contract
      // For demo, we'll simulate the transaction
      
      // Simulate Petra wallet transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update finding status
      const storedFindings = localStorage.getItem('chainaudit_findings');
      const allFindings = JSON.parse(storedFindings);
      const updatedFindings = allFindings.map(f => {
        if (f.id === finding.id) {
          return {
            ...f,
            status: accept ? 1 : 2, // 1=ACCEPTED, 2=REJECTED
            reward: accept ? parseFloat(rewardAmount) : 0,
            reviewedAt: Date.now()
          };
        }
        return f;
      });
      
      localStorage.setItem('chainaudit_findings', JSON.stringify(updatedFindings));

      setMessage({ 
        type: 'success', 
        text: accept 
          ? `✅ Finding ACCEPTED! ${rewardAmount} APT will be transferred to auditor.`
          : '✅ Finding REJECTED.'
      });

      // Reload findings
      setTimeout(() => {
        loadFindings();
        setSelectedFinding(null);
        setRewardAmount('');
        setMessage({ type: '', text: '' });
      }, 2000);

    } catch (error) {
      console.error('Review error:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Error: ${error.message || 'Review failed'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const pendingFindings = findings.filter(f => f.status === 0);
  const reviewedFindings = findings.filter(f => f.status !== 0);

  if (!connected) {
    return (
      <div className="review-page">
        <div className="empty-state">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your Petra wallet to review findings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="review-header">
        <div>
          <h2>📋 Review Findings</h2>
          <p className="subtitle">
            Package: <strong>{packageName || localStorage.getItem('selected_package')}</strong>
          </p>
        </div>
        <button onClick={() => navigate('/owner')} className="btn btn-secondary">
          ← Back to Dashboard
        </button>
      </div>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Pending Findings */}
      <div className="findings-section">
        <h3>⏳ Pending Review ({pendingFindings.length})</h3>
        
        {pendingFindings.length === 0 ? (
          <div className="empty-state-small">
            <p>No pending findings to review</p>
          </div>
        ) : (
          <div className="findings-list">
            {pendingFindings.map((finding) => (
              <div key={finding.id} className="finding-card-review">
                <div className="finding-header-review">
                  <div>
                    <h4>{finding.title}</h4>
                    <span 
                      className="severity-badge"
                      style={{ background: getSeverityColor(finding.severity) }}
                    >
                      {getSeverityLabel(finding.severity)}
                    </span>
                  </div>
                  <div className="finding-meta">
                    <span>Submitted: {new Date(finding.submittedAt).toLocaleDateString()}</span>
                    <span>Auditor: {finding.auditor.slice(0, 8)}...</span>
                  </div>
                </div>

                <div className="finding-description">
                  <p>{finding.description}</p>
                </div>

                {selectedFinding?.id === finding.id ? (
                  <div className="review-actions-expanded">
                    <div className="reward-input-section">
                      <label>Reward Amount (APT)</label>
                      <div className="reward-input-group">
                        <input
                          type="number"
                          value={rewardAmount}
                          onChange={(e) => setRewardAmount(e.target.value)}
                          placeholder={`Suggested: ${getSuggestedReward(finding.severity)} APT`}
                          min="0"
                          step="1"
                        />
                        <button
                          onClick={() => setRewardAmount(getSuggestedReward(finding.severity).toString())}
                          className="btn-suggest"
                        >
                          Use Suggested
                        </button>
                      </div>
                      <small>
                        Suggested reward for {getSeverityLabel(finding.severity)}: {getSuggestedReward(finding.severity)} APT
                      </small>
                    </div>

                    <div className="review-buttons">
                      <button
                        onClick={() => handleReview(finding, true)}
                        disabled={loading || !rewardAmount}
                        className="btn btn-accept"
                      >
                        {loading ? '⏳ Processing...' : '✅ Accept & Pay Reward'}
                      </button>
                      <button
                        onClick={() => handleReview(finding, false)}
                        disabled={loading}
                        className="btn btn-reject"
                      >
                        ❌ Reject Finding
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFinding(null);
                          setRewardAmount('');
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedFinding(finding);
                      setRewardAmount(getSuggestedReward(finding.severity).toString());
                    }}
                    className="btn btn-primary"
                  >
                    📝 Review This Finding
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed Findings */}
      {reviewedFindings.length > 0 && (
        <div className="findings-section">
          <h3>✅ Reviewed ({reviewedFindings.length})</h3>
          <div className="findings-list">
            {reviewedFindings.map((finding) => (
              <div key={finding.id} className="finding-card-review reviewed">
                <div className="finding-header-review">
                  <div>
                    <h4>{finding.title}</h4>
                    <span 
                      className="severity-badge"
                      style={{ background: getSeverityColor(finding.severity) }}
                    >
                      {getSeverityLabel(finding.severity)}
                    </span>
                    <span className={`status-badge status-${finding.status === 1 ? 'accepted' : 'rejected'}`}>
                      {getStatusLabel(finding.status)}
                    </span>
                  </div>
                  {finding.status === 1 && (
                    <div className="reward-display">
                      💰 {finding.reward} APT
                    </div>
                  )}
                </div>
                <div className="finding-description">
                  <p>{finding.description}</p>
                </div>
                <div className="review-info">
                  <small>Reviewed: {new Date(finding.reviewedAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewFindings;
