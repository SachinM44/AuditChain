import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import '../styles/Header.css';

function Header() {
  const { connect, disconnect, account, connected, wallet } = useWallet();

  const handleWalletAction = async () => {
    try {
      if (connected) {
        await disconnect();
      } else {
        await connect('Petra');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Please install Petra Wallet extension first!');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>⛓️ ChainAudit</h1>
          <span className="tagline">Web3 Security Standard</span>
        </Link>
        
        <nav className="nav">
          <Link to="/packages" className="nav-link">
            <span className="icon">📦</span>
            Packages
          </Link>
          <Link to="/owner" className="nav-link">
            <span className="icon">👨‍💼</span>
            Owner
          </Link>
          <Link to="/auditor" className="nav-link">
            <span className="icon">🔍</span>
            Auditor
          </Link>
        </nav>

        <div className="wallet-section">
          {connected && account && (
            <div className="wallet-info">
              <span className="wallet-balance">Connected</span>
            </div>
          )}
          <button onClick={handleWalletAction} className="wallet-btn">
            {connected && account
              ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
              : '🔗 Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
