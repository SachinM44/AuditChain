import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import Header from './components/Header';
import Home from './pages/Home';
import OwnerDashboard from './pages/OwnerDashboard';
import AuditorDashboard from './pages/AuditorDashboard';
import PackageExplorer from './pages/PackageExplorer';
import RegisterPackage from './pages/RegisterPackage';
import SubmitFinding from './pages/SubmitFinding';
import './styles/App.css';

const wallets = [new PetraWallet()];

function App() {
  return (
    <AptosWalletAdapterProvider 
      plugins={wallets} 
      autoConnect={true}
      onError={(error) => {
        console.log('Wallet error:', error);
      }}
    >
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/auditor" element={<AuditorDashboard />} />
              <Route path="/packages" element={<PackageExplorer />} />
              <Route path="/register" element={<RegisterPackage />} />
              <Route path="/submit" element={<SubmitFinding />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AptosWalletAdapterProvider>
  );
}

export default App;
