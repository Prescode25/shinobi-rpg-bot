/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 1 OF 10)
 * ============================================================================
 * Focus: API Initialization, Massive World Map (10 locations/village), 
 * 50+ Clan Registry, and Advanced Player Data Structures.
 * ============================================================================
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ==========================================
// 1. API & SYSTEM INITIALIZATION
// ==========================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // MUST BE IN QUOTES
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const client = new Client({ 
    authStrategy: new LocalAuth() 
});

const DB_FILE = 'shinobi_db.json';
const ADMIN_NUMBER = '2348144086486@c.us';

// ==========================================
// 2. MASSIVE WORLD MAP (80+ Locations)
// ==========================================
const VILLAGE_MAPS = {
    leaf: [
        { id: 1, name: "Hokage Office", type: "safezone", desc: "The center of administration." },
        { id: 2, name: "Training Ground 1", type: "training", desc: "Basic academy training area." },
        { id: 3, name: "Training Ground 2", type: "training", desc: "Advanced combat testing ground." },
        { id: 4, name: "Konoha Hospital", type: "medical", desc: "Heal your injuries here." },
        { id: 5, name: "Ichiraku Ramen", type: "shop", desc: "Buy stamina recovery food." },
        { id: 6, name: "General Shop", type: "shop", desc: "Purchase basic weapons and scrolls." },
        { id: 7, name: "Ninja Academy", type: "hub", desc: "Where Genin are born." },
        { id: 8, name: "Uchiha District", type: "explore", desc: "The abandoned compound." },
        { id: 9, name: "Forest of Death", type: "danger", desc: "High-level hostile area." },
        { id: 10, name: "Konoha Gates", type: "travel", desc: "Exit the village to the world map." }
    ],
    sand: [
        { id: 1, name: "Kazekage Office", type: "safezone", desc: "The highest tower in Suna." },
        { id: 2, name: "Desert Training Area", type: "training", desc: "Harsh environment training." },
        { id: 3, name: "Medical Tent", type: "medical", desc: "Anti-venom and healing." },
        { id: 4, name: "Sand Shop", type: "shop", desc: "Buy desert survival gear." },
        { id: 5, name: "Suna Academy", type: "hub", desc: "Harsh shinobi schooling." },
        { id: 6, name: "Puppet Workshop", type: "shop", desc: "Purchase and repair puppets." },
        { id: 7, name: "Green Room", type: "hub", desc: "Rare herb cultivation." },
        { id: 8, name: "Sunagakure Aviary", type: "explore", desc: "Messenger bird post." },
        { id: 9, name: "Demon Desert", type: "danger", desc: "Scorpion-infested wasteland." },
        { id: 10, name: "Outer Walls", type: "travel", desc: "The narrow canyon exit." }
    ],
    mist: [
        { id: 1, name: "Mizukage Office", type: "safezone", desc: "The heavily guarded center." },
        { id: 2, name: "Hidden Cove", type: "training", desc: "Water-walking practice." },
        { id: 3, name: "Training Island", type: "training", desc: "Isolated combat zone." },
        { id: 4, name: "Mist Hospital", type: "medical", desc: "Standard healing." },
        { id: 5, name: "Swordsman Forge", type: "shop", desc: "High-end Kenjutsu weapons." },
        { id: 6, name: "Marketplace", type: "shop", desc: "General tools and pills." },
        { id: 7, name: "Mist Academy", type: "hub", desc: "The bloody graduation site." },
        { id: 8, name: "The Docks", type: "explore", desc: "Vessels leaving for the mainland." },
        { id: 9, name: "Blood Lake", type: "danger", desc: "Rogue ninja hideout." },
        { id: 10, name: "Mist Border", type: "travel", desc: "Thick fog obscures the exit." }
    ],
    cloud: [
        { id: 1, name: "Raikage Office", type: "safezone", desc: "High altitude command center." },
        { id: 2, name: "Cloud Academy", type: "hub", desc: "Kenjutsu and Lightning focus." },
        { id: 3, name: "Training Mountain", type: "training", desc: "High-gravity resistance training." },
        { id: 4, name: "Cloud Hospital", type: "medical", desc: "Advanced medical ninjutsu." },
        { id: 5, name: "General Shop", type: "shop", desc: "Standard shinobi gear." },
        { id: 6, name: "Waterfall of Truth", type: "explore", desc: "Face your inner darkness." },
        { id: 7, name: "Lightning District", type: "hub", desc: "Residential zone." },
        { id: 8, name: "Training Peak", type: "training", desc: "Extreme altitude combat." },
        { id: 9, name: "Valley of Clouds", type: "danger", desc: "Fierce beasts roam here." },
        { id: 10, name: "Cloud Border", type: "travel", desc: "Mountain pass to the world map." }
    ],
    stone: [
        { id: 1, name: "Tsuchikage Office", type: "safezone", desc: "Carved into the largest rock." },
        { id: 2, name: "Stone Academy", type: "hub", desc: "Focuses on unyielding will." },
        { id: 3, name: "Training Canyon", type: "training", desc: "Earth jutsu practice." },
        { id: 4, name: "Rock Hospital", type: "medical", desc: "Sturdy healing center." },
        { id: 5, name: "Mining District Shop", type: "shop", desc: "Heavy weapons and armor." },
        { id: 6, name: "Artisan District", type: "explore", desc: "Clay and explosive crafting." },
        { id: 7, name: "Training Cave", type: "training", desc: "Darkness combat training." },
        { id: 8, name: "Stone Fort", type: "hub", desc: "Military barracks." },
        { id: 9, name: "The Wastelands", type: "danger", desc: "Bandit territory." },
        { id: 10, name: "Border Gate", type: "travel", desc: "The heavily fortified exit." }
    ],
    sound: [
        { id: 1, name: "Oto Base", type: "safezone", desc: "Orochimaru's main throne." },
        { id: 2, name: "Training Lab", type: "training", desc: "Cruel experiment rooms." },
        { id: 3, name: "Infirmary", type: "medical", desc: "Questionable healing methods." },
        { id: 4, name: "Black Market", type: "shop", desc: "Illegal and rare items." },
        { id: 5, name: "Testing Ground", type: "danger", desc: "Fight cursed mark failures." },
        { id: 6, name: "Forest Path", type: "explore", desc: "Hidden entrance to the base." },
        { id: 7, name: "Secret Lab 1", type: "hub", desc: "Genetic research." },
        { id: 8, name: "Secret Lab 2", type: "hub", desc: "Jutsu development." },
        { id: 9, name: "The Dungeon", type: "danger", desc: "Prisoners are kept here." },
        { id: 10, name: "Sound Border", type: "travel", desc: "Hidden passage to the world." }
    ]
};

// ==========================================
// 3. MASSIVE CLAN REGISTRY (50+ CLANS)
// ==========================================
const CLAN_DB = {
    // Leaf Village Clans
    "Uchiha": { kg: "Sharingan", type: "Dojutsu", buff: "INT +20", passives: ["Copy Jutsu", "Fire Affinity"] },
    "Hyuga": { kg: "Byakugan", type: "Dojutsu", buff: "AGI +20", passives: ["Chakra Block", "360 Vision"] },
    "Senju": { kg: "Wood Release", type: "Nature", buff: "HP +50", passives: ["High Regeneration", "Chakra Reserves"] },
    "Nara": { kg: "Shadow Possession", type: "Hiden", buff: "INT +25", passives: ["Shadow Hold Scaling"] },
    "Akimichi": { kg: "Expansion", type: "Hiden", buff: "STR +30", passives: ["Butterfly Multiplier"] },
    "Yamanaka": { kg: "Mind Transfer", type: "Hiden", buff: "INT +15", passives: ["Mind Stun", "Defense Shatter"] },
    "Aburame": { kg: "Kikai Insects", type: "Hiden", buff: "AGI +15", passives: ["Rinkaichu Venom", "Chakra Leech"] },
    "Inuzuka": { kg: "Beast Mimicry", type: "Hiden", buff: "STR +15", passives: ["Ninja Hound Companion"] },
    "Sarutobi": { kg: "Fire/Wind Nature", type: "Nature", buff: "NIN +20", passives: ["High Jutsu Damage"] },
    "Hatake": { kg: "White Light Chakra", type: "Kenjutsu", buff: "AGI +25", passives: ["Kenjutsu Mastery"] },
    "Kurama": { kg: "Kurama Genjutsu", type: "Genjutsu", buff: "GEN +30", passives: ["Reality Warping"] },
    "Shimura": { kg: "Wind Release", type: "Nature", buff: "NIN +15", passives: ["Vacuum Jutsu"] },
    "Kohaku": { kg: "None", type: "Standard", buff: "HP +20", passives: ["Survivor"] },
    "Lee": { kg: "Eight Gates", type: "Taijutsu", buff: "STR +40", passives: ["No Ninjutsu", "Gates Mastery"] },
    "Tenma": { kg: "None", type: "Standard", buff: "AGI +10", passives: ["Speed Boost"] },
    
    // Sand Village Clans
    "Kazekage": { kg: "Magnet Release", type: "Kekkei Genkai", buff: "NIN +25", passives: ["Iron Sand/Gold Dust"] },
    "Shirogane": { kg: "Puppet Mastery", type: "Hiden", buff: "INT +20", passives: ["Multi-Puppet Control"] },
    "Hoki": { kg: "Medical Ninjutsu", type: "Standard", buff: "HP +30", passives: ["Enhanced Healing"] },
    "Matsuri": { kg: "Weapon Mastery", type: "Kenjutsu", buff: "STR +15", passives: ["Weapon Damage Buff"] },
    "Yashamaru": { kg: "None", type: "Standard", buff: "INT +10", passives: ["Tactician"] },
    "Shamon": { kg: "Puppet Mastery", type: "Hiden", buff: "INT +15", passives: ["Puppet Creation"] },
    "Araya": { kg: "None", type: "Standard", buff: "AGI +10", passives: ["Stealth"] },

    // Mist Village Clans
    "Hoshigaki": { kg: "Shark Physiology", type: "Mutation", buff: "CHAKRA +50", passives: ["Chakra Absorption"] },
    "Yuki": { kg: "Ice Release", type: "Nature", buff: "NIN +25", passives: ["Demonic Mirrors"] },
    "Kaguya": { kg: "Shikotsumyaku", type: "Body", buff: "STR +30", passives: ["Bone Weapons", "High Defense"] },
    "Hozuki": { kg: "Hydrification", type: "Hiden", buff: "AGI +20", passives: ["Physical Immunity"] },
    "Momochi": { kg: "Silent Killing", type: "Kenjutsu", buff: "STR +25", passives: ["Mist Assassination"] },
    "Terumi": { kg: "Lava/Boil Release", type: "Nature", buff: "NIN +30", passives: ["Dual Kekkei Genkai"] },
    "Karatachi": { kg: "None", type: "Standard", buff: "INT +15", passives: ["Genjutsu Resistance"] },
    "Suikazan": { kg: "Hair Manipulation", type: "Hiden", buff: "STR +15", passives: ["Needle Senbon"] },

    // Cloud Village Clans
    "Yotsuki": { kg: "Lightning Release", type: "Nature", buff: "AGI +30", passives: ["Lightning Armor"] },
    "Chinoike": { kg: "Ketsuryugan", type: "Dojutsu", buff: "GEN +25", passives: ["Blood Manipulation"] },
    "Darui": { kg: "Storm Release", type: "Nature", buff: "NIN +25", passives: ["Laser Circus"] },
    "Mabui": { kg: "Heavenly Transfer", type: "Hiden", buff: "INT +20", passives: ["Light Speed Travel"] },

    // Stone Village Clans
    "Kamizuru": { kg: "Bee Manipulation", type: "Hiden", buff: "INT +20", passives: ["Summon Bees"] },
    "Kurotsuchi": { kg: "Lava Release", type: "Nature", buff: "NIN +25", passives: ["Quicklime Jutsu"] },
    "Ishi": { kg: "Earth Grudge", type: "Hiden", buff: "STR +20", passives: ["Hardened Skin"] },
    "Deidara": { kg: "Explosion Release", type: "Nature", buff: "NIN +30", passives: ["Explosive Clay"] },

    // Sound/Other/Filler Clans
    "Uzumaki": { kg: "Adamantine Chains", type: "Fuinjutsu", buff: "CHAKRA +100", passives: ["Massive Reserves", "Healing Bite"] },
    "Fuma": { kg: "Chakra Threads", type: "Hiden", buff: "AGI +15", passives: ["Fuma Shuriken Mastery"] },
    "Iburi": { kg: "Smoke Form", type: "Mutation", buff: "AGI +25", passives: ["Intangibility"] },
    "Jugo": { kg: "Sage Transformation", type: "Mutation", buff: "STR +35", passives: ["Nature Energy Absorption"] },
    "Shiin": { kg: "Sound Genjutsu", type: "Genjutsu", buff: "GEN +20", passives: ["Flute Mastery"] },
    "Tsuchigumo": { kg: "Fury", type: "Kinjutsu", buff: "NIN +40", passives: ["Massive Explosion"] },
    "Amachi": { kg: "Sea Boss", type: "Summoning", buff: "HP +20", passives: ["Water Adaptation"] },
    "Rinha": { kg: "Medical Ninjutsu", type: "Standard", buff: "HP +30", passives: ["Chakra Absorption"] },
    "Kurama-Filler": { kg: "Id Genjutsu", type: "Genjutsu", buff: "GEN +35", passives: ["Monster Manifestation"] },
    "Hirasaka": { kg: "None", type: "Standard", buff: "INT +15", passives: ["Trap Mastery"] },
    "Kedouin": { kg: "Face Copy", type: "Hiden", buff: "AGI +15", passives: ["Perfect Disguise"] },
    "Tenro": { kg: "None", type: "Standard", buff: "STR +15", passives: ["Wolf Taming"] }
};

// ==========================================
// 4. DATABASE INITIALIZATION & DEEP MERGE
// ==========================================
let db = {};

if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDb() { 
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); 
}

function getOrCreatePlayer(phone, name) {
    if (!db[phone]) {
        db[phone] = {
            isRegistered: false,
            // Master/Admin Check
            isMaster: (phone === ADMIN_NUMBER), 
            title: (phone === ADMIN_NUMBER) ? "Master Shinobi" : "Academy Student",
            name: name || "Unknown",
            clan: "None",
            village: "None",
            combatClass: "None",
            level: 1,
            xp: 0,
            ryo: 1000, // Fixed 1000 starting Ryo
            gems: 10,
            location: "Hokage Office",
            
            // Advanced Stat Mapping
            stats: { 
                hp: 100, maxHp: 100, 
                chakra: 100, maxChakra: 100, 
                taijutsu: 10, ninjutsu: 10, genjutsu: 10,
                strength: 10, agility: 10, intelligence: 10 // Retained for older logic
            },
            
            inventory: { weapons: [], scrolls: [], pills: [] },
            equipped: { weapon: "None", scroll: "None" },
            
            // Intricate State Machines
            activeMission: null,
            missionState: null, // Track steps in multi-part missions
            battleState: null, // Track active turn-based combat
            
            // Specific Clan & Advanced Mechanics
            gates: { unlocked: 0, active: 0 },
            kekkeiGenkai: null,
            companion: null, // For Inuzuka Hounds
            butterflyMode: false // For Akimichi multipliers
        };
    }
    
    let p = db[phone];
    // Deep Merge Fallbacks (Prevents 'undefined' errors on old profiles)
    if (!p.stats.taijutsu) p.stats.taijutsu = p.stats.strength || 10;
    if (!p.stats.ninjutsu) p.stats.ninjutsu = p.stats.intelligence || 10;
    if (!p.stats.genjutsu) p.stats.genjutsu = p.stats.intelligence || 10;
    if (p.ryo === undefined) p.ryo = 1000;
    if (p.gems === undefined) p.gems = 10;
    if (!p.gates) p.gates = { unlocked: 0, active: 0 };
    
    return p;
}
/

* ============================================================================
* SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 2 OF 10)
* ============================================================================
* Focus: Village-Clan Distributions, WhatsApp Client Boot, Master Admin
* Overrides, Categorized Help Menus, and the Deep Registration System.
* ============================================================================
* Instructions: Paste this directly underneath Part 1. Do not delete anything.
* ============================================================================
*/

// ==========================================
// 5. VILLAGE TO CLAN DISTRIBUTION ARRAYS
// ==========================================
// This ensures that when you pick a village, you only roll clans native to it.
const VILLAGE_POOLS = {
leaf: ["Uchiha", "Hyuga", "Senju", "Nara", "Akimichi", "Yamanaka", "Aburame", "Inuzuka", "Sarutobi", "Hatake", "Kurama", "Shimura", "Kohaku", "Lee", "Tenma"],
sand: ["Kazekage", "Shirogane", "Hoki", "Matsuri", "Yashamaru", "Shamon", "Araya"],
mist: ["Hoshigaki", "Yuki", "Kaguya", "Hozuki", "Momochi", "Terumi", "Karatachi", "Suikazan"],
cloud: ["Yotsuki", "Chinoike", "Darui", "Mabui"],
stone: ["Kamizuru", "Kurotsuchi", "Ishi", "Deidara"],
sound: ["Uzumaki", "Fuma", "Iburi", "Jugo", "Shiin", "Tsuchigumo", "Amachi", "Rinha", "Kurama-Filler", "Hirasaka", "Kedouin", "Tenro"] // Uzumaki hidden here
};

// ==========================================
// 6. WHATSAPP CLIENT BOOT & EVENT LISTENERS
// ==========================================
client.on('qr', (qr) => {
// Generates the QR code in your terminal to link your WhatsApp
qrcode.generate(qr, { small: true });
console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP DEVICE.');
});

client.on('ready', () => {
console.log('✅ ============================================');
console.log('✅ SHINOBI WORLD ENGINE V5 - MASTER BUILD ONLINE');
console.log('✅ ============================================');
});

// ==========================================
// 7. MESSAGE PARSER & CORE LOOP
// ==========================================
client.on('message', async (msg) => {
const text = msg.body.trim();

```
// Quick intercept for new players
if (text.toLowerCase() === '!shinobi') {
    return msg.reply("🍃 *Welcome to the Shinobi World!* Type *!shinobi help* to see the command directory.");
}

// Ignore any message that doesn't start with our prefix
if (!text.toLowerCase().startsWith('!shinobi ')) return;

// Advanced Argument Parser (Handles multiple spaces and long strings)
const args = text.split(/\s+/);
const cmd = args[1] ? args[1].toLowerCase() : 'help';
const sub = args[2] ? args[2].toLowerCase() : null;
const actionArg1 = args[3] ? args[3].toLowerCase() : null;
const actionArg2 = args[4] ? args[4].toLowerCase() : null;
const fullString = args.slice(2).join(' '); // Used for multi-word names

const sender = msg.from;

// Load or initialize the player. Name remains 'Unknown' until registration.
let player = getOrCreatePlayer(sender, "Unknown");

// ==========================================
// 8. MASTER ADMIN COMMANDS (God Mode)
// ==========================================
if (player.isMaster) {
    if (cmd === 'admin') {
        if (sub === 'addryo') {
            const amount = parseInt(actionArg1) || 10000;
            player.ryo += amount;
            saveDb();
            return msg.reply(`👑 *MASTER COMMAND:* Added 🪙 ${amount} Ryo. New Balance: 🪙 ${player.ryo}`);
        }
        if (sub === 'addxp') {
            const amount = parseInt(actionArg1) || 500;
            player.xp += amount;
            saveDb();
            return msg.reply(`👑 *MASTER COMMAND:* Added 🌟 ${amount} XP. (Level up checks run during combat).`);
        }
        if (sub === 'setlevel') {
            const lvl = parseInt(actionArg1) || 100;
            player.level = lvl;
            player.stats.maxHp = lvl * 50;
            player.stats.maxChakra = lvl * 50;
            player.stats.hp = player.stats.maxHp;
            player.stats.chakra = player.stats.maxChakra;
            saveDb();
            return msg.reply(`👑 *MASTER COMMAND:* Level forced to ${lvl}. Stats aggressively scaled.`);
        }
        if (sub === 'heal') {
            player.stats.hp = player.stats.maxHp;
            player.stats.chakra = player.stats.maxChakra;
            player.battleState = null; // Clears stuck battles
            player.hospitalTimer = null; // Removes hospital locks
            saveDb();
            return msg.reply(`👑 *MASTER COMMAND:* Fully restored HP/Chakra and cleared all negative states.`);
        }
    }
}

// ==========================================
// 9. CATEGORIZED HELP DIRECTORY
// ==========================================
if (cmd === 'help') {
    if (!sub) {
        return msg.reply(
            `📜 *SHINOBI COMMAND DIRECTORY* 📜\n` +
            `Reply with a category to see specific commands:\n\n` +
            `👤 *!shinobi help profile* - Stats, ID, & Inventory\n` +
            `🗺️ *!shinobi help map* - Travel & Locations\n` +
            `🎯 *!shinobi help mission* - Quests & Tasks\n` +
            `🏬 *!shinobi help shop* - Weapons, Scrolls & Items\n` +
            `⚔️ *!shinobi help combat* - Fighting, Skills & Gates\n` +
            `🧬 *!shinobi help clan* - Kekkei Genkai & Passives`
        );
    }
    if (sub === 'profile') return msg.reply(`👤 *PROFILE COMMANDS:*\n- *!shinobi profile* : View your Ninja ID Card.\n- *!shinobi inventory* : Check your bag.\n- *!shinobi stats* : View detailed combat attributes.`);
    if (sub === 'map') return msg.reply(`🗺️ *MAP COMMANDS:*\n- *!shinobi map* : View all locations in your current village.\n- *!shinobi map world* : View other villages.\n- *!shinobi travel [ID]* : Move to a location.`);
    if (sub === 'mission') return msg.reply(`🎯 *MISSION COMMANDS:*\n- *!shinobi mission board* : View available missions.\n- *!shinobi mission start [ID]* : Accept a mission.\n- *!shinobi mission abandon* : Quit current task.`);
    if (sub === 'shop') return msg.reply(`🏬 *SHOP COMMANDS:*\n- *!shinobi shop* : View the market (Must be at a shop location).\n- *!shinobi buy [ID]* : Purchase an item.\n- *!shinobi equip [Item Name]* : Equip weapon/scroll.`);
    if (sub === 'combat') return msg.reply(`⚔️ *COMBAT COMMANDS:*\n- *!shinobi fight* : Trigger an ambush.\n- *!shinobi attack* : Basic strike.\n- *!shinobi jutsu [Name]* : Use Ninjutsu/Genjutsu.\n- *!shinobi heal* : Use a pill.\n- *!shinobi flee* : Run away (-10 Karma).`);
    if (sub === 'clan') return msg.reply(`🧬 *CLAN COMMANDS:*\n- *!shinobi clan info* : View your clan's passive abilities and Kekkei Genkai modifiers.`);
}

// ==========================================
// 10. DEEP REGISTRATION SYSTEM
// ==========================================
if (!player.isRegistered) {
    if (cmd === 'start') {
        if (!sub) return msg.reply("⚠️ You must provide a name. Example: *!shinobi start Ekom*");
        
        player.name = fullString;
        player.isRegistered = "pending_village";
        saveDb();
        
        return msg.reply(
            `Welcome, ${player.name}.\nTo forge your path, select your birthplace:\n\n` +
            `🍃 *!shinobi village leaf*\n` +
            `⏳ *!shinobi village sand*\n` +
            `🌫️ *!shinobi village mist*\n` +
            `⚡ *!shinobi village cloud*\n` +
            `🪨 *!shinobi village stone*\n` +
            `🎵 *!shinobi village sound*`
        );
    }
    
    if (cmd === 'village' && player.isRegistered === "pending_village") {
        const chosenVillage = sub;
        if (!VILLAGE_POOLS[chosenVillage]) {
            return msg.reply("❌ Invalid village. Check your spelling (e.g., leaf, sand, mist, cloud, stone, sound).");
        }
        
        // 1. Assign Village & Spawn Location (Kage Office)
        player.village = chosenVillage.charAt(0).toUpperCase() + chosenVillage.slice(1);
        player.location = VILLAGE_MAPS[chosenVillage][0].name; 
        
        // 2. Roll Random Clan from the specific Village Pool
        const availableClans = VILLAGE_POOLS[chosenVillage];
        player.clan = availableClans[Math.floor(Math.random() * availableClans.length)];
        
        // 3. Apply Deep Clan Logic & Kekkei Genkai
        const clanData = CLAN_DB[player.clan];
        if (clanData) {
            player.kekkeiGenkai = clanData.kg;
            
            // Parse the buff string (e.g., "INT +20")
            const [statType, statValue] = clanData.buff.split(' +');
            const buffVal = parseInt(statValue);
            
            if (statType === "INT") { player.stats.ninjutsu += buffVal; player.stats.genjutsu += buffVal; }
            if (statType === "AGI") player.stats.taijutsu += buffVal;
            if (statType === "STR") player.stats.taijutsu += buffVal;
            if (statType === "HP") { player.stats.maxHp += buffVal; player.stats.hp = player.stats.maxHp; }
            if (statType === "CHAKRA") { player.stats.maxChakra += buffVal; player.stats.chakra = player.stats.maxChakra; }
            if (statType === "NIN") player.stats.ninjutsu += buffVal;
            if (statType === "GEN") player.stats.genjutsu += buffVal;
        }

        // 4. Finalize Registration
        player.isRegistered = true;
        saveDb();
        
        return msg.reply(
            `✅ *DESTINY SEALED*\n\n` +
            `You were born into the **${player.clan} Clan** of the Hidden ${player.village}.\n` +
            `🧬 Inherited Trait: **${player.kekkeiGenkai || "None"}**\n\n` +
            `Type *!shinobi profile* to view your official Ninja ID.`
        );
    }
    
    return msg.reply("⚠️ You have not completed registration. Type *!shinobi start [Your Name]*");
}

// ==========================================
// 11. HIGH-DEFINITION PROFILE CARD
// ==========================================
if (cmd === 'profile') {
    const titleLine = player.isMaster ? `👑 *** ${player.title.toUpperCase()} *** 👑` : `🥷 *NINJA ID CARD*`;
    
    let kgDisplay = player.kekkeiGenkai && player.kekkeiGenkai !== "None" 
        ? `🧬 *Bloodline:* ${player.kekkeiGenkai}\n` 
        : `🧬 *Bloodline:* None\n`;

    return msg.reply(
        `╔════════════════════════════╗\n` +
        ` ${titleLine} \n` +
        `╚════════════════════════════╝\n\n` +
        `👤 *Name:* ${player.name}\n` +
        `⛩️ *Village:* Hidden ${player.village}\n` +
        `🩸 *Clan:* ${player.clan}\n` +
        kgDisplay +
        `🎖️ *Rank:* ${player.title}\n` +
        `📈 *Level:* ${player.level} (XP: ${player.xp})\n\n` +
        `📊 *--- COMBAT STATS ---*\n` +
        `❤️ *HP:* ${player.stats.hp} / ${player.stats.maxHp}\n` +
        `🌀 *Chakra:* ${player.stats.chakra} / ${player.stats.maxChakra}\n\n` +
        `👊 *Taijutsu:* ${player.stats.taijutsu}\n` +
        `💨 *Ninjutsu:* ${player.stats.ninjutsu}\n` +
        `👁️ *Genjutsu:* ${player.stats.genjutsu}\n\n` +
        `🎒 *--- EQUIPMENT ---*\n` +
        `⚔️ *Weapon:* ${player.equipped.weapon}\n` +
        `📜 *Scroll:* ${player.equipped.scroll}\n` +
        `🚪 *Gates Unlocked:* ${player.gates.unlocked}/8\n\n` +
        `💰 *--- WEALTH ---*\n` +
        `🪙 *Ryo:* ${player.ryo}\n` +
        `💎 *Gems:* ${player.gems}\n\n` +
        `📍 *Location:* ${player.location}`
    );
}

/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 3 OF 10)
 * ============================================================================
 * Focus: World Map Navigation, Massive Global Shop Database, Location-Aware 
 * Purchasing, and the Dynamic Equipment & Stat-Scaling Engine.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 2. 
 * ============================================================================
 */

    // ==========================================
    // 12. ADVANCED MAP & TRAVEL SYSTEM
    // ==========================================
    if (cmd === 'map') {
        const villageKey = player.village.toLowerCase();
        const locations = VILLAGE_MAPS[villageKey];
        
        if (!locations) return msg.reply("❌ Error: Map data corrupted or missing for your village.");

        let mapDisplay = `🗺️ *HIDDEN ${player.village.toUpperCase()} MAP* 🗺️\n\n`;
        mapDisplay += `📍 *Current Location:* ${player.location}\n\n`;
        
        locations.forEach(loc => {
            let icon = "🟢";
            if (loc.type === "danger") icon = "🔴";
            if (loc.type === "shop") icon = "🏬";
            if (loc.type === "medical") icon = "🏥";
            if (loc.type === "training") icon = "⚔️";
            if (loc.type === "travel") icon = "🚪";
            
            let highlight = (player.location === loc.name) ? "*(You are here)*" : "";
            mapDisplay += `${icon} *[${loc.id}]* ${loc.name} ${highlight}\n └ _${loc.desc}_\n`;
        });

        mapDisplay += `\n🏃‍♂️ *To move:* Type *!shinobi travel [ID]* (e.g., !shinobi travel 2)`;
        return msg.reply(mapDisplay);
    }

    if (cmd === 'travel') {
        if (!sub) return msg.reply("⚠️ Where do you want to go? Provide a Location ID. Example: *!shinobi travel 3*");
        
        // Prevent travel if locked in combat or hospital
        if (player.battleState) return msg.reply("⚔️ You cannot fast-travel while in combat! Flee or fight!");
        if (player.hospitalTimer && player.hospitalTimer > Date.now()) {
            const timeLeft = Math.ceil((player.hospitalTimer - Date.now()) / 60000);
            return msg.reply(`🏥 You are recovering in the hospital. Time remaining: ${timeLeft} minutes.`);
        }

        const locId = parseInt(sub);
        const villageKey = player.village.toLowerCase();
        const locations = VILLAGE_MAPS[villageKey];
        
        const destination = locations.find(l => l.id === locId);
        
        if (!destination) return msg.reply(`❌ Location ID [${locId}] does not exist in the Hidden ${player.village}.`);
        if (player.location === destination.name) return msg.reply(`⚠️ You are already at the ${destination.name}.`);

        player.location = destination.name;
        saveDb();
        
        let travelMsg = `🏃‍♂️ *TRAVELING...*\n\nYou have arrived at: **${destination.name}**.\n_${destination.desc}_`;
        
        if (destination.type === "danger") travelMsg += `\n\n⚠️ *WARNING:* This is a hostile zone. Enemies may ambush you.`;
        if (destination.type === "shop") travelMsg += `\n\n🏬 *INFO:* You can access the market here using *!shinobi shop*.`;
        
        return msg.reply(travelMsg);
    }

    // ==========================================
    // 13. MASSIVE GLOBAL ITEM DATABASE
    // ==========================================
    const GLOBAL_SHOP_DB = [
        // ================= WEAPONS (Taijutsu Buffs) =================
        { id: 101, name: "Kunai Set", type: "weapon", price: 500, buff: { taijutsu: 5 }, desc: "Basic ninja tools." },
        { id: 102, name: "Shuriken Set", type: "weapon", price: 500, buff: { taijutsu: 5 }, desc: "Standard throwing stars." },
        { id: 103, name: "Iron Knuckles", type: "weapon", price: 1500, buff: { taijutsu: 15 }, desc: "Increases striking power." },
        { id: 104, name: "Chakra Blades", type: "weapon", price: 5000, buff: { taijutsu: 25, ninjutsu: 10 }, desc: "Conducts elemental chakra." },
        { id: 105, name: "Steel Katana", type: "weapon", price: 4000, buff: { taijutsu: 30 }, desc: "Standard samurai sword." },
        { id: 106, name: "Fuma Shuriken", type: "weapon", price: 3000, buff: { taijutsu: 20 }, desc: "Massive foldable shuriken." },
        { id: 107, name: "Demon Wind Shuriken", type: "weapon", price: 6000, buff: { taijutsu: 35 }, desc: "Lethal aerodynamic blades." },
        { id: 108, name: "Executioner Blade", type: "weapon", price: 25000, buff: { taijutsu: 80, agility: -10 }, desc: "Legendary sword that regenerates using iron from blood." },
        { id: 109, name: "Samehada", type: "weapon", price: 50000, buff: { taijutsu: 50, maxChakra: 200 }, desc: "Sentient sword that eats chakra." },
        { id: 110, name: "Gunbai Fan", type: "weapon", price: 45000, buff: { taijutsu: 40, ninjutsu: 50 }, desc: "Massive war fan capable of reflecting jutsu." },

        // ================= SCROLLS (Ninjutsu Buffs) =================
        { id: 201, name: "Fireball Scroll", type: "scroll", price: 1500, buff: { ninjutsu: 15 }, desc: "Basic Uchiha style fire jutsu." },
        { id: 202, name: "Water Dragon Scroll", type: "scroll", price: 3000, buff: { ninjutsu: 25 }, desc: "Forms a massive water dragon." },
        { id: 203, name: "Earth Wall Scroll", type: "scroll", price: 2000, buff: { maxHp: 50 }, desc: "Creates a sturdy defensive wall." },
        { id: 204, name: "Lightning Beast Scroll", type: "scroll", price: 4500, buff: { ninjutsu: 40 }, desc: "Summons a hound of pure lightning." },
        { id: 205, name: "Wind Scythe Scroll", type: "scroll", price: 3500, buff: { ninjutsu: 30 }, desc: "Slices through the air." },
        { id: 206, name: "Shadow Clone Scroll", type: "scroll", price: 10000, buff: { ninjutsu: 40, taijutsu: 40 }, desc: "Solid copies of the user. High chakra drain." },
        { id: 207, name: "Rasengan Scroll", type: "scroll", price: 20000, buff: { ninjutsu: 70 }, desc: "Pure chakra sphere of destruction." },
        { id: 208, name: "Chidori Scroll", type: "scroll", price: 20000, buff: { ninjutsu: 70 }, desc: "High-speed lightning assassination jutsu." },
        { id: 209, name: "Toad Summoning", type: "scroll", price: 30000, buff: { maxHp: 200, ninjutsu: 30 }, desc: "Contract with Mt. Myoboku." },
        { id: 210, name: "Snake Summoning", type: "scroll", price: 30000, buff: { genjutsu: 50, ninjutsu: 30 }, desc: "Contract with Ryuchi Cave." },

        // ================= ARMOR (HP/Defense Buffs) =================
        { id: 301, name: "Genin Flak Jacket", type: "armor", price: 2000, buff: { maxHp: 100 }, desc: "Standard village issue." },
        { id: 302, name: "Chunin Flak Jacket", type: "armor", price: 8000, buff: { maxHp: 300 }, desc: "Padded for heavier combat." },
        { id: 303, name: "Jonin Flak Jacket", type: "armor", price: 20000, buff: { maxHp: 600, maxChakra: 100 }, desc: "Elite tier protection." },
        { id: 304, name: "Anbu Black Ops Armor", type: "armor", price: 35000, buff: { maxHp: 500, ninjutsu: 20, taijutsu: 20 }, desc: "Lightweight and deadly." },
        { id: 305, name: "Samurai Plate", type: "armor", price: 25000, buff: { maxHp: 800 }, desc: "Heavy steel armor from the Land of Iron." },

        // ================= CONSUMABLES (Healing & Boosts) =================
        { id: 401, name: "Soldier Pill", type: "pill", price: 200, effect: "recover_chakra", value: 100, desc: "Restores 100 Chakra." },
        { id: 402, name: "Blood Pill", type: "pill", price: 300, effect: "recover_hp", value: 150, desc: "Restores 150 HP." },
        { id: 403, name: "Ration Bar", type: "pill", price: 50, effect: "recover_both", value: 30, desc: "Restores 30 HP and Chakra." },
        { id: 404, name: "Akimichi Food Pill", type: "pill", price: 5000, effect: "buff_taijutsu", value: 100, desc: "Temporary massive strength boost." }
    ];

    // ==========================================
    // 14. DYNAMIC SHOP UI & PURCHASING
    // ==========================================
    if (cmd === 'shop') {
        const villageKey = player.village.toLowerCase();
        const locations = VILLAGE_MAPS[villageKey];
        const currentLocData = locations.find(l => l.name === player.location);

        // Location Check: Are they actually at a shop?
        if (!currentLocData || currentLocData.type !== "shop") {
            return msg.reply(
                `❌ You are currently at **${player.location}**. There are no merchants here.\n` +
                `Type *!shinobi map* to find a location marked with 🏬, then use *!shinobi travel [ID]* to go there.`
            );
        }

        if (!sub) {
            let shopMsg = `🏬 *THE MARKETPLACE* 🏬\n💰 *Your Ryo:* ${player.ryo}\n\n`;
            shopMsg += `🗡️ *WEAPONS (Taijutsu Buffs)*\n`;
            GLOBAL_SHOP_DB.filter(i => i.type === "weapon").slice(0, 5).forEach(i => {
                shopMsg += `[ID: ${i.id}] ${i.name} - 🪙 ${i.price}\n`;
            });
            shopMsg += `\n📜 *SCROLLS (Ninjutsu Buffs)*\n`;
            GLOBAL_SHOP_DB.filter(i => i.type === "scroll").slice(0, 5).forEach(i => {
                shopMsg += `[ID: ${i.id}] ${i.name} - 🪙 ${i.price}\n`;
            });
            shopMsg += `\n🛡️ *ARMOR (HP Buffs)*\n`;
            GLOBAL_SHOP_DB.filter(i => i.type === "armor").forEach(i => {
                shopMsg += `[ID: ${i.id}] ${i.name} - 🪙 ${i.price}\n`;
            });
            shopMsg += `\n💊 *CONSUMABLES*\n`;
            GLOBAL_SHOP_DB.filter(i => i.type === "pill").forEach(i => {
                shopMsg += `[ID: ${i.id}] ${i.name} - 🪙 ${i.price}\n`;
            });
            shopMsg += `\n🛒 *To buy:* Type *!shinobi buy [ID]*`;
            return msg.reply(shopMsg);
        }
    }

    if (cmd === 'buy') {
        const itemId = parseInt(sub);
        if (!itemId) return msg.reply("⚠️ Usage: *!shinobi buy [ID]*");

        const item = GLOBAL_SHOP_DB.find(i => i.id === itemId);
        if (!item) return msg.reply(`❌ Invalid Item ID.`);

        if (player.ryo < item.price) {
            return msg.reply(`❌ Insufficient funds. You need 🪙 ${item.price} Ryo to buy ${item.name}. You only have 🪙 ${player.ryo}.`);
        }

        // Check Inventory Duplicates for Gear (Weapons/Scrolls/Armor)
        if (item.type !== "pill") {
            const hasItem = player.inventory.weapons.includes(item.name) || 
                            player.inventory.scrolls.includes(item.name) ||
                            (player.inventory.armor && player.inventory.armor.includes(item.name));
            if (hasItem) return msg.reply(`⚠️ You already own the **${item.name}**.`);
        }

        // Process Transaction
        player.ryo -= item.price;
        
        if (item.type === "weapon") player.inventory.weapons.push(item.name);
        else if (item.type === "scroll") player.inventory.scrolls.push(item.name);
        else if (item.type === "armor") {
            if (!player.inventory.armor) player.inventory.armor = [];
            player.inventory.armor.push(item.name);
        }
        else if (item.type === "pill") {
            // Pills can stack, represented as an array of objects
            const existingPill = player.inventory.pills.find(p => p.name === item.name);
            if (existingPill) existingPill.amount += 1;
            else player.inventory.pills.push({ name: item.name, amount: 1 });
        }

        saveDb();
        return msg.reply(`🛍️ *PURCHASE SUCCESSFUL*\n\nYou bought **${item.name}** for 🪙 ${item.price} Ryo.\nCurrent Balance: 🪙 ${player.ryo}\n\nType *!shinobi equip ${item.name}* to use it.`);
    }

    // ==========================================
    // 15. INVENTORY & EQUIPMENT MANAGEMENT
    // ==========================================
    if (cmd === 'inventory' || cmd === 'inv') {
        let invMsg = `🎒 *${player.name}'S INVENTORY* 🎒\n\n`;
        
        invMsg += `⚔️ *Weapons:* ${player.inventory.weapons.length > 0 ? player.inventory.weapons.join(", ") : "None"}\n`;
        invMsg += `📜 *Scrolls:* ${player.inventory.scrolls.length > 0 ? player.inventory.scrolls.join(", ") : "None"}\n`;
        if (player.inventory.armor) invMsg += `🛡️ *Armor:* ${player.inventory.armor.length > 0 ? player.inventory.armor.join(", ") : "None"}\n`;
        
        invMsg += `💊 *Pills/Consumables:*\n`;
        if (player.inventory.pills.length === 0) invMsg += ` - None\n`;
        player.inventory.pills.forEach(p => { invMsg += ` - ${p.name} (x${p.amount})\n`; });

        invMsg += `\n*Currently Equipped:*\nWeapon: ${player.equipped.weapon}\nScroll: ${player.equipped.scroll}\nArmor: ${player.equipped.armor || "None"}\n\n`;
        invMsg += `Equip items using *!shinobi equip [Item Name]*`;
        return msg.reply(invMsg);
    }

    if (cmd === 'equip') {
        const itemName = args.slice(2).join(' ').toLowerCase();
        if (!itemName) return msg.reply("⚠️ Usage: *!shinobi equip [Item Name]* (e.g., !shinobi equip Steel Katana)");

        // Find the item globally to get its type and stats
        const itemObj = GLOBAL_SHOP_DB.find(i => i.name.toLowerCase() === itemName);
        if (!itemObj) return msg.reply("❌ That item does not exist in the database.");
        if (itemObj.type === "pill") return msg.reply("❌ You cannot equip pills. Use *!shinobi heal* or *!shinobi consume* instead.");

        // Check if player owns it
        let ownsItem = false;
        if (itemObj.type === "weapon" && player.inventory.weapons.map(w=>w.toLowerCase()).includes(itemName)) ownsItem = true;
        if (itemObj.type === "scroll" && player.inventory.scrolls.map(s=>s.toLowerCase()).includes(itemName)) ownsItem = true;
        if (itemObj.type === "armor" && player.inventory.armor && player.inventory.armor.map(a=>a.toLowerCase()).includes(itemName)) ownsItem = true;

        if (!ownsItem) return msg.reply(`⚠️ You do not own a **${itemObj.name}**. Check your inventory.`);

        // --- STAT RECALCULATION ENGINE ---
        // 1. Remove old item buffs
        const oldItemName = player.equipped[itemObj.type];
        if (oldItemName && oldItemName !== "None") {
            const oldItemObj = GLOBAL_SHOP_DB.find(i => i.name === oldItemName);
            if (oldItemObj && oldItemObj.buff) {
                if (oldItemObj.buff.taijutsu) player.stats.taijutsu -= oldItemObj.buff.taijutsu;
                if (oldItemObj.buff.ninjutsu) player.stats.ninjutsu -= oldItemObj.buff.ninjutsu;
                if (oldItemObj.buff.genjutsu) player.stats.genjutsu -= oldItemObj.buff.genjutsu;
                if (oldItemObj.buff.maxHp) player.stats.maxHp -= oldItemObj.buff.maxHp;
                if (oldItemObj.buff.maxChakra) player.stats.maxChakra -= oldItemObj.buff.maxChakra;
            }
        }

        // 2. Equip new item
        player.equipped[itemObj.type] = itemObj.name;

        // 3. Apply new item buffs
        if (itemObj.buff) {
            if (itemObj.buff.taijutsu) player.stats.taijutsu += itemObj.buff.taijutsu;
            if (itemObj.buff.ninjutsu) player.stats.ninjutsu += itemObj.buff.ninjutsu;
            if (itemObj.buff.genjutsu) player.stats.genjutsu += itemObj.buff.genjutsu;
            if (itemObj.buff.maxHp) player.stats.maxHp += itemObj.buff.maxHp;
            if (itemObj.buff.maxChakra) player.stats.maxChakra += itemObj.buff.maxChakra;
        }

        // Prevent current HP/Chakra from exceeding new maxes (if armor was removed)
        if (player.stats.hp > player.stats.maxHp) player.stats.hp = player.stats.maxHp;
        if (player.stats.chakra > player.stats.maxChakra) player.stats.chakra = player.stats.maxChakra;

        saveDb();
        
        let equipMsg = `✅ **${itemObj.name}** has been successfully equipped.\n\n📊 *Stat Changes:*\n`;
        if (itemObj.buff.taijutsu) equipMsg += `👊 Taijutsu +${itemObj.buff.taijutsu}\n`;
        if (itemObj.buff.ninjutsu) equipMsg += `💨 Ninjutsu +${itemObj.buff.ninjutsu}\n`;
        if (itemObj.buff.maxHp) equipMsg += `❤️ Max HP +${itemObj.buff.maxHp}\n`;
        
        return msg.reply(equipMsg);
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 4 OF 10)
 * ============================================================================
 * Focus: Consumable Engine, Passive Training System, Global Mission Database, 
 * and the Branching Mission State Machine.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 3.
 * ============================================================================
 */

    // ==========================================
    // 16. CONSUMABLES & HEALING ENGINE
    // ==========================================
    if (cmd === 'heal' || cmd === 'consume') {
        let pillName = args.slice(2).join(' ').toLowerCase();
        
        if (!pillName) {
            return msg.reply("⚠️ Specify what you want to consume. Example: *!shinobi consume blood pill*");
        }

        // Find the pill in player's inventory
        const invPillIndex = player.inventory.pills.findIndex(p => p.name.toLowerCase() === pillName);
        
        if (invPillIndex === -1 || player.inventory.pills[invPillIndex].amount <= 0) {
            return msg.reply(`❌ You do not have any **${pillName}** in your inventory.`);
        }

        // Find pill data from Global DB (Assumes GLOBAL_SHOP_DB is available from Part 3)
        const pillData = GLOBAL_SHOP_DB.find(i => i.name.toLowerCase() === pillName && i.type === "pill");
        if (!pillData) return msg.reply("❌ Invalid consumable item.");

        // Apply Effects
        let effectMsg = `💊 You consumed **${pillData.name}**.\n\n`;
        
        if (pillData.effect === "recover_hp") {
            player.stats.hp += pillData.value;
            if (player.stats.hp > player.stats.maxHp) player.stats.hp = player.stats.maxHp;
            effectMsg += `❤️ Restored ${pillData.value} HP. (Current: ${player.stats.hp}/${player.stats.maxHp})`;
        } 
        else if (pillData.effect === "recover_chakra") {
            player.stats.chakra += pillData.value;
            if (player.stats.chakra > player.stats.maxChakra) player.stats.chakra = player.stats.maxChakra;
            effectMsg += `🌀 Restored ${pillData.value} Chakra. (Current: ${player.stats.chakra}/${player.stats.maxChakra})`;
        }
        else if (pillData.effect === "recover_both") {
            player.stats.hp += pillData.value;
            player.stats.chakra += pillData.value;
            if (player.stats.hp > player.stats.maxHp) player.stats.hp = player.stats.maxHp;
            if (player.stats.chakra > player.stats.maxChakra) player.stats.chakra = player.stats.maxChakra;
            effectMsg += `✨ Restored ${pillData.value} HP and Chakra.`;
        }
        else if (pillData.effect === "buff_taijutsu") {
            // Temporary buffs will be handled in the combat engine (Part 5/6)
            // For now, we apply a massive temporary flat buff, recorded in player state
            player.butterflyMode = true; 
            effectMsg += `🦋 MASSIVE POWER SURGE! Taijutsu greatly temporarily enhanced!`;
        }

        // Deduct from inventory
        player.inventory.pills[invPillIndex].amount -= 1;
        if (player.inventory.pills[invPillIndex].amount === 0) {
            player.inventory.pills.splice(invPillIndex, 1); // Remove from array if empty
        }

        saveDb();
        return msg.reply(effectMsg);
    }

    // ==========================================
    // 17. PASSIVE TRAINING SYSTEM (Stat Grinding)
    // ==========================================
    if (cmd === 'train') {
        const trainType = sub;
        
        // Ensure player is at a training ground
        const villageKey = player.village.toLowerCase();
        const locations = VILLAGE_MAPS[villageKey];
        const currentLocData = locations.find(l => l.name === player.location);

        if (!currentLocData || currentLocData.type !== "training") {
            return msg.reply("❌ You can only train at designated **Training Grounds**. Use *!shinobi map* to find one with the ⚔️ icon.");
        }

        if (!trainType || !["taijutsu", "ninjutsu", "genjutsu", "chakra"].includes(trainType)) {
            return msg.reply(
                `🏋️ *TRAINING SYSTEM*\n\n` +
                `Spend 20 Chakra to grind base stats or XP.\n` +
                `Usage: *!shinobi train [type]*\n\n` +
                `Types available:\n` +
                `👊 *taijutsu* (Increases physical damage)\n` +
                `💨 *ninjutsu* (Increases jutsu damage)\n` +
                `👁️ *genjutsu* (Increases illusion scaling)\n` +
                `🌀 *chakra* (Converts HP into Max Chakra)`
            );
        }

        // Check if player has enough resources
        if (trainType === "chakra") {
            if (player.stats.hp < 30) return msg.reply("⚠️ You do not have enough HP to safely expand your chakra network. Heal first.");
            player.stats.hp -= 20;
            player.stats.maxChakra += 2; // Permanent max chakra increase
        } else {
            if (player.stats.chakra < 20) return msg.reply("⚠️ You do not have enough Chakra to train. Rest or use a pill.");
            player.stats.chakra -= 20;
            
            // Random chance to actually increase the stat permanently, otherwise just gives XP
            const statIncreaseChance = Math.random();
            if (statIncreaseChance > 0.7) { // 30% chance to gain a permanent stat point
                player.stats[trainType] += 1;
                player.xp += 10;
            } else {
                player.xp += 25; // Good XP gain if stat doesn't increase
            }
        }

        saveDb();

        return msg.reply(
            `💦 *TRAINING COMPLETE*\n\n` +
            `You spent hours pushing your limits at ${player.location}.\n` +
            `Current ${trainType.charAt(0).toUpperCase() + trainType.slice(1)}: ${player.stats[trainType] || player.stats.maxChakra}\n` +
            `Current XP: ${player.xp}`
        );
    }

    // ==========================================
    // 18. GLOBAL MISSION DATABASE
    // ==========================================
    const GLOBAL_MISSIONS = [
        // D-Rank (Level 1-5)
        { 
            id: 101, rank: "D", reqLevel: 1, reqVillage: "Any",
            title: "Tora the Lost Cat", 
            desc: "The Daimyo's wife lost her cat again. It is highly aggressive.", 
            rewardRyo: 200, rewardXp: 50,
            steps: [
                { text: "You spot Tora on a roof. How do you approach? [A: *Sneak* / B: *Jump*]", valid: ["a", "b"] },
                { text: "You caught the cat, but it's scratching your face! [A: *Hold tight* / B: *Drop it*]", valid: ["a", "b"] }
            ]
        },
        { 
            id: 102, rank: "D", reqLevel: 2, reqVillage: "Leaf",
            title: "Clean the Hokage Monument", 
            desc: "Someone painted graffiti on the Hokage faces. Scrub it off.", 
            rewardRyo: 150, rewardXp: 80,
            steps: [
                { text: "You are suspended by a rope. The wind picks up. [A: *Use Chakra on feet* / B: *Hold the rope*]", valid: ["a", "b"] }
            ]
        },
        // C-Rank (Level 5-15)
        { 
            id: 201, rank: "C", reqLevel: 5, reqVillage: "Any",
            title: "Bridge Builder Escort", 
            desc: "Escort a civilian architect to the neighboring town.", 
            rewardRyo: 1000, rewardXp: 300,
            steps: [
                { text: "You notice a puddle on the road, but it hasn't rained in days. [A: *Investigate puddle* / B: *Ignore it*]", valid: ["a", "b"] },
                { text: "Two rogue ninja jump out of the puddle! (COMBAT_TRIGGER_ROGUES)", valid: ["combat"] }
            ]
        },
        // B-Rank (Level 15-30)
        { 
            id: 301, rank: "B", reqLevel: 15, reqVillage: "Any",
            title: "Bandit Camp Wipeout", 
            desc: "A group of rogue samurai have taken over a trade route.", 
            rewardRyo: 3500, rewardXp: 1200,
            steps: [
                { text: "You approach the camp. There are guards at the gate. [A: *Assassinate silently* / B: *Fireball jutsu*]", valid: ["a", "b"] },
                { text: "The bandit boss hears the commotion and draws his Odachi. (COMBAT_TRIGGER_BOSS)", valid: ["combat"] }
            ]
        }
    ];

    // ==========================================
    // 19. BRANCHING MISSION ENGINE
    // ==========================================
    if (cmd === 'mission') {
        
        // --- VIEW MISSION BOARD ---
        if (sub === 'board') {
            if (player.activeMission) {
                return msg.reply(`⚠️ You are already on a mission: **${GLOBAL_MISSIONS.find(m => m.id === player.activeMission).title}**.\nType *!shinobi mission step* to continue or *!shinobi mission abandon* to quit.`);
            }

            // Filter missions by player level and village
            const availableMissions = GLOBAL_MISSIONS.filter(m => 
                m.reqLevel <= player.level && 
                (m.reqVillage === "Any" || m.reqVillage === player.village)
            );

            if (availableMissions.length === 0) return msg.reply("📜 No missions available for your current level.");

            let boardMsg = `📜 *MISSION DESK* 📜\n\n`;
            availableMissions.forEach(m => {
                boardMsg += `[ID: ${m.id}] **${m.title}** (Rank: ${m.rank})\n`;
                boardMsg += ` └ Level Req: ${m.reqLevel} | 💰 ${m.rewardRyo} Ryo | 🌟 ${m.rewardXp} XP\n\n`;
            });
            boardMsg += `🎯 *To accept:* Type *!shinobi mission start [ID]*`;
            
            return msg.reply(boardMsg);
        }

        // --- START A MISSION ---
        if (sub === 'start') {
            const missionId = parseInt(actionArg1);
            if (!missionId) return msg.reply("⚠️ Specify a Mission ID. Example: *!shinobi mission start 101*");
            
            if (player.activeMission) return msg.reply("⚠️ You must finish or abandon your current mission first.");

            const missionData = GLOBAL_MISSIONS.find(m => m.id === missionId);
            if (!missionData) return msg.reply("❌ Invalid Mission ID.");
            if (player.level < missionData.reqLevel) return msg.reply(`❌ Your level is too low. Requires Level ${missionData.reqLevel}.`);
            if (missionData.reqVillage !== "Any" && missionData.reqVillage !== player.village) return msg.reply("❌ This mission is exclusive to a different village.");

            // Initialize Mission State
            player.activeMission = missionId;
            player.missionState = { stepIndex: 0 };
            saveDb();

            return msg.reply(
                `✅ *MISSION ACCEPTED: ${missionData.title}*\n\n` +
                `_${missionData.desc}_\n\n` +
                `Type *!shinobi mission step* to begin the first phase of the assignment.`
            );
        }

        // --- EXECUTE MISSION STEPS (Branching Logic) ---
        if (sub === 'step') {
            if (!player.activeMission) return msg.reply("⚠️ You are not on an active mission. Check the *!shinobi mission board*.");
            
            const missionData = GLOBAL_MISSIONS.find(m => m.id === player.activeMission);
            const currentStep = missionData.steps[player.missionState.stepIndex];

            // If user just types 'step' without an answer, show the prompt
            if (!actionArg1) {
                return msg.reply(`🎯 *Mission Update:*\n\n${currentStep.text}`);
            }

            // Handle Combat Triggers inside missions
            if (currentStep.valid.includes("combat")) {
                // Combat transition logic will link to Part 5 (Enemy Generation Engine)
                return msg.reply("⚔️ *COMBAT INITIATED!* (The Combat Engine will be deployed in the next update to handle this encounter).");
            }

            // Validate user's choice (e.g., A or B)
            if (!currentStep.valid.includes(actionArg1)) {
                return msg.reply(`❌ Invalid choice. Please reply with one of the valid options.\n\n${currentStep.text}`);
            }

            // --- Advance the Step ---
            player.missionState.stepIndex += 1;

            // Check if mission is complete
            if (player.missionState.stepIndex >= missionData.steps.length) {
                const earnedRyo = missionData.rewardRyo;
                const earnedXp = missionData.rewardXp;
                
                player.ryo += earnedRyo;
                player.xp += earnedXp;
                player.activeMission = null;
                player.missionState = null;
                
                // Basic Level Up Check
                let levelUpMsg = "";
                const xpNeeded = player.level * 100;
                if (player.xp >= xpNeeded) {
                    player.level += 1;
                    player.stats.maxHp += 20;
                    player.stats.maxChakra += 20;
                    player.stats.hp = player.stats.maxHp; // Full heal on level up
                    levelUpMsg = `\n\n🎉 *LEVEL UP!* You are now Level ${player.level}! Stats increased.`;
                }

                saveDb();

                return msg.reply(
                    `🎊 *MISSION ACCOMPLISHED!* 🎊\n\n` +
                    `You successfully completed **${missionData.title}**.\n` +
                    `💰 Gained: ${earnedRyo} Ryo\n` +
                    `🌟 Gained: ${earnedXp} XP` + 
                    levelUpMsg
                );
            } else {
                saveDb();
                const nextStep = missionData.steps[player.missionState.stepIndex];
                return msg.reply(`✅ Choice accepted.\n\n🎯 *Next Phase:*\n${nextStep.text}`);
            }
        }

        // --- ABANDON MISSION ---
        if (sub === 'abandon') {
            if (!player.activeMission) return msg.reply("⚠️ You have no active mission to abandon.");
            
            player.activeMission = null;
            player.missionState = null;
            saveDb();
            
            return msg.reply("🏃‍♂️ You have abandoned the mission. Your reputation may suffer slightly.");
        }
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 5 OF 10)
 * ============================================================================
 * Focus: Massive Jutsu Database, Jutsu Acquisition, Enemy Generation Engine,
 * and the Wild Encounter / Patrol System.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 4.
 * ============================================================================
 */

    // ==========================================
    // 20. MASSIVE JUTSU & SKILL DATABASE
    // ==========================================
    const JUTSU_DB = [
        // --- BASIC JUTSU (Available to all) ---
        { id: "J01", name: "Clone Jutsu", type: "genjutsu", cost: 10, power: 0, effect: "evade", reqNinjutsu: 5, reqClan: "Any", desc: "Creates afterimages to dodge 1 attack." },
        { id: "J02", name: "Substitution Jutsu", type: "ninjutsu", cost: 15, power: 0, effect: "counter", reqNinjutsu: 10, reqClan: "Any", desc: "Swaps body with a log, counter-attacking." },
        { id: "J03", name: "Leaf Hurricane", type: "taijutsu", cost: 5, power: 20, effect: "none", reqTaijutsu: 15, reqClan: "Any", desc: "A spinning physical kick." },
        
        // --- ELEMENTAL NINJUTSU ---
        { id: "F01", name: "Fireball Jutsu", type: "ninjutsu", cost: 20, power: 35, effect: "burn", reqNinjutsu: 20, reqClan: "Any", desc: "Spits a massive sphere of fire." },
        { id: "F02", name: "Phoenix Flower", type: "ninjutsu", cost: 25, power: 30, effect: "multi-hit", reqNinjutsu: 30, reqClan: "Any", desc: "Multiple small fireballs hiding shuriken." },
        { id: "W01", name: "Water Prison", type: "ninjutsu", cost: 30, power: 10, effect: "stun_2", reqNinjutsu: 25, reqClan: "Any", desc: "Traps the enemy in a dense sphere of water." },
        { id: "W02", name: "Water Dragon", type: "ninjutsu", cost: 40, power: 50, effect: "none", reqNinjutsu: 40, reqClan: "Any", desc: "A giant dragon made of pressurized water." },
        { id: "E01", name: "Mud Wall", type: "ninjutsu", cost: 25, power: 0, effect: "defense_buff", reqNinjutsu: 20, reqClan: "Any", desc: "Erects a thick earthen wall for defense." },
        { id: "L01", name: "Chidori", type: "ninjutsu", cost: 50, power: 80, effect: "pierce", reqNinjutsu: 50, reqClan: "Any", desc: "High-speed lightning assassination strike." },
        { id: "A01", name: "Wind Scythe", type: "ninjutsu", cost: 25, power: 40, effect: "bleed", reqNinjutsu: 30, reqClan: "Any", desc: "Razor-sharp gusts of wind." },
        { id: "A02", name: "Rasengan", type: "ninjutsu", cost: 60, power: 90, effect: "knockback", reqNinjutsu: 60, reqClan: "Any", desc: "A grinding sphere of pure condensed chakra." },

        // --- CLAN EXCLUSIVE / KEKKEI GENKAI JUTSU ---
        { id: "KG01", name: "Amaterasu", type: "ninjutsu", cost: 100, power: 150, effect: "fatal_burn", reqNinjutsu: 80, reqClan: "Uchiha", desc: "Black flames that never extinguish." },
        { id: "KG02", name: "Tsukuyomi", type: "genjutsu", cost: 80, power: 100, effect: "stun_3", reqGenjutsu: 80, reqClan: "Uchiha", desc: "Traps enemy in an agonizing time-altered illusion." },
        { id: "KG03", name: "8 Trigrams 64 Palms", type: "taijutsu", cost: 40, power: 70, effect: "chakra_seal", reqTaijutsu: 50, reqClan: "Hyuga", desc: "Strikes all chakra points, sealing enemy jutsu." },
        { id: "KG04", name: "Shadow Possession", type: "ninjutsu", cost: 30, power: 10, effect: "stun_2", reqNinjutsu: 30, reqClan: "Nara", desc: "Binds the enemy's movements." },
        { id: "KG05", name: "Human Boulder", type: "taijutsu", cost: 25, power: 50, effect: "crush", reqTaijutsu: 30, reqClan: "Akimichi", desc: "Expands body and rolls over the enemy." },
        { id: "KG06", name: "Mind Transfer", type: "genjutsu", cost: 40, power: 0, effect: "mind_control", reqGenjutsu: 40, reqClan: "Yamanaka", desc: "Takes over the enemy's body temporarily." },
        { id: "KG07", name: "Bone Drill", type: "taijutsu", cost: 30, power: 65, effect: "pierce", reqTaijutsu: 40, reqClan: "Kaguya", desc: "Manifests a hardened bone spear." },
        { id: "KG08", name: "Ice Mirrors", type: "ninjutsu", cost: 60, power: 70, effect: "freeze", reqNinjutsu: 50, reqClan: "Yuki", desc: "Traps enemy in reflective ice panels." },
        { id: "KG09", name: "Sand Coffin", type: "ninjutsu", cost: 50, power: 85, effect: "crush", reqNinjutsu: 60, reqClan: "Kazekage", desc: "Encases and crushes the target in dense sand." }
    ];

    // ==========================================
    // 21. JUTSU ACQUISITION SYSTEM
    // ==========================================
    if (cmd === 'library' || cmd === 'jutsu') {
        if (!sub || sub === 'list') {
            // Ensure player has a jutsu array
            if (!player.inventory.jutsu) player.inventory.jutsu = [];

            let libMsg = `📚 *YOUR JUTSU LIBRARY*\n\n`;
            if (player.inventory.jutsu.length === 0) {
                libMsg += `_You haven't learned any Jutsu yet._\n`;
            } else {
                player.inventory.jutsu.forEach(jName => {
                    const jData = JUTSU_DB.find(j => j.name === jName);
                    if (jData) libMsg += `🔹 **${jData.name}** [${jData.type.toUpperCase()}]\n Cost: ${jData.cost} Chakra | Power: ${jData.power}\n`;
                });
            }
            libMsg += `\n🔍 To learn new Jutsu, type *!shinobi learn list* at a Training Ground.`;
            return msg.reply(libMsg);
        }
    }

    if (cmd === 'learn') {
        const villageKey = player.village.toLowerCase();
        const locations = VILLAGE_MAPS[villageKey];
        const currentLocData = locations.find(l => l.name === player.location);

        if (!currentLocData || currentLocData.type !== "training" && currentLocData.type !== "hub") {
            return msg.reply("❌ You can only study new Jutsu at a **Training Ground** or **Academy/Hub**.");
        }

        if (!player.inventory.jutsu) player.inventory.jutsu = [];

        if (sub === 'list') {
            let learnMsg = `📜 *AVAILABLE SCROLLS TO LEARN*\n\n`;
            
            JUTSU_DB.forEach(j => {
                // Filter out jutsu the player already knows
                if (player.inventory.jutsu.includes(j.name)) return;
                
                // Filter out clan-exclusive jutsu not belonging to player
                if (j.reqClan !== "Any" && j.reqClan !== player.clan) return;

                let reqsMet = true;
                if (j.reqNinjutsu && player.stats.ninjutsu < j.reqNinjutsu) reqsMet = false;
                if (j.reqGenjutsu && player.stats.genjutsu < j.reqGenjutsu) reqsMet = false;
                if (j.reqTaijutsu && player.stats.taijutsu < j.reqTaijutsu) reqsMet = false;

                let icon = reqsMet ? "✅" : "❌";
                learnMsg += `${icon} **${j.name}** [ID: ${j.id}]\n`;
                learnMsg += ` └ Reqs: NIN:${j.reqNinjutsu||0} GEN:${j.reqGenjutsu||0} TAI:${j.reqTaijutsu||0}\n`;
            });
            learnMsg += `\n✍️ To study a technique, type *!shinobi learn [ID]* (Costs 500 Ryo for materials).`;
            return msg.reply(learnMsg);
        }

        const jutsuId = sub.toUpperCase();
        const jutsuData = JUTSU_DB.find(j => j.id === jutsuId);

        if (!jutsuData) return msg.reply("❌ Invalid Jutsu ID.");
        if (player.inventory.jutsu.includes(jutsuData.name)) return msg.reply("⚠️ You already know this technique.");
        if (jutsuData.reqClan !== "Any" && jutsuData.reqClan !== player.clan) return msg.reply(`❌ This is a secret technique of the **${jutsuData.reqClan}** clan. You cannot learn it.`);
        
        if (jutsuData.reqNinjutsu && player.stats.ninjutsu < jutsuData.reqNinjutsu) return msg.reply(`❌ Insufficient Ninjutsu. (Need ${jutsuData.reqNinjutsu})`);
        if (jutsuData.reqGenjutsu && player.stats.genjutsu < jutsuData.reqGenjutsu) return msg.reply(`❌ Insufficient Genjutsu. (Need ${jutsuData.reqGenjutsu})`);
        if (jutsuData.reqTaijutsu && player.stats.taijutsu < jutsuData.reqTaijutsu) return msg.reply(`❌ Insufficient Taijutsu. (Need ${jutsuData.reqTaijutsu})`);

        if (player.ryo < 500) return msg.reply("❌ You need 🪙 500 Ryo to purchase the necessary training scrolls and materials.");

        player.ryo -= 500;
        player.inventory.jutsu.push(jutsuData.name);
        saveDb();

        return msg.reply(`🎉 *TECHNIQUE MASTERED!*\n\nYou have successfully learned **${jutsuData.name}**.\nYou can now use it in combat by typing *!shinobi cast ${jutsuData.name}* during your turn.`);
    }

    // ==========================================
    // 22. ENEMY GENERATOR & PATROL SYSTEM
    // ==========================================
    const ENEMY_TEMPLATES = [
        { name: "Rogue Genin", baseHp: 50, baseDmg: 5, rank: "Low" },
        { name: "Bandit Thug", baseHp: 40, baseDmg: 8, rank: "Low" },
        { name: "Missing-nin", baseHp: 150, baseDmg: 15, rank: "Mid" },
        { name: "Mercenary Samurai", baseHp: 200, baseDmg: 20, rank: "Mid" },
        { name: "Akatsuki Supporter", baseHp: 500, baseDmg: 40, rank: "High" },
        { name: "Cursed Mark Experiment", baseHp: 800, baseDmg: 60, rank: "High" }
    ];

    if (cmd === 'patrol' || cmd === 'search') {
        if (player.battleState) return msg.reply("❌ You are already in combat! Defeat your enemy or flee!");

        const villageKey = player.village.toLowerCase();
        const locations = VILLAGE_MAPS[villageKey];
        const currentLocData = locations.find(l => l.name === player.location);

        if (!currentLocData) return msg.reply("❌ Map error.");
        if (currentLocData.type === "safezone" || currentLocData.type === "medical") {
            return msg.reply("🕊️ You patrol the area, but it is heavily guarded. No enemies here. Try patrolling a **danger** or **explore** zone.");
        }

        // Calculate encounter chance based on zone type
        let encounterChance = 0.3; // 30% chance in training/hub
        if (currentLocData.type === "danger") encounterChance = 0.8; // 80% chance
        if (currentLocData.type === "explore") encounterChance = 0.5; // 50% chance

        if (Math.random() > encounterChance) {
            return msg.reply("🍃 You searched the area but found nothing. The coast is clear.");
        }

        // Generate Enemy based on Player Level
        let availableEnemies = ENEMY_TEMPLATES.filter(e => e.rank === "Low");
        if (player.level >= 15) availableEnemies = availableEnemies.concat(ENEMY_TEMPLATES.filter(e => e.rank === "Mid"));
        if (player.level >= 40) availableEnemies = availableEnemies.concat(ENEMY_TEMPLATES.filter(e => e.rank === "High"));

        const template = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
        
        // Scale enemy stats to player level dynamically
        const levelMultiplier = 1 + (player.level * 0.1);
        const scaledHp = Math.floor(template.baseHp * levelMultiplier);
        const scaledDmg = Math.floor(template.baseDmg * levelMultiplier);

        player.battleState = {
            enemyName: template.name,
            enemyMaxHp: scaledHp,
            enemyHp: scaledHp,
            enemyBaseDmg: scaledDmg,
            status: { stun: 0, burn: 0, bleed: 0 },
            turnCount: 0
        };

        saveDb();

        return msg.reply(
            `⚠️ *AMBUSH TRIGGERED!* ⚠️\n\n` +
            `A hostile **${player.battleState.enemyName}** leaps from the shadows!\n` +
            `❤️ Enemy HP: ${player.battleState.enemyHp} / ${player.battleState.enemyMaxHp}\n\n` +
            `⚔️ *Your Options:*\n` +
            `👊 *!shinobi attack* (Basic Taijutsu/Weapon Strike)\n` +
            `🌀 *!shinobi cast [Jutsu Name]* (Use Chakra)\n` +
            `🏃‍♂️ *!shinobi flee* (Attempt to escape)`
        );
    }

    // ==========================================
    // 23. COMBAT ENGINE: INITIALIZATION & FLEEING
    // ==========================================
    if (cmd === 'flee') {
        if (!player.battleState) return msg.reply("⚠️ You are not in combat.");
        
        // Fleeing calculation based on Taijutsu (Agility equivalent) vs Enemy Level
        const escapeChance = Math.random() + (player.stats.taijutsu * 0.01);
        
        if (escapeChance > 0.5) {
            player.battleState = null;
            saveDb();
            return msg.reply("💨 You threw a smoke bomb and successfully escaped the battle!");
        } else {
            // Enemy gets a free hit if escape fails
            const enemyHit = Math.floor(player.battleState.enemyBaseDmg * (Math.random() * 0.5 + 0.8));
            player.stats.hp -= enemyHit;
            
            let deathCheck = "";
            if (player.stats.hp <= 0) {
                player.stats.hp = 0;
                player.battleState = null;
                deathCheck = `\n\n💀 You have been defeated. You awaken in the hospital.`;
            }
            saveDb();
            return msg.reply(`❌ Escape failed! You tripped!\n⚔️ The **${player.battleState.enemyName}** strikes you in the back for ${enemyHit} damage! (Your HP: ${player.stats.hp}/${player.stats.maxHp})${deathCheck}`);
        }
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 6 OF 10)
 * ============================================================================
 * Focus: Core Combat Engine, Basic Attacks, Weapon Scaling, Jutsu Casting,
 * Status Effect Ticks (Burn, Stun, Bleed), and Enemy AI Turn Resolution.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 5.
 * ============================================================================
 */

    // ==========================================
    // 24. COMBAT ENGINE: BASIC ATTACK (TAIJUTSU/WEAPON)
    // ==========================================
    if (cmd === 'attack' || cmd === 'strike') {
        if (!player.battleState) return msg.reply("⚠️ You are not in combat. Type *!shinobi patrol* to find enemies.");

        let battleMsg = `⚔️ *COMBAT LOG: TURN ${player.battleState.turnCount + 1}*\n\n`;

        // Player Phase: Calculate Damage
        // Base damage comes from Taijutsu stat + a random variance.
        let rawDmg = player.stats.taijutsu * (Math.random() * 0.4 + 0.8);
        
        // Critical Hit Chance (based on Taijutsu scaling)
        let isCrit = Math.random() < 0.15; // 15% base crit chance
        if (isCrit) {
            rawDmg *= 1.5;
            battleMsg += `💥 *CRITICAL HIT!*\n`;
        }

        let finalDmg = Math.floor(rawDmg);
        if (finalDmg < 1) finalDmg = 1;

        // Apply Damage
        player.battleState.enemyHp -= finalDmg;
        battleMsg += `👊 You struck the **${player.battleState.enemyName}** for ${finalDmg} damage!\n`;

        // Check for Enemy Death
        if (player.battleState.enemyHp <= 0) {
            return resolveVictory(msg, player, battleMsg);
        }

        // Enemy Turn Resolution
        battleMsg = processEnemyTurn(player, battleMsg);
        saveDb();
        return msg.reply(battleMsg);
    }

    // ==========================================
    // 25. COMBAT ENGINE: JUTSU CASTING
    // ==========================================
    if (cmd === 'cast' || cmd === 'use') {
        if (!player.battleState) return msg.reply("⚠️ You are not in combat. Type *!shinobi patrol* to find enemies.");
        
        const jutsuName = args.slice(2).join(' ').toLowerCase();
        if (!jutsuName) return msg.reply("⚠️ Usage: *!shinobi cast [Jutsu Name]* (e.g., !shinobi cast fireball jutsu)");

        // Find Jutsu in Global DB
        const jutsuData = JUTSU_DB.find(j => j.name.toLowerCase() === jutsuName);
        if (!jutsuData) return msg.reply(`❌ **${jutsuName}** does not exist in the jutsu database.`);

        // Verify Ownership
        if (!player.inventory.jutsu || !player.inventory.jutsu.map(j=>j.toLowerCase()).includes(jutsuName)) {
            return msg.reply(`❌ You have not learned **${jutsuData.name}**.`);
        }

        // Chakra Check
        if (player.stats.chakra < jutsuData.cost) {
            return msg.reply(`⚠️ Insufficient Chakra! **${jutsuData.name}** costs ${jutsuData.cost} Chakra. You have ${player.stats.chakra}. Rest or use a pill!`);
        }

        let battleMsg = `🌀 *COMBAT LOG: TURN ${player.battleState.turnCount + 1}*\n\n`;
        player.stats.chakra -= jutsuData.cost;
        battleMsg += `✨ You cast **${jutsuData.name}**! (-${jutsuData.cost} Chakra)\n`;

        // Calculate Jutsu Damage
        let rawDmg = 0;
        if (jutsuData.type === 'ninjutsu') {
            rawDmg = jutsuData.power + (player.stats.ninjutsu * 0.5);
        } else if (jutsuData.type === 'genjutsu') {
            rawDmg = jutsuData.power + (player.stats.genjutsu * 0.6); // Genjutsu scales better but has lower base power
        } else if (jutsuData.type === 'taijutsu') {
            rawDmg = jutsuData.power + (player.stats.taijutsu * 0.4);
        }

        let finalDmg = Math.floor(rawDmg * (Math.random() * 0.2 + 0.9)); // 10% variance

        // Apply Effect Handling
        if (jutsuData.effect === "stun_2") {
            player.battleState.status.stun = 2;
            battleMsg += `⚡ The enemy is paralyzed for 2 turns!\n`;
        } else if (jutsuData.effect === "stun_3") {
            player.battleState.status.stun = 3;
            battleMsg += `⚡ The enemy is trapped in a devastating illusion for 3 turns!\n`;
        } else if (jutsuData.effect === "burn") {
            player.battleState.status.burn = 3; // 3 turns of burning
            battleMsg += `🔥 The enemy catches fire!\n`;
        } else if (jutsuData.effect === "fatal_burn") {
            player.battleState.status.burn = 5; 
            battleMsg += `⬛ Black flames ignite on the enemy! They cannot be extinguished!\n`;
        } else if (jutsuData.effect === "bleed") {
            player.battleState.status.bleed = 3;
            battleMsg += `🩸 The enemy is bleeding profusely!\n`;
        }

        if (finalDmg > 0) {
            player.battleState.enemyHp -= finalDmg;
            battleMsg += `💥 The jutsu hits for **${finalDmg}** damage!\n`;
        }

        // Check Death Before Enemy Turn
        if (player.battleState.enemyHp <= 0) {
            return resolveVictory(msg, player, battleMsg);
        }

        // Enemy Turn Resolution
        battleMsg = processEnemyTurn(player, battleMsg);
        saveDb();
        return msg.reply(battleMsg);
    }

    // ==========================================
    // 26. COMBAT ENGINE: ENEMY TURN & STATUS TICKS
    // ==========================================
    function processEnemyTurn(player, battleMsg) {
        let bs = player.battleState;
        bs.turnCount += 1;
        battleMsg += `\n-- Enemy Phase --\n`;

        // Process Status Effects First
        if (bs.status.burn > 0) {
            let burnDmg = Math.floor(bs.enemyMaxHp * 0.05); // 5% max HP damage
            bs.enemyHp -= burnDmg;
            bs.status.burn -= 1;
            battleMsg += `🔥 The enemy takes ${burnDmg} burn damage! (${bs.status.burn} turns left)\n`;
        }
        if (bs.status.bleed > 0) {
            let bleedDmg = Math.floor(bs.enemyMaxHp * 0.08); // 8% max HP damage
            bs.enemyHp -= bleedDmg;
            bs.status.bleed -= 1;
            battleMsg += `🩸 The enemy loses ${bleedDmg} HP from bleeding! (${bs.status.bleed} turns left)\n`;
        }

        // Check if status effects killed the enemy
        if (bs.enemyHp <= 0) {
            battleMsg += `💀 The enemy succumbed to their wounds!\n`;
            bs.enemyHp = 0;
            return battleMsg + `\n🏆 The enemy has fallen! Type *!shinobi attack* one last time to claim victory.`;
        }

        // Enemy Attack Logic
        if (bs.status.stun > 0) {
            bs.status.stun -= 1;
            battleMsg += `⚡ The enemy is stunned and cannot attack! (${bs.status.stun} turns left)\n`;
        } else {
            // Determine Enemy Attack Power (Variance applied)
            let enemyDmg = Math.floor(bs.enemyBaseDmg * (Math.random() * 0.4 + 0.8));
            
            // Subtract Player Defense (Rough estimation based on Max HP scaling/Armor)
            // Every 100 max HP gives 5 flat damage reduction
            let defReduction = Math.floor(player.stats.maxHp / 100) * 5;
            enemyDmg -= defReduction;
            if (enemyDmg < 1) enemyDmg = 1;

            player.stats.hp -= enemyDmg;
            battleMsg += `💢 The **${bs.enemyName}** retaliates, dealing **${enemyDmg}** damage to you!\n`;
        }

        battleMsg += `\n📊 *STATUS UPDATE:*\n`;
        battleMsg += `❤️ You: ${player.stats.hp}/${player.stats.maxHp} HP | 🌀 ${player.stats.chakra}/${player.stats.maxChakra} Chakra\n`;
        battleMsg += `🖤 Enemy: ${bs.enemyHp}/${bs.enemyMaxHp} HP\n`;

        if (player.stats.hp <= 0) {
            player.stats.hp = 0;
            player.battleState = null;
            
            // Set Hospital Timer (5 minutes lock out)
            player.hospitalTimer = Date.now() + (5 * 60000);
            
            // Map the hospital location dynamically based on village
            const villageKey = player.village.toLowerCase();
            const hospitalLoc = VILLAGE_MAPS[villageKey].find(l => l.type === "medical");
            player.location = hospitalLoc ? hospitalLoc.name : "Village Gates"; 
            
            battleMsg += `\n💀 **DEFEAT!** You have been knocked unconscious. You awaken in the hospital and must recover.`;
        }

        return battleMsg;
    }

    // ==========================================
    // 27. COMBAT ENGINE: VICTORY RESOLUTION
    // ==========================================
    function resolveVictory(msg, player, battleMsg) {
        let bs = player.battleState;
        
        // Calculate Rewards based on Enemy Max HP & Damage
       let ryoReward = Math.floor(bs.enemyMaxHp * 0.5) + Math.floor(Math.random() * 50);
	let xpReward = Math.floor(bs.enemyBaseDmg * 2) + Math.floor(Math.random() * 20);
	let premiumMsg = "";

	// Apply Rank Multipliers
	if (player.title === "Chunin") { ryoReward = Math.floor(ryoReward * 1.2); }
	if (player.title === "Jonin") { ryoReward = Math.floor(ryoReward * 1.5); }
	if (player.title === "Kage") { ryoReward = Math.floor(ryoReward * 2.0); }

	// --- FIXED PREMIUM CHECK ---
	if (player.isPremium) {
    		ryoReward = Math.floor(ryoReward * 1.4);
    		xpReward = Math.floor(xpReward * 1.4);
    		premiumMsg = "🌟 *Premium Bonus Applied! (+40%)*\n";
	}
	// ---------------------------

	// Apply Rewards to Player
	player.ryo += ryoReward;
	player.xp += xpReward;

	// Construct the Final Victory Message
	battleMsg += `\n🏆 **VICTORY!** The **${bs.enemyName}** has been defeated.\n`;
	battleMsg += `🪙 Gained: ${ryoReward} Ryo\n`;
	battleMsg += `💠 Gained: ${xpReward} XP\n`;
	if (premiumMsg !== "") {
    		battleMsg += premiumMsg;
	}

	// Level Up Check Logic (Keep your existing code below this line)


        // Level Up Check Logic
        const xpNeeded = player.level * 100;
        if (player.xp >= xpNeeded) {
            player.level += 1;
            player.stats.maxHp += 20;
            player.stats.maxChakra += 20;
            player.stats.hp = player.stats.maxHp; 
            player.stats.chakra = player.stats.maxChakra;
            battleMsg += `\n🎉 **LEVEL UP!** You are now Level ${player.level}! Health and Chakra fully restored.`;
        }

        // Clear Battle State
        player.battleState = null;
        saveDb();

        return msg.reply(battleMsg);
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 7 OF 10)
 * ============================================================================
 * Focus: Hospital & Recovery System, Equipment Engine (Weapons & Armor), 
 * and the PvP / Bounty Board System.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 6.
 * ============================================================================
 */

    // ==========================================
    // 28. HOSPITAL & RECOVERY SYSTEM
    // ==========================================
    // Intercept actions if the player is currently hospitalized
    if (player.hospitalTimer) {
        if (Date.now() < player.hospitalTimer) {
            const timeLeft = Math.ceil((player.hospitalTimer - Date.now()) / 60000);
            return msg.reply(`🏥 You are currently hospitalized and unconscious. You will wake up in **${timeLeft} minutes**.`);
        } else {
            // Timer expired, heal player to 50% and clear timer
            player.hospitalTimer = null;
            player.stats.hp = Math.floor(player.stats.maxHp * 0.5);
            saveDb();
            msg.reply("🏥 You have recovered enough to leave the hospital. Your HP is at 50%. Take it easy out there.");
        }
    }

    if (cmd === 'rest' || cmd === 'sleep') {
        if (player.battleState) return msg.reply("❌ You cannot rest while in combat!");
        
        const villageKey = player.village.toLowerCase();
        const locations = VILLAGE_MAPS[villageKey];
        const currentLocData = locations.find(l => l.name === player.location);

        if (!currentLocData || (currentLocData.type !== "safezone" && currentLocData.type !== "hub")) {
            return msg.reply("⚠️ You can only rest safely in **Safezones** or **Hubs** (like the Village Gates or Academy).");
        }

        // Fully heal HP and Chakra
        player.stats.hp = player.stats.maxHp;
        player.stats.chakra = player.stats.maxChakra;
        saveDb();

        return msg.reply("💤 You found a safe spot and rested for a few hours. Your HP and Chakra have been fully restored.");
    }

    if (cmd === 'treat' || cmd === 'hospital') {
        const villageKey = player.village.toLowerCase();
        const locations = VILLAGE_MAPS[villageKey];
        const currentLocData = locations.find(l => l.name === player.location);

        if (!currentLocData || currentLocData.type !== "medical") {
            return msg.reply("❌ You must be at the **Hospital** to receive medical treatment. Check your map.");
        }

        const healCost = Math.floor((player.stats.maxHp - player.stats.hp) * 0.5); // 0.5 Ryo per HP missing
        
        if (player.stats.hp === player.stats.maxHp) {
            return msg.reply("🩺 The medic ninja evaluates you. 'You are perfectly healthy. Stop wasting our time.'");
        }

        if (sub === 'pay') {
            if (player.ryo < healCost) return msg.reply(`❌ You need ${healCost} Ryo for full treatment. You only have ${player.ryo} Ryo.`);
            
            player.ryo -= healCost;
            player.stats.hp = player.stats.maxHp;
            player.stats.chakra = player.stats.maxChakra;
            saveDb();
            
            return msg.reply(`💉 You paid ${healCost} Ryo to the medical staff. Thanks to their Mystical Palm Jutsu, you are fully restored!`);
        }

        return msg.reply(`🩺 *HOSPITAL WARD*\n\nYour HP: ${player.stats.hp}/${player.stats.maxHp}\nTreatment Cost: **${healCost} Ryo**\n\nType *!shinobi treat pay* to be fully healed.`);
    }

    // ==========================================
    // 29. EQUIPMENT ENGINE (WEAPONS & ARMOR)
    // ==========================================
    // Ensure player has an equipment object
    if (!player.equipment) {
        player.equipment = { weapon: null, armor: null };
    }

    if (cmd === 'equip') {
        const itemName = args.slice(1).join(' ').toLowerCase();
        if (!itemName) return msg.reply("⚠️ Specify an item to equip. Example: *!shinobi equip kunai*");

        // Find item in inventory
        const invItem = player.inventory.weapons.find(w => w.name.toLowerCase() === itemName) || 
                        player.inventory.armor.find(a => a.name.toLowerCase() === itemName);

        if (!invItem) return msg.reply(`❌ You do not own a **${itemName}**.`);

        // Fetch data from Global DB (Assuming GLOBAL_SHOP_DB from Part 3 is accessible)
        const itemData = GLOBAL_SHOP_DB.find(i => i.name.toLowerCase() === itemName);
        if (!itemData) return msg.reply("❌ Item data corrupted.");

        if (itemData.type === "weapon") {
            player.equipment.weapon = itemData.name;
            saveDb();
            return msg.reply(`⚔️ You have equipped the **${itemData.name}**. Your basic attack damage will now scale with this weapon!`);
        } else if (itemData.type === "armor") {
            player.equipment.armor = itemData.name;
            // Update Max HP based on armor
            const prevArmorMaxHp = player.equipment.armorBonus || 0;
            player.equipment.armorBonus = itemData.value;
            player.stats.maxHp = (player.stats.maxHp - prevArmorMaxHp) + itemData.value;
            saveDb();
            return msg.reply(`🛡️ You have equipped the **${itemData.name}**. Max HP increased by ${itemData.value}!`);
        }
    }

    if (cmd === 'unequip') {
        const slot = sub;
        if (!slot || !["weapon", "armor"].includes(slot)) {
            return msg.reply("⚠️ Specify the slot to unequip. Example: *!shinobi unequip weapon* or *!shinobi unequip armor*");
        }

        if (!player.equipment[slot]) return msg.reply(`❌ You don't have anything equipped in your ${slot} slot.`);

        const unequippedItem = player.equipment[slot];
        player.equipment[slot] = null;

        if (slot === "armor") {
            const armorBonus = player.equipment.armorBonus || 0;
            player.stats.maxHp -= armorBonus;
            player.equipment.armorBonus = 0;
            if (player.stats.hp > player.stats.maxHp) player.stats.hp = player.stats.maxHp;
        }

        saveDb();
        return msg.reply(`✅ You have unequipped your **${unequippedItem}**.`);
    }

    // ==========================================
    // 30. BOUNTY & PVP SYSTEM (BETA)
    // ==========================================
    if (cmd === 'bounty') {
        // Collect all players who are missing-nin or have high PK (Player Kill) counts
        // For this build, we'll list players sorted by their Ryo as a pseudo-bounty target
        let bountyList = Object.values(db).sort((a, b) => b.ryo - a.ryo).slice(0, 5);

        let bountyMsg = `📜 *BINGO BOOK (GLOBAL BOUNTIES)* 📜\n\n`;
        if (bountyList.length === 0) {
            bountyMsg += `_The Bingo Book is currently empty. Peace reigns... for now._\n`;
        } else {
            bountyList.forEach((bTarget, index) => {
                let rankStr = bTarget.title || "Academy Student";
                // Bounty is calculated as 10% of their Ryo + base level scaling
                let calculatedBounty = Math.floor(bTarget.ryo * 0.1) + (bTarget.level * 500);
                bountyMsg += `**${index + 1}. ${bTarget.username}** [${bTarget.village} ${rankStr}]\n`;
                bountyMsg += ` └ 🎯 Bounty: **${calculatedBounty} Ryo** | Lvl: ${bTarget.level}\n\n`;
            });
        }
        bountyMsg += `\n⚠️ *To attack another player, type !shinobi hunt [@user]*`;
        return msg.reply(bountyMsg);
    }

    if (cmd === 'hunt') {
        if (player.battleState) return msg.reply("❌ You are already in combat!");
        
        // Ensure the location is a PvP zone (Danger or Explore zones)
        const villageKey = player.village.toLowerCase();
        const locations = VILLAGE_MAPS[villageKey];
        const currentLocData = locations.find(l => l.name === player.location);

        if (currentLocData.type === "safezone" || currentLocData.type === "medical" || currentLocData.type === "hub") {
            return msg.reply("🕊️ You cannot initiate PvP in a safe zone. You must be in an unexplored or dangerous area.");
        }

        const targetId = msg.mentions.users.first()?.id;
        if (!targetId) return msg.reply("⚠️ You must mention a player to hunt. Example: *!shinobi hunt @user*");
        if (targetId === userId) return msg.reply("❌ You cannot hunt yourself.");

        const targetPlayer = db[targetId];
        if (!targetPlayer) return msg.reply("❌ That player does not exist in the Shinobi database.");

        // Check target location and status
        if (targetPlayer.location !== player.location) {
            return msg.reply(`❌ **${targetPlayer.username}** is not in your current location (${player.location}). You must track them down.`);
        }
        if (targetPlayer.hospitalTimer) {
            return msg.reply(`❌ **${targetPlayer.username}** is currently recovering in the hospital. Have some honor.`);
        }
        if (targetPlayer.battleState) {
            return msg.reply(`❌ **${targetPlayer.username}** is already engaged in combat.`);
        }

        // Initialize PvP Battle State (Asynchronous turn-based PvP logic will be handled in Part 8)
        player.battleState = {
            isPvP: true,
            targetId: targetId,
            enemyName: targetPlayer.username,
            turnCount: 0
        };
        
        targetPlayer.battleState = {
            isPvP: true,
            targetId: userId,
            enemyName: player.username,
            turnCount: 0,
            waitingForTurn: true // Target goes second
        };

        saveDb();
        return msg.reply(`⚔️ **PVP INITIATED!** You have ambushed **${targetPlayer.username}**!\n\nIt is your turn! Type *!shinobi attack* or *!shinobi cast [jutsu]* to strike!`);
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 8 OF 10)
 * ============================================================================
 * Focus: Synchronous PvP Engine, Turn-Passing Logic, PvP Damage & Jutsu Scaling,
 * Bounty Claiming, and Target Notification via client.sendMessage.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 7.
 * Important: This block intercepts combat commands specifically for PvP.
 * ============================================================================
 */

    // ==========================================
    // 31. PVP COMBAT ENGINE: TURN MANAGEMENT
    // ==========================================
    if (player.battleState && player.battleState.isPvP) {
        
        const targetId = player.battleState.targetId;
        const targetPlayer = db[targetId];

        // Failsafe in case the opponent's data gets wiped or desyncs
        if (!targetPlayer || !targetPlayer.battleState || targetPlayer.battleState.targetId !== userId) {
            player.battleState = null;
            saveDb();
            return msg.reply("⚠️ PvP Battle desynchronized. Target lost. Combat aborted.");
        }

        // Prevent acting out of turn
        if (player.battleState.waitingForTurn && (cmd === 'attack' || cmd === 'strike' || cmd === 'cast' || cmd === 'use' || cmd === 'flee')) {
            return msg.reply(`⏳ Hold your ground! It is not your turn. Waiting for **${targetPlayer.username}** to make their move.`);
        }

        // --- PVP ATTACK (BASIC STRIKE) ---
        if (cmd === 'attack' || cmd === 'strike') {
            let battleMsg = `⚔️ *PVP COMBAT: TURN ${player.battleState.turnCount + 1}*\n\n`;
            
            // Base scaling off Taijutsu stat
            let rawDmg = player.stats.taijutsu * (Math.random() * 0.4 + 0.8);
            
            if (player.equipment && player.equipment.weapon) {
                // Add weapon scaling if equipped (Assume +15 flat for PvP balance)
                rawDmg += 15; 
                battleMsg += `🗡️ You swing your ${player.equipment.weapon} at them!\n`;
            } else {
                battleMsg += `👊 You rush in with a brutal Taijutsu combo!\n`;
            }

            let isCrit = Math.random() < 0.15; // 15% crit chance
            if (isCrit) {
                rawDmg *= 1.5;
                battleMsg += `💥 *CRITICAL HIT!*\n`;
            }

            let finalDmg = Math.floor(rawDmg);
            if (finalDmg < 1) finalDmg = 1;

            targetPlayer.stats.hp -= finalDmg;
            battleMsg += `💢 You struck **${targetPlayer.username}** for ${finalDmg} damage!\n`;

            return resolvePvPTurn(msg, player, targetPlayer, battleMsg, client);
        }

        // --- PVP JUTSU CAST ---
        if (cmd === 'cast' || cmd === 'use') {
            const jutsuName = args.slice(2).join(' ').toLowerCase();
            if (!jutsuName) return msg.reply("⚠️ Usage: *!shinobi cast [Jutsu Name]*");

            const jutsuData = JUTSU_DB.find(j => j.name.toLowerCase() === jutsuName);
            if (!jutsuData) return msg.reply(`❌ **${jutsuName}** does not exist.`);
            
            if (!player.inventory.jutsu || !player.inventory.jutsu.map(j=>j.toLowerCase()).includes(jutsuName)) {
                return msg.reply(`❌ You have not mastered **${jutsuData.name}**.`);
            }

            if (player.stats.chakra < jutsuData.cost) {
                return msg.reply(`⚠️ Insufficient Chakra! You need ${jutsuData.cost} for this jutsu.`);
            }

            let battleMsg = `🌀 *PVP COMBAT: TURN ${player.battleState.turnCount + 1}*\n\n`;
            player.stats.chakra -= jutsuData.cost;
            battleMsg += `✨ You weave signs and cast **${jutsuData.name}**! (-${jutsuData.cost} Chakra)\n`;

            // PvP Jutsu Damage Scaling
            let rawDmg = 0;
            if (jutsuData.type === 'ninjutsu') rawDmg = jutsuData.power + (player.stats.ninjutsu * 0.5);
            else if (jutsuData.type === 'genjutsu') rawDmg = jutsuData.power + (player.stats.genjutsu * 0.6);
            else if (jutsuData.type === 'taijutsu') rawDmg = jutsuData.power + (player.stats.taijutsu * 0.4);

            let finalDmg = Math.floor(rawDmg * (Math.random() * 0.2 + 0.9));
            if (finalDmg > 0) {
                targetPlayer.stats.hp -= finalDmg;
                battleMsg += `💥 The jutsu blasts **${targetPlayer.username}** for **${finalDmg}** damage!\n`;
            }

            // PvP Status Effects Application
            if (jutsuData.effect === "stun_2") {
                targetPlayer.battleState.status = targetPlayer.battleState.status || {};
                targetPlayer.battleState.status.stun = 2;
                battleMsg += `⚡ **${targetPlayer.username}** is paralyzed!\n`;
            } else if (jutsuData.effect === "burn") {
                targetPlayer.battleState.status = targetPlayer.battleState.status || {};
                targetPlayer.battleState.status.burn = 3;
                battleMsg += `🔥 **${targetPlayer.username}** is burning!\n`;
            }

            return resolvePvPTurn(msg, player, targetPlayer, battleMsg, client);
        }

        // --- PVP FLEE ---
        if (cmd === 'flee') {
            const escapeChance = Math.random() + (player.stats.taijutsu * 0.01);
            
            if (escapeChance > 0.5) {
                player.battleState = null;
                targetPlayer.battleState = null;
                saveDb();
                
                // Notify opponent via direct message
                client.sendMessage(targetId, `💨 **${player.username}** threw a smoke bomb and cowardly escaped the battle! The PvP encounter has ended.`);
                return msg.reply("💨 You successfully escaped the PvP encounter!");
            } else {
                let battleMsg = `❌ Escape failed! You tripped trying to retreat!\n`;
                // Pass turn to enemy
                return resolvePvPTurn(msg, player, targetPlayer, battleMsg, client);
            }
        }
    }

    // ==========================================
    // 32. PVP TURN RESOLUTION & DEATH HANDLING
    // ==========================================
    function resolvePvPTurn(msg, player, targetPlayer, battleMsg, discordClient) {
        
        // 1. Check if the target was killed by the attack
        if (targetPlayer.stats.hp <= 0) {
            targetPlayer.stats.hp = 0;
            
            // Apply severe PvP hospital penalty (10 minutes)
            targetPlayer.hospitalTimer = Date.now() + (10 * 60000); 
            
            // Relocate target to their village hospital
            const villageKey = targetPlayer.village.toLowerCase();
            const hospitalLoc = VILLAGE_MAPS[villageKey].find(l => l.type === "medical");
            targetPlayer.location = hospitalLoc ? hospitalLoc.name : "Village Gates";

            // Calculate Bounty / Ryo Stealing
            let stolenRyo = Math.floor(targetPlayer.ryo * 0.1); // Steal 10% of their Ryo
            targetPlayer.ryo -= stolenRyo;
            player.ryo += stolenRyo;
            
            // XP Reward based on target's level
            let xpReward = targetPlayer.level * 50;
            player.xp += xpReward;

            battleMsg += `\n💀 **${targetPlayer.username}** collapses! You have won the duel!\n`;
            battleMsg += `🏆 **PVP VICTORY!**\n💰 You looted ${stolenRyo} Ryo!\n🌟 Gained ${xpReward} XP!`;

            // Wipe battle states
            player.battleState = null;
            targetPlayer.battleState = null;
            saveDb();

            // Notify the dead player
            discordClient.sendMessage(targetPlayer.id, `💀 **DEFEAT!** You were knocked unconscious by **${player.username}**.\n💸 You lost ${stolenRyo} Ryo.\n🏥 You awaken in the hospital and cannot act for 10 minutes.`);
            
            return msg.reply(battleMsg);
        }

        // 2. Target survived. Pass the turn.
        player.battleState.turnCount += 1;
        player.battleState.waitingForTurn = true;
        targetPlayer.battleState.waitingForTurn = false;
        
        battleMsg += `\n📊 *BATTLE STATUS:*\n`;
        battleMsg += `❤️ You: ${player.stats.hp}/${player.stats.maxHp} HP\n`;
        battleMsg += `🖤 Enemy: ${targetPlayer.stats.hp}/${targetPlayer.stats.maxHp} HP\n`;
        battleMsg += `\n⏳ Turn passed to **${targetPlayer.username}**.`;

        saveDb();

        // 3. Notify the target that it is now their turn
        let targetAlert = `⚔️ **${player.username}** attacked!\n\n`;
        targetAlert += `❤️ Your HP: ${targetPlayer.stats.hp}/${targetPlayer.stats.maxHp}\n`;
        targetAlert += `🌀 Your Chakra: ${targetPlayer.stats.chakra}/${targetPlayer.stats.maxChakra}\n\n`;
        targetAlert += `It is your turn! Defend yourself:\n👊 *!shinobi attack*\n🌀 *!shinobi cast [jutsu]*\n🏃‍♂️ *!shinobi flee*`;
        
        discordClient.sendMessage(targetPlayer.id, targetAlert);

        return msg.reply(battleMsg);
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 9)
 * ============================================================================
 * Focus: Refined Eight Gates Rules (Chakra Drain, Non-Yūgao Taijutsu Class),
 * Dojutsu Activation Engine (Sharingan/Byakugan), and Numbered Multi-Buy Shop.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 8.
 * ============================================================================
 */

    // ==========================================
    // 33. REFINED EIGHT GATES MECHANIC
    // ==========================================
    if (cmd === 'gate' || cmd === 'gates') {
        // Strict Class & Clan Checks:
        // Gates are ONLY available to Taijutsu specialists who are NOT from the Yūgao clan.
        if (player.combatClass !== "Taijutsu") {
            return msg.reply("❌ Only pure **Taijutsu Specialists** can unlock the Eight Gates!");
        }
        if (player.clan === "Yugao") {
            return msg.reply("❌ Yūgao clan members utilize a distinct martial discipline and cannot open the Eight Gates.");
        }
        if (player.level < 10) {
            return msg.reply("❌ Your body is too weak. You must reach **Level 10** before your chakra pathway system can withstand opening the First Gate.");
        }

        const gateNum = parseInt(sub);
        if (isNaN(gateNum) || gateNum < 0 || gateNum > 8) {
            return msg.reply("⚠️ Specify a gate to open (1 to 8), or 0 to close them. Example: *!shinobi gate 1*");
        }

        // Deactivation
        if (gateNum === 0) {
            player.gates.active = 0;
            saveDb();
            return msg.reply("🟢 **EIGHT GATES DEACTIVATED**: Your chakra pathway system closes and returns to normal flow.");
        }

        // Level / Unlock Check
        if (gateNum > player.gates.unlocked) {
            return msg.reply(`❌ You have only unlocked up to **Gate ${player.gates.unlocked}**. Train harder or complete rank exams to open higher gates!`);
        }

        // Chakra Check
        const chakraCostPerTurn = gateNum * 15;
        if (player.stats.chakra < chakraCostPerTurn) {
            return msg.reply(`❌ Opening Gate ${gateNum} requires at least ${chakraCostPerTurn} Chakra per turn. Your chakra is currently too low!`);
        }

        player.gates.active = gateNum;
        saveDb();

        const gateNames = [
            "", "Gate of Opening", "Gate of Healing", "Gate of Life", "Gate of Pain",
            "Gate of Limit", "Gate of View", "Gate of Wonder", "Gate of Death"
        ];

        return msg.reply(
            `🔥 **${gateNames[gateNum].toUpperCase()} (GATE ${gateNum}) OPENED!** 🔥\n\n` +
            `⚡ Your Taijutsu damage and physical speed have skyrocketed!\n` +
            `🌀 Chakra Cost: **-${chakraCostPerTurn} Chakra** every combat turn.\n` +
            `⚠️ If your Chakra hits 0, the gates will force-close automatically!`
        );
    }

    // Process Eight Gates Chakra Drain inside active combat turn (Hooked into enemy turn processor)
    function applyGateChakraDrain(player) {
        if (player.gates && player.gates.active > 0) {
            const cost = player.gates.active * 15;
            player.stats.chakra -= cost;
            
            if (player.stats.chakra <= 0) {
                player.stats.chakra = 0;
                player.gates.active = 0;
                return `\n⚠️ **CHAKRA EXHAUSTION!** Your Chakra reached 0 and the Eight Gates forcefully shut down!`;
            }
            return `\n🔥 **Gate ${player.gates.active} Active**: Drained ${cost} Chakra.`;
        }
        return "";
    }

    // ==========================================
    // 34. KEKKEI GENKAI & DOJUTSU ACTIVATION
    // ==========================================
    if (!player.dojutsuState) {
        player.dojutsuState = { active: false, type: null, stage: 1 };
    }

    if (cmd === 'dojutsu' || cmd === 'activate' || cmd === 'eye') {
        if (!player.kekkeiGenkai || !["Sharingan", "Byakugan", "Mangekyou Sharingan"].includes(player.kekkeiGenkai)) {
            return msg.reply("❌ You do not possess a Dojutsu (Eye-based Kekkei Genkai).");
        }

        if (sub === 'off' || sub === 'deactivate') {
            player.dojutsuState.active = false;
            saveDb();
            return msg.reply(`👁️ You deactivated your **${player.kekkeiGenkai}**. Chakra consumption stopped.`);
        }

        // Activate Eye
        if (player.stats.chakra < 20) {
            return msg.reply("❌ You need at least 20 Chakra to activate your Dojutsu.");
        }

        player.dojutsuState.active = true;
        player.dojutsuState.type = player.kekkeiGenkai;
        saveDb();

        if (player.kekkeiGenkai === "Sharingan") {
            return msg.reply(
                `👁️ **SHARINGAN ACTIVATED!**\n\n` +
                `🔴 Your eyes turn crimson with spinning tomoe.\n` +
                `🎯 +20% Evasion & Genjutsu Damage.\n` +
                `🌀 Drains **10 Chakra** per turn.`
            );
        } else if (player.kekkeiGenkai === "Byakugan") {
            return msg.reply(
                `👁️ **BYAKUGAN ACTIVATED!**\n\n` +
                `⚪ Veins bulge around your eyes as 360-degree vision unlocks.\n` +
                `🎯 Attacks bypass enemy defense and target chakra points.\n` +
                `🌀 Drains **10 Chakra** per turn.`
            );
        } else if (player.kekkeiGenkai === "Mangekyou Sharingan") {
            return msg.reply(
                `👁️ **MANGEKYOU SHARINGAN ACTIVATED!**\n\n` +
                `☸️ Your pupil transforms into a pinwheel pattern!\n` +
                `💥 Unlocks god-tier abilities (Amaterasu / Tsukuyomi).\n` +
                `🌀 Drains **35 Chakra** per turn.`
            );
        }
    }

    // ==========================================
    // 35. NUMBERED SHOP & MULTI-BUYING SYSTEM
    // ==========================================
    if (cmd === 'shop' || cmd === 'market') {
        
        // --- DISPLAY SHOP MENU BY ID ---
        if (!sub || sub === 'list') {
            let shopMenu = `🏬 *VILLAGE MARKETPLACE* 🏬\n`;
            shopMenu += `🪙 Your Balance: **${player.ryo} Ryo** | 💎 **${player.gems} Gems**\n\n`;
            shopMenu += `*WEAPONS & EQUIPMENT:*\n`;

            SHOP_ITEMS.forEach(item => {
                shopMenu += `[#${item.id}] **${item.name}** - 🪙 ${item.price} Ryo | Class: _${item.class}_\n`;
            });

            shopMenu += `\n🛒 *HOW TO BUY:*`;
            shopMenu += `\nType *!shinobi shop buy [Item #] [Quantity]*`;
            shopMenu += `\nExample: *!shinobi shop buy 7 5* (Buys 5 Soldier Pills)`;
            
            return msg.reply(shopMenu);
        }

        // --- PURCHASE LOGIC BY ITEM ID & QUANTITY ---
        if (sub === 'buy') {
            const itemId = parseInt(actionArg || args[3]);
            const quantity = parseInt(args[4]) || 1;

            if (isNaN(itemId)) {
                return msg.reply("⚠️ Specify the item number from the shop. Example: *!shinobi shop buy 1* or *!shinobi shop buy 7 5*");
            }
            if (quantity <= 0) {
                return msg.reply("❌ Quantity must be at least 1.");
            }

            const selectedItem = SHOP_ITEMS.find(i => i.id === itemId);
            if (!selectedItem) {
                return msg.reply("❌ Invalid item ID. Type *!shinobi shop* to see available numbers.");
            }

            const totalCost = selectedItem.price * quantity;

            if (player.ryo < totalCost) {
                return msg.reply(`❌ Insufficient funds! You need 🪙 **${totalCost} Ryo** to buy ${quantity}x **${selectedItem.name}**. You have **${player.ryo} Ryo**.`);
            }

            // Deduct Ryo
            player.ryo -= totalCost;

            // Add to Player Inventory based on Category
            if (!player.inventory.weapons) player.inventory.weapons = [];
            if (!player.inventory.consumables) player.inventory.consumables = {};

            if (selectedItem.cat === "weapon") {
                for (let i = 0; i < quantity; i++) {
                    player.inventory.weapons.push({ name: selectedItem.name, classReq: selectedItem.class });
                }
            } else if (selectedItem.cat === "pill" || selectedItem.cat === "consumable") {
                player.inventory.consumables[selectedItem.name] = (player.inventory.consumables[selectedItem.name] || 0) + quantity;
            } else if (selectedItem.cat === "scroll") {
                if (!player.inventory.scrolls) player.inventory.scrolls = [];
                player.inventory.scrolls.push(selectedItem.name);
            }

            saveDb();

            return msg.reply(
                `🛍️ **PURCHASE SUCCESSFUL!**\n\n` +
                `Bought: **${quantity}x ${selectedItem.name}**\n` +
                `Spent: 🪙 **${totalCost} Ryo**\n` +
                `Remaining Ryo: 🪙 **${player.ryo} Ryo**\n\n` +
                `Type *!shinobi inventory* to view your items.`
            );
        }
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 10)
 * ============================================================================
 * Focus: Interactive Mission State Machine, Location Verification,
 * Branching Choice System (!shinobi choice [num]), Jutsu Misuse Consequences,
 * and Dynamic Reward Distribution (Ryo + Gem Rewards per Rank).
 * ============================================================================
 * Instructions: Paste this directly underneath Part 9.
 * ============================================================================
 */

    // ==========================================
    // 36. MISSION SYSTEM & SELECTION MENU
    // ==========================================
    if (cmd === 'mission' || cmd === 'quest') {
        
        // --- MISSION LIST ---
        if (!sub || sub === 'list') {
            let missionMsg = `📜 *VILLAGE MISSION BOARD* 📜\n`;
            missionMsg += `📍 Current Location: **${player.location}**\n\n`;

            MISSION_LIST.forEach(m => {
                let statusStr = (player.activeMission && player.activeMission.id === m.id) ? " 🟢 [ACTIVE]" : "";
                let gemRewardStr = m.rank === 'D' ? "1-2 Gems" : m.rank === 'C' ? "2-5 Gems" : "5-10 Gems";
                
                missionMsg += `[#${m.id}] **${m.title}** (${m.rank}-Rank)${statusStr}\n`;
                missionMsg += ` └ 📍 Location: _${m.location}_\n`;
                missionMsg += ` └ 💰 Reward: 🪙 ${m.reward} Ryo | 💎 ${gemRewardStr}\n\n`;
            });

            missionMsg += `📌 *HOW TO ACCEPT & PLAY:*\n`;
            missionMsg += `1. Type *!shinobi mission accept [Number]* (e.g. !shinobi mission accept 1)\n`;
            missionMsg += `2. If you are not at the mission location, travel there via *!shinobi travel*\n`;
            missionMsg += `3. Once at the location, type *!shinobi choice [Number]* to make interactive decisions!`;

            return msg.reply(missionMsg);
        }

        // --- ACCEPT MISSION ---
        if (sub === 'accept') {
            const mId = parseInt(actionArg || args[3]);
            if (isNaN(mId)) return msg.reply("⚠️ Specify a mission number. Example: *!shinobi mission accept 1*");

            const selectedMission = MISSION_LIST.find(m => m.id === mId);
            if (!selectedMission) return msg.reply("❌ Invalid mission ID. Check *!shinobi mission list*.");

            if (player.activeMission) {
                return msg.reply(`⚠️ You already have an active mission: **${player.activeMission.title}**. Complete or abandon it first!`);
            }

            // Set active mission
            player.activeMission = {
                id: selectedMission.id,
                title: selectedMission.title,
                rank: selectedMission.rank,
                location: selectedMission.location,
                rewardRyo: selectedMission.reward,
                stage: "accepted"
            };

            // Check location right now
            if (player.location !== selectedMission.location) {
                saveDb();
                return msg.reply(
                    `📜 **MISSION ACCEPTED: ${selectedMission.title}** (${selectedMission.rank}-Rank)\n\n` +
                    `⚠️ **LOCATION REQUIREMENT**: This mission takes place at **${selectedMission.location}**.\n` +
                    `📍 You are currently at **${player.location}**.\n\n` +
                    `👉 Type *!shinobi travel ${selectedMission.location}* to go there and begin!`
                );
            }

            // If ALREADY at location, trigger mission phase immediately
            return triggerMissionInteractiveState(msg, player);
        }

        // --- ABANDON MISSION ---
        if (sub === 'abandon') {
            if (!player.activeMission) return msg.reply("❌ You don't have any active mission to abandon.");
            const oldTitle = player.activeMission.title;
            player.activeMission = null;
            player.missionState = null;
            saveDb();
            return msg.reply(`🗑️ You abandoned the mission: **${oldTitle}**.`);
        }
    }

    // Helper function to initiate the branching decision stage
    function triggerMissionInteractiveState(msg, player) {
        if (!player.activeMission) return;
        
        const mId = player.activeMission.id;
        player.activeMission.stage = "in_progress";

        if (mId === 1) { // Rescue Lost Cat
            player.missionState = { promptId: "cat_tree", step: 1 };
            saveDb();
            return msg.reply(
                `🐱 *MISSION STARTED: RESCUE LOST CAT*\n\n` +
                `You arrive at ${player.location} and spot Tora the lost cat sitting high up on a brittle branch of an oak tree! Tora looks nervous and ready to bolt.\n\n` +
                `What will you do? Reply with your choice:\n` +
                `1️⃣ *!shinobi choice 1* - Carefully climb the tree branch.\n` +
                `2️⃣ *!shinobi choice 2* - Use cat food/lure to bring it down.\n` +
                `3️⃣ *!shinobi choice 3* - Perform a high ninja jump to snatch the cat.\n\n` +
                `⚠️ *Note:* You can also try casting a jutsu with *!shinobi cast [jutsu]*, but be careful what skill you use!`
            );
        } else if (mId === 2) { // Clean Hokage Monument
            player.missionState = { promptId: "hokage_monument", step: 1 };
            saveDb();
            return msg.reply(
                `🗿 *MISSION STARTED: CLEAN HOKAGE MONUMENT*\n\n` +
                `You stand before the massive stone faces of the Hokage covered in graffiti and dirt.\n\n` +
                `What will you do?\n` +
                `1️⃣ *!shinobi choice 1* - Scrub manually with a brush and bucket.\n` +
                `2️⃣ *!shinobi choice 2* - Use Water Style Jutsu to wash it off.\n` +
                `3️⃣ *!shinobi choice 3* - Hire academy students to help you scrub.`
            );
        } else if (mId === 3) { // Escort Merchant
            player.missionState = { promptId: "escort_merchant", step: 1 };
            saveDb();
            return msg.reply(
                `📦 *MISSION STARTED: ESCORT MERCHANT*\n\n` +
                `While escorting the merchant through the Forest of Death, two masked rogue bandits leap out from the bushes with katanas drawn!\n\n` +
                `What is your move?\n` +
                `1️⃣ *!shinobi choice 1* - Stand in front of the merchant and draw your weapon.\n` +
                `2️⃣ *!shinobi choice 2* - Cast a Genjutsu mist to confuse the bandits.\n` +
                `3️⃣ *!shinobi choice 3* - Throw a smoke bomb and run with the merchant.`
            );
        }
    }

    // ==========================================
    // 37. BRANCHING CHOICE RESOLUTION ENGINE
    // ==========================================
    if (cmd === 'choice' || cmd === 'option') {
        if (!player.activeMission || !player.missionState) {
            return msg.reply("❌ You do not have an active interactive mission decision waiting.");
        }

        const choiceNum = parseInt(sub);
        if (isNaN(choiceNum) || choiceNum < 1 || choiceNum > 3) {
            return msg.reply("⚠️ Invalid choice number. Choose *1*, *2*, or *3*.");
        }

        const mState = player.missionState;

        // --- CAT MISSION BRANCHES ---
        if (mState.promptId === "cat_tree") {
            if (choiceNum === 1) { // Climb carefully
                if (player.stats.taijutsu >= 12) {
                    return completeMissionSuccess(msg, player, 
                        `🧗 You carefully scale the brittle branches using chakra control on your feet. You grab Tora smoothly and bring her down safely!`
                    );
                } else {
                    return completeMissionFailure(msg, player,
                        `🧗 You try climbing, but a branch snaps under your weight! You crash down and Tora gets spooked and runs away!`
                    );
                }
            } else if (choiceNum === 2) { // Cat food lure
                return completeMissionSuccess(msg, player,
                    `🐟 You whip out a small dish of dried fish. Tora smells it, purrs, and cautiously climbs down right into your arms!`
                );
            } else if (choiceNum === 3) { // High Jump
                if (player.stats.taijutsu >= 25) {
                    return completeMissionSuccess(msg, player,
                        `🥷 With incredible agility, you leap 20 feet into the air, grab Tora in mid-air, and land gracefully on your feet!`
                    );
                } else {
                    return completeMissionFailure(msg, player,
                        `🥷 You leap into the air, but you miss Tora by two feet! You land hard on the dirt while Tora leaps to another tree and escapes!`
                    );
                }
            }
        }

        // --- HOKAGE MONUMENT BRANCHES ---
        if (mState.promptId === "hokage_monument") {
            if (choiceNum === 1) {
                return completeMissionSuccess(msg, player,
                    `🧽 It takes hours of hard labor, but you scrub every inch of graffiti off the Hokage's faces clean!`
                );
            } else if (choiceNum === 2) {
                if (player.stats.ninjutsu >= 20) {
                    return completeMissionSuccess(msg, player,
                        `🌊 You cast a controlled Water Stream Jutsu that blasts away all dirt without damaging the stone monument!`
                    );
                } else {
                    return completeMissionFailure(msg, player,
                        `🌊 Your water jutsu goes out of control! The pressure cracks a piece off the First Hokage's nose! The Kage council fined you!`
                    );
                }
            } else if (choiceNum === 3) {
                return completeMissionSuccess(msg, player,
                    `👦 You promise the academy kids ramen if they help. Together, you finish the job in record time!`
                );
            }
        }

        // --- ESCORT MERCHANT BRANCHES ---
        if (mState.promptId === "escort_merchant") {
            if (choiceNum === 1) {
                // Initiate combat with rogue bandit
                player.missionState = null;
                player.battleState = {
                    enemyName: "Rogue Bandit",
                    enemyHp: 150,
                    enemyMaxHp: 150,
                    enemyBaseDmg: 20,
                    turnCount: 0,
                    status: {}
                };
                saveDb();
                return msg.reply(
                    `⚔️ You draw your weapon and engage the Rogue Bandit to protect the merchant!\n\n` +
                    `🖤 Enemy: **Rogue Bandit** (150 HP)\n` +
                    `Type *!shinobi attack* or *!shinobi cast [jutsu]* to begin combat!`
                );
            } else if (choiceNum === 2) {
                if (player.stats.genjutsu >= 18) {
                    return completeMissionSuccess(msg, player,
                        `👁️ You cast a Genjutsu illusion. The bandits start striking trees thinking they are you, allowing you and the merchant to slip away safely!`
                    );
                } else {
                    return completeMissionFailure(msg, player,
                        `👁️ Your Genjutsu fails! The bandits laugh and ambush you while your hands are bound in handseals!`
                    );
                }
            } else if (choiceNum === 3) {
                return completeMissionSuccess(msg, player,
                    `💨 You detonate a thick smoke bomb! In the confusion, you grab the merchant and sprint to safety.`
                );
            }
        }
    }

    // ==========================================
    // 38. MISSION COMPLETION & REWARD HANDLERS
    // ==========================================
    function completeMissionSuccess(msg, player, textMsg) {
        const m = player.activeMission;
        
        let ryoEarned = m.rewardRyo;
        let gemsEarned = 1;

        if (m.rank === 'D') gemsEarned = Math.floor(Math.random() * 2) + 1; // 1-2 gems
        else if (m.rank === 'C') gemsEarned = Math.floor(Math.random() * 4) + 2; // 2-5 gems
        else if (m.rank === 'B') gemsEarned = Math.floor(Math.random() * 6) + 5; // 5-10 gems

        let xpEarned = m.rank === 'D' ? 50 : m.rank === 'C' ? 150 : 350;

        player.ryo += ryoEarned;
        player.gems += gemsEarned;
        player.xp += xpEarned;

        player.activeMission = null;
        player.missionState = null;
        saveDb();

        return msg.reply(
            `${textMsg}\n\n` +
            `🎉 **MISSION COMPLETED!**\n` +
            `💰 Reward: 🪙 **${ryoEarned} Ryo** | 💎 **${gemsEarned} Gems**\n` +
            `🌟 XP Gained: **${xpEarned} XP**`
        );
	
    }

    function completeMissionFailure(msg, player, textMsg) {
        player.activeMission = null;
        player.missionState = null;
        saveDb();

        return msg.reply(
            `${textMsg}\n\n` +
            `❌ **MISSION FAILED!** You received no rewards. Better luck next time!`
        );
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 11)
 * ============================================================================
 * Focus: Clan Management & Ryo Banking, Passive Clan Buffs, 
 * and the Multi-Stage Interactive Chunin Exam System.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 10.
 * ============================================================================
 */

    // ==========================================
    // 39. CLAN ADMINISTRATION & RYO BANK
    // ==========================================
    // Initialize global clans object if it doesn't exist
    if (!global.clans) global.clans = {};

    if (cmd === 'clan') {
        if (!sub || sub === 'info') {
            if (!player.clan || player.clan === "None") {
                return msg.reply("❌ You are not in a clan. Use *!shinobi clan create [Name]* (Costs 5000 Ryo) or *!shinobi clan join [Name]*.");
            }
            
            const clanData = global.clans[player.clan];
            if (!clanData) return msg.reply("⚠️ Your clan data is corrupted or missing.");

            return msg.reply(
                `🛡️ **CLAN: ${player.clan}** (Level ${clanData.level})\n\n` +
                `👑 Leader: ${clanData.leader}\n` +
                `👥 Members: ${clanData.members.length}\n` +
                `💰 Clan Vault: 🪙 ${clanData.bank} Ryo\n\n` +
                `📈 **Clan Buff:** +${clanData.level * 5}% to all base stats for all members!\n` +
                `To contribute to the vault, type *!shinobi clan deposit [amount]*`
            );
        }

        if (sub === 'create') {
            const clanName = args.slice(2).join(" ");
            if (!clanName) return msg.reply("⚠️ Specify a clan name: *!shinobi clan create [Name]*");
            if (player.clan !== "None") return msg.reply("❌ You must leave your current clan first.");
            if (global.clans[clanName]) return msg.reply("❌ A clan with that name already exists.");
            if (player.ryo < 5000) return msg.reply("❌ Creating a clan requires 🪙 5000 Ryo.");

            player.ryo -= 5000;
            player.clan = clanName;
            
            global.clans[clanName] = {
                leader: player.username,
                members: [userId],
                level: 1,
                bank: 0
            };
            saveDb();
            return msg.reply(`🎉 You have successfully founded the **${clanName}** clan!`);
        }

        if (sub === 'join') {
            const clanName = args.slice(2).join(" ");
            if (!global.clans[clanName]) return msg.reply("❌ That clan does not exist.");
            if (player.clan !== "None") return msg.reply("❌ You are already in a clan!");

            player.clan = clanName;
            global.clans[clanName].members.push(userId);
            saveDb();
            return msg.reply(`🤝 You have successfully joined the **${clanName}** clan!`);
        }

        if (sub === 'deposit') {
            const amount = parseInt(args[2]);
            if (isNaN(amount) || amount <= 0) return msg.reply("⚠️ Specify a valid amount. Example: *!shinobi clan deposit 1000*");
            if (!player.clan || player.clan === "None" || !global.clans[player.clan]) return msg.reply("❌ You are not in a valid clan.");
            if (player.ryo < amount) return msg.reply("❌ You don't have enough Ryo.");

            player.ryo -= amount;
            const myClan = global.clans[player.clan];
            myClan.bank += amount;

            // Clan Level Up Logic (Every 10,000 Ryo = 1 Level)
            let oldLevel = myClan.level;
            myClan.level = Math.floor(myClan.bank / 10000) + 1;
            
            saveDb();

            let response = `💰 You deposited 🪙 **${amount} Ryo** into the **${player.clan}** vault.`;
            if (myClan.level > oldLevel) {
                response += `\n\n🆙 **CLAN LEVEL UP!** The ${player.clan} clan is now Level ${myClan.level}! All members receive a higher stat buff.`;
            }
            return msg.reply(response);
        }
    }

    // Apply Clan Buff Dynamically (Hook this into combat stat calculations later)
    function getClanBuffMultiplier(player) {
        if (player.clan && player.clan !== "None" && global.clans[player.clan]) {
            const clanLevel = global.clans[player.clan].level;
            return 1 + (clanLevel * 0.05); // +5% per clan level
        }
        return 1;
    }


    // ==========================================
    // 40. THE CHUNIN EXAMS (MULTI-STAGE EVENT)
    // ==========================================
    const CHUNIN_TRIVIA = [
        { q: "What is the primary chakra nature of the Uchiha Clan?", a: "fire" },
        { q: "How many gates are in the Eight Gates formation?", a: "8" },
        { q: "What is the name of the First Hokage?", a: "hashirama" }
    ];

    if (cmd === 'exam' || cmd === 'chunin') {
        if (player.rank !== "Genin") return msg.reply("❌ Only Genin can take the Chunin Exams. If you are a Chunin or higher, you have already passed.");
        if (player.level < 15) return msg.reply("❌ You must be at least **Level 15** to enter the Chunin Exams.");

        // Initialize exam state
        if (!player.examState) {
            player.examState = { stage: 0 };
        }

        // --- STAGE 0: INTRODUCTION ---
        if (player.examState.stage === 0) {
            player.examState.stage = 1;
            player.examState.questionIndex = Math.floor(Math.random() * CHUNIN_TRIVIA.length);
            saveDb();
            return msg.reply(
                `📝 **CHUNIN EXAMS: STAGE 1 (WRITTEN TEST)**\n\n` +
                `You sit in the academy classroom. Proctor Ibiki glares at you.\n` +
                `"Answer this question correctly, or fail immediately!"\n\n` +
                `**Question:** ${CHUNIN_TRIVIA[player.examState.questionIndex].q}\n\n` +
                `👉 Type *!shinobi exam answer [your answer]*`
            );
        }

        // --- STAGE 1: WRITTEN TEST (TRIVIA) ---
        if (sub === 'answer' && player.examState.stage === 1) {
            const answerStr = args.slice(2).join(" ").toLowerCase();
            const correctAns = CHUNIN_TRIVIA[player.examState.questionIndex].a.toLowerCase();

            if (answerStr.includes(correctAns)) {
                player.examState.stage = 2;
                saveDb();
                return msg.reply(
                    `✅ **CORRECT!** You passed the written exam!\n\n` +
                    `🌲 **STAGE 2: THE FOREST OF DEATH**\n` +
                    `You stand before the locked gates of the Forest of Death. You must survive a deadly encounter to obtain both the Heaven and Earth scrolls.\n\n` +
                    `👉 Type *!shinobi exam enter* when you are ready to fight!`
                );
            } else {
                player.examState = null; // Fail and reset
                saveDb();
                return msg.reply(`❌ **WRONG ANSWER!** Ibiki points to the door. "Get out. You fail."\nYou must start the exam over.`);
            }
        }

        // --- STAGE 2: FOREST OF DEATH (COMBAT) ---
        if (sub === 'enter' && player.examState.stage === 2) {
            player.examState.stage = 3;
            
            // Trigger an un-fleeable combat with an aggressive NPC
            player.battleState = {
                enemyName: "Sound Ninja Team",
                enemyHp: 300,
                enemyMaxHp: 300,
                enemyBaseDmg: 35,
                turnCount: 0,
                isExam: true, // Special flag to prevent fleeing
                status: {}
            };
            saveDb();
            
            return msg.reply(
                `🐍 **FOREST OF DEATH AMBUSH!**\n\n` +
                `A team of Sound Ninja drop from the trees and attack you for your scroll!\n` +
                `🖤 Enemy: **Sound Ninja Team** (300 HP)\n\n` +
                `*Note: You cannot flee an exam battle!*\n` +
                `👉 Type *!shinobi attack* or *!shinobi cast [jutsu]* to fight!`
            );
        }

        // --- STAGE 3: TOURNAMENT FINALS ---
        // (This triggers after the combat engine detects a win with isExam === true)
        if (sub === 'finals' && player.examState.stage === 3) {
            // Note: The logic that sets stage to 3.5 or clears battle must be in the combat engine.
            // For now, assume the user defeated the Sound Ninja and typed !shinobi exam finals
            player.examState.stage = 4;
            
            player.battleState = {
                enemyName: "Exam Proctor Neji",
                enemyHp: 500,
                enemyMaxHp: 500,
                enemyBaseDmg: 50,
                turnCount: 0,
                isExamFinals: true,
                status: {}
            };
            saveDb();

            return msg.reply(
                `🏟️ **CHUNIN EXAMS: TOURNAMENT FINALS!**\n\n` +
                `You step into the grand arena. The crowd roars. Your opponent is a Hyuga prodigy.\n` +
                `🖤 Enemy: **Exam Proctor Neji** (500 HP | 50 Dmg)\n\n` +
                `Defeat him to earn your Chunin vest!\n` +
                `👉 Type *!shinobi attack* or *!shinobi cast [jutsu]* to fight!`
            );
        }
    }

    // --- HOOKING EXAMS INTO COMBAT WIN/LOSS LOGIC ---
    // (This snippet modifies the existing combat engine win logic in Part 6)
    // If player wins and player.battleState.isExam is true:
    // player.examState.stage = 3; (Tell them to type !shinobi exam finals)
    // If player wins and player.battleState.isExamFinals is true:
    // player.rank = "Chunin";
    // player.examState = null;
    // Award 5000 Ryo, 10 Gems, and Chunin Vest.
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 12)
 * ============================================================================
 * Focus: Kuchiyose (Summoning), Player-driven Bingo Book (Bounties), 
 * and the Jinchuriki Tailed Beast System.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 11.
 * ============================================================================
 */

    // ==========================================
    // 41. KUCHIYOSE NO JUTSU (SUMMONING SYSTEM)
    // ==========================================
    if (cmd === 'contract') {
        const animal = sub ? sub.toLowerCase() : null;
        const validAnimals = ['toad', 'snake', 'slug'];

        if (!animal || !validAnimals.includes(animal)) {
            return msg.reply(
                `📜 **SUMMONING CONTRACTS**\n` +
                `You must sign a blood contract to summon a creature in battle.\n\n` +
                `🐸 **Toad** - Heavy physical damage and block chance.\n` +
                `🐍 **Snake** - High evasion and applies deadly poison.\n` +
                `🐌 **Slug** - Passive HP healing and chakra restoration.\n\n` +
                `*Command: !shinobi contract [toad/snake/slug]*\n` +
                `⚠️ *Note: You can only sign ONE contract.*`
            );
        }

        if (player.summonContract) {
            return msg.reply(`❌ You have already signed a blood contract with the **${player.summonContract}**!`);
        }

        player.summonContract = animal.charAt(0).toUpperCase() + animal.slice(1);
        saveDb();
        return msg.reply(`🩸 You bite your thumb and press it against the scroll. You have forged a blood contract with the **${player.summonContract}**!`);
    }

    if (cmd === 'summon') {
        if (!player.battleState) {
            return msg.reply("❌ You can only summon creatures during combat!");
        }
        if (!player.summonContract) {
            return msg.reply("❌ You have not signed a summoning contract yet. Use *!shinobi contract* first.");
        }
        if (player.battleState.activeSummon) {
            return msg.reply(`⚠️ Your **${player.summonContract}** is already on the battlefield!`);
        }
        if (player.stats.chakra < 50) {
            return msg.reply("❌ Kuchiyose no Jutsu requires at least 50 Chakra!");
        }

        // Deduct Chakra and set active summon
        player.stats.chakra -= 50;
        player.battleState.activeSummon = {
            type: player.summonContract,
            duration: 3 // Lasts for 3 combat turns
        };
        saveDb();

        let summonMsg = `💥 **KUCHIYOSE NO JUTSU!** A massive cloud of smoke erupts on the battlefield!\n`;
        if (player.summonContract === "Toad") summonMsg += `🐸 A giant warrior Toad lands, wielding a massive blade!`;
        if (player.summonContract === "Snake") summonMsg += `🐍 A colossal Snake slithers from the smoke, hissing fiercely!`;
        if (player.summonContract === "Slug") summonMsg += `🐌 A giant Slug appears, radiating a soothing healing chakra!`;

        return msg.reply(summonMsg);
    }

    // Process Summon Effects (Hook this into the turn-based engine)
    function applySummonEffects(player, enemy) {
        if (!player.battleState || !player.battleState.activeSummon) return "";
        
        const summon = player.battleState.activeSummon;
        summon.duration -= 1;
        
        let effectLog = "\n";
        if (summon.type === "Toad") {
            const dmg = 25;
            enemy.hp -= dmg;
            effectLog += `🐸 Your Toad slashed the enemy for **${dmg} Damage**!`;
        } else if (summon.type === "Snake") {
            const dmg = 15;
            enemy.hp -= dmg;
            enemy.status = enemy.status || {};
            enemy.status.poisoned = 3; // 3 turns of poison
            effectLog += `🐍 Your Snake bit the enemy, dealing **${dmg} Damage** and applying Poison!`;
        } else if (summon.type === "Slug") {
            const heal = 25;
            player.hp = Math.min(player.maxHp, player.hp + heal);
            effectLog += `🐌 Your Slug dispersed healing chakra, restoring **${heal} HP**!`;
        }

        if (summon.duration <= 0) {
            player.battleState.activeSummon = null;
            effectLog += `\n💨 *Poof!* Your summon has run out of chakra and returned to its realm.`;
        }
        return effectLog;
    }


    // ==========================================
    // 42. THE BINGO BOOK (GLOBAL BOUNTY SYSTEM)
    // ==========================================
    if (!global.bingoBook) global.bingoBook = {};

    if (cmd === 'bounty' || cmd === 'bingobook') {
        if (!sub || sub === 'list') {
            let bookMsg = `📖 **THE BINGO BOOK** 📖\n*A global ledger of rogue shinobi and targets.*\n\n`;
            let hasBounties = false;

            for (const [targetName, amount] of Object.entries(global.bingoBook)) {
                if (amount > 0) {
                    bookMsg += `🎯 **${targetName}** - Reward: 🪙 **${amount} Ryo**\n`;
                    hasBounties = true;
                }
            }

            if (!hasBounties) bookMsg += `*No targets currently have a bounty.*`;
            bookMsg += `\n\nTo place a bounty, use: *!shinobi bounty add [username] [amount]*`;
            return msg.reply(bookMsg);
        }

        if (sub === 'add') {
            const targetName = args[2];
            const amount = parseInt(args[3]);

            if (!targetName || isNaN(amount) || amount <= 0) {
                return msg.reply("⚠️ Usage: *!shinobi bounty add [username] [amount]*");
            }
            if (targetName.toLowerCase() === player.username.toLowerCase()) {
                return msg.reply("❌ You cannot place a bounty on yourself.");
            }
            if (player.ryo < amount) {
                return msg.reply(`❌ You do not have enough Ryo. You only have 🪙 ${player.ryo} Ryo.`);
            }

            // Deduct from player, add to global bingo book
            player.ryo -= amount;
            if (!global.bingoBook[targetName]) global.bingoBook[targetName] = 0;
            global.bingoBook[targetName] += amount;
            saveDb(); // Assuming global objects are serialized into the main JSON DB

            return msg.reply(`💀 **BOUNTY POSTED:** You have placed a 🪙 **${amount} Ryo** bounty on **${targetName}**! They are now listed in the Bingo Book.`);
        }
    }

    // PvP Hook Note: When Player A defeats Player B in !shinobi duel, the engine will check:
    // if (global.bingoBook[PlayerB.username] > 0) { 
    // PlayerA.ryo += global.bingoBook[PlayerB.username]; 
    // global.bingoBook[PlayerB.username] = 0;
    // }


    // ==========================================
    // 43. JINCHURIKI & TAILED BEAST CLOAK
    // ==========================================
    // Note: Beasts should be granted by server admins or ultra-rare events.
    if (cmd === 'cloak' || cmd === 'bijuu') {
        if (!player.tailedBeast || player.tailedBeast === 0) {
            return msg.reply("❌ You do not possess a Tailed Beast inside you. You are not a Jinchuriki.");
        }

        const requestedTails = parseInt(sub);
        
        if (sub === 'off') {
            if (player.bijuuCloak) {
                player.bijuuCloak = 0;
                saveDb();
                return msg.reply(`🔴 Your red chakra recedes back into your seal. The Tailed Beast cloak dissipates.`);
            }
            return msg.reply("Your cloak is already off.");
        }

        if (isNaN(requestedTails) || requestedTails < 1 || requestedTails > player.tailedBeast) {
            return msg.reply(`⚠️ Specify a number of tails to manifest (1 to ${player.tailedBeast}), or 'off'. Example: *!shinobi cloak 1*`);
        }

        player.bijuuCloak = requestedTails;
        
        // Massive instant heal and chakra spike upon activation
        const chakraSurge = requestedTails * 100;
        player.stats.chakra += chakraSurge;
        saveDb();

        return msg.reply(
            `🦊 **TAILED BEAST CLOAK: ${requestedTails} TAILS ACTIVATED!** 🦊\n\n` +
            `Thick, bubbling red chakra violently erupts from your body, forming ${requestedTails} tails behind you!\n` +
            `🔥 **Damage Multiplier:** +${requestedTails * 20}%\n` +
            `🌀 **Chakra Surge:** +${chakraSurge} instantly!\n` +
            `⚠️ **Warning:** The corrosive chakra will drain **${requestedTails * 5} HP** per turn!`
        );
    }

    // Process Bijuu Cloak Drain (Hook this into the turn-based engine)
    function applyBijuuCloakEffects(player) {
        if (player.bijuuCloak && player.bijuuCloak > 0) {
            const hpDrain = player.bijuuCloak * 5;
            player.hp -= hpDrain;
            
            let log = `\n🦊 **Bijuu Cloak**: The corrosive red chakra burns you for **${hpDrain} HP**!`;
            
            if (player.hp <= 0) {
                player.hp = 1; // Cannot die purely from cloak, drops to 1
                player.bijuuCloak = 0;
                log += `\n⚠️ Your body can no longer handle the Tailed Beast chakra! The cloak forcefully shatters!`;
            }
            return log;
        }
        return "";
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 13)
 * ============================================================================
 * Focus: Expanded Dynamic Summoning (Shop/Mission unlocks), 
 * Tailed Beast Hunt/Capture Missions, and the PvP Matchmaking Initializer.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 12.
 * ============================================================================
 */

    // ==========================================
    // 41-B. DYNAMIC SUMMONING SYSTEM (UPDATED)
    // ==========================================
    // Players can now unlock multiple summons via shop, missions, or events.
    if (!player.unlockedSummons) {
        player.unlockedSummons = []; // Array of string names e.g., ["Ninja Hound", "Giant Falcon"]
    }

    if (cmd === 'summon') {
        const summonName = args.slice(1).join(" ").toLowerCase();

        if (!player.battleState && !player.pvpState) {
            return msg.reply("❌ You can only summon creatures during combat!");
        }

        if (!summonName) {
            let summonListMsg = `📜 **YOUR SUMMONING SCROLLS** 📜\n`;
            if (player.summonContract) summonListMsg += `🩸 Blood Contract: **${player.summonContract}**\n`;
            
            if (player.unlockedSummons.length > 0) {
                summonListMsg += `\n📦 Inventory Summons:\n`;
                player.unlockedSummons.forEach(s => summonListMsg += ` - **${s}**\n`);
            } else {
                summonListMsg += `\n*You have no extra summoning scrolls. Find them in missions or the shop!*`;
            }
            summonListMsg += `\n👉 To summon, type: *!shinobi summon [Name]*`;
            return msg.reply(summonListMsg);
        }

        // Check if player owns the requested summon
        const hasBloodContract = player.summonContract && player.summonContract.toLowerCase() === summonName;
        const hasInventorySummon = player.unlockedSummons.find(s => s.toLowerCase() === summonName);

        if (!hasBloodContract && !hasInventorySummon) {
            return msg.reply(`❌ You do not have a contract or scroll for "${summonName}".`);
        }

        if (player.stats.chakra < 50) {
            return msg.reply("❌ Kuchiyose no Jutsu requires at least 50 Chakra!");
        }

        // Deduct Chakra and set active summon
        player.stats.chakra -= 50;
        const activeSummonName = hasInventorySummon ? hasInventorySummon : player.summonContract;
        
        let state = player.battleState || player.pvpState; // Works in both PvE and PvP
        state.activeSummon = {
            name: activeSummonName,
            duration: 3 // Lasts 3 turns
        };
        saveDb();

        return msg.reply(`💥 **KUCHIYOSE NO JUTSU!** You slam your hand on the ground! A massive cloud of smoke erupts, and **${activeSummonName}** appears on the battlefield!`);
    }

    // ==========================================
    // 44. TAILED BEAST (BIJUU) CAPTURE MISSIONS
    // ==========================================
    // These are ultra-hard, server-wide raid events or rare tracking missions.
    
    // Define the Tailed Beasts
    const BIJUU_DATA = {
        1: { name: "Shukaku (1-Tail)", hp: 5000, dmg: 100, reqLevel: 40 },
        2: { name: "Matatabi (2-Tails)", hp: 6000, dmg: 120, reqLevel: 45 },
        3: { name: "Isobu (3-Tails)", hp: 7000, dmg: 140, reqLevel: 50 },
        // ... expands up to 9
        9: { name: "Kurama (9-Tails)", hp: 15000, dmg: 300, reqLevel: 80 }
    };

    if (cmd === 'hunt' && sub === 'bijuu') {
        const targetTails = parseInt(args[2]);
        if (isNaN(targetTails) || targetTails < 1 || targetTails > 9) {
            return msg.reply("⚠️ Specify which beast you are tracking. Example: *!shinobi hunt bijuu 1* (for Shukaku).");
        }

        const bijuu = BIJUU_DATA[targetTails];
        
        if (player.level < bijuu.reqLevel) {
            return msg.reply(`❌ You are too weak to track **${bijuu.name}**. You must be at least Level ${bijuu.reqLevel}.`);
        }
        if (player.activeMission) {
            return msg.reply("❌ Finish your current mission before attempting a Bijuu Hunt.");
        }

        // Initialize the epic boss battle
        player.battleState = {
            enemyName: bijuu.name,
            enemyHp: bijuu.hp,
            enemyMaxHp: bijuu.hp,
            enemyBaseDmg: bijuu.dmg,
            turnCount: 0,
            isBijuuCapture: targetTails, // Special flag for the combat engine
            status: {}
        };
        saveDb();

        return msg.reply(
            `🌪️ **BIJUU HUNT INITIATED!** 🌪️\n\n` +
            `You tracked the massive chakra signature to a desolate wasteland. The ground shakes violently as **${bijuu.name}** rises before you!\n\n` +
            `🖤 Boss: **${bijuu.name}** (${bijuu.hp} HP | ${bijuu.dmg} Dmg)\n` +
            `⚠️ *Warning: If you defeat it, you will seal it within yourself and become a Jinchuriki! If you lose, you will drop a massive amount of XP/Ryo.*\n\n` +
            `👉 Type *!shinobi attack* or *!shinobi cast [jutsu]* to fight for your life!`
        );
    }

    // Hooking Bijuu Capture into Combat Engine (Logic to add to Part 6's win condition)
    /* 
       if (player.battleState.isBijuuCapture) {
           const tails = player.battleState.isBijuuCapture;
           player.tailedBeast = tails; // Player is now a Jinchuriki!
           player.maxHp += (tails * 200); // Massive permanent HP boost
           player.stats.maxChakra += (tails * 500); // Massive permanent Chakra boost
           msg.reply(`🔗 **SEALING JUTSU SUCCESSFUL!** You have defeated and sealed ${tails}-Tails into your body! You are now a Jinchuriki! Use !shinobi cloak to harness its power.`);
       }
    */

    // ==========================================
    // 45. TRUE PVP MATCHMAKING (DUELS)
    // ==========================================
    if (!global.pvpRequests) global.pvpRequests = {};
    if (!global.activePvP) global.activePvP = {};

    if (cmd === 'duel') {
        const targetMention = msg.mentions.users.first();
        if (!targetMention) return msg.reply("⚠️ You must mention a player to duel. Example: *!shinobi duel @Naruto*");
        if (targetMention.id === userId) return msg.reply("❌ You cannot duel yourself.");

        // Target must be registered in the DB
        const targetPlayer = readDb()[targetMention.id];
        if (!targetPlayer) return msg.reply("❌ That player has not started their ninja journey yet.");

        // Create a duel request
        global.pvpRequests[targetMention.id] = {
            challengerId: userId,
            challengerName: player.username,
            timestamp: Date.now()
        };

        return msg.reply(
            `⚔️ **DUEL REQUEST SENT!**\n` +
            `${player.username} has challenged <@${targetMention.id}> to a shinobi battle!\n` +
            `<@${targetMention.id}>, type *!shinobi accept* to begin the fight!`
        );
    }

    if (cmd === 'accept') {
        const request = global.pvpRequests[userId];
        if (!request) return msg.reply("❌ You have no pending duel requests.");
        
        // Timeout check (requests expire after 5 minutes)
        if (Date.now() - request.timestamp > 300000) {
            delete global.pvpRequests[userId];
            return msg.reply("⏳ That duel request has expired.");
        }

        const challengerId = request.challengerId;
        const challengerData = readDb()[challengerId];

        // Create the active PvP session
        const pvpSessionId = `${challengerId}_${userId}`;
        
        global.activePvP[pvpSessionId] = {
            p1: { id: challengerId, hp: challengerData.hp, chakra: challengerData.stats.chakra, name: challengerData.username },
            p2: { id: userId, hp: player.hp, chakra: player.stats.chakra, name: player.username },
            turn: challengerId, // Challenger goes first
            log: []
        };

        // Attach session ID to both players
        player.pvpSession = pvpSessionId;
        challengerData.pvpSession = pvpSessionId;
        
        delete global.pvpRequests[userId];
        saveDb(); // Save challenger's new state

        return msg.reply(
            `🔥 **PVP BATTLE STARTED!** 🔥\n\n` +
            `**${challengerData.username}** VS **${player.username}**\n\n` +
            `It is **${challengerData.username}**'s turn!\n` +
            `👉 Use *!shinobi pvp attack* or *!shinobi pvp cast [jutsu]*`
        );
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 14)
 * ============================================================================
 * Focus: Path Specializations (ANBU & Shadow Hokage, Rogue & Akatsuki),
 * Specialized Mission Boards, and S-Rank Bijuu Capture Restrictions.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 13.
 * ============================================================================
 */

    // ==========================================
    // 46. PATH SPECIALIZATION & PROMOTION SYSTEM
    // ==========================================
    if (cmd === 'path' || cmd === 'spec') {
        const choice = sub ? sub.toLowerCase() : null;

        if (!choice) {
            return msg.reply(
                `🧭 **SHINOBI PATH SPECIALIZATION** 🧭\n\n` +
                `As you grow stronger, your path diverges:\n` +
                `1️⃣ **ANBU Black Ops** (Requires Level 40+ & Chunin/Jonin) - Leads to the **Shadow Hokage** route.\n` +
                `2️⃣ **Elite Jonin** (Requires Level 40+ & Jonin) - Direct line to Village Leadership.\n` +
                `3️⃣ **Rogue Shinobi** (Requires Level 30+) - Abandon the village for forbidden freedom.\n\n` +
                `👉 Choose your path: *!shinobi path anbu*, *!shinobi path jonin*, or *!shinobi path rogue*`
            );
        }

        if (choice === 'anbu') {
            if (player.level < 40) return msg.reply("❌ You must be at least Level 40 to join the ANBU Black Ops.");
            if (player.factionPath && player.factionPath !== "Village") return msg.reply("❌ Rogue shinobi cannot join the ANBU.");
            
            player.factionPath = "Village";
            player.subPath = "ANBU";
            saveDb();
            return msg.reply(
                `🎭 **PATH CHOSEN: ANBU BLACK OPS**\n` +
                `You don the porcelain mask and cloak. You now answer directly to the shadows of the village.\n` +
                `*Unlocked: ANBU covert mission board and the path to Shadow Hokage!*`
            );
        }

        if (choice === 'jonin') {
            if (player.level < 40) return msg.reply("❌ You must be at least Level 40 to become an Elite Jonin.");
            if (player.factionPath && player.factionPath !== "Village") return msg.reply("❌ Rogue shinobi cannot become Elite Jonin.");
            
            player.factionPath = "Village";
            player.subPath = "EliteJonin";
            saveDb();
            return msg.reply(
                `🛡️ **PATH CHOSEN: ELITE JONIN**\n` +
                `You become a pillar of village defense, commanding respect and leading high-tier operations.`
            );
        }

        if (choice === 'rogue') {
            if (player.level < 30) return msg.reply("❌ You must be at least Level 30 to abandon your village.");
            
            player.factionPath = "Rogue";
            player.subPath = "RogueNinja";
            player.clan = "None"; // Leaves village clan
            saveDb();
            return msg.reply(
                `🗡️ **PATH CHOSEN: ROGUE SHINOBI**\n` +
                `You slash your village headband. You are now a target of the Bingo Book, but you operate under your own rules.\n` +
                `*Unlocked: Rogue mission board. Reach Level 50 to unlock the Akatsuki path!*`
            );
        }
    }

    // --- AKATSUKI UPGRADE FOR ROGUE SHINOBI ---
    if (cmd === 'akatsuki' || cmd === 'joinakatsuki') {
        if (player.factionPath !== "Rogue") return msg.reply("❌ Only Rogue Shinobi can seek out the Akatsuki.");
        if (player.level < 50) return msg.reply("❌ You must be at least Level 50 to be scouted by the Akatsuki.");
        if (player.subPath === "Akatsuki") return msg.reply("⚠️ You are already a member of the Akatsuki.");

        player.subPath = "Akatsuki";
        saveDb();
        return msg.reply(
            `☁️ **AKATSUKI INDUCTION COMPLETE** ☁️\n` +
            `A mysterious figure in a black cloak with red clouds hands you a ring engraved with kanji. You have joined the Akatsuki.\n` +
            `*Unlocked: Akatsuki mission board and S-Rank Tailed Beast Capture privileges!*`
        );
    }

    // --- SHADOW HOKAGE ROUTE ---
    if (cmd === 'shadowhokage' || cmd === 'shadowkage') {
        if (player.subPath !== "ANBU") return msg.reply("❌ Only high-ranking ANBU members can walk the path of the Shadow Hokage.");
        if (player.level < 70) return msg.reply("❌ You must be at least Level 70 to claim the Shadow Hokage mantle.");

        player.title = "Shadow Hokage";
        saveDb();
        return msg.reply(
            `🌑 **TITLE ACHIEVED: SHADOW HOKAGE** 🌑\n` +
            `While the official Hokage rules the light, you pull the strings from the absolute dark. Your word is law across the hidden village! All stats permanently increased by +50%.`
        );
    }


    // ==========================================
    // 47. SPECIALIZED MISSION BOARDS & S-RANK BIJUU MISSIONS
    // ==========================================
    // Overriding / Expanding the Mission List based on Path & SubPath
    if (cmd === 'mission' || cmd === 'quest') {
        if (sub === 'list' || !sub) {
            let missionMsg = `📜 *SPECIALIZED MISSION BOARD* 📜\n`;
            missionMsg += `📍 Current Location: **${player.location}**\n`;
            missionMsg += `🧭 Faction/Path: **${player.factionPath || "Village"} (${player.subPath || "Genin/Standard"})**\n\n`;

            // Filter missions based on user path
            let availableMissions = [...MISSION_LIST];

            if (player.subPath === "ANBU") {
                availableMissions.push(
                    { id: 101, title: "Assassinate Rogue Cell", rank: "A", location: "Land of Rain", reward: 8000 },
                    { id: 102, title: "Classified Infiltration", rank: "S", location: "Land of Sound", reward: 15000 }
                );
            } else if (player.factionPath === "Rogue" && player.subPath !== "Akatsuki") {
                availableMissions = [
                    { id: 201, title: "Raid Merchant Caravan", rank: "C", location: "Land of Fire", reward: 1200 },
                    { id: 202, title: "Sabotage Border Gate", rank: "B", location: "Land of Wind", reward: 3500 },
                    { id: 203, title: "Assassinate Defector", rank: "A", location: "Land of Water", reward: 7000 }
                ];
            } else if (player.subPath === "Akatsuki") {
                availableMissions = [
                    { id: 301, title: "Extract Jinchuriki Host", rank: "S", location: "Hidden Waterfall", reward: 20000 },
                    { id: 302, title: "Hunt Bingo Book Target", rank: "S", location: "Land of Iron", reward: 25000 }
                ];
            }

            // S-Rank Tailed Beast Capture Missions (Only for Akatsuki or Elite Jonin Level 60+)
            if (player.level >= 60 && (player.subPath === "Akatsuki" || player.subPath === "EliteJonin")) {
                availableMissions.push(
                    { id: 999, title: "S-Rank: Capture Tailed Beast (Bijuu Hunt)", rank: "S", location: "Wasteland", reward: 50000 }
                );
            }

            availableMissions.forEach(m => {
                missionMsg += `[#${m.id}] **${m.title}** (${m.rank}-Rank)\n`;
                missionMsg += ` └ 📍 Location: _${m.location}_\n`;
                missionMsg += ` └ 💰 Reward: 🪙 ${m.reward} Ryo\n\n`;
            });

            missionMsg += `👉 Accept using: *!shinobi mission accept [Number]*`;
            return msg.reply(missionMsg);
        }
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 15)
 * ============================================================================
 * Focus: True Synchronous PvP Action Engine, Turn Switching, 
 * and Bingo Book Bounty Claiming Execution.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 14.
 * ============================================================================
 */

    // ==========================================
    // 48. TRUE PVP COMBAT ENGINE (ACTION PROCESSOR)
    // ==========================================
    if (cmd === 'pvp') {
        if (!player.pvpSession || !global.activePvP[player.pvpSession]) {
            return msg.reply("❌ You are not currently in an active PvP battle.");
        }

        const session = global.activePvP[player.pvpSession];
        const isP1 = session.p1.id === userId;
        const myState = isP1 ? session.p1 : session.p2;
        const enemyState = isP1 ? session.p2 : session.p1;
        
        // Fetch full DB data for the enemy to apply persistent changes (like HP loss/Death)
        const allPlayers = readDb();
        const enemyData = allPlayers[enemyState.id];

        if (!enemyData) return msg.reply("⚠️ Error: Enemy data could not be found.");

        if (session.turn !== userId) {
            return msg.reply(`⏳ It is not your turn. Waiting for **${enemyState.name}** to make their move...`);
        }

        let combatLog = `⚔️ **${myState.name}'s Turn!**\n`;
        let rawDamage = 0;
        let actionValid = false;

        // --- PVP BASIC ATTACK ---
        if (sub === 'attack') {
            rawDamage = Math.floor(player.stats.taijutsu * 1.5) + Math.floor(Math.random() * 10);
            combatLog += `👊 You lunge forward with a barrage of Taijutsu strikes, dealing **${rawDamage} Damage**!\n`;
            actionValid = true;
        }

        // --- PVP JUTSU CASTING ---
        else if (sub === 'cast') {
            const jutsuName = args.slice(2).join(" ").toLowerCase();
            if (!jutsuName) return msg.reply("⚠️ Specify a jutsu to cast: *!shinobi pvp cast [Jutsu Name]*");

            // Check if player knows the jutsu
            const knowsJutsu = player.inventory.jutsu && player.inventory.jutsu.some(j => j.toLowerCase() === jutsuName);
            if (!knowsJutsu) return msg.reply(`❌ You haven't mastered "${jutsuName}". Check your *!shinobi jutsu list*.`);

            // Fetch jutsu stats from DB
            const jutsuData = JUTSU_DB.find(j => j.name.toLowerCase() === jutsuName);
            if (!jutsuData) return msg.reply("❌ Invalid Jutsu.");

            if (player.stats.chakra < jutsuData.cost) {
                return msg.reply(`❌ Not enough Chakra! (Requires ${jutsuData.cost}, you have ${player.stats.chakra})`);
            }

            // Pay cost and calculate damage
            player.stats.chakra -= jutsuData.cost;
            myState.chakra = player.stats.chakra; // Update session state

            // Damage scaling based on jutsu type
            let modifier = 1.0;
            if (jutsuData.type === "ninjutsu") modifier = player.stats.ninjutsu / 10;
            if (jutsuData.type === "genjutsu") modifier = player.stats.genjutsu / 10;
            if (jutsuData.type === "taijutsu") modifier = player.stats.taijutsu / 10;

            rawDamage = Math.floor(jutsuData.power * modifier) + 10;
            combatLog += `🌀 You weave hand signs and cast **${jutsuData.name}**, dealing **${rawDamage} Damage**!\n`;
            actionValid = true;
        }

        // --- PVP FLEE (COWARDICE) ---
        else if (sub === 'flee') {
            // Fleeing PvP costs you a huge amount of Ryo and gives it to the enemy
            const cowardPenalty = Math.floor(player.ryo * 0.1); // Lose 10% of total wealth
            player.ryo -= cowardPenalty;
            enemyData.ryo += cowardPenalty;

            let cowardMsg = `💨 **MATCH FORFEIT**\n**${myState.name}** threw a smoke bomb and fled the battle like a coward!\nThey dropped 🪙 **${cowardPenalty} Ryo**, which **${enemyState.name}** picked up.`;
            
            // End session
            delete global.activePvP[player.pvpSession];
            player.pvpSession = null;
            enemyData.pvpSession = null;
            
            // In a real environment, you'd save `enemyData` specifically here
            // fs.writeFileSync('db.json', JSON.stringify(allPlayers)); 
            saveDb(); 
            
            return msg.reply(cowardMsg);
        }

        else {
            return msg.reply("⚠️ Invalid action. Use: *!shinobi pvp attack*, *!shinobi pvp cast [jutsu]*, or *!shinobi pvp flee*.");
        }

        if (actionValid) {
            // Apply passive modifiers (Bijuu cloak, Eight Gates, Summons) - Calling functions from Part 12 & 13
            // combatLog += applyBijuuCloakEffects(player);
            // combatLog += applySummonEffects(player, enemyState); // Adapting summon to hurt enemyState.hp

            // Apply Damage
            enemyState.hp -= rawDamage;
            enemyData.hp = enemyState.hp; // Sync DB with session
            
            // Check for Death / Win Condition
            if (enemyState.hp <= 0) {
                enemyState.hp = 0;
                enemyData.hp = 0; // The enemy is dead and must visit the hospital

                let winMsg = `🏆 **PVP VICTORY!** 🏆\n\n**${myState.name}** has struck the final blow, defeating **${enemyState.name}** in glorious combat!\n`;

                // --- BINGO BOOK BOUNTY CHECK ---
                if (global.bingoBook && global.bingoBook[enemyState.name] > 0) {
                    const bounty = global.bingoBook[enemyState.name];
                    player.ryo += bounty;
                    global.bingoBook[enemyState.name] = 0; // Clear the bounty
                    winMsg += `\n💀 **BOUNTY CLAIMED!**\n**${enemyState.name}** was a wanted shinobi! You collected 🪙 **${bounty} Ryo** for their head!`;
                }

                // Clean up session
                delete global.activePvP[player.pvpSession];
                player.pvpSession = null;
                enemyData.pvpSession = null;
                saveDb(); // Ensure all states are saved
                
                return msg.reply(winMsg);
            }

            // Toggle Turn
            session.turn = enemyState.id;
            session.log.push(combatLog);
            saveDb();

            combatLog += `\n❤️ **${enemyState.name}** HP: ${enemyState.hp}/${enemyData.stats.maxHp || '??'}\n`;
            combatLog += `\n👉 It is now <@${enemyState.id}>'s turn!`;
            return msg.reply(combatLog);
        }
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 16)
 * ============================================================================
 * Focus: Dojutsu Evolution Engine (Sharingan, Byakugan, Rinnegan) and
 * Active Chakra Drain Maintenance.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 15.
 * ============================================================================
 */

    // ==========================================
    // 49. DOJUTSU AWAKENING & EVOLUTION
    // ==========================================
    if (cmd === 'dojutsu') {
        if (!player.clan) {
            return msg.reply("❌ You do not belong to a clan. You cannot awaken a Dojutsu.");
        }

        // --- AWAKEN DOJUTSU ---
        if (sub === 'awaken') {
            if (player.dojutsu) return msg.reply(`⚠️ You have already awakened the **${player.dojutsu.name}**.`);

            if (player.clan === "Uchiha") {
                if (player.level < 10) return msg.reply("❌ You must be at least Level 10 to awaken the Sharingan.");
                player.dojutsu = { name: "1-Tomoe Sharingan", stage: 1, type: "Sharingan" };
                saveDb();
                return msg.reply("👁️ **DOJUTSU AWAKENED!** Under intense emotional stress, your eyes turn crimson. You have awakened the **1-Tomoe Sharingan**!");
            } 
            else if (player.clan === "Hyuga") {
                if (player.level < 10) return msg.reply("❌ You must be at least Level 10 to awaken the Byakugan.");
                player.dojutsu = { name: "Byakugan", stage: 1, type: "Byakugan" };
                saveDb();
                return msg.reply("👁️ **DOJUTSU AWAKENED!** The veins bulge around your temples. You have unlocked the all-seeing **Byakugan**!");
            }
            else {
                return msg.reply("❌ Your clan does not possess a known Dojutsu bloodline limit.");
            }
        }

        // --- EVOLVE DOJUTSU ---
        if (sub === 'evolve') {
            if (!player.dojutsu) return msg.reply("❌ You must awaken your Dojutsu first using *!shinobi dojutsu awaken*.");

            let d = player.dojutsu;

            // UCHIHA EVOLUTION LINE
            if (d.type === "Sharingan") {
                if (d.stage === 1 && player.level >= 20) {
                    d.name = "2-Tomoe Sharingan"; d.stage = 2;
                } else if (d.stage === 2 && player.level >= 30) {
                    d.name = "3-Tomoe Sharingan"; d.stage = 3;
                } else if (d.stage === 3 && player.level >= 50) {
                    d.name = "Mangekyou Sharingan"; d.stage = 4;
                } else if (d.stage === 4 && player.level >= 70) {
                    // Note: In a deeper build, this would require a specific mission or item
                    d.name = "Eternal Mangekyou Sharingan"; d.stage = 5;
                } else if (d.stage === 5 && player.level >= 100) {
                    d.name = "Rinnegan"; d.stage = 6; d.type = "Rinnegan"; // Ascends past Sharingan
                } else {
                    return msg.reply(`❌ You are not powerful enough to evolve your ${d.name} yet. Keep leveling up.`);
                }
                saveDb();
                return msg.reply(`🩸 **DOJUTSU EVOLVED!** Your ocular powers have grown! You now possess the **${d.name}**!`);
            }

            // HYUGA EVOLUTION LINE
            if (d.type === "Byakugan") {
                if (d.stage === 1 && player.level >= 80) {
                    // Requires massive level gap to achieve the lunar eye
                    d.name = "Tenseigan"; d.stage = 2; d.type = "Tenseigan";
                    saveDb();
                    return msg.reply(`✨ **DOJUTSU EVOLVED!** Your Byakugan has absorbed vast amounts of chakra, glowing with a stellar radiance. You have awakened the **Tenseigan**!`);
                } else {
                    return msg.reply(`❌ You are not powerful enough to evolve your ${d.name} yet. (Requires Level 80).`);
                }
            }
        }

        // --- ACTIVATE DOJUTSU (COMBAT TOGGLE) ---
        if (sub === 'on' || sub === 'activate') {
            if (!player.dojutsu) return msg.reply("❌ You do not possess a Dojutsu.");
            if (player.activeDojutsu) return msg.reply(`⚠️ Your **${player.dojutsu.name}** is already active.`);
            if (player.stats.chakra < 20) return msg.reply("❌ You do not have enough chakra to open your eyes.");

            player.activeDojutsu = true;
            saveDb();
            return msg.reply(`⚡ You channel chakra to your optical nerves. **${player.dojutsu.name} ACTIVATED!** (Stats boosted, Chakra will drain each turn)`);
        }

        // --- DEACTIVATE DOJUTSU ---
        if (sub === 'off' || sub === 'deactivate') {
            if (!player.activeDojutsu) return msg.reply("⚠️ Your Dojutsu is not active.");
            
            player.activeDojutsu = false;
            saveDb();
            return msg.reply(`💨 Your eyes return to normal. Dojutsu deactivated. Chakra drain stopped.`);
        }

        return msg.reply("⚠️ Usage: *!shinobi dojutsu [awaken/evolve/on/off]*");
    }

    // ==========================================
    // 50. DOJUTSU CHAKRA DRAIN & COMBAT HOOK
    // ==========================================
    // This function should be called inside your processEnemyTurn (PvE) and PvP Action Processors
    // just like the Bijuu Cloak function.

    function applyDojutsuEffects(player) {
        if (!player.activeDojutsu || !player.dojutsu) return { log: "", dmgBuff: 0, defBuff: 0 };

        let drain = 0;
        let dBuff = 0; // Damage percent increase
        let defBuff = 0; // Flat damage reduction (evasion/reading movements)
        let eyeName = player.dojutsu.name;

        // Scaling costs and buffs based on stage/type
        if (player.dojutsu.type === "Sharingan") {
            const stageMultiplier = player.dojutsu.stage; 
            drain = stageMultiplier * 5; // e.g., MS costs 20 chakra/turn
            dBuff = stageMultiplier * 10; // +40% damage for MS
            defBuff = stageMultiplier * 5; 
        } 
        else if (player.dojutsu.type === "Rinnegan") {
            drain = 50;
            dBuff = 80; // +80% damage
            defBuff = 40; 
        }
        else if (player.dojutsu.type === "Byakugan") {
            drain = 10;
            dBuff = 15;
            defBuff = 30; // Better defense/evasion than base Sharingan
        }
        else if (player.dojutsu.type === "Tenseigan") {
            drain = 45;
            dBuff = 70;
            defBuff = 50;
        }

        // Apply Drain
        player.stats.chakra -= drain;
        let log = `\n👁️ **${eyeName}**: Drained **${drain} Chakra**.`;

        // Force shutdown if out of chakra
        if (player.stats.chakra <= 0) {
            player.stats.chakra = 0;
            player.activeDojutsu = false;
            log += `\n⚠️ You ran out of chakra! Your Dojutsu forcefully deactivates!`;
        }

        return { log, dBuff, defBuff };
    }

    // Example of integrating the Buffs in combat (For reference when modifying Part 6 or Part 15):
    /*
        const eyeEffects = applyDojutsuEffects(player);
        combatLog += eyeEffects.log;
        
        // Boosting Jutsu Damage:
        let finalDamage = rawDamage * (1 + (eyeEffects.dBuff / 100));

        // Reducing Incoming Damage:
        enemyDamage -= eyeEffects.defBuff;
    */
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 17)
 * ============================================================================
 * Focus: The Eight Inner Gates, Jinchuriki Cloaks & Rampage Risk, 
 * and the Automated Bingo Book / PK Tracking System.
 * ============================================================================
 * Instructions: Paste this directly underneath Part 16.
 * ============================================================================
 */

    // ==========================================
    // 51. THE EIGHT INNER GATES (HACHIMON)
    // ==========================================
    if (cmd === 'gates' || cmd === 'gate') {
        const action = args[1]?.toLowerCase();
        const gateNum = parseInt(args[2]);

        if (action === 'close' || action === 'off') {
            if (!player.activeGate) return msg.reply("⚠️ You do not have any Gates open.");
            player.activeGate = 0;
            saveDb();
            return msg.reply("💨 You release the pressure on your chakra network. The Eight Gates are closed.");
        }

        if (action === 'open' || action === 'on') {
            if (isNaN(gateNum) || gateNum < 1 || gateNum > 8) {
                return msg.reply("⚠️ Specify which Gate to open (1-8). Example: *!shinobi gates open 3*");
            }

            // Gates require immense physical conditioning (Taijutsu scaling)
            const requiredTaijutsu = gateNum * 15; // Gate 1 = 15, Gate 8 = 120 Taijutsu base requirement
            if (player.stats.taijutsu < requiredTaijutsu) {
                return msg.reply(`❌ Your body cannot handle opening Gate ${gateNum}. You need at least ${requiredTaijutsu} Base Taijutsu.`);
            }

            player.activeGate = gateNum;
            saveDb();

            let gateMsg = `💥 **EIGHT INNER GATES: GATE ${gateNum} OPENED!**\n`;
            if (gateNum <= 2) gateMsg += `Your muscles bulge and your speed increases exponentially.`;
            else if (gateNum <= 5) gateMsg += `Your skin turns red as sweat evaporates instantly from the heat of your chakra!`;
            else if (gateNum <= 7) gateMsg += `Blue glowing aura erupts from your body! The sheer pressure cracks the ground beneath you!`;
            else if (gateNum === 8) gateMsg += `🔥 **GATE OF DEATH OPENED!** A blazing red aura of boiling blood surrounds you. You possess god-like power, but **you will die when this ends.**`;

            return msg.reply(gateMsg);
        }

        return msg.reply("⚠️ Usage: *!shinobi gates open [1-8]* or *!shinobi gates close*");
    }

    // --- EIGHT GATES COMBAT HOOK (Run inside turn processing) ---
    function applyEightGatesEffects(player) {
        if (!player.activeGate) return { log: "", dmgBuff: 0, recoil: 0 };

        const gate = player.activeGate;
        const dmgBuff = gate * 25; // Gate 1 = +25% dmg, Gate 8 = +200% dmg!
        const recoil = Math.floor(player.stats.maxHp * (gate * 0.05)); // Take 5% max HP damage per gate level

        player.stats.hp -= recoil;
        let log = `\n💥 **Gate ${gate} Recoil**: You take **${recoil} Damage** from tearing your muscle fibers.`;

        if (player.stats.hp <= 0 && gate < 8) {
            player.stats.hp = 0;
            player.activeGate = 0;
            log += `\n⚠️ Your body collapses from the strain of the Eight Gates!`;
        } else if (gate === 8 && player.stats.hp <= 0) {
            // 8th Gate lets you keep fighting with 1 HP until combat ends, then you die.
            player.stats.hp = 1; 
            log += `\n🩸 Your life force is completely burned away, but the 8th Gate holds you together for one final strike!`;
        }

        return { log, dmgBuff, recoil };
    }

    // ==========================================
    // 52. JINCHURIKI CLOAKS & RAMPAGE MECHANIC
    // ==========================================
    if (cmd === 'cloak') {
        if (!player.tailedBeast) {
            return msg.reply("❌ You do not possess a Tailed Beast. You are not a Jinchuriki.");
        }

        const action = args[1]?.toLowerCase();
        
        if (action === 'off') {
            if (!player.activeCloak) return msg.reply("⚠️ You are not using a Bijuu Cloak.");
            player.activeCloak = 0;
            saveDb();
            return msg.reply("🌪️ The boiling chakra recedes back into your seal. Cloak deactivated.");
        }

        const tails = parseInt(args[2]);
        if (isNaN(tails) || tails < 1 || tails > player.tailedBeast) {
            return msg.reply(`⚠️ Specify how many tails to manifest (1-${player.tailedBeast}). Example: *!shinobi cloak on 3*`);
        }

        player.activeCloak = tails;
        saveDb();

        let cloakMsg = `🔥 **JINCHURIKI TRANSFORMATION!**\nBubbling red chakra erupts from your body, forming **${tails} tail(s)**!`;
        if (tails >= 4) cloakMsg += `\n💀 *Warning: You have entered Version 2! Your skin is peeling away, and there is a high risk of losing control!*`;
        
        return msg.reply(cloakMsg);
    }

    // --- BIJUU CLOAK COMBAT HOOK ---
    function applyBijuuCloakEffects(player) {
        if (!player.activeCloak) return { log: "", dmgBuff: 0, defBuff: 0, chakraRegen: 0 };

        const tails = player.activeCloak;
        const dmgBuff = tails * 15; // +15% damage per tail
        const defBuff = tails * 10; // Flat damage reduction per tail
        const chakraRegen = tails * 50; // Massive chakra regeneration per turn

        let log = `\n🔥 **${tails}-Tail Cloak**: Recovered ${chakraRegen} Chakra.`;
        player.stats.chakra += chakraRegen;
        if (player.stats.chakra > player.stats.maxChakra) player.stats.chakra = player.stats.maxChakra;

        // V2 Form (4+ Tails) causes recoil damage to the host
        if (tails >= 4) {
            const burnDmg = Math.floor(player.stats.maxHp * 0.08); // 8% Max HP drain
            player.stats.hp -= burnDmg;
            log += `\n🩸 The dense chakra burns your skin! Took **${burnDmg}** Recoil Damage.`;
        }

        // Rampage Check (If player level is too low compared to tails drawn)
        const controlThreshold = tails * 15; // E.g., Need lvl 60 to safely use 4 tails
        if (player.level < controlThreshold && Math.random() < 0.2) {
            // 20% chance to go berserk if under-leveled
            player.status.berserk = true;
            log += `\n🚨 **RAMPAGE!** You lost control to the Tailed Beast! Your attacks will now hit randomly (including yourself)!`;
        }

        return { log, dmgBuff, defBuff, chakraRegen };
    }

    // ==========================================
    // 53. BINGO BOOK PK AUTOMATION (WANTED SYSTEM)
    // ==========================================
    // This function runs automatically inside the PvP Combat Engine (Part 15) when a player dies
    function handleBingoBookUpdate(killer, victim) {
        if (!global.bingoBook) global.bingoBook = {};

        // If the victim was from the same village and NOT a rogue, the killer committed treason!
        const isTreason = (killer.village === victim.village) && (victim.factionPath !== "Rogue");
        const isMurder = (victim.factionPath === "Village" || victim.factionPath === "ANBU");

        if (isTreason || (isMurder && killer.factionPath === "Rogue")) {
            // Calculate bounty increase (Scales with the level of the victim)
            const bountyIncrease = 5000 + (victim.level * 200);
            
            if (!global.bingoBook[killer.username]) {
                global.bingoBook[killer.username] = bountyIncrease;
            } else {
                global.bingoBook[killer.username] += bountyIncrease;
            }

            // Force player into Rogue status if they commit treason
            if (isTreason && killer.factionPath !== "Rogue") {
                killer.factionPath = "Rogue";
                killer.subPath = "RogueNinja";
                killer.clan = "None";
                return `\n🚨 **TREASON DETECTED!** **${killer.username}** murdered a fellow villager! They have been exiled and marked as a **Rogue Shinobi**! Bounty increased to 🪙 **${global.bingoBook[killer.username]} Ryo**!`;
            }

            return `\n💀 **BINGO BOOK UPDATED:** **${killer.username}**'s bounty has increased to 🪙 **${global.bingoBook[killer.username]} Ryo**!`;
        }
        return "";
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 18 - SYSTEMS PATCH)
 * ============================================================================
 * Focus: 5/Day Training Limit, Scroll Threshold Logic, Dojutsu Ability Unlocks,
 * and the Official Rank Promotion System.
 * ============================================================================
 * Instructions: Paste this below Part 17. 
 * (Note: The `train` and `learn` blocks here will OVERRIDE the older versions 
 * from Parts 4 and 5 if you place them at the bottom of your file).
 * ============================================================================
 */

    // ==========================================
    // 54. OVERRIDE: 5/DAY TRAINING LIMIT
    // ==========================================
    if (cmd === 'train') {
        const trainType = sub;
        
        // Date Checking for Daily Limit
        const today = new Date().toDateString();
        if (player.lastTrainingDate !== today) {
            player.lastTrainingDate = today;
            player.dailyTrainingCount = 0;
        }

        if (player.dailyTrainingCount >= 5) {
            return msg.reply("💦 **LIMIT REACHED:** Your muscles are torn and your chakra network is exhausted. You have already trained 5 times today. Rest and return tomorrow.");
        }

        if (!trainType || !["taijutsu", "ninjutsu", "genjutsu", "chakra"].includes(trainType)) {
            return msg.reply(`🏋️ *TRAINING SYSTEM (Daily Limit: ${player.dailyTrainingCount}/5)*\nUsage: *!shinobi train [taijutsu/ninjutsu/genjutsu/chakra]*`);
        }

        // Apply Training
        player.dailyTrainingCount += 1;
        
        if (trainType === "chakra") {
            player.stats.maxChakra += 5; // Flat boost
        } else {
            player.stats[trainType] += 2; // Flat boost
            player.xp += 50; 
        }

        saveDb();
        return msg.reply(`💪 *TRAINING COMPLETE (${player.dailyTrainingCount}/5)*\nYou trained your **${trainType}** intensely! Your stats have permanently increased.`);
    }

    // ==========================================
    // 55. OVERRIDE: SCROLL LEARNING & THRESHOLD LOGIC
    // ==========================================
    if (cmd === 'learn') {
        const jutsuId = sub ? sub.toUpperCase() : null;
        if (!jutsuId) return msg.reply("⚠️ Usage: *!shinobi learn [JUTSU_ID]*");

        const jutsuData = JUTSU_DB.find(j => j.id === jutsuId);
        if (!jutsuData) return msg.reply("❌ Invalid Jutsu ID.");

        if (!player.inventory.jutsu) player.inventory.jutsu = [];
        if (player.inventory.jutsu.includes(jutsuData.name)) return msg.reply("⚠️ You already know this technique.");

        // Check if player has a Scroll to reduce thresholds
        let hasScroll = player.inventory.items && player.inventory.items.includes("Jutsu Scroll");
        let thresholdModifier = hasScroll ? 0.7 : 1.0; // Scroll reduces requirement by 30%

        let reqNin = Math.floor((jutsuData.reqNinjutsu || 0) * thresholdModifier);
        let reqGen = Math.floor((jutsuData.reqGenjutsu || 0) * thresholdModifier);
        let reqTai = Math.floor((jutsuData.reqTaijutsu || 0) * thresholdModifier);

        // Validate Stats
        if (player.stats.ninjutsu < reqNin) return msg.reply(`❌ Insufficient Ninjutsu. Need ${reqNin} (Scroll modified).`);
        if (player.stats.genjutsu < reqGen) return msg.reply(`❌ Insufficient Genjutsu. Need ${reqGen} (Scroll modified).`);
        if (player.stats.taijutsu < reqTai) return msg.reply(`❌ Insufficient Taijutsu. Need ${reqTai} (Scroll modified).`);

        // Consume Scroll if used, otherwise charge Ryo
        if (hasScroll) {
            const scrollIndex = player.inventory.items.indexOf("Jutsu Scroll");
            player.inventory.items.splice(scrollIndex, 1);
            player.inventory.jutsu.push(jutsuData.name);
            saveDb();
            return msg.reply(`📜 You unrolled the Jutsu Scroll. The complex formulas made it easier to understand! You successfully learned **${jutsuData.name}**! (Scroll consumed).`);
        } else {
            if (player.ryo < 1000) return msg.reply("❌ You do not have a Jutsu Scroll, so you must pay an instructor 🪙 1000 Ryo to learn this. You are too poor.");
            player.ryo -= 1000;
            player.inventory.jutsu.push(jutsuData.name);
            saveDb();
            return msg.reply(`💴 You paid 1000 Ryo to an instructor and successfully learned **${jutsuData.name}**!`);
        }
    }

    // ==========================================
    // 56. DOJUTSU JUTSU UNLOCK LOGIC (Hook)
    // ==========================================
    // Add this helper function to be called when Dojutsu Evolves (from Part 16)
    function grantDojutsuAbilities(player, dojutsuName) {
        if (!player.inventory.jutsu) player.inventory.jutsu = [];
        let unlocked = "";

        if (dojutsuName === "Mangekyou Sharingan") {
            if (!player.inventory.jutsu.includes("Amaterasu")) {
                player.inventory.jutsu.push("Amaterasu");
                player.inventory.jutsu.push("Tsukuyomi");
                unlocked = "\n🔥 *New Jutsu Unlocked: Amaterasu & Tsukuyomi!*";
            }
        } else if (dojutsuName === "Rinnegan") {
            if (!player.inventory.jutsu.includes("Almighty Push")) {
                player.inventory.jutsu.push("Almighty Push");
                player.inventory.jutsu.push("Planetary Devastation");
                unlocked = "\n🌌 *New Jutsu Unlocked: Almighty Push & Planetary Devastation!*";
            }
        } else if (dojutsuName === "Byakugan" && player.dojutsu.stage === 1) {
             if (!player.inventory.jutsu.includes("8 Trigrams 64 Palms")) {
                player.inventory.jutsu.push("8 Trigrams 64 Palms");
                unlocked = "\n☯️ *New Jutsu Unlocked: 8 Trigrams 64 Palms!*";
            }
        }
        return unlocked;
    }

    // ==========================================
    // 57. OFFICIAL RANK PROMOTION EXAMS
    // ==========================================
    if (cmd === 'promote' || cmd === 'exam') {
        let currentRank = player.title || "Genin";

        if (currentRank === "Genin") {
            if (player.level < 20) return msg.reply("❌ You must be at least Level 20 to enter the Chunin Exams.");
            if (player.ryo < 2000) return msg.reply("❌ You need 🪙 2000 Ryo to pay the Chunin Exam entry fee.");
            
            player.ryo -= 2000;
            player.title = "Chunin";
            player.stats.maxHp += 100;
            saveDb();
            return msg.reply("🦺 **PROMOTION!** You survived the Forest of Death and won your tournament matches! You are officially a **Chunin**! Max HP increased by 100.");
        }

        if (currentRank === "Chunin") {
            if (player.level < 40) return msg.reply("❌ You must be at least Level 40 to be recommended for Jonin promotion.");
            if (player.stats.ninjutsu < 50 || player.stats.taijutsu < 50) return msg.reply("❌ You lack the balanced stats required for Jonin leadership (Require 50 Ninjutsu & 50 Taijutsu).");
            
            player.title = "Jonin";
            player.stats.maxChakra += 150;
            saveDb();
            return msg.reply("🛡️ **PROMOTION!** The Kage has recognized your elite skills. You are officially a **Jonin**! Max Chakra increased by 150.");
        }

        return msg.reply(`⚠️ You are currently a **${currentRank}**. There are no standard exams available for your rank.`);
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 19 - LORE & SYSTEMS UPDATE)
 * ============================================================================
 * Focus: Robust Command Parsing (Space/Case Fix), MS Variants Correction,
 * ANBU Tracker Ninja Mechanics, 3-Man Squad System, and Admin Commands.
 * ============================================================================
 * Instructions: The Command Parsing update goes at the VERY TOP of your 
 * message listener. The rest goes below Part 18.
 * ============================================================================
 */

    // ==========================================
    // 58. ROBUST COMMAND PARSER (REPLACE YOUR OLD LISTENER TOP)
    // ==========================================
    /* 
       Replace your current `client.on('message', async msg => {` setup with this
       to handle spaces like "! shinobi" and case insensitivity like "!SHINOBI".
    */
    client.on('message', async msg => {
        let rawBody = msg.body.trim();
        
        // Remove spaces between the exclamation mark and the command prefix
        // Converts "! shinobi admin" to "!shinobi admin"
        rawBody = rawBody.replace(/^!\s+/, '!'); 
        
        // Convert to lowercase for case-insensitive matching
        const lowerBody = rawBody.toLowerCase();

        if (!lowerBody.startsWith('!shinobi')) return;

        // Split by spaces, treating multiple spaces as a single space
        const args = lowerBody.split(/\s+/); 
        const cmd = args[1]; // The main action (e.g., 'profile', 'attack')
        const sub = args[2]; // Sub-action (e.g., 'open', 'buy')
        
        // Basic Command Suggestion / Help Prompt Hook
        const validCommands = ["profile", "mission", "explore", "train", "shop", "attack", "cast", "flee", "gates", "cloak", "dojutsu", "squad", "track", "admin"];
        
        if (cmd && !validCommands.includes(cmd)) {
            // Find closest match (simple logic)
            const suggestion = validCommands.find(c => c.startsWith(cmd.charAt(0)));
            let hint = `❌ Unknown command: *${cmd}*.`;
            if (suggestion) hint += `\nDid you mean: *!shinobi ${suggestion}*?`;
            hint += `\nType *!shinobi help* for the full command list.`;
            return msg.reply(hint);
        }

    // ==========================================
    // 59. OVERRIDE: MANGEKYOU SHARINGAN VARIANTS
    // ==========================================
    // Replace the specific Mangekyou unlock logic in Part 18's grantDojutsuAbilities
    function grantDojutsuAbilities(player, dojutsuName) {
        if (!player.inventory.jutsu) player.inventory.jutsu = [];
        let unlocked = "";

        if (dojutsuName === "Mangekyou Sharingan") {
            // Randomize MS Variant upon awakening
            const variants = ["Itachi", "Sasuke", "Obito", "Shisui"];
            const myVariant = player.dojutsu.variant || variants[Math.floor(Math.random() * variants.length)];
            player.dojutsu.variant = myVariant; // Save variant permanently

            if (myVariant === "Itachi" && !player.inventory.jutsu.includes("Amaterasu")) {
                player.inventory.jutsu.push("Amaterasu");
                player.inventory.jutsu.push("Tsukuyomi");
                unlocked = "\n🔥 *Unlocked Itachi's MS: Amaterasu & Tsukuyomi!*";
            } else if (myVariant === "Sasuke" && !player.inventory.jutsu.includes("Flame Control")) {
                player.inventory.jutsu.push("Amaterasu");
                player.inventory.jutsu.push("Flame Control");
                unlocked = "\n🔥 *Unlocked Sasuke's MS: Amaterasu & Flame Control!*";
            } else if (myVariant === "Obito" && !player.inventory.jutsu.includes("Kamui")) {
                player.inventory.jutsu.push("Kamui");
                player.inventory.jutsu.push("Kamui Warp");
                unlocked = "\n🌀 *Unlocked Obito's MS: Kamui Intangibility & Warp!*";
            } else if (myVariant === "Shisui" && !player.inventory.jutsu.includes("Kotoamatsukami")) {
                player.inventory.jutsu.push("Kotoamatsukami");
                unlocked = "\n👁️ *Unlocked Shisui's MS: Kotoamatsukami!*";
            }
        } 
        // ... (Keep the Rinnegan and Byakugan logic from Part 18 here) ...
        return unlocked;
    }

    // ==========================================
    // 60. ANBU TRACKER SYSTEM
    // ==========================================
    if (cmd === 'track') {
        if (player.factionPath !== "ANBU") {
            return msg.reply("❌ Classified Technique. Only ANBU operatives possess tracking authorization.");
        }

        const targetMention = args[2];
        if (!targetMention) return msg.reply("⚠️ Specify a target to track: *!shinobi track @user*");

        const targetId = targetMention.replace(/[^0-9]/g, '');
        const targetPlayer = db[targetId];

        if (!targetPlayer) return msg.reply("❌ No chakra signature found for that target in the Shinobi Database.");
        
        // ANBU tracking consumes Chakra
        if (player.stats.chakra < 50) return msg.reply("❌ Tracking requires 50 Chakra.");
        player.stats.chakra -= 50;
        saveDb();

        let trackMsg = `🦅 **ANBU TRACKING SQUAD DEPLOYED**\n\n`;
        trackMsg += `Tracking Chakra Signature: **${targetPlayer.username}**...\n`;
        
        if (targetPlayer.location === "Unknown" || targetPlayer.hospitalTimer) {
            trackMsg += `⚠️ Target is currently obscured or in recovery. Cannot pinpoint exact coordinates.`;
        } else {
            trackMsg += `🎯 **Target Located!**\n`;
            trackMsg += `Village: ${targetPlayer.village}\n`;
            trackMsg += `Current Sector: **${targetPlayer.location}**\n\n`;
            trackMsg += `_Tip: Travel to this location to engage them using !shinobi pvp_`;
        }

        return msg.reply(trackMsg);
    }

    // ==========================================
    // 61. 3-MAN SQUAD SYSTEM
    // ==========================================
    if (cmd === 'squad') {
        if (!global.squads) global.squads = {};
        
        const action = sub;

        if (action === 'create') {
            if (player.squad) return msg.reply(`⚠️ You are already in **Team ${player.squad}**.`);
            const squadName = args.slice(3).join(" ");
            if (!squadName) return msg.reply("⚠️ Specify a squad name: *!shinobi squad create [Name]*");
            
            global.squads[squadName] = { leader: userId, members: [userId] };
            player.squad = squadName;
            saveDb();
            return msg.reply(`👥 **Team ${squadName}** created! You are the Squad Leader. Use *!shinobi squad invite @user* to add up to 2 more members.`);
        }

        if (action === 'invite') {
            if (!player.squad || global.squads[player.squad].leader !== userId) {
                return msg.reply("❌ You must be a Squad Leader to invite members.");
            }
            if (global.squads[player.squad].members.length >= 3) {
                return msg.reply("❌ A standard Shinobi Squad cannot exceed 3 members.");
            }

            const targetId = args[3]?.replace(/[^0-9]/g, '');
            if (!targetId || !db[targetId]) return msg.reply("⚠️ Mention a valid player to invite.");
            
            const targetPlayer = db[targetId];
            if (targetPlayer.squad) return msg.reply(`❌ **${targetPlayer.username}** is already in a squad.`);

            // Direct add for this engine build (can be changed to an accept/decline prompt)
            global.squads[player.squad].members.push(targetId);
            targetPlayer.squad = player.squad;
            saveDb();
            
            return msg.reply(`✅ **${targetPlayer.username}** has been recruited to **Team ${player.squad}**! XP from Boss Fights will now be shared.`);
        }

        if (action === 'leave') {
            if (!player.squad) return msg.reply("⚠️ You are not in a squad.");
            const squadName = player.squad;
            const mySquad = global.squads[squadName];
            
            mySquad.members = mySquad.members.filter(id => id !== userId);
            player.squad = null;

            if (mySquad.members.length === 0) {
                delete global.squads[squadName]; // Disband if empty
            } else if (mySquad.leader === userId) {
                mySquad.leader = mySquad.members[0]; // Pass leadership
            }
            saveDb();
            return msg.reply(`🚶‍♂️ You have left **Team ${squadName}**.`);
        }
    }

    // ==========================================
    // 62. ADMIN COMMANDS (God Mode)
    // ==========================================
    // Replace "YOUR_PHONE_NUMBER_ID" with your actual WhatsApp ID to lock this
    const ADMIN_ID = "YOUR_PHONE_NUMBER_ID@c.us"; 

    if (cmd === 'admin') {
        if (userId !== ADMIN_ID) {
            // Secretly trap players who try to hack admin commands
            player.stats.hp = 1;
            saveDb();
            return msg.reply("⚡ **DIVINE PUNISHMENT:** You are not a god. Your HP has been reduced to 1 for attempting to use admin commands.");
        }

        const adminAction = sub;
        const targetMention = args[3];
        const targetId = targetMention ? targetMention.replace(/[^0-9]/g, '') : userId;
        const targetPlayer = db[targetId];

        if (!targetPlayer) return msg.reply("❌ Target not found.");

        if (adminAction === 'give') {
            const amount = parseInt(args[4]);
            targetPlayer.ryo += amount;
            saveDb();
            return msg.reply(`🛠️ **ADMIN:** Spawned 🪙 ${amount} Ryo for ${targetPlayer.username}.`);
        }

        if (adminAction === 'setlevel') {
            const newLevel = parseInt(args[4]);
            targetPlayer.level = newLevel;
            targetPlayer.stats.maxHp = newLevel * 20;
            targetPlayer.stats.maxChakra = newLevel * 20;
            saveDb();
            return msg.reply(`🛠️ **ADMIN:** Forced ${targetPlayer.username} to Level ${newLevel}.`);
        }

        if (adminAction === 'wipe') {
            targetPlayer.inventory = { weapons: [], armor: [], jutsu: [] };
            targetPlayer.stats = { hp: 100, maxHp: 100, chakra: 100, maxChakra: 100, ninjutsu: 10, genjutsu: 10, taijutsu: 10 };
            saveDb();
            return msg.reply(`🛠️ **ADMIN:** ${targetPlayer.username}'s stats and inventory have been entirely wiped.`);
        }
        
        return msg.reply("🛠️ Admin Tools: *give [user] [amt]*, *setlevel [user] [lvl]*, *wipe [user]*");
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 20 - MONETIZATION & HELP)
 * ============================================================================
 * Focus: Premium DM Locks, Real-Money Shops (Ryo/Gems), 
 * Admin Grant Tools, and the Master Help Menu.
 * ============================================================================
 * Instructions: Paste this below Part 19.
 * Note: The DM check MUST go at the top of your message listener, right after 
 * you load the `player` from the database.
 * ============================================================================
 */

    // ==========================================
    // 63. PREMIUM DM RESTRICTION HOOK
    // ==========================================
    /* 
       Place this right AFTER you define `const player = db[userId];` 
       at the top of your `client.on('message')` listener.
    */
    const isDirectMessage = !msg.from.includes('@g.us');
    
    // Check if Premium is expired
    if (player && player.premiumUntil && Date.now() > player.premiumUntil) {
        player.isPremium = false;
        player.premiumUntil = null;
        saveDb();
    }

    if (isDirectMessage) {
        if (userId !== ADMIN_ID && (!player || !player.isPremium)) {
            return msg.reply("🔒 **RESTRICTED ACCESS**\nOnly **Premium Shinobi** can DM the bot directly to avoid server overload. Free players must use commands inside a Group Chat.\n\nType *!shinobi premium* in a group chat to unlock DM access and get a 1.4x boost to all mission rewards!");
        }
    }

    // ==========================================
    // 64. PREMIUM MENU & REAL MONEY SHOPS
    // ==========================================
    if (cmd === 'premium' || cmd === 'donate') {
        const shopType = sub;

        if (shopType === 'ryo') {
            return msg.reply(`💰 **RYO BLACK MARKET** 💰\nPurchase Ryo directly to fund your Shinobi journey!\n
🪙 5,000 Ryo - ₦500
🪙 10,000 Ryo - ₦1,000
🪙 20,000 Ryo - ₦1,500
🪙 50,000 Ryo - ₦2,000
🪙 100,000 Ryo - ₦3,000
🪙 500,000 Ryo - ₦4,000
🪙 1,000,000 Ryo - ₦5,000
🪙 10,000,000 Ryo - ₦10,000
🪙 100,000,000 Ryo - ₦15,000

💳 **Bank:** Palmpay
🏦 **Acct:** 8077567926
👤 **Name:** Ezekiel Precious

📸 *Send the payment receipt directly to the Master Admin's DM to receive your Ryo!*`);
        }

        if (shopType === 'gems') {
            return msg.reply(`💎 **PREMIUM GEMS SHOP** 💎\nGems can be used for exclusive items and instant revives!\n
💎 100 Gems - ₦500
💎 500 Gems - ₦1,000
💎 1,000 Gems - ₦2,000
💎 10,000 Gems - ₦5,000
💎 50,000 Gems - ₦10,000

💳 **Bank:** Palmpay
🏦 **Acct:** 8077567926
👤 **Name:** Ezekiel Precious

📸 *Send the payment receipt directly to the Master Admin's DM to receive your Gems!*`);
        }

        // Default to Premium Subscription Menu
        return msg.reply(`🌟 **SHINOBI PREMIUM SUBSCRIPTION** 🌟
Unlock the ultimate ninja experience!

✨ **Premium Perks:**
1️⃣ Direct Message (DM) access to the bot.
2️⃣ **1.4x Multiplier** on ALL Mission Rewards (Ryo & XP)!

📅 **Pricing Plans:**
• 1 Week - ₦1,000 (Promo: ₦500)
• 1 Month - ₦3,000
• 2 Months - ₦6,000
• 1 Year - ₦50,000

💳 **Payment Details:**
🏦 **Bank:** Palmpay
🔢 **Acct:** 8077567926
👤 **Name:** Ezekiel Precious

📸 **HOW TO ACTIVATE:**
Make the transfer and send the receipt to the bot's DM or directly to the Master Admin. The Admin will use a command to instantly activate your Premium status!
*(Use !shinobi donate ryo or !shinobi donate gems for currency)*`);
    }

    // ==========================================
    // 65. OVERRIDE: ENHANCED ADMIN COMMANDS
    // ==========================================
    // Replace the Admin command from Part 19 with this upgraded version
    if (cmd === 'admin') {
        if (userId !== ADMIN_ID) {
            player.stats.hp = 1;
            saveDb();
            return msg.reply("⚡ **DIVINE PUNISHMENT:** You are not a god. Your HP has been reduced to 1 for attempting to use admin commands.");
        }

        const adminAction = sub;
        const targetMention = args[3];
        const targetId = targetMention ? targetMention.replace(/[^0-9]/g, '') : null;
        
        if (!targetId || !db[targetId]) return msg.reply("❌ Target not found. Mention the user.");
        const targetPlayer = db[targetId];

        if (adminAction === 'premium') {
            const days = parseInt(args[4]) || 7;
            targetPlayer.isPremium = true;
            // Add days to current time (86400000 ms per day)
            targetPlayer.premiumUntil = Date.now() + (days * 86400000); 
            saveDb();
            return msg.reply(`🌟 **ADMIN:** Granted ${days} days of Premium to **${targetPlayer.username}**!`);
        }

        if (adminAction === 'give') {
            const currencyType = args[4]?.toLowerCase();
            const amount = parseInt(args[5]);

            if (isNaN(amount)) return msg.reply("⚠️ Specify an amount.");

            if (currencyType === 'ryo') {
                targetPlayer.ryo += amount;
                saveDb();
                return msg.reply(`🛠️ **ADMIN:** Added 🪙 ${amount} Ryo to **${targetPlayer.username}**'s account.`);
            } else if (currencyType === 'gems') {
                if (!targetPlayer.gems) targetPlayer.gems = 0;
                targetPlayer.gems += amount;
                saveDb();
                return msg.reply(`🛠️ **ADMIN:** Added 💎 ${amount} Gems to **${targetPlayer.username}**'s account.`);
            } else {
                return msg.reply("⚠️ Specify 'ryo' or 'gems'. Example: *!shinobi admin give @user ryo 50000*");
            }
        }
        
        return msg.reply("🛠️ Admin Tools:\n*!shinobi admin premium @user [days]*\n*!shinobi admin give @user ryo [amt]*\n*!shinobi admin give @user gems [amt]*");
    }

    // ==========================================
    // 66. THE MASTER HELP MENU
    // ==========================================
    if (cmd === 'help') {
        const page = sub;

        if (page === 'combat') {
            return msg.reply(`⚔️ **COMBAT & ABILITIES**
*!shinobi attack [@user]* - Attack another player.
*!shinobi cast [jutsu name] [@user]* - Use a specific Jutsu.
*!shinobi flee* - Attempt to run from battle.
*!shinobi heal* - Pay Ryo at the hospital to restore HP.
*!shinobi summon [animal]* - Call your summoning animal into battle.
*!shinobi gates open [1-8]* - Open the Eight Inner Gates.
*!shinobi gates close* - Deactivate the Gates.
*!shinobi cloak on [1-9]* - Activate Bijuu Cloak (Jinchuriki only).
*!shinobi cloak off* - Deactivate Bijuu Cloak.`);
        }

        if (page === 'stats') {
            return msg.reply(`📊 **STATS & PROGRESSION**
*!shinobi profile* - View your stats, rank, and inventory.
*!shinobi train [taijutsu/ninjutsu/genjutsu/chakra]* - Train stats (5x/day limit).
*!shinobi learn [jutsu name]* - Learn a new Jutsu (Requires Jutsu Scroll or 1000 Ryo).
*!shinobi promote* - Take the exam to rank up (Chunin/Jonin).
*!shinobi dojutsu awake* - Attempt to awaken or evolve your eye.
*!shinobi dojutsu on/off* - Activate/Deactivate your Dojutsu.`);
        }

        if (page === 'world') {
            return msg.reply(`🌍 **WORLD & FACTIONS**
*!shinobi explore* - Look for enemies, events, or items in your area.
*!shinobi map* - View the world map.
*!shinobi travel [location]* - Move to a new sector.
*!shinobi mission* - Request a PvE mission for Ryo and XP.
*!shinobi bounty* - View the Bingo Book.
*!shinobi track [@user]* - Locate a rogue ninja (ANBU only).
*!shinobi squad create [name]* - Create a 3-man team.
*!shinobi squad invite [@user]* - Add a player to your team.
*!shinobi squad leave* - Leave your current squad.`);
        }

        // Default Main Menu
        return msg.reply(`📜 **SHINOBI WORLD ENGINE - COMMAND DIRECTORY** 📜

Use *!shinobi help [category]* to see specific commands:
🔹 *!shinobi help combat* - PvP, Jutsu, Gates, and Summonings.
🔹 *!shinobi help stats* - Training, Learning Jutsu, and Ranking up.
🔹 *!shinobi help world* - Exploration, Missions, Squads, and Travel.

💎 **MONETIZATION & SHOPS**
*!shinobi shop* - Buy weapons, armor, and scrolls.
*!shinobi premium* - Unlock DM bot access & 1.4x Mission Rewards!
*!shinobi donate ryo* - Buy Ryo with real money.
*!shinobi donate gems* - Buy Gems with real money.`);
    }
/**
 * ============================================================================
 * SHINOBI WORLD ENGINE - MASTER BUILD V5 (PART 21 - CLOUD & MATH ENGINE)
 * ============================================================================
 * Focus: Cloud Hosting Server, Universal Damage Math, and Dynamic Databases.
 * ============================================================================
 * Instructions: 
 * 1. Put the Cloud Server code at the VERY TOP of your bot file.
 * 2. Put the Math Engine above your !shinobi attack logic.
 * ============================================================================
 */

    // ==========================================
    // 67. CLOUD HOSTING KEEP-ALIVE SERVER
    // ==========================================
    /* 
       If you host on Render, Heroku, Replit, or a VPS, the cloud provider will 
       shut your bot down if it doesn't detect a web server. This tiny Express 
       server creates a dummy webpage to keep your WhatsApp bot online 24/7.
       
       Run this in terminal first: npm install express
    */
    const express = require('express');
    const app = express();
    
    app.get('/', (req, res) => {
        res.send('🟢 Shinobi World Engine is ONLINE and running in the cloud.');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`☁️ Cloud Web Server running on port ${PORT}`);
    });

    // ==========================================
    // 68. DYNAMIC PLUG-AND-PLAY DATABASES
    // ==========================================
    /*
       You NEVER have to write logic for items or jutsu again. 
       Just add a new block to these arrays. The engine will automatically 
       add them to the shop, calculate their stats, and let players use them.
    */
    
    global.SHOP_DB = [
        { id: "kunai", name: "Standard Kunai", type: "weapon", price: 500, damageBoost: 15 },
        { id: "kubikiribocho", name: "Executioner's Blade", type: "weapon", price: 15000, damageBoost: 150 },
        { id: "flak", name: "Chunin Flak Jacket", type: "armor", price: 5000, defenseBoost: 50 }
        // To add a new weapon, just paste a new line here!
    ];

    global.JUTSU_DB = [
        { id: "fireball", name: "Fire Style: Fireball Jutsu", type: "ninjutsu", reqNinjutsu: 20, baseDamage: 40, chakraCost: 15 },
        { id: "chidori", name: "Chidori", type: "ninjutsu", reqNinjutsu: 80, baseDamage: 120, chakraCost: 50 },
        { id: "tsukuyomi", name: "Tsukuyomi", type: "genjutsu", reqGenjutsu: 150, baseDamage: 300, chakraCost: 100 }
        // To add a new jutsu, just paste a new line here!
    ];

    global.MISSIONS_DB = [
        { rank: "D", name: "Find the missing cat", successRate: 90, ryoReward: 200, xpReward: 50 },
        { rank: "A", name: "Assassinate Rogue Ninja", successRate: 40, ryoReward: 5000, xpReward: 800 }
        // To add new missions, just paste a new line here!
    ];

    // ==========================================
    // 69. THE UNIVERSAL COMBAT MATH ENGINE
    // ==========================================
    /*
       This function automatically calculates damage for EVERYTHING.
       It checks Stats + Weapons + Gates + Cloaks + Dojutsu in one go.
       Call this whenever someone attacks.
    */
    function calculateDamage(attacker, defender, attackType = "taijutsu", jutsuName = null) {
        let rawDamage = 0;
        let multiplier = 1.0;

        // 1. Base Stat Calculation
        if (attackType === "taijutsu") {
            rawDamage = attacker.stats.taijutsu * 1.5;
            
            // Add Weapon Boost if equipped
            if (attacker.equipment && attacker.equipment.weapon) {
                const weaponData = global.SHOP_DB.find(w => w.name === attacker.equipment.weapon);
                if (weaponData) rawDamage += weaponData.damageBoost;
            }
        } else if (attackType === "ninjutsu" || attackType === "genjutsu") {
            const statUsed = attackType === "ninjutsu" ? attacker.stats.ninjutsu : attacker.stats.genjutsu;
            rawDamage = statUsed * 1.2;
            
            // Add Jutsu Base Damage
            if (jutsuName) {
                const jutsuData = global.JUTSU_DB.find(j => j.name === jutsuName);
                if (jutsuData) rawDamage += jutsuData.baseDamage;
            }
        }

        // 2. Modifiers (Gates & Bijuu Cloaks)
        if (attacker.activeGates) {
            multiplier += (attacker.activeGates * 0.5); // +50% damage per Gate opened
        }
        if (attacker.activeCloak) {
            multiplier += (attacker.activeCloak * 0.4); // +40% damage per Bijuu Tail
        }

        // 3. Dojutsu Modifiers
        if (attacker.dojutsu && attacker.dojutsu.active) {
            if (attacker.dojutsu.name === "Sharingan") multiplier += 0.2;
            if (attacker.dojutsu.name === "Mangekyou Sharingan") multiplier += 0.5;
            if (attacker.dojutsu.name === "Rinnegan") multiplier += 1.0;
        }

        // 4. Defender Armor Calculation
        let defense = defender.stats.taijutsu * 0.5; // Base defense from physical fitness
        if (defender.equipment && defender.equipment.armor) {
            const armorData = global.SHOP_DB.find(a => a.name === defender.equipment.armor);
            if (armorData) defense += armorData.defenseBoost;
        }

        // 5. Final Calculation
        let finalDamage = Math.floor((rawDamage * multiplier) - defense);
        
        // Prevent negative damage (healing the enemy by accident)
        if (finalDamage < 1) finalDamage = 1; 

        // 6. Premium Player Mission/PvE Boost (If fighting a bot/boss)
        if (attacker.isPremium && defender.isBot) {
            finalDamage = Math.floor(finalDamage * 1.2); // Premium players do 20% more damage in PvE
        }

        return finalDamage;
    }