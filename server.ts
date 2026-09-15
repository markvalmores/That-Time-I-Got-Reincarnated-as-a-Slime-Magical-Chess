import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

// CJS build handles __filename and __dirname naturally
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Tensura Anime Roster & Sprites API (Season 1, 2, 3, 4, Movie & Light Novel)
app.get('/api/tensura/characters', (req, res) => {
  const { season, search } = req.query;
  // Dynamic anime assets metadata
  const characters = [
    {
      id: 'rimuru',
      name: 'Rimuru Tempest',
      jpName: 'リムル＝テンペスト',
      title: 'Chaos Creator / Supreme Demon Lord',
      season: 'Season 4',
      race: 'Ultimate Slime (Viscous Draconic Demonoid)',
      element: 'water',
      ep: 10000000,
      ultimateSkill: 'Void God Nodens & Beelzebuth',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/8/364239.jpg&w=400&h=400&fit=cover',
      animeMalId: 37430
    },
    {
      id: 'ciel_raphael',
      name: 'Ciel / Wisdom King Raphael',
      jpName: 'シエル / 智恵之王 (ラファエル)',
      title: 'Manas / Voice of the World',
      season: 'Season 4',
      race: 'Divine Thinking Manas Core',
      element: 'holy',
      ep: 25000000,
      ultimateSkill: 'Knowledge God Raphael & Akashic Records',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/16/435165.jpg&w=400&h=400&fit=cover',
      animeMalId: 37430
    },
    {
      id: 'veldora',
      name: 'Veldora Tempest',
      jpName: 'ヴェルドラ＝テンペスト',
      title: 'Storm Dragon',
      season: 'Season 4',
      race: 'True Dragon (High Dragon Species)',
      element: 'lightning',
      ep: 88126610,
      ultimateSkill: 'King of Investigation Faust & Nyarlathotep',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/14/368819.jpg&w=400&h=400&fit=cover',
      animeMalId: 37430
    },
    {
      id: 'milim',
      name: 'Milim Nava',
      jpName: 'ミリム・ナーヴァ',
      title: 'Destroyer / Dragonoid Demon Lord',
      season: 'Season 4',
      race: 'Dragonoid Demon Lord',
      element: 'fire',
      ep: 40000000,
      ultimateSkill: 'Wrathful King Satanael',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/13/368820.jpg&w=400&h=400&fit=cover',
      animeMalId: 37430
    },
    {
      id: 'guy_crimson',
      name: 'Guy Crimson (Rouge)',
      jpName: 'ギィ・クリムゾン',
      title: 'Lord of Darkness / Red Primordial',
      season: 'Season 4',
      race: 'Primordial Demon Lord',
      element: 'fire',
      ep: 40000000,
      ultimateSkill: 'Pride King Lucifer',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/13/447230.jpg&w=400&h=400&fit=cover',
      animeMalId: 41487
    },
    {
      id: 'diablo',
      name: 'Diablo (Noir)',
      jpName: 'ディアブロ',
      title: 'Black Primordial / Demon Duke',
      season: 'Season 4',
      race: 'Primordial Demon',
      element: 'dark',
      ep: 6666666,
      ultimateSkill: 'Temptation King Azazel',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/9/408990.jpg&w=400&h=400&fit=cover',
      animeMalId: 39551
    },
    {
      id: 'velgrynd',
      name: 'Velgrynd',
      jpName: 'ヴェルグリンド',
      title: 'Scorch Dragon / True Dragon Sister',
      season: 'Season 4',
      race: 'True Dragon (Scorch Species)',
      element: 'fire',
      ep: 74350087,
      ultimateSkill: 'Charity King Raguel & Flame God Cthugha',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/11/498877.jpg&w=400&h=400&fit=cover',
      animeMalId: 53580
    },
    {
      id: 'velzard',
      name: 'Velzard',
      jpName: 'ヴェルザード',
      title: 'White Ice Dragon / Northern Sovereign',
      season: 'Season 4',
      race: 'True Dragon (Ice Species)',
      element: 'ice',
      ep: 80000000,
      ultimateSkill: 'Patience King Gabriel & Ice God Cthulhu',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/6/498878.jpg&w=400&h=400&fit=cover',
      animeMalId: 53580
    },
    {
      id: 'testarossa',
      name: 'Testarossa (Blanc)',
      jpName: 'テスタロッサ',
      title: 'Killer Lord / White Primordial',
      season: 'Season 4',
      race: 'Primordial Demon',
      element: 'fire',
      ep: 3333333,
      ultimateSkill: 'Hell King Belial',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/11/498880.jpg&w=400&h=400&fit=cover',
      animeMalId: 53580
    },
    {
      id: 'luminous',
      name: 'Luminous Valentine',
      jpName: 'ルミナス・バレンタイン',
      title: 'Queen of Nightmares / Demon Lord of Lubelius',
      season: 'Season 3',
      race: 'True Ancestor Vampire Demon Lord',
      element: 'holy',
      ep: 5000000,
      ultimateSkill: 'Lustful King Asmodeus',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/15/447231.jpg&w=400&h=400&fit=cover',
      animeMalId: 41487
    },
    {
      id: 'hinata',
      name: 'Hinata Sakaguchi',
      jpName: 'ヒナタ・サカグチ',
      title: 'Saint of Lubelius / Chief Knight Captain',
      season: 'Season 3',
      race: 'Saint',
      element: 'holy',
      ep: 2500000,
      ultimateSkill: 'Mathematician & Usurper',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/11/435166.jpg&w=400&h=400&fit=cover',
      animeMalId: 41487
    },
    {
      id: 'chloe',
      name: 'Chloe Aubert / Chronoa',
      jpName: 'クロエ・オベール / クロノア',
      title: 'Hero of Time / True Hero',
      season: 'Season 4',
      race: 'Human Hero',
      element: 'space',
      ep: 30000000,
      ultimateSkill: 'Space-Time King Yog-Sothoth',
      image: 'https://images.weserv.nl/?url=cdn.myanimelist.net/images/characters/4/447233.jpg&w=400&h=400&fit=cover',
      animeMalId: 53580
    }
  ];

  res.json({
    success: true,
    total: characters.length,
    seasons: ['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Movie / LN'],
    characters
  });
});

// Device & Network IP Detection API
app.get('/api/device-info', (req, res) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const clientIp = (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : Array.isArray(forwardedFor) ? forwardedFor[0] : null) || realIp || req.socket.remoteAddress || '127.0.0.1';
  
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  res.json({
    ip: clientIp,
    protocol: req.protocol,
    host: req.headers.host || 'localhost:3000',
    userAgent,
    serverPlatform: process.platform,
    serverArch: process.arch,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Great Sage / Raphael Tactical AI Analysis API
app.post('/api/gemini/great-sage-advice', async (req, res) => {
  try {
    const { fen, gameMode, turn, difficulty, lastMove, inCheck, evalScore, playerCharacter, opponentCharacter } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Return rich contextual in-character tactical assessment when key is unavailable
      return res.json({
        success: true,
        source: 'great_sage_local_engine',
        advice: inCheck 
          ? `<<Notice>> Warning: Your King/Commander is under immediate threat! Initiate evasion maneuver or interpose a magic barrier immediately.`
          : evalScore > 1.5 
          ? `<<Report>> Analysis complete: Tactical advantage is in Lord Rimuru's favor (+${evalScore}). Recommend pressing forward on the center files.`
          : evalScore < -1.5 
          ? `<<Notice>> Position compromised (${evalScore}). Opponent is exerting pressure on the king flank. Reinforce defenses.`
          : `<<Report>> Equal position detected. Calculate optimal pawn/piece structure to secure spatial control.`,
        skillTip: `[Tensura Skill Suggestion] Coordinate ${playerCharacter || 'Rimuru'} with your forward knights and bishops for optimal magic synergy.`,
        winRate: Math.max(5, Math.min(95, Math.round(50 + evalScore * 8)))
      });
    }

    const prompt = `You are "Great Sage" (and later "Raphael" / "Ciel"), the ultimate algorithmic analytical skill from "That Time I Got Reincarnated as a Slime" (Tensura).
You are assisting Lord Rimuru (the player) in a Magical Chess / Checkers battle against opponent character "${opponentCharacter || 'Veldora'}".
Game Mode: ${gameMode || 'Normal Chess'}
Current Turn: ${turn}
Player Character: ${playerCharacter || 'Rimuru Tempest'}
Opponent: ${opponentCharacter || 'Veldora Tempest'}
Difficulty Level: ${difficulty || 'Grandmaster'}
Is in Check: ${inCheck ? 'YES (CRITICAL DANGER)' : 'NO'}
Board Evaluation Score: ${evalScore || 0}
Last Move: ${lastMove || 'Game opening'}

Generate a short, authentic Great Sage voice analysis in the iconic Tensura format starting with "<<Report>>" or "<<Notice>>" or "<<Analysis>>".
Keep it under 3 sentences:
1. Exact tactical assessment of the board situation and immediate threats or opportunities.
2. Recommended strategic initiative or skill to use.
Return pure JSON with keys: "advice", "skillTip", "winRate" (integer 0-100).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        advice: text.replace(/[{}"]/g, '').trim() || '<<Report>> Calculation complete. Advance your pieces with caution.',
        skillTip: 'Maintain tactical coordination across all files.',
        winRate: 50
      };
    }

    res.json({
      success: true,
      source: 'gemini_raphael_ai',
      ...data
    });
  } catch (err: any) {
    console.error('Great Sage API error:', err);
    res.json({
      success: true,
      source: 'fallback_engine',
      advice: `<<Notice>> Tactical calculation: Defend key diagonals and control the central 4 squares.`,
      skillTip: `Coordinate piece synergy for maximum magical domain control.`,
      winRate: 50
    });
  }
});

// Character Battle Banter API
app.post('/api/gemini/character-dialogue', async (req, res) => {
  try {
    const { character, event, playerMove } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const defaultBanter: Record<string, Record<string, string>> = {
        'Veldora Tempest': {
          'capture': 'GWAHAHAHA! You dare take my warrior? Feel the fury of the Storm Dragon!',
          'check': 'KUHAHAHA! Rimuru, your king is trapped in my storm vortex!',
          'move': 'Hmph! A shrewd move, but my dragon intellect sees through it!',
          'win': 'KWAHAHA! None can rival the Great Dragon Veldora in strategy!',
          'loss': 'N-NANI?! Rimuru, did Great Sage cheat for you again?! Best 2 out of 3!'
        },
        'Milim Nava': {
          'capture': 'WAHAHA! That piece was delicious! I am the Demon Lord Milim!',
          'check': 'Look, look! Checkmate is coming right up, best buddy!',
          'move': 'Boring moves won\'t save you from my Dragon Knuckle strike!',
          'win': 'I WON! Now give me all the honey in Tempest!',
          'loss': 'AWWW NO! You tricked me with that knight fork! Let\'s rematch!'
        },
        'Diablo': {
          'capture': 'Kufufufu... An intriguing sacrifice, yet entirely within my calculations.',
          'check': 'Lord Rimuru, forgive me, but it is my duty to test your royal vigilance.',
          'move': 'A sublime move, Lord Rimuru. As expected of my master.',
          'win': 'Kufufufu... It was an exquisite battle of minds.',
          'loss': 'Magnificent! As expected of the supreme wisdom of Lord Rimuru!'
        },
        'Benimaru': {
          'capture': 'A clean strike. Let the flames of ogre pride consume the board!',
          'check': 'Commander! Your retreat path is severed by Hellflare!',
          'move': 'A solid defense. Let\'s see how you handle our vanguard!',
          'win': 'Victory for the vanguard of Tempest!',
          'loss': 'Well played! Your command strategy is truly peerless.'
        },
        'Guy Crimson': {
          'capture': 'Heh, you play boldly. That\'s what makes this game with you amusing.',
          'check': 'Is this the limit of your calculations, little slime?',
          'move': 'Entertaining. Let us see how long you can maintain this balance.',
          'win': 'As expected of the Lord of Darkness. A predictable outcome.',
          'loss': 'Hahahahaha! Incredible, Rimuru! You truly are full of surprises!'
        }
      };

      const charBanter = defaultBanter[character] || defaultBanter['Veldora Tempest'];
      const dialogue = charBanter[event] || charBanter['move'] || 'Let us duel with magic and intellect!';

      return res.json({ success: true, dialogue });
    }

    const prompt = `You are ${character} from "That Time I Got Reincarnated as a Slime" (Tensura).
Event in chess/checkers: ${event} (e.g. capture, check, move, win, loss).
Recent Move: ${playerMove || 'Standard maneuver'}.
Generate 1 line of dialogue in pure character personality (sub Japanese anime anime dub style: Milim is playful & loves honey, Veldora boasts "Gwahahaha", Diablo is polite & fanatical "Kufufufu", Guy Crimson is suave & arrogant).
Keep it under 25 words. Pure text dialogue.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { temperature: 0.8 }
    });

    res.json({
      success: true,
      dialogue: response.text?.replace(/^["']|["']$/g, '').trim() || 'Let us continue the match!'
    });
  } catch (err: any) {
    res.json({
      success: true,
      dialogue: 'An exhilarating match of magical chess!'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tensura Magical Chess Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
