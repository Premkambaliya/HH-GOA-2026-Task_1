export function parseSkills(input: string): string[] {
  return input
    .split(/[,|/]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function skillShort(skill: string): string {
  const map: Record<string, string> = {
    react: "Re",
    next: "Nx",
    nextjs: "Nx",
    "next.js": "Nx",
    node: "Nd",
    nodejs: "Nd",
    python: "Py",
    typescript: "Ts",
    javascript: "Js",
    mongo: "Db",
    mongodb: "Db",
    docker: "Dk",
    figma: "Fg",
    solidity: "Sol",
    rust: "Rs",
    go: "Go",
    ai: "AI",
    ml: "ML",
    design: "Ui",
    solana: "◎",
  };
  const key = skill.toLowerCase().replace(/\s+/g, "");
  if (map[key]) return map[key];
  const letters = skill.replace(/[^a-zA-Z0-9]/g, "");
  return (letters.slice(0, 2) || "••").toUpperCase();
}
