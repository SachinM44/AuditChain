import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface ChainAuditConfig {
  riskThreshold: number;
  policy: 'allow' | 'warn' | 'block';
  registryAddress: string;
  network: 'testnet' | 'mainnet';
}

const DEFAULT_CONFIG: ChainAuditConfig = {
  riskThreshold: 70,
  policy: 'warn',
  registryAddress: '',
  network: 'testnet',
};

const CONFIG_DIR = path.join(os.homedir(), '.chainaudit');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export function loadConfig(): ChainAuditConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return DEFAULT_CONFIG;
    }
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch (error) {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: Partial<ChainAuditConfig>): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    const currentConfig = loadConfig();
    const newConfig = { ...currentConfig, ...config };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
