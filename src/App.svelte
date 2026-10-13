<script lang="ts">
  import PhoneCodes from './lib/PhoneCodes.svelte'
  import CountryFlags from './lib/CountryFlags.svelte'
  import { Menus, Modes, PlayerState } from './lib/enums'
  
  let playerState: PlayerState = $state(PlayerState.IDLE)
  let menu: Menus = $state(Menus.MENU)
  let mode: Modes = $state(Modes.IDLE)

  const onMenuChange = (selection: Menus) => {
    menu = selection;
    mode = Modes.SELECT;
    playerState = PlayerState.IDLE;
  }

  const onModeChange = (selection: Modes) => {
    mode = selection;
    playerState = PlayerState.MODE;
  }

  const onExit = () => {
    playerState = PlayerState.IDLE;
    mode = Modes.IDLE;
    menu = Menus.MENU;
  }
</script>

<section>
  <h1>Geoguessr Training Room</h1>

  <nav class="menu-nav" class:visible={mode === Modes.IDLE || mode === Modes.SELECT}>
    <div class="menu-row">
      <button 
        class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        class:bg-amber-700={menu === Menus.PHONE}
        onclick={() => onMenuChange(Menus.PHONE)}>
        Phone Codes
      </button>
      <button 
        class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        class:bg-amber-700={menu === Menus.FLAGS}
        onclick={() => onMenuChange(Menus.FLAGS)}>
        Country Flags
      </button>
    </div>
    {#if mode === Modes.SELECT || playerState === PlayerState.MODE || playerState === PlayerState.PLAY}
      <div class="menu-row">
        <button 
          class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
          class:bg-amber-700={mode === Modes.GAME}
          onclick={() => onModeChange(Modes.GAME)}>
          Test Your Might
        </button>
        <button 
          class="bg-amber-500 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
          class:bg-amber-700={mode === Modes.TRAINING}
          onclick={() => onModeChange(Modes.TRAINING)}>
          Training
        </button>
      </div>
    {/if}
  </nav>
</section>

{#if playerState === PlayerState.MODE && menu === Menus.PHONE} 
<PhoneCodes {playerState} {mode} />
<button 
  class="border-2 border-red-500 hover:bg-red-500 text-black hover:text-white dark:text-white px-4 py-2 rounded-xl mx-auto block mt-4"
  onclick={() => onExit()}>
  Exit Game
</button>
{:else if playerState === PlayerState.MODE && menu === Menus.FLAGS} 
<CountryFlags />
<button 
  class="border-2 border-red-500 hover:bg-red-500 text-black hover:text-white dark:text-white px-4 py-2 rounded-xl mx-auto block mt-4"
  onclick={() => onExit()}>
  Exit Game
</button>
{/if}
