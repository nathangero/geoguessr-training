<script lang="ts">
  import PhoneCodes from './lib/PhoneCodes.svelte'
  import CountryFlags from './lib/CountryFlags.svelte'
  import { Training } from './lib/enums'
  
  let training: Training = $state(Training.MENU)

</script>

<section id="">
  <h1>Geoguessr Training Room</h1>

  <table class="mx-auto w-full max-w-xl table-fixed border-separate border-spacing-x-16" class:hidden={training !== Training.MENU}>
    <thead>
      <tr>
        <th class="text-center">
          <button 
            class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
            onclick={() => training = Training.PHONE}>
            Phone Codes
          </button>
        </th>
        <th class="text-center">
          <button 
            class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
            onclick={() => training = Training.FLAGS}>
            Country Flags
          </button>
        </th>
      </tr>
    </thead>
  </table>
</section>

{#if training === Training.PHONE} 
<PhoneCodes />
<button 
  class="border-2 border-red-500 hover:bg-red-500 text-white px-4 py-2 rounded-xl mx-auto block mt-4"
  onclick={() => training = Training.MENU}>
  Exit Game
</button>
{:else if training === Training.FLAGS} 
<CountryFlags />
<button 
  class="border-2 border-red-500 hover:bg-red-500 text-white px-4 py-2 rounded-xl mx-auto block mt-4"
  onclick={() => training = Training.MENU}>
  Exit Game
</button>
{/if}
