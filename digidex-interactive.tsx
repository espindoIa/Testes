import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Filter, Star, Zap, Shield, Heart, Sword, Eye, EyeOff, Volume2, VolumeX, Sparkles, TrendingUp, Users, Award } from 'lucide-react';

const Digidex = () => {
  const [digimons, setDigimons] = useState([]);
  const [filteredDigimons, setFilteredDigimons] = useState([]);
  const [selectedDigimon, setSelectedDigimon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareDigimons, setCompareDigimons] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const audioRef = useRef(null);

  // Fetch Digimon data
  useEffect(() => {
    const fetchDigimons = async () => {
      try {
        const response = await fetch('https://digimon-api.vercel.app/api/digimon');
        const data = await response.json();
        
        // Enrich data with mock stats
        const enrichedData = data.map((digimon, index) => ({
          ...digimon,
          id: index + 1,
          hp: Math.floor(Math.random() * 1000) + 500,
          attack: Math.floor(Math.random() * 200) + 50,
          defense: Math.floor(Math.random() * 200) + 50,
          speed: Math.floor(Math.random() * 200) + 50,
          type: ['Vaccine', 'Data', 'Virus'][Math.floor(Math.random() * 3)],
          attribute: ['Fire', 'Water', 'Earth', 'Wind', 'Thunder', 'Dark', 'Light'][Math.floor(Math.random() * 7)],
          description: `A ${digimon.level} level Digimon with incredible powers. Known for its fierce battles in the Digital World.`
        }));
        
        setDigimons(enrichedData);
        setFilteredDigimons(enrichedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Digimon:', error);
        setLoading(false);
      }
    };

    fetchDigimons();
  }, []);

  // Filter Digimons
  useEffect(() => {
    let filtered = digimons;

    if (searchTerm) {
      filtered = filtered.filter(digimon =>
        digimon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(digimon => digimon.level === selectedLevel);
    }

    setFilteredDigimons(filtered);
  }, [searchTerm, selectedLevel, digimons]);

  // Get unique levels
  const levels = useMemo(() => {
    const uniqueLevels = [...new Set(digimons.map(d => d.level))];
    return ['all', ...uniqueLevels];
  }, [digimons]);

  // Play sound effect
  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Toggle favorite
  const toggleFavorite = (digimonId) => {
    setFavorites(prev => 
      prev.includes(digimonId) 
        ? prev.filter(id => id !== digimonId)
        : [...prev, digimonId]
    );
    playSound();
  };

  // Handle compare mode
  const handleCompare = (digimon) => {
    if (compareDigimons.find(d => d.id === digimon.id)) {
      setCompareDigimons(prev => prev.filter(d => d.id !== digimon.id));
    } else if (compareDigimons.length < 2) {
      setCompareDigimons(prev => [...prev, digimon]);
    }
    playSound();
  };

  // Get level color
  const getLevelColor = (level) => {
    const colors = {
      'Fresh': 'from-green-400 to-green-600',
      'In Training': 'from-blue-400 to-blue-600',
      'Rookie': 'from-yellow-400 to-yellow-600',
      'Champion': 'from-orange-400 to-orange-600',
      'Ultimate': 'from-purple-400 to-purple-600',
      'Mega': 'from-red-400 to-red-600',
      'Armor': 'from-pink-400 to-pink-600'
    };
    return colors[level] || 'from-gray-400 to-gray-600';
  };

  // Get type color
  const getTypeColor = (type) => {
    const colors = {
      'Vaccine': 'bg-blue-500',
      'Data': 'bg-green-500',
      'Virus': 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  // Get attribute icon
  const getAttributeIcon = (attribute) => {
    const icons = {
      'Fire': '🔥',
      'Water': '💧',
      'Earth': '🌍',
      'Wind': '💨',
      'Thunder': '⚡',
      'Dark': '🌑',
      'Light': '✨'
    };
    return icons[attribute] || '❓';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Audio element for sound effects */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE" />

      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>
        <div className="absolute w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                  DIGIDEX
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg blur opacity-30 animate-pulse"></div>
              </div>
              <Sparkles className="w-8 h-8 text-yellow-400 animate-spin-slow" />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all transform hover:scale-110"
              >
                {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
              
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                  compareMode ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Compare Mode
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Digimon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 transition-all"
                />
              </div>
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 transition-all cursor-pointer"
            >
              {levels.map(level => (
                <option key={level} value={level} className="bg-gray-900">
                  {level === 'all' ? 'All Levels' : level}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="grid grid-cols-2 gap-1 w-5 h-5">
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-purple-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="space-y-1 w-5 h-5">
                  <div className="bg-white h-1 rounded-sm"></div>
                  <div className="bg-white h-1 rounded-sm"></div>
                  <div className="bg-white h-1 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-4 text-sm text-gray-400">
            <span>Total: {filteredDigimons.length} Digimon</span>
            <span>•</span>
            <span>Favorites: {favorites.length}</span>
            {compareMode && (
              <>
                <span>•</span>
                <span>Comparing: {compareDigimons.length}/2</span>
              </>
            )}
          </div>
        </div>

        {/* Compare Panel */}
        {compareMode && compareDigimons.length === 2 && (
          <div className="mt-8 bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-center">Battle Comparison</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {compareDigimons.map((digimon, index) => (
                <div key={digimon.id} className="text-center">
                  <img 
                    src={digimon.img} 
                    alt={digimon.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-purple-500"
                  />
                  <h4 className="text-xl font-bold mb-2">{digimon.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>HP:</span>
                      <span className={digimon.hp > compareDigimons[1-index].hp ? 'text-green-400' : ''}>{digimon.hp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attack:</span>
                      <span className={digimon.attack > compareDigimons[1-index].attack ? 'text-green-400' : ''}>{digimon.attack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Defense:</span>
                      <span className={digimon.defense > compareDigimons[1-index].defense ? 'text-green-400' : ''}>{digimon.defense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className={digimon.speed > compareDigimons[1-index].speed ? 'text-green-400' : ''}>{digimon.speed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {(() => {
                  const total1 = compareDigimons[0].hp + compareDigimons[0].attack + compareDigimons[0].defense + compareDigimons[0].speed;
                  const total2 = compareDigimons[1].hp + compareDigimons[1].attack + compareDigimons[1].defense + compareDigimons[1].speed;
                  if (total1 > total2) return `${compareDigimons[0].name} Wins!`;
                  if (total2 > total1) return `${compareDigimons[1].name} Wins!`;
                  return "It's a Tie!";
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-yellow-400" />
            </div>
          </div>
        )}

        {/* Digimon Grid/List */}
        {!loading && (
          <div className={`mt-8 ${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' : 'space-y-4'}`}>
            {filteredDigimons.map(digimon => (
              <div
                key={digimon.id}
                className={`group relative bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:border-purple-400 cursor-pointer ${
                  compareMode && compareDigimons.find(d => d.id === digimon.id) ? 'ring-4 ring-purple-500' : ''
                } ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}
                onClick={() => !compareMode && setSelectedDigimon(digimon)}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Digimon Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-20 h-20 mr-4' : 'h-48'} overflow-hidden`}>
                  <img 
                    src={digimon.img} 
                    alt={digimon.name}
                    className={`${viewMode === 'list' ? 'w-full h-full object-cover rounded-lg' : 'w-full h-full object-cover'} group-hover:scale-110 transition-transform duration-300`}
                  />
                  
                  {viewMode === 'grid' && (
                    <>
                      {/* Level Badge */}
                      <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getLevelColor(digimon.level)} shadow-lg`}>
                        {digimon.level}
                      </div>
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(digimon.id);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all transform hover:scale-110"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(digimon.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Digimon Info */}
                <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'}`}>
                  <h3 className={`font-bold ${viewMode === 'list' ? 'text-lg' : 'text-lg mb-2'} group-hover:text-purple-400 transition-colors`}>
                    {digimon.name}
                  </h3>
                  
                  {viewMode === 'grid' && (
                    <>
                      {/* Type and Attribute */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(digimon.type)} text-white`}>
                          {digimon.type}
                        </span>
                        <span className="text-2xl">{getAttributeIcon(digimon.attribute)}</span>
                      </div>
                      
                      {/* Stats Preview */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Heart className="w-3 h-3 text-red-400" />
                          <div className="flex-1 bg-white/10 rounded-full h-1 overflow-hidden">
                            <div className="h-full bg-red-400" style={{width: `${(digimon.hp / 1500) * 100}%`}}></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sword className="w-3 h-3 text-orange-400" />
                          <div className="flex-1 bg-white/10 rounded-full h-1 overflow-hidden">
                            <div className="h-full bg-orange-400" style={{width: `${(digimon.attack / 250) * 100}%`}}></div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {viewMode === 'list' && (
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getLevelColor(digimon.level)}`}>
                        {digimon.level}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(digimon.type)} text-white`}>
                        {digimon.type}
                      </span>
                      <span className="text-xl">{getAttributeIcon(digimon.attribute)}</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-sm">{digimon.hp}</span>
                        <Sword className="w-4 h-4 text-orange-400" />
                        <span className="text-sm">{digimon.attack}</span>
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{digimon.defense}</span>
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{digimon.speed}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(digimon.id);
                        }}
                        className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(digimon.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Compare Mode Overlay */}
                {compareMode && (
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompare(digimon);
                    }}
                  >
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">
                        {compareDigimons.find(d => d.id === digimon.id) ? 'Remove from Compare' : 'Add to Compare'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Digimon Detail Modal */}
      {selectedDigimon && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={() => setSelectedDigimon(null)}>
          <div 
            className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-black rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDigimon(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
            >
              <Eye className="w-6 h-6" />
            </button>
            
            {/* Header with image */}
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img 
                src={selectedDigimon.img} 
                alt={selectedDigimon.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              
              {/* Name and Level */}
              <div className="absolute bottom-4 left-6">
                <h2 className="text-4xl font-bold mb-2">{selectedDigimon.name}</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getLevelColor(selectedDigimon.level)} inline-block`}>
                  {selectedDigimon.level}
                </span>
              </div>
              
              {/* Favorite */}
              <button
                onClick={() => toggleFavorite(selectedDigimon.id)}
                className="absolute top-4 left-4 p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all transform hover:scale-110"
              >
                <Star className={`w-6 h-6 ${favorites.includes(selectedDigimon.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Type and Attribute */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Type:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedDigimon.type)} text-white`}>
                    {selectedDigimon.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Attribute:</span>
                  <span className="text-3xl">{getAttributeIcon(selectedDigimon.attribute)}</span>
                  <span className="font-medium">{selectedDigimon.attribute}</span>
                </div>
              </div>
              
              {/* Description */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed">{selectedDigimon.description}</p>
              </div>
              
              {/* Battle Stats */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Battle Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="w-20">HP</span>
                    <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000 ease-out"
                        style={{width: `${(selectedDigimon.hp / 1500) * 100}%`}}
                      ></div>
                    </div>
                    <span className="w-16 text-right font-bold">{selectedDigimon.hp}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Sword className="w-5 h-5 text-orange-400" />
                    <span className="w-20">Attack</span>
                    <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                        style={{width: `${(selectedDigimon.attack / 250) * 100}%`}}
                      ></div>
                    </div>
                    <span className="w-16 text-right font-bold">{selectedDigimon.attack}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="w-20">Defense</span>
                    <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                        style={{width: `${(selectedDigimon.defense / 250) * 100}%`}}
                      ></div>
                    </div>
                    <span className="w-16 text-right font-bold">{selectedDigimon.defense}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="w-20">Speed</span>
                    <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-1000 ease-out"
                        style={{width: `${(selectedDigimon.speed / 250) * 100}%`}}
                      ></div>
                    </div>
                    <span className="w-16 text-right font-bold">{selectedDigimon.speed}</span>
                  </div>
                </div>
                
                {/* Total Power */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Total Power</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {selectedDigimon.hp + selectedDigimon.attack + selectedDigimon.defense + selectedDigimon.speed}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Evolution hint */}
              <div className="text-center text-gray-400 text-sm">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Evolution data coming soon...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Digidex;