<script lang="ts">
  import { Howl } from 'howler';
  import AudioPlayerProgress from './AudioPlayerProgress.svelte';
  import { onMount } from 'svelte';

  export let audioUrl: string;

  let audio: Howl;

  $: audioUrl && switchTrack(audioUrl);

  let playing = false;
  let trackLength: number;
  let currentPos: number;

  function switchTrack(url: string) {
    playing = false;
    if (audio) {
      audio.stop();
    }

    audio = new Howl({
      src: url,
      onload: () => {
        trackLength = audio.duration();
        currentPos = 0;
        playing = true;
        audio.play();
      }
    });
  }

  function pauseOrResume() {
    if (playing) {
      pause();
    } else {
      resume();
    }
    playing = !playing;
  }

  function pause() {
    audio.pause();
  }

  function resume() {
    audio.play();
  }

  function updateCurrentPosition() {
    requestAnimationFrame(() => {
      if (audio) {
        currentPos = audio.seek();
      }
      updateCurrentPosition();
    });
  }

  onMount(() => {
    updateCurrentPosition();
  });
</script>

<div class="flex flex-col gap-8">
  <div class="flex gap-3">
    <button disabled={!audio} on:click={pauseOrResume}>
      {#if playing}
        ⏸
      {:else}
        ▶
      {/if}
    </button>
    <!-- <button disabled={!audio} on:click={pauseOrResume}> ▶ ⏸</button> -->
  </div>
  {#if audio}
    <AudioPlayerProgress {trackLength} {currentPos}></AudioPlayerProgress>
  {/if}
</div>
