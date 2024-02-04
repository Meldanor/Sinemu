import fs from 'fs/promises';
import { join, basename } from 'path';
import { MUSIC_DIR } from '$env/static/private';
import type { RequestHandler } from './$types';
import { existsSync } from 'fs';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  const filePath = join(MUSIC_DIR, params.file);

  if (!existsSync(filePath)) {
    return error(404);
  }

  const fileName = basename(filePath);
  const buffer = await fs.readFile(filePath);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
    }
  });
};
