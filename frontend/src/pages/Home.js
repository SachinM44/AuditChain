import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Secure the npm Ecosystem, Earn APT</h1>
        <p>Human-driven bounty hunting platform for npm package security</p>
        <div className="cta-buttons">
          <Link to="/owner" className="btn btn-primary">Register Package</Link>
          <Link to="/auditor" className="btn btn-secondary">Start Auditing</Link>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h3>50+</h3>
          <p>Registered Packages</p>
        </div>
        <div className="stat-card">
          <h3>100+</h3>
          <p>Active Auditors</p>
        </div>
        <div className="stat-card">
          <h3>10,000+</h3>
          <p>APT Distributed</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Package Owners Register</h3>
            <p>Pay APT to list your npm package for security auditing</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Auditors Find Bugs</h3>
            <p>Security experts manually discover vulnerabilities</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Owners Review & Reward</h3>
            <p>Accept valid findings and distribute APT rewards</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Developers Check Security</h3>
            <p>View verified security scores before installing</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
