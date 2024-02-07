<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

Path: {data.path}

<h2>Directories</h2>
<ul>
  {#if data.path !== ''}
    <li><a href={data.parent}>..</a></li>
  {/if}
  {#each data.directories as directory}
    <li><a href={directory.path}>{directory.path}</a></li>
  {/each}
</ul>
<h2>Files</h2>
<ul>
  {#each data.files as file}
    <li>{file.path} - {file.mime}</li>
  {/each}
</ul>
