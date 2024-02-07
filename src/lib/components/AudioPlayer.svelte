<script lang="ts">
  export let audioUrl: string;

  let audioPlayer: HTMLAudioElement;

  $: audioUrl && audioPlayer && stopAudio();

  function stopAudio() {
    audioPlayer.pause();
    audioPlayer.load();
    audioPlayer.play();
  }
</script>

<audio bind:this={audioPlayer} controls preload="metadata">
  <source src={audioUrl} />
</audio>
