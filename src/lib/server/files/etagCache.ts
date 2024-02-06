import { createCache, memoryStore } from 'cache-manager';

import { XXH64 } from 'xxh3-ts';
import { readFile } from 'fs/promises';

const cache = createCache(memoryStore(), {
  ttl: 24 * 60 * 60 * 1000
});

interface HashedFile {
  hash: string;
  // Avoids reading the file twice in the same request
  content?: Buffer;
}

async function getFileHash(filePath: string): Promise<HashedFile> {
  let hash = (await cache.get(filePath)) as string;
  if (hash) {
    return { hash };
  }

  const fileBuffer = await readFile(filePath);
  hash = XXH64(fileBuffer).toString(16);
  await cache.set(filePath, hash);
  return { hash, content: fileBuffer };
}

export { getFileHash };
