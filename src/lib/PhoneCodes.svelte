<script lang="ts">
  import { PhoneModes } from './enums'
  
  let phoneMode: PhoneModes = $state(PhoneModes.MENU)
  let isPlaying: Boolean = $state(false)

  const getModeString = (): string => {
    switch (phoneMode) {
      case PhoneModes.ALL:
        return "All"
      case PhoneModes.WORLD:
        return "World"
      case PhoneModes.USA:
        return "USA"
      default:
        return "Menu"
    }
  }

  const changeMode = (mode: PhoneModes) => {
    phoneMode = mode;
    isPlaying = !isPlaying;
  }

  
</script>

<h2>Phone Codes</h2>

{#if !isPlaying}
<table class="mx-auto w-full max-w-xl table-fixed border-separate border-spacing-x-16">
  <thead>
    <tr>
    <th class="text-center">
      <button 
        class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        onclick={() => changeMode(PhoneModes.ALL)}>
        All
      </button>
    </th>
    <th class="text-center">
      <button 
        class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        onclick={() => changeMode(PhoneModes.WORLD)}>
        World
      </button>
    </th>
    <th class="text-center">
      <button 
        class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        onclick={() => changeMode(PhoneModes.USA)}>
        USA
      </button>
    </th>
    </tr>
  </thead>
</table>
{/if}


{#if isPlaying}
<section id="training-phone">
<p>You selected "{getModeString()}" Mode</p>
</section>


<button 
  class="border-2 border-amber-500 hover:bg-amber-500 text-white px-4 py-2 rounded-xl mx-auto block mt-4"
  onclick={() => changeMode(PhoneModes.MENU)}>
  Reselect Mode
</button>
{/if}