import { join, basename } from 'path';
import { MUSIC_DIR } from '$env/static/private';
import type { RequestHandler } from './$types';
import { existsSync } from 'fs';
import { error } from '@sveltejs/kit';
import { getFileHash } from '$lib/server/files/etagCache';
import { readFile } from 'fs/promises';

export const GET: RequestHandler = async ({ params, request }) => {
  const filePath = join(MUSIC_DIR, params.file);
  if (!existsSync(filePath)) {
    return error(404);
  }

  const hashedFile = await getFileHash(filePath);
  const requestEtag = request.headers.get('if-match');
  if (requestEtag && hashedFile.hash === requestEtag) {
    return new Response(null, { status: 304 });
  }

  const fileName = basename(filePath);
  const fileContent = hashedFile.content || (await readFile(filePath));
  return new Response(fileContent, {
    status: 200,
    headers: {
      ETag: hashedFile.hash,
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
    }
  });
};
