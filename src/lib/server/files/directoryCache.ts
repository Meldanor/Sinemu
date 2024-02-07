import { createCache, memoryStore } from 'cache-manager';

// @ts-expect-error TS reports the export is existing, but it is there!
import { fileTypeFromFile } from 'file-type';

import { XXH64 } from 'xxh3-ts';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { ALLOWED_MIME_TYPES } from '$env/static/private';
import type { DirectoryContent, DirectoryFile } from '$lib/interfaces/directoryFiles';

const allowedMimesSet = new Set(ALLOWED_MIME_TYPES.split(','));

const cache = createCache(memoryStore(), {
  ttl: 24 * 60 * 60 * 1000
});

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
  let dirFiles: DirectoryFile[] = await Promise.all(
    files
      .filter((filer) => filer.isDirectory() || filer.isFile())
      .map(async (file) => {
        let path = join(file.path, file.name);
        const type = file.isFile() ? 'file' : 'directory';
        let mime;
        if (type === 'file') {
          mime = await fileTypeFromFile(path);
          if (mime) {
            mime = mime.mime;
          }
        }
        path = path.split('/').slice(1).join('/');
        return { path, type, mime };
      })
  );
  // Filter out files that are not allowed, like non audio files
  dirFiles = dirFiles.filter((val) => {
    return val.type === 'directory' || (val.mime && allowedMimesSet.has(val.mime));
  });

  dirFiles.sort((a, b) => a.path.localeCompare(b.path));

  const hash = XXH64(Buffer.from(dirFiles.map((val) => val.path).join())).toString(16);

  return {
    files: dirFiles,
    hash: hash
  };
}

export { getDirectoryContent };
