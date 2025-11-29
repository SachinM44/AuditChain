export interface Finding {
  type: 'obfuscation' | 'network' | 'crypto_mining' | 'tampering';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  file: string;
  line: number;
}

export interface AnalysisResult {
  risk_score: number;
  engine_confidence: number;
  findings: Finding[];
}

export class AIEngineClient {
  private engineUrl: string;

  constructor(engineUrl: string) {
    this.engineUrl = engineUrl;
  }

  async analyzePackage(
    packageName: string,
    version: string,
    tarballPath: string
  ): Promise<AnalysisResult> {
    // TODO: Replace with actual AI engine API call when Shubasis delivers
    // For now, return mock data
    return this.mockAnalysis(packageName, version);
  }

  private mockAnalysis(packageName: string, version: string): AnalysisResult {
    // Generate deterministic but varied risk scores based on package name
    const hash = this.simpleHash(packageName + version);
    const riskScore = hash % 100;

    // Determine findings based on risk score
    const findings: Finding[] = [];

    if (riskScore > 70) {
      findings.push({
        type: 'obfuscation',
        severity: 'HIGH',
        description: 'Heavily obfuscated code detected',
        file: 'index.js',
        line: 42,
      });
      findings.push({
        type: 'network',
        severity: 'MEDIUM',
        description: 'Suspicious network call to unknown domain',
        file: 'lib/network.js',
        line: 15,
      });
    } else if (riskScore > 40) {
      findings.push({
        type: 'network',
        severity: 'LOW',
        description: 'HTTP request to external API',
        file: 'utils.js',
        line: 23,
      });
    }

    return {
      risk_score: riskScore,
      engine_confidence: 0.85 + (Math.random() * 0.1), // 0.85-0.95
      findings,
    };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
