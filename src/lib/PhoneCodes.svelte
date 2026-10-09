<script lang="ts">
  import { countryCodes, nanpCodes, usaCodes, type PhoneNumberCode } from './area-codes';
  import { PhoneModes } from './enums'
  
  let phoneMode: PhoneModes = $state(PhoneModes.MENU);
  let isPlaying: Boolean = $state(false);
  let codes: PhoneNumberCode[] = $state([]);

  const getModeString = (): string => {
    switch (phoneMode) {
      case PhoneModes.ALL:
        return "All";
      case PhoneModes.WORLD:
        return "World";
      case PhoneModes.NANP:
        return "NANP";
      case PhoneModes.USA:
        return "USA";
      default:
        return "Menu";
    }
  }

  const loadAll = () => {
    codes = [...countryCodes, ...nanpCodes];
  }

  const loadWorld = () => {
    codes = countryCodes;
  }

  const loadNanp = () => {
    codes = nanpCodes;
  }

  const loadUsa = () => {
    codes = usaCodes;
  }

  const changeMode = (mode: PhoneModes) => {
    phoneMode = mode;
    isPlaying = !isPlaying;
    if (!isPlaying) return;

    switch (phoneMode) {
      case PhoneModes.ALL:
        loadAll();
        break;
      case PhoneModes.WORLD:
        loadWorld();
        break;
      case PhoneModes.NANP:
        loadNanp();
        break;
      case PhoneModes.USA:
        loadUsa(); "USA"
        break;
      default:
        codes = []; // Clear the array
    }
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
        onclick={() => changeMode(PhoneModes.NANP)}>
        NANP
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
<button 
  class="border-2 border-amber-500 hover:bg-amber-500 text-white px-4 py-2 rounded-xl mx-auto block my-4"
  onclick={() => changeMode(PhoneModes.MENU)}>
  Reselect Mode
</button>

<section id="training-phone">
  <p>You selected "{getModeString()}" Mode</p>
  <p>You'll be tested on the following: </p>
  <br />
    
    <table class="mx-auto  border-separate border-spacing-x-16">
      <thead>
        <tr>
          <th>Code</th>
          <th>Location</th>
        </tr>
        {#each codes as code}
          <tr>
            {#if code.country === "NANP"}
              {#if phoneMode === PhoneModes.ALL}
                <th class="text-center">{code.countryCode} {code.areaCode}</th>
              {:else}
                <th class="text-center">{code.areaCode}</th>
              {/if}
              <th class="text-left">{code.locations.join(", ")}</th> 
            {:else}
              <th class="text-center">{code.countryCode}</th>
              <th class="text-center">{code.country}</th> 
            {/if}
          </tr>
          
        {/each}
      </thead>
    </table>
</section>
{/if}