<script lang="ts">
  export let trackLength: number;
  export let currentPos: number;

  $: trackLength && currentPos && updateWidth();

  let progressBarWidth: number;

  function updateWidth() {
    progressBarWidth = (currentPos / trackLength) * 100.0;
  }
</script>

<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
  <div class="bg-blue-600 h-2.5 rounded-full" style={`width: ${progressBarWidth}%`}></div>
</div>
