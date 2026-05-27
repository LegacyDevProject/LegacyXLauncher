export const MINECRAFT_VERSIONS = {
  releases: [
    "1.21.5", "1.21.4", "1.21.3", "1.21.2", "1.21.1", "1.21",
    "1.20.6", "1.20.4", "1.20.3", "1.20.2", "1.20.1", "1.20",
    "1.19.4", "1.19.3", "1.19.2", "1.19.1", "1.19",
    "1.18.2", "1.18.1", "1.18",
    "1.17.1", "1.17",
    "1.16.5", "1.16.4", "1.16.3", "1.16.2", "1.16.1", "1.16",
    "1.15.2", "1.14.4", "1.13.2", "1.12.2", "1.11.2", "1.10.2",
    "1.9.4", "1.8.9", "1.7.10"
  ],
  snapshots: [
    "25w20a", "25w19a", "25w18a", "25w17a", "25w16a",
    "24w46a", "24w45a", "24w44a"
  ],
  oldBeta: ["b1.8.1", "b1.7.3", "b1.6.6", "b1.5_01", "b1.4_01", "b1.3_01"],
  oldAlpha: ["a1.2.6", "a1.1.2_01", "a1.0.17_04", "a1.0.16"]
};

export const MOD_LOADERS = {
  forge: {
    "1.21.5": ["55.0.1", "55.0.0"],
    "1.21.4": ["54.1.0", "54.0.23"],
    "1.20.6": ["50.1.0", "50.0.33"],
    "1.20.4": ["49.1.0", "49.0.50"],
    "1.20.1": ["47.3.0", "47.2.20", "47.1.0"],
    "1.19.2": ["43.4.0", "43.3.13"],
    "1.18.2": ["40.2.21", "40.2.0"],
    "1.16.5": ["36.2.42", "36.2.39"],
    "1.12.2": ["14.23.5.2860"],
  },
  fabric: {
    "1.21.5": ["0.16.9", "0.16.7"],
    "1.21.4": ["0.16.5", "0.16.3"],
    "1.20.6": ["0.15.11"],
    "1.20.4": ["0.15.7"],
    "1.20.1": ["0.14.25", "0.14.21"],
    "1.19.2": ["0.14.11"],
    "1.18.2": ["0.13.3"],
  },
  neoforge: {
    "1.21.5": ["21.5.2", "21.5.0"],
    "1.21.4": ["21.4.1", "21.4.0"],
    "1.20.6": ["20.6.119"],
    "1.20.4": ["20.4.237"],
  },
  quilt: {
    "1.21.4": ["0.27.1", "0.27.0"],
    "1.20.4": ["0.24.0"],
    "1.20.1": ["0.23.1"],
    "1.19.2": ["0.19.2"],
  }
};

export const MOCK_MODS = [
  { id: "1", name: "Sodium", author: "CaffeineMC", description: "A modern rendering engine for Minecraft which greatly improves performance", downloads: 48500000, source: "modrinth", category: "optimization", versions: ["1.21.5","1.21.4","1.20.6","1.20.4","1.20.1","1.19.2"], loaders: ["fabric","neoforge","quilt"], icon: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=64&h=64&fit=crop" },
  { id: "2", name: "Iris Shaders", author: "coderbot", description: "A modern shaders mod for Minecraft intended to be compatible with existing OptiFine shader packs", downloads: 32100000, source: "modrinth", category: "rendering", versions: ["1.21.5","1.21.4","1.20.4","1.20.1","1.19.2"], loaders: ["fabric","neoforge","quilt"], icon: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=64&h=64&fit=crop" },
  { id: "3", name: "JEI", author: "mezz", description: "Just Enough Items - View Items and Recipes", downloads: 254000000, source: "curseforge", category: "utility", versions: ["1.21.4","1.20.4","1.20.1","1.19.2","1.18.2","1.16.5","1.12.2"], loaders: ["forge","neoforge","fabric"], icon: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=64&h=64&fit=crop" },
  { id: "4", name: "Create", author: "simibubi", description: "Aesthetic Technology that empowers the Player", downloads: 72000000, source: "curseforge", category: "technology", versions: ["1.20.1","1.19.2","1.18.2"], loaders: ["forge","fabric"], icon: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=64&h=64&fit=crop" },
  { id: "5", name: "Fabric API", author: "FabricMC", description: "Lightweight and modular API providing common hooks and intercompatibility measures", downloads: 610000000, source: "modrinth", category: "library", versions: ["1.21.5","1.21.4","1.20.6","1.20.4","1.20.1","1.19.2","1.18.2"], loaders: ["fabric","quilt"], icon: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=64&h=64&fit=crop" },
  { id: "6", name: "OptiFine", author: "sp614x", description: "HD textures, dynamic lighting, shaders and much more", downloads: 180000000, source: "curseforge", category: "optimization", versions: ["1.21.4","1.20.4","1.20.1","1.19.2","1.18.2","1.16.5","1.12.2","1.8.9","1.7.10"], loaders: ["forge"], icon: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=64&h=64&fit=crop" },
  { id: "7", name: "Xaero's Minimap", author: "xaero96", description: "Displays the nearby world terrain, players, mobs, and more on a handy minimap", downloads: 95000000, source: "curseforge", category: "utility", versions: ["1.21.5","1.21.4","1.20.4","1.20.1","1.19.2","1.18.2","1.16.5"], loaders: ["forge","fabric","neoforge","quilt"], icon: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=64&h=64&fit=crop" },
  { id: "8", name: "Lithium", author: "CaffeineMC", description: "No-compromises game logic/server optimization mod", downloads: 25000000, source: "modrinth", category: "optimization", versions: ["1.21.5","1.21.4","1.20.4","1.20.1","1.19.2","1.18.2"], loaders: ["fabric","neoforge","quilt"], icon: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=64&h=64&fit=crop" },
  { id: "9", name: "Biomes O' Plenty", author: "Forstride", description: "An expansive biome mod that adds a ton of unique biomes to the game", downloads: 115000000, source: "curseforge", category: "worldgen", versions: ["1.21.4","1.20.4","1.20.1","1.19.2","1.18.2","1.16.5"], loaders: ["forge","neoforge"], icon: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=64&h=64&fit=crop" },
  { id: "10", name: "Mod Menu", author: "TerraformersMC", description: "Adds a mod menu to view the list of mods you have installed", downloads: 40000000, source: "modrinth", category: "utility", versions: ["1.21.5","1.21.4","1.20.4","1.20.1","1.19.2","1.18.2"], loaders: ["fabric","quilt"], icon: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=64&h=64&fit=crop" },
  { id: "11", name: "Applied Energistics 2", author: "AlgorithmX2", description: "A Minecraft mod about storage, automation, and making things generally easier", downloads: 88000000, source: "curseforge", category: "technology", versions: ["1.21.4","1.20.4","1.20.1","1.19.2","1.18.2","1.16.5","1.12.2"], loaders: ["forge","fabric","neoforge"], icon: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop" },
  { id: "12", name: "Waystones", author: "BlayTheNinth", description: "Teleport back to activated waystones. For Survival, Adventure or Servers", downloads: 66000000, source: "curseforge", category: "utility", versions: ["1.21.4","1.20.4","1.20.1","1.19.2","1.18.2","1.16.5"], loaders: ["forge","fabric","neoforge"], icon: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=64&h=64&fit=crop" },
];

export const MOCK_NEWS = [
  {
    id: 1,
    title: "Minecraft 1.21.5 - The Garden Awakens Update",
    description: "Explore new biomes, discover the Pale Garden, and face the terrifying Creaking mob!",
    image: "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=800&h=400&fit=crop",
    date: "2025-04-23",
    tag: "Update"
  },
  {
    id: 2,
    title: "Snapshot 25w20a Available",
    description: "New snapshot brings performance improvements and bug fixes for the upcoming release.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    date: "2025-05-14",
    tag: "Snapshot"
  },
  {
    id: 3,
    title: "Minecraft Live 2025 Announced",
    description: "Join us for Minecraft Live 2025! Vote on the next mob and see what's coming next.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
    date: "2025-05-10",
    tag: "Event"
  }
];

export const THEMES = [
  { id: "dark", name: "Dark Default", description: "Deep dark with purple accent", colors: { bg: "#141118", accent: "#8B5CF6", card: "#1C1825", text: "#E8E4EE" } },
  { id: "light", name: "Light Clean", description: "White with blue accent", colors: { bg: "#F3F4F8", accent: "#3B82F6", card: "#FFFFFF", text: "#1A2030" } },
  { id: "creeper", name: "Creeper Green", description: "Dark green, neon accent", colors: { bg: "#0D1A0F", accent: "#00FF00", card: "#122016", text: "#D4EAD8" } },
  { id: "nether", name: "Nether Red", description: "Charcoal with fiery accent", colors: { bg: "#161010", accent: "#F05A28", card: "#1F1414", text: "#EAD8D0" } },
  { id: "end", name: "End Purple", description: "Navy with ender purple", colors: { bg: "#0D0F1A", accent: "#A855F7", card: "#141828", text: "#D8D4EA" } },
  { id: "retro", name: "Retro CRT", description: "Monochrome green phosphor", colors: { bg: "#080A08", accent: "#33FF33", card: "#0D120D", text: "#66CC66" } },
];

export const formatDownloads = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
};