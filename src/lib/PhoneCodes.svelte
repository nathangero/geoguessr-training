<script lang="ts">
  import { countryCodes, nanpCodes, usaCodes, codeToLocations, locationToCode, type PhoneNumberCode } from './area-codes';
  import { Modes, PhoneModes, PlayerState } from './enums'
  const typingDelay = 300; // Need?

  let {playerState, mode}: {playerState: PlayerState, mode: Modes} = $props();

  let phoneMode: PhoneModes = $state(PhoneModes.MENU);
  let codes: PhoneNumberCode[] = $state([]);
  let locations: {[key: string]: string} = $state({}); // {location: code}

  let searchQuery: string = $state("");
  let searchResult: PhoneNumberCode[] = $state([]);
  let isAreaCode: boolean = $state(false);

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

  const changeMode = (selection: PhoneModes) => {
    phoneMode = selection;
    playerState = selection === PhoneModes.MENU ? PlayerState.MODE : PlayerState.PLAY;
    if (playerState !== PlayerState.PLAY) return;

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

    loadLocations();
  }

  const loadLocations = () => {
    console.log("Loading locations for mode:", getModeString());
    const uniqueLocations = new Set<string>();
    for (const code of codes) {
      for (const location of code.locations) {
        uniqueLocations.add(location);
      }
    }

    for (const location of uniqueLocations) {
      locations[location] = location;
    }
  }

  const codePrefix = (index: number, isWorld: boolean): string => {
    const value = isWorld ? codes[index]?.countryCode : codes[index]?.areaCode;
    return value?.slice(0, searchQuery.length) ?? "";
  }

  const binarySearchPhoneCodes = (isWorld: boolean): PhoneNumberCode[] => {
    let left = 0;
    let right = codes.length;

    // First index whose prefix is >= the query
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (codePrefix(mid, isWorld) < searchQuery) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    const leftBoundary = left;
    right = codes.length;

    // First index whose prefix is > the query
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (codePrefix(mid, isWorld) <= searchQuery) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return codes.slice(leftBoundary, left);
  }


  const onSearch = (e: Event) => {
    const input = (e.target as HTMLInputElement).value;
    searchQuery = "";
    // console.log("Waiting for typing delay...");

    if (input.length === 0) {
      return;
    }

    let isWorld = input[0] === "+" ? true : false;

    // setTimeout(() => {
      console.log("Searching for:", input);
      searchQuery = input;
      // Check if num first digit is a number or a +
      if (parseInt(input[0]) || input[0] === "+") {
        isAreaCode = true;
        searchResult = binarySearchPhoneCodes(isWorld);
      } else {
        isAreaCode = false;
        // searchResult = locationToCode[input];
      }
    // }, typingDelay);
  }
</script>

<!-- {#if playerState !== PlayerState.PLAY} -->
<table class="mx-auto w-full max-w-xl table-fixed border-separate border-spacing-x-16">
  <thead>
    <tr>
    <!-- <th class="text-center">
      <button 
        class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        class:bg-amber-700={phoneMode === PhoneModes.ALL}
        onclick={() => changeMode(PhoneModes.ALL)}>
        All
      </button>
    </th>
    <th class="text-center">
      <button 
        class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        class:bg-amber-700={phoneMode === PhoneModes.WORLD}
        onclick={() => changeMode(PhoneModes.WORLD)}>
        World
      </button>
    </th> -->
    <th class="text-center">
      <button 
        class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        class:bg-amber-700={phoneMode === PhoneModes.NANP}
        onclick={() => changeMode(PhoneModes.NANP)}>
        NANP
      </button>
    </th>
    <th class="text-center">
      <button 
        class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        class:bg-amber-700={phoneMode === PhoneModes.USA}
        onclick={() => changeMode(PhoneModes.USA)}>
        USA
      </button>
    </th>
    </tr>
  </thead>
</table>
<!-- {/if} -->

<br />

{#if playerState === PlayerState.PLAY}

  {#if mode === Modes.TRAINING}
  <section id="training-phone">
    <input class="text-center w-5/6 p-2 rounded-xl" type="text" placeholder="Search by code or location" oninput={(e) => onSearch(e)} />
    <br />
      
    {#if searchQuery !== ""}
      <p>Searching for: {searchQuery}</p>
      {#if isAreaCode}
      <table class="mx-auto border-separate border-spacing-x-16 border-spacing-y-2">
        <thead>
          <tr>
            <th class="text-left">Code</th>
            <th class="text-left">Location</th>
            {#if phoneMode !== PhoneModes.WORLD}
            <th class="text-left">Country/Province</th>
            {/if}
          </tr>
          {#each searchResult as code}
            <tr>
              {#if code.country === "NANP"}
                {#if phoneMode === PhoneModes.ALL}
                  <th class="text-center">{code.countryCode} {code.areaCode}</th>
                {:else}
                  <th class="text-center">{code.areaCode}</th>
                {/if}
                <th class="text-left">{code.locations.slice(0, code.locations.length - 1).join(", ")}</th> 
                <th class="text-left">{code.locations.slice(code.locations.length - 1, code.locations.length).join(", ")}</th> 
              {:else}
                <th class="text-center">{code.countryCode}</th>
                {#if phoneMode !== PhoneModes.WORLD}
                <th class="text-center">{code.country}</th> 
                {/if}
  
              {/if}
            </tr>
            
          {/each}
        </thead>
      </table>
      {:else}
        <p>Location</p>
      {/if}

    {:else}
    <table class="mx-auto border-separate border-spacing-x-16 border-spacing-y-2">
      <thead>
        <tr>
          <th class="text-left">Code</th>
          <th class="text-left">Location</th>
          {#if phoneMode !== PhoneModes.WORLD}
          <th class="text-left">Country/Province</th>
          {/if}
        </tr>
        {#each codes as code}
          <tr>
            {#if code.country === "NANP"}
              {#if phoneMode === PhoneModes.ALL}
                <th class="text-center">{code.countryCode} {code.areaCode}</th>
              {:else}
                <th class="text-center">{code.areaCode}</th>
              {/if}
              <th class="text-left">{code.locations.slice(0, code.locations.length - 1).join(", ")}</th> 
              <th class="text-left">{code.locations.slice(code.locations.length - 1, code.locations.length).join(", ")}</th> 
            {:else}
              <th class="text-center">{code.countryCode}</th>
              {#if phoneMode !== PhoneModes.WORLD}
              <th class="text-center">{code.country}</th> 
              {/if}

            {/if}
          </tr>
          
        {/each}
      </thead>
    </table>
    {/if}
  </section>
  {/if}

  {#if mode === Modes.GAME}
  <section id="game-phone">
    <p>Games coming soon</p>
    <br />
    
  </section>
  {/if}

{/if}