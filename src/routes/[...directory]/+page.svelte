<script lang="ts">
  import AudioPlayer from '$lib/components/AudioPlayer.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let url: string;
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
    <li>
      {file.path} - {file.mime} -
      <button on:click={() => (url = `/api/files/${file.path}`)}>Play</button>
    </li>
  {/each}
</ul>

{#if url}
  <AudioPlayer audioUrl={url}></AudioPlayer>
{/if}
