import { createCache, memoryStore } from 'cache-manager';

import { XXH64 } from 'xxh3-ts';
import { readdir } from 'fs/promises';

const cache = createCache(memoryStore(), {
  ttl: 24 * 60 * 60 * 1000
});

interface DirectoryContent {
  files: DirectoryFile[];
  hash: string;
}

interface DirectoryFile {
  path: string;
  type: 'file' | 'directory';
}

async function getDirectoryContent(dirPath: string): Promise<DirectoryContent> {
  let directoryContent = (await cache.get(dirPath)) as DirectoryContent;
  if (directoryContent) {
    return directoryContent;
  }

  directoryContent = await buildDirectoryContent(dirPath);

  await cache.set(dirPath, directoryContent);
  return directoryContent;
}

async function buildDirectoryContent(dirPath: string): Promise<DirectoryContent> {
  const files = await readdir(dirPath, { withFileTypes: true });
  const dirFiles: DirectoryFile[] = files
    .filter((filer) => filer.isDirectory() || filer.isFile())
    .map((file) => {
      return { path: file.name, type: file.isFile() ? 'file' : 'directory' };
    });
  // TODO: Find out mime type and filter only for music files

  dirFiles.sort((a, b) => a.path.localeCompare(b.path));

  const hash = XXH64(Buffer.from(dirFiles.map((val) => val.path).join())).toString(16);

  return {
    files: dirFiles,
    hash: hash
  };
}

export { getDirectoryContent };
