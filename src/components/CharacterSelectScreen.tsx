import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Shield, 
  Zap, 
  Flame, 
  Droplets, 
  Swords, 
  Volume2, 
  CheckCircle2, 
  ArrowLeft,
  Search,
  Filter,
  Crown
} from 'lucide-react';
import { TensuraCharacter, ControllerPromptStyle } from '../types/game';
import { TENSURA_CHARACTERS } from '../data/characters';
import { soundEngine } from '../utils/audio';

interface CharacterSelectScreenProps {
  playerCharacter: TensuraCharacter;
  opponentCharacter: TensuraCharacter;
  onConfirmSelection: (player: TensuraCharacter, opponent: TensuraCharacter) => void;
  onBack: () => void;
  promptStyle: ControllerPromptStyle;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  playerCharacter,
  opponentCharacter,
  onConfirmSelection,
  onBack,
  promptStyle
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<TensuraCharacter>(playerCharacter);
  const [selectedOpponent, setSelectedOpponent] = useState<TensuraCharacter>(opponentCharacter);
  const [activeSlot, setActiveSlot] = useState<'player' | 'opponent'>('player');
  const [filterSeason, setFilterSeason] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const seasons = [
    { id: 'all', label: 'All Seasons' },
    { id: 'Season 4', label: 'Season 4 & Movie' },
    { id: 'Season 3', label: 'Season 3' },
    { id: 'Season 2', label: 'Season 2' },
    { id: 'Season 1', label: 'Season 1' }
  ];

  const filteredCharacters = TENSURA_CHARACTERS.filter((char) => {
    const matchSeason = filterSeason === 'all' || char.season === filterSeason;
    const matchSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        char.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        char.ultimateSkill.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSeason && matchSearch;
  });

  const handleSelectChar = (char: TensuraCharacter) => {
    soundEngine.playClick();
    if (activeSlot === 'player') {
      setSelectedPlayer(char);
    } else {
      setSelectedOpponent(char);
    }
  };

  const handleConfirm = () => {
    soundEngine.playSkillActivation();
    onConfirmSelection(selectedPlayer, selectedOpponent);
  };

  const currentChar = activeSlot === 'player' ? selectedPlayer : selectedOpponent;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-slate-950 text-slate-100 select-none overflow-x-hidden">
      
      {/* Background Animated Gradient Aura */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-slate-950" />
      
      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-500/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40 uppercase">
                TENSURA CHARACTER VAULT UPTO SEASON 4
              </span>
              <span className="text-xs font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                24+ ANIME LEGENDS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Cinzel'] text-white drop-shadow">
              COMMANDER SELECTION ROSTER
            </h1>
          </div>
        </div>

        {/* Slot Selector: Choose Player 1 (Tempest) vs Opponent (Rival) */}
        <div className="flex items-center gap-3 bg-slate-900/90 p-1.5 rounded-2xl border border-cyan-500/40 shadow-inner">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveSlot('player');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
              activeSlot === 'player'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-950">
              <img src={selectedPlayer.image} alt={selectedPlayer.name} className="w-full h-full object-cover" />
            </div>
            <span>PLAYER 1: {selectedPlayer.name.split(' ')[0]}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveSlot('opponent');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition ${
              activeSlot === 'opponent'
                ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-600/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-950">
              <img src={selectedOpponent.image} alt={selectedOpponent.name} className="w-full h-full object-cover" />
            </div>
            <span>OPPONENT: {selectedOpponent.name.split(' ')[0]}</span>
          </button>
        </div>
      </header>

      {/* Main Content: Character Grid + Active Character Live Showcase */}
      <main className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 flex-1">
        
        {/* Left Column: Filter Tabs + Grid of Character Anime Cards (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          
          {/* Search & Season Filter Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {seasons.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setFilterSeason(s.id);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition border ${
                    filterSeason === s.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search character or skill..."
                className="pl-8 pr-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44 font-mono"
              />
            </div>
          </div>

          {/* Grid of Character Portrait Tiles */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2.5 max-h-[58vh] overflow-y-auto pr-1">
            {filteredCharacters.map((char) => {
              const isSelectedActive = currentChar.id === char.id;
              const isPlayerChosen = selectedPlayer.id === char.id;
              const isOpponentChosen = selectedOpponent.id === char.id;

              return (
                <motion.div
                  key={char.id}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectChar(char)}
                  className={`
                    relative group rounded-2xl p-2 cursor-pointer transition-all border flex flex-col items-center text-center overflow-hidden
                    ${isSelectedActive 
                      ? 'bg-gradient-to-b from-cyan-950 to-slate-900 border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl shadow-cyan-950/80' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'}
                  `}
                >
                  {/* Anime Character Artwork Thumbnail with High-Res Image */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-700/60 mb-2 bg-slate-950">
                    <img 
                      src={char.image} 
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 filter contrast-110"
                      loading="lazy"
                    />

                    {/* Season Stamp */}
                    <span className="absolute top-1 left-1 text-[8px] font-mono font-bold bg-slate-950/90 text-cyan-300 px-1 rounded border border-cyan-500/40">
                      {char.season}
                    </span>

                    {/* Elemental Badge */}
                    <span className="absolute bottom-1 right-1 text-sm drop-shadow">
                      {char.avatarIcon}
                    </span>

                    {/* P1 / Opponent Overlay Flag */}
                    {isPlayerChosen && (
                      <span className="absolute top-1 right-1 text-[8px] font-mono font-black bg-cyan-400 text-slate-950 px-1 rounded shadow">
                        P1
                      </span>
                    )}
                    {isOpponentChosen && (
                      <span className="absolute bottom-1 left-1 text-[8px] font-mono font-black bg-rose-500 text-white px-1 rounded shadow">
                        CPU
                      </span>
                    )}
                  </div>

                  {/* Character Name & Titles */}
                  <h4 className="text-xs font-bold text-white truncate w-full font-sans leading-tight">
                    {char.name}
                  </h4>
                  <span className="text-[9px] font-mono text-cyan-400 truncate w-full opacity-80">
                    {char.jpName}
                  </span>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Right Column: High-Res Anime Character Showcase Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900/95 via-cyan-950/40 to-slate-950/95 rounded-3xl border-2 border-cyan-500/50 p-6 shadow-2xl shadow-cyan-950/80 backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden">
          
          {/* Background Elemental Aura */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Badge & Slot Tag */}
            <div className="flex items-center justify-between mb-4 border-b border-cyan-500/30 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>ASSIGNING TO: {activeSlot === 'player' ? 'PLAYER 1 (TEMPEST)' : 'OPPONENT COMMANDER'}</span>
              </span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                {currentChar.season}
              </span>
            </div>

            {/* Character Anime Portrait & Header */}
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30 shrink-0 relative bg-slate-950">
                <img 
                  src={currentChar.image} 
                  alt={currentChar.name} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 text-xl drop-shadow">
                  {currentChar.avatarIcon}
                </span>
              </div>

              <div className="min-w-0">
                <span className="text-xs font-jp-calligraphy text-cyan-300 block mb-0.5">
                  {currentChar.jpName}
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-['Cinzel'] text-white truncate leading-tight">
                  {currentChar.name}
                </h2>
                <p className="text-xs font-mono text-cyan-300 truncate mt-0.5">
                  {currentChar.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                    RACE: {currentChar.race}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-500/50 text-amber-300">
                    EP: {currentChar.ep.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Ultimate Skill Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/40 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>ULTIMATE SKILL: {currentChar.ultimateSkill}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {currentChar.ultimateDescription}
              </p>
            </div>

            {/* Anime Voice Lines Preview */}
            <div className="mt-3 p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-cyan-300 mb-1">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BATTLE START QUOTE:</span>
                </span>
                <button
                  onClick={() => soundEngine.playSkillActivation()}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold"
                >
                  [Play SFX]
                </button>
              </div>
              <p className="text-xs text-slate-200 italic">
                "{currentChar.voiceLines.start}"
              </p>
            </div>

          </div>

          {/* Confirm & Start Duel Action Button */}
          <div className="mt-6 pt-4 border-t border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400">
              <span>Selected: </span>
              <strong className="text-cyan-300">{selectedPlayer.name.split(' ')[0]}</strong>
              <span> vs </span>
              <strong className="text-rose-400">{selectedOpponent.name.split(' ')[0]}</strong>
            </div>

            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-slate-950 font-black font-mono text-xs shadow-xl shadow-cyan-500/40 hover:scale-105 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>LOCK IN COMMANDERS</span>
            </button>
          </div>

        </div>

      </main>

    </div>
  );
};
