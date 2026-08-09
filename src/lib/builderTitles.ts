const TITLES = [
  "stack overflower",
  "ship captain",
  "prompt pirate",
  "fiber lock-in",
  "demo day threat",
  "on-chain cartographer",
  "beachside deployer",
  "signal over noise",
  "vibe compiler",
  "bounty magnet",
  "latency assassin",
  "goa genesis",
  "weekend warrior",
  "pixel smuggler",
  "runtime poet",
  "multichain mariner",
];

export function pickBuilderTitle(name: string, stack: string): string {
  const seed = `${name.trim().toLowerCase()}|${stack.trim().toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return TITLES[hash % TITLES.length];
}

export function randomBuilderTitle(): string {
  return TITLES[Math.floor(Math.random() * TITLES.length)];
}
