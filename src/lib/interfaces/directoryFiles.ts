interface DirectoryContent {
  files: DirectoryFile[];
  hash: string;
}

interface DirectoryFile {
  path: string;
  type: 'file' | 'directory';
  mime?: string;
}

export type { DirectoryContent, DirectoryFile };
