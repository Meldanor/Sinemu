import { join } from 'path';
import { MUSIC_DIR } from '$env/static/private';
import type { RequestHandler } from './$types';
import { existsSync } from 'fs';
import { error, json } from '@sveltejs/kit';
import { getDirectoryContent } from '$lib/server/files/directoryCache';

export const GET: RequestHandler = async ({ params, request }) => {
  const filePath = join(MUSIC_DIR, params.directory);
  if (!existsSync(filePath)) {
    return error(404);
  }

  const directoryContent = await getDirectoryContent(filePath);
  const requestEtag = request.headers.get('if-match');
  if (requestEtag && directoryContent.hash === requestEtag) {
    return new Response(null, { status: 304 });
  }

  return json(directoryContent, {
    headers: {
      ETag: directoryContent.hash
    }
  });
};
