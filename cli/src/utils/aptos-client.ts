import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { NODE_URL, API_KEY } from './config';

let client: Aptos | null = null;

export function getAptosClient(): Aptos {
  if (!client) {
    const config = new AptosConfig({ 
      network: Network.TESTNET,
      fullnode: NODE_URL,
      clientConfig: {
        HEADERS: {
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    });
    client = new Aptos(config);
  }
  return client;
}
