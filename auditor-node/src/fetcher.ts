import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class PackageFetcher {
  private cacheDir: string;

  constructor() {
    this.cacheDir = path.join(os.tmpdir(), 'chainaudit-cache');
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  async fetchPackage(packageName: string, version: string): Promise<string> {
    // Get package metadata from npm registry
    const registryUrl = `https://registry.npmjs.org/${packageName}/${version}`;
    
    const response = await fetch(registryUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch package metadata: ${response.statusText}`);
    }

    const metadata = await response.json() as any;
    const tarballUrl = metadata.dist?.tarball;

    if (!tarballUrl) {
      throw new Error('No tarball URL found in package metadata');
    }

    // Download tarball
    const tarballResponse = await fetch(tarballUrl);
    if (!tarballResponse.ok) {
      throw new Error(`Failed to download tarball: ${tarballResponse.statusText}`);
    }

    // Save to cache
    const filename = `${packageName.replace('/', '-')}-${version}.tgz`;
    const filepath = path.join(this.cacheDir, filename);

    const buffer = await tarballResponse.buffer();
    fs.writeFileSync(filepath, buffer);

    return filepath;
  }

  getCacheDir(): string {
    return this.cacheDir;
  }

  clearCache() {
    if (fs.existsSync(this.cacheDir)) {
      fs.rmSync(this.cacheDir, { recursive: true, force: true });
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }
}
