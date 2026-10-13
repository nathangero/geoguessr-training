<script lang="ts">
  import { worldCodes, nanpCodes, usaCodes, locationToCode, type PhoneNumberCode } from './area-codes';
  import { Modes, PhoneModes, PlayerState } from './enums'
  const typingDelay = 300; // Need?

  let {playerState, mode}: {playerState: PlayerState, mode: Modes} = $props();

  let phoneMode: PhoneModes = $state(PhoneModes.MENU);
  let codes: PhoneNumberCode[] = $state([]);
  let locations: {[key: string]: string} = $state({}); // {location: code}

  let searchQuery: string = $state("");
  let searchResult: PhoneNumberCode[] = $state([]);
  let searchResultLocations: string[] = $state([]); // List of locations
  let isPhoneCode: boolean = $state(false);

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
    codes = [...worldCodes, ...nanpCodes];
  }

  const loadWorld = () => {
    codes = worldCodes;
  }

  const loadNanp = () => {
    codes = nanpCodes.sort((a, b) => a.countryCode.localeCompare(b.countryCode));
  }

  const loadUsa = () => {
    codes = usaCodes.sort((a, b) => a.countryCode.localeCompare(b.countryCode));
  }

  const changeMode = (selection: PhoneModes) => {
    phoneMode = selection;
    playerState = selection === PhoneModes.MENU ? PlayerState.MODE : PlayerState.PLAY;

    if (playerState !== PlayerState.PLAY) return;
    codes = []; // Clear the array

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
    // console.log("Loading locations for mode:", getModeString());
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

  const codePrefix = (list: PhoneNumberCode[], index: number, isWorld: boolean): string => {
    const prefix = isWorld ? list[index]?.countryCode : list[index]?.areaCode;
    return prefix?.slice(0, searchQuery.length) ?? "";
  }

  const binarySearchPhoneCodes = (list: PhoneNumberCode[], searchQuery: string, isWorld: boolean): PhoneNumberCode[] => {
    let left = 0;
    let right = list.length;

    // First index whose prefix is >= the query
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const prefix = codePrefix(list, mid, isWorld);
      if (prefix < searchQuery) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    const leftBoundary = left;
    right = list.length;

    // First index whose prefix is > the query
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const prefix = codePrefix(list, mid, isWorld);
      if (prefix <= searchQuery) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return list.slice(leftBoundary, left);
  }


  /// TODO:
  const binarySearchLocation = (list: string[]): string[] => {
    let left = 0;
    let right = list.length;

    // First index whose prefix is >= the query
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const prefix = list[mid];
      if (prefix < searchQuery) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    const leftBoundary = left;
    right = list.length;

    // First index whose prefix is > the query
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const prefix = list[mid];
      if (prefix <= searchQuery) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    return list.slice(leftBoundary, left);
  }


  const onSearch = (e: Event) => {
    const input = (e.target as HTMLInputElement).value;
    searchQuery = "";

    if (input.length === 0) {
      return;
    }

    const isWorld = (phoneMode === PhoneModes.WORLD || phoneMode === PhoneModes.ALL) ? true : false;
    let list: PhoneNumberCode[];

    if (phoneMode === PhoneModes.USA) {
      list = usaCodes.sort((a, b) => {
        const areaA = a?.areaCode ?? "";
        const areaB = b?.areaCode ?? "";
        return areaA.localeCompare(areaB);
      });

    } else if (phoneMode === PhoneModes.NANP) {
      list = nanpCodes.sort((a, b) => {
        const areaA = a?.areaCode ?? "";
        const areaB = b?.areaCode ?? "";
        return areaA.localeCompare(areaB);
      });

    } else if (phoneMode === PhoneModes.WORLD) {
      list = worldCodes.sort((a, b) => a.countryCode.localeCompare(b.countryCode));
    } else {
      list = [];
    }
    
    // console.log("Searching for:", input, `in the ${isWorld ? "WORLD" : "NANP OR USA"}`);
    searchQuery = input;

    // Check if num first digit is a number or a +
    if (parseInt(input[0])) {
      isPhoneCode = true;

      if (phoneMode === PhoneModes.ALL) {
        // Search two lists and combine both results
        list = nanpCodes.sort((a, b) => {
          const areaA = a?.areaCode ?? "";
          const areaB = b?.areaCode ?? "";
          return areaA.localeCompare(areaB);
        });
        let resultNanp = binarySearchPhoneCodes(list, searchQuery, false);
        let resultWorld = binarySearchPhoneCodes(worldCodes.sort((a, b) => a.countryCode.localeCompare(b.countryCode)), searchQuery, true);

        searchResult = [...resultWorld, ...resultNanp];
      } else {
        searchResult = binarySearchPhoneCodes(list, searchQuery, isWorld);
      }
    } else {
      isPhoneCode = false;
      searchResultLocations = binarySearchLocation(Object.keys(locationToCode));
    }
  }
</script>

<table class="mx-auto w-full max-w-xl table-fixed border-separate border-spacing-x-16">
  <thead>
    <tr>
    <th class="text-center">
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
    </th>
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

<br />

{#if playerState === PlayerState.PLAY}

  {#if mode === Modes.TRAINING}
  <section id="training-phone">
    <input class="text-center w-5/6 p-2 rounded-xl" type="text" placeholder="Search by code or location" oninput={(e) => onSearch(e)} />
    <br /><br />
      
    {#if searchQuery !== ""}
      <p>RESULTS:</p>
      {#if isPhoneCode}
      <table class="mx-auto border-separate border-spacing-x-16 border-spacing-y-2">
        <thead>
          {#if phoneMode === PhoneModes.NANP || phoneMode === PhoneModes.USA}
            <tr>
              <th class="text-left">Code</th>
              {#if phoneMode === PhoneModes.USA}
                <th class="text-left">State</th>
              {:else}
                <th class="text-left">State/Province/Country</th>
              {/if}
            </tr>
            {#each searchResult as code}
              <tr>
                <th class="text-left">+{code.countryCode} {code.areaCode}</th>
                <th class="text-left">{code.locations.slice(code.locations.length - 1, code.locations.length).join(", ")}</th>   
              </tr>
            {/each}
          {:else if phoneMode === PhoneModes.WORLD}
            <tr>
              <th class="text-left">Code</th>
              <th class="text-left">Country/Province</th>
            </tr>
            {#each searchResult as code}
              <tr>
                <th class="text-left">+{code.countryCode} {code.areaCode}</th>
                <th class="text-left">{code.locations.slice(code.locations.length - 1, code.locations.length).join(", ")}</th>   
              </tr>
            {/each}
          {:else}
            <tr>
              <th class="text-left">Code</th>
              <th class="text-left">City</th>
              <th class="text-left">Country/Province/State</th>
            </tr>
            {#each searchResult as code}
              <tr>
                <th class="text-left">+{code.countryCode} {code.areaCode}</th>
                <th class="text-left">{code.locations.slice(0, code.locations.length - 1).join(", ")}</th> 
                <th class="text-left">{code.locations.slice(code.locations.length - 1, code.locations.length).join(", ")}</th>   
              </tr>
            {/each}
          {/if}
        </thead>
      </table>
      {:else}
        {#each Object.keys(locationToCode) as location}
          <table class="mx-auto border-separate border-spacing-x-16 border-spacing-y-2">
            <thead>
                <tr>
                  <th class="text-left">Location</th>
                  <th class="text-left">Code</th>
                </tr>
                <!-- SHOW RESULTS -->
            </thead>
          </table>
        {/each}
      {/if}

    {:else}
      <table class="mx-auto border-separate border-spacing-x-16 border-spacing-y-2">
        <thead>
          {#if phoneMode === PhoneModes.NANP || phoneMode === PhoneModes.USA}
            <tr>
              <th class="text-left">Code</th>
              {#if phoneMode === PhoneModes.USA}
                <th class="text-left">State</th>
              {:else}
                <th class="text-left">State/Province/Country</th>
              {/if}
            </tr>
            {#each codes as code}
              <tr>
                <th class="text-left">+{code.countryCode} {code.areaCode}</th>
                <th class="text-left">{code.locations.slice(code.locations.length - 1, code.locations.length).join(", ")}</th>   
              </tr>
            {/each}
          {:else if phoneMode === PhoneModes.WORLD}
            <tr>
              <th class="text-left">Code</th>
              <th class="text-left">Country/Province</th>
            </tr>
            {#each codes as code}
              <tr>
                <th class="text-left">+{code.countryCode} {code.areaCode}</th>
                <th class="text-left">{code.locations.slice(code.locations.length - 1, code.locations.length).join(", ")}</th>   
              </tr>
            {/each}
          {:else}
            <tr>
              <th class="text-left">Code</th>
              <th class="text-left">City</th>
              <th class="text-left">Country/Province/State</th>
            </tr>
            {#each codes as code}
              <tr>
                <th class="text-left">+{code.countryCode} {code.areaCode}</th>
                <th class="text-left">{code.locations.slice(0, code.locations.length - 1).join(", ")}</th> 
                <th class="text-left">{code.locations.slice(code.locations.length - 1, code.locations.length).join(", ")}</th>   
              </tr>
            {/each}
          {/if}
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