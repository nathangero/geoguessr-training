// Player state
export enum PlayerState {
    IDLE = "idle",
    MODE = "mode",
    PLAY = "play",
}

/// Menu selection
export enum Menus {
    MENU = "menu",
    PHONE = "phone",
    FLAGS = "flags",
}

/// Mode Selection
export enum Modes {
    IDLE = "idle",
    SELECT = "select",
    TRAINING = "training",
    GAME = "game",
}

/// Phone code selection
export enum PhoneModes {
    MENU = "menu",
    ALL = "all",
    WORLD = "world",
    NANP = "nanp",
    USA = "usa",
}

/// Phone mode string
export enum PhoneModeString {
    MENU = "menu",
    ALL = "All",
    WORLD = "World",
    USA = "USA",
}

/// Flags mode selection
export enum FlagsModes {
    WORLD = "world",
    USA = "usa",
}