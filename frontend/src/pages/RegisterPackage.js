import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { REGISTRATION_FEES } from '../config/constants';
import '../styles/Form.css';

function RegisterPackage() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    npmName: '',
    tier: '0',
    bountyAmount: '20'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const getTierInfo = (tier) => {
    const tiers = {
      '0': { name: 'Basic', fee: 10, desc: '<100k downloads/month' },
      '1': { name: 'Popular', fee: 25, desc: '100k-1M downloads/month' },
      '2': { name: 'Enterprise', fee: 50, desc: '>1M downloads/month' }
    };
    return tiers[tier];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected || !account) {
      setMessage({ type: 'error', text: '⚠️ Please connect your Petra wallet first!' });
      return;
    }

    if (!formData.npmName.trim()) {
      setMessage({ type: 'error', text: '⚠️ Please enter a package name' });
      return;
    }

    const bountyNum = parseFloat(formData.bountyAmount);
    if (bountyNum < 20) {
      setMessage({ type: 'error', text: '⚠️ Minimum bounty is 20 APT' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // DEMO MODE: Simulate successful registration
      // In production, this would submit a real transaction
      
      console.log('Demo: Package registration', {
        npmName: formData.npmName,
        tier: formData.tier,
        bountyAmount: formData.bountyAmount,
        owner: account.address
      });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage (demo mode)
      const newPackage = {
        name: formData.npmName,
        owner: account.address,
        tier: parseInt(formData.tier),
        bountyPool: parseFloat(formData.bountyAmount),
        credibility: 50,
        totalFindings: 0,
        acceptedFindings: 0,
        registeredAt: Date.now()
      };
      
      const storedPackages = localStorage.getItem('chainaudit_packages');
      const packages = storedPackages ? JSON.parse(storedPackages) : [];
      packages.push(newPackage);
      localStorage.setItem('chainaudit_packages', JSON.stringify(packages));
      
      setMessage({ 
        type: 'success', 
        text: `✅ Package "${formData.npmName}" registered successfully! (Demo Mode)` 
      });
      
      // Reset form
      setFormData({ npmName: '', tier: '0', bountyAmount: '20' });
      
      // Redirect to owner dashboard after 2 seconds
      setTimeout(() => {
        navigate('/owner');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Error: ${error.message || 'Transaction failed'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const currentTier = getTierInfo(formData.tier);
  const totalCost = currentTier.fee + parseFloat(formData.bountyAmount);

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>📦 Register Your Package</h2>
        <p>List your npm package for security auditing and earn credibility</p>
      </div>

      {!connected && (
        <div className="warning-box">
          <p>⚠️ Please connect your Petra wallet to continue</p>
        </div>
      )}

      <div className="info-box" style={{ marginBottom: '2rem' }}>
        <h4>🎯 Demo Mode Active</h4>
        <p>This is a demonstration. In production, this would submit a real blockchain transaction to register your package.</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>npm Package Name *</label>
          <input
            type="text"
            value={formData.npmName}
            onChange={(e) => setFormData({...formData, npmName: e.target.value})}
            placeholder="e.g., express, lodash, axios"
            required
            disabled={loading}
          />
          <small>Enter the exact name from npmjs.com</small>
        </div>

        <div className="form-group">
          <label>Package Tier *</label>
          <select
            value={formData.tier}
            onChange={(e) => setFormData({...formData, tier: e.target.value})}
            disabled={loading}
          >
            <option value="0">Basic (10 APT) - &lt;100k downloads</option>
            <option value="1">Popular (25 APT) - 100k-1M downloads</option>
            <option value="2">Enterprise (50 APT) - &gt;1M downloads</option>
          </select>
          <small>{currentTier.desc}</small>
        </div>

        <div className="form-group">
          <label>Initial Bounty Pool (APT) *</label>
          <input
            type="number"
            value={formData.bountyAmount}
            onChange={(e) => setFormData({...formData, bountyAmount: e.target.value})}
            min="20"
            step="1"
            required
            disabled={loading}
          />
          <small>Minimum 20 APT - This incentivizes auditors to review your package</small>
        </div>

        <div className="cost-summary">
          <h3>Cost Summary</h3>
          <div className="cost-row">
            <span>Registration Fee ({currentTier.name}):</span>
            <strong>{currentTier.fee} APT</strong>
          </div>
          <div className="cost-row">
            <span>Initial Bounty Pool:</span>
            <strong>{formData.bountyAmount} APT</strong>
          </div>
          <div className="cost-row total">
            <span>Total Cost:</span>
            <strong>{totalCost} APT</strong>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !connected} 
          className="btn btn-primary btn-large"
        >
          {loading ? '⏳ Registering...' : '🚀 Register Package (Demo)'}
        </button>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}
      </form>

      <div className="info-box">
        <h4>💡 What happens next?</h4>
        <ul>
          <li>Your package will be listed in the auditor dashboard</li>
          <li>Security experts will analyze your code</li>
          <li>You'll review and approve/reject findings</li>
          <li>Valid findings earn auditors APT from your bounty pool</li>
          <li>Your package earns credibility score</li>
        </ul>
      </div>
    </div>
  );
}

export default RegisterPackage;
