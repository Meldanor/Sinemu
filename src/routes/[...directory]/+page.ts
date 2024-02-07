import type { DirectoryFile } from '$lib/interfaces/directoryFiles';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  let path = params.directory;
  if (params.directory && params.directory !== '') {
    path = '/' + path;
  }
  const uri = encodeURI('/api/directories' + path);
  const resp = await fetch(uri);
  const data = (await resp.json()) as { files: DirectoryFile[] };

  return {
    directories: data.files.filter((val) => val.type === 'directory'),
    files: data.files.filter((val) => val.type === 'file'),
    path: path,
    parent: path.substring(0, path.lastIndexOf('/')) || '/'
  };
};
