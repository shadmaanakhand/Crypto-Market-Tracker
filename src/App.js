// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';

// const CryptoDashboard = () => {
//   const [coins, setCoins] = useState([]);
//   const [filteredCoins, setFilteredCoins] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedCoin, setSelectedCoin] = useState(null);
//   const [chartData, setChartData] = useState([]);
//   const [chartDays, setChartDays] = useState(7);
//   const [lastUpdate, setLastUpdate] = useState(new Date());

//   useEffect(() => {
//     fetchCoins();
//     const interval = setInterval(fetchCoins, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const filtered = coins.filter(coin =>
//       coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredCoins(filtered);
//   }, [searchTerm, coins]);

//   const fetchCoins = async () => {
//     try {
//       const response = await fetch(
//         'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h'
//       );
//       const data = await response.json();
//       setCoins(data);
//       setFilteredCoins(data);
//       setLoading(false);
//       setLastUpdate(new Date());
//     } catch (error) {
//       console.error('Error fetching coins:', error);
//       setLoading(false);
//     }
//   };

//   const fetchChartData = async (coinId, days) => {
//     try {
//       const response = await fetch(
//         `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
//       );
//       const data = await response.json();
//       const formattedData = data.prices.map(([timestamp, price]) => ({
//         date: new Date(timestamp).toLocaleDateString(),
//         price: price
//       }));
//       setChartData(formattedData);
//     } catch (error) {
//       console.error('Error fetching chart data:', error);
//     }
//   };

//   const handleCoinClick = (coin) => {
//     setSelectedCoin(coin);
//     fetchChartData(coin.id, chartDays);
//   };

//   const handleChartDaysChange = (days) => {
//     setChartDays(days);
//     if (selectedCoin) {
//       fetchChartData(selectedCoin.id, days);
//     }
//   };

//   const formatPrice = (price) => {
//     if (price >= 1) {
//       return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//     }
//     return `$${price.toFixed(6)}`;
//   };

//   const formatLargeNumber = (num) => {
//     if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
//     if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
//     if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
//     return `$${num.toLocaleString()}`;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-2xl">Loading crypto data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Crypto Dashboard
//           </h1>
//           <p className="text-gray-400">Real-time cryptocurrency prices and market data</p>
//           <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
//             <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
//             <button
//               onClick={fetchCoins}
//               className="p-1 hover:bg-white/10 rounded transition-colors"
//               title="Refresh data"
//             >
//               <RefreshCw className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-6 relative">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search cryptocurrencies..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>

//         {/* Chart Modal */}
//         {selectedCoin && (
//           <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <div className="flex items-center gap-3 mb-2">
//                   <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10" />
//                   <div>
//                     <h2 className="text-2xl font-bold">{selectedCoin.name}</h2>
//                     <p className="text-gray-400 uppercase">{selectedCoin.symbol}</p>
//                   </div>
//                 </div>
//                 <p className="text-3xl font-bold">{formatPrice(selectedCoin.current_price)}</p>
//               </div>
//               <button
//                 onClick={() => setSelectedCoin(null)}
//                 className="text-gray-400 hover:text-white transition-colors"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="flex gap-2 mb-4">
//               {[7, 30, 90].map((days) => (
//                 <button
//                   key={days}
//                   onClick={() => handleChartDaysChange(days)}
//                   className={`px-4 py-2 rounded-lg transition-colors ${
//                     chartDays === days
//                       ? 'bg-purple-600 text-white'
//                       : 'bg-white/10 text-gray-400 hover:bg-white/20'
//                   }`}
//                 >
//                   {days}D
//                 </button>
//               ))}
//             </div>

//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={chartData}>
//                 <XAxis
//                   dataKey="date"
//                   stroke="#9ca3af"
//                   tick={{ fill: '#9ca3af' }}
//                   tickFormatter={(value) => value.split('/')[0]}
//                 />
//                 <YAxis
//                   stroke="#9ca3af"
//                   tick={{ fill: '#9ca3af' }}
//                   tickFormatter={(value) => `$${value.toLocaleString()}`}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                     border: '1px solid rgba(255, 255, 255, 0.2)',
//                     borderRadius: '8px',
//                     color: 'white'
//                   }}
//                   formatter={(value) => [formatPrice(value), 'Price']}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="price"
//                   stroke="#a855f7"
//                   strokeWidth={2}
//                   dot={false}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* Coins Table */}
//         <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-white/5">
//                 <tr>
//                   <th className="text-left p-4 font-semibold text-gray-300">#</th>
//                   <th className="text-left p-4 font-semibold text-gray-300">Coin</th>
//                   <th className="text-right p-4 font-semibold text-gray-300">Price</th>
//                   <th className="text-right p-4 font-semibold text-gray-300">24h Change</th>
//                   <th className="text-right p-4 font-semibold text-gray-300 hidden md:table-cell">Market Cap</th>
//                   <th className="text-right p-4 font-semibold text-gray-300 hidden lg:table-cell">Volume (24h)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCoins.map((coin) => (
//                   <tr
//                     key={coin.id}
//                     onClick={() => handleCoinClick(coin)}
//                     className="border-t border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
//                   >
//                     <td className="p-4 text-gray-400">{coin.market_cap_rank}</td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-3">
//                         <img src={coin.image} alt={coin.name} className="w-8 h-8" />
//                         <div>
//                           <div className="font-semibold">{coin.name}</div>
//                           <div className="text-sm text-gray-400 uppercase">{coin.symbol}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4 text-right font-semibold">
//                       {formatPrice(coin.current_price)}
//                     </td>
//                     <td className="p-4 text-right">
//                       <div
//                         className={`flex items-center justify-end gap-1 ${
//                           coin.price_change_percentage_24h >= 0
//                             ? 'text-green-400'
//                             : 'text-red-400'
//                         }`}
//                       >
//                         {coin.price_change_percentage_24h >= 0 ? (
//                           <TrendingUp className="w-4 h-4" />
//                         ) : (
//                           <TrendingDown className="w-4 h-4" />
//                         )}
//                         <span className="font-semibold">
//                           {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
//                         </span>
//                       </div>
//                     </td>
//                     <td className="p-4 text-right text-gray-300 hidden md:table-cell">
//                       {formatLargeNumber(coin.market_cap)}
//                     </td>
//                     <td className="p-4 text-right text-gray-300 hidden lg:table-cell">
//                       {formatLargeNumber(coin.total_volume)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {filteredCoins.length === 0 && (
//           <div className="text-center py-12 text-gray-400">
//             No cryptocurrencies found matching "{searchTerm}"
//           </div>
//         )}

//         {/* Footer */}
//         <div className="mt-8 text-center text-gray-500 text-sm">
//           <p>Data provided by CoinGecko API • Updates every 60 seconds</p>
//           <p className="mt-1">Click on any coin to view its price chart</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CryptoDashboard;

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Search, RefreshCw, Star, ArrowUp, Moon, Sun, ChevronUp, BarChart3 } from 'lucide-react';

const CryptoDashboard = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartDays, setChartDays] = useState(7);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [favorites, setFavorites] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });
  const [darkMode, setDarkMode] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [globalData, setGlobalData] = useState(null);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareCoin, setCompareCoin] = useState(null);
  const [compareChartData, setCompareChartData] = useState([]);
  const [error, setError] = useState(null);
  const [sparklines, setSparklines] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('cryptoFavorites');
    if (saved) setFavorites(JSON.parse(saved));
    
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000);
    
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const sorted = [...coins].sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      const aVal = a[sortConfig.key] || 0;
      const bVal = b[sortConfig.key] || 0;
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    const filtered = sorted.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [searchTerm, coins, sortConfig]);

  const fetchAllData = async () => {
    try {
      setError(null);
      await Promise.all([
        fetchCoins(),
        fetchGlobalData(),
        fetchTrending()
      ]);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    }
  };

  const fetchCoins = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h,7d'
      );
      const data = await response.json();
      setCoins(data);
      setFilteredCoins(data);
      setLoading(false);
      setLastUpdate(new Date());
      
      const sparklineData = {};
      data.forEach(coin => {
        if (coin.sparkline_in_7d?.price) {
          sparklineData[coin.id] = coin.sparkline_in_7d.price;
        }
      });
      setSparklines(sparklineData);
    } catch (error) {
      console.error('Error fetching coins:', error);
      setLoading(false);
    }
  };

  const fetchGlobalData = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/global');
      const data = await response.json();
      setGlobalData(data.data);
    } catch (error) {
      console.error('Error fetching global data:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
      const data = await response.json();
      setTrendingCoins(data.coins.slice(0, 5));
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const fetchChartData = async (coinId, days) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await response.json();
      const formattedData = data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price: price,
        timestamp: timestamp
      }));
      
      if (compareMode && compareCoin) {
        setCompareChartData(formattedData);
      } else {
        setChartData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const handleCoinClick = (coin) => {
    if (compareMode && !compareCoin) {
      setCompareCoin(coin);
      fetchChartData(coin.id, chartDays);
    } else if (compareMode && compareCoin && compareCoin.id !== coin.id) {
      setSelectedCoin(coin);
      fetchChartData(coin.id, chartDays);
    } else {
      setSelectedCoin(coin);
      setCompareCoin(null);
      setCompareChartData([]);
      fetchChartData(coin.id, chartDays);
    }
  };

  const handleChartDaysChange = (days) => {
    setChartDays(days);
    if (selectedCoin) {
      fetchChartData(selectedCoin.id, days);
    }
    if (compareCoin && compareMode) {
      fetchChartData(compareCoin.id, days);
    }
  };

  const toggleFavorite = (coinId, e) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(coinId)
      ? favorites.filter(id => id !== coinId)
      : [...favorites, coinId];
    setFavorites(newFavorites);
    localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const formatLargeNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const Sparkline = ({ data, isPositive }) => {
    if (!data || data.length === 0) return null;
    
    const points = data.slice(-24);
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min;
    
    const svgPoints = points.map((price, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 100 - ((price - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width="100" height="40" className="inline-block">
        <polyline
          points={svgPoints}
          fill="none"
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="2"
        />
      </svg>
    );
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
          <div className="w-8 h-8 bg-white/10 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded w-1/4"></div>
            <div className="h-3 bg-white/10 rounded w-1/6"></div>
          </div>
          <div className="h-4 bg-white/10 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} p-4 md:p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className={`mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="h-12 bg-white/10 rounded w-64 mb-2"></div>
            <div className="h-6 bg-white/10 rounded w-96"></div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'} p-4 md:p-8 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crypto Dashboard
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Real-time cryptocurrency prices and market data</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              <button
                onClick={fetchAllData}
                className={`p-1 hover:bg-white/10 rounded transition-all ${darkMode ? '' : 'hover:bg-black/5'}`}
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Global Stats */}
        {globalData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in">
            <div className={`${darkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-md border ${darkMode ? 'border-white/20' : 'border-black/10'} rounded-lg p-4`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Market Cap</p>
              <p className="text-2xl font-bold">{formatLargeNumber(globalData.total_market_cap.usd)}</p>
              <p className={`text-sm mt-1 ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {globalData.market_cap_change_percentage_24h_usd.toFixed(2)}% (24h)
              </p>
            </div>
            <div className={`${darkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-md border ${darkMode ? 'border-white/20' : 'border-black/10'} rounded-lg p-4`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>24h Volume</p>
              <p className="text-2xl font-bold">{formatLargeNumber(globalData.total_volume.usd)}</p>
            </div>
            <div className={`${darkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-md border ${darkMode ? 'border-white/20' : 'border-black/10'} rounded-lg p-4`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>BTC Dominance</p>
              <p className="text-2xl font-bold">{globalData.market_cap_percentage.btc.toFixed(2)}%</p>
            </div>
          </div>
        )}

        {/* Trending Coins Carousel */}
        {trendingCoins.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>🔥 Trending</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {trendingCoins.map((item) => (
                <div
                  key={item.item.id}
                  className={`${darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-white/60 hover:bg-white/80'} backdrop-blur-md border ${darkMode ? 'border-white/20' : 'border-black/10'} rounded-lg p-3 min-w-[180px] cursor-pointer transition-all`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={item.item.small} alt={item.item.name} className="w-6 h-6" />
                    <span className="font-semibold text-sm">{item.item.symbol}</span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>#{item.item.market_cap_rank}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar & Compare Mode */}
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} w-5 h-5`} />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${darkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/60 border-black/10 text-gray-900 placeholder-gray-500'} backdrop-blur-md border rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <button
            onClick={() => {
              setCompareMode(!compareMode);
              if (compareMode) {
                setCompareCoin(null);
                setCompareChartData([]);
              }
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              compareMode 
                ? 'bg-purple-600 text-white' 
                : darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/60 hover:bg-white/80'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Compare Mode
          </button>
        </div>

        {/* Chart Modal */}
        {selectedCoin && (
          <div className={`mb-6 ${darkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-md border ${darkMode ? 'border-white/20' : 'border-black/10'} rounded-lg p-6 animate-fade-in`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCoin.name}</h2>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase`}>{selectedCoin.symbol}</p>
                  </div>
                </div>
                <p className="text-3xl font-bold">{formatPrice(selectedCoin.current_price)}</p>
                <div className="flex gap-4 mt-2">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>24h High</p>
                    <p className="text-sm font-semibold text-green-400">{formatPrice(selectedCoin.high_24h)}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>24h Low</p>
                    <p className="text-sm font-semibold text-red-400">{formatPrice(selectedCoin.low_24h)}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCoin(null);
                  setCompareCoin(null);
                  setCompareChartData([]);
                  setCompareMode(false);
                }}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                ✕
              </button>
            </div>

            {compareCoin && (
              <div className="mb-4 p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
                <p className="text-sm mb-1">Comparing with:</p>
                <div className="flex items-center gap-2">
                  <img src={compareCoin.image} alt={compareCoin.name} className="w-6 h-6" />
                  <span className="font-semibold">{compareCoin.name}</span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>({compareCoin.symbol.toUpperCase()})</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => handleChartDaysChange(days)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    chartDays === days
                      ? 'bg-purple-600 text-white'
                      : darkMode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-black/10 text-gray-600 hover:bg-black/20'
                  }`}
                >
                  {days}D
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  {compareCoin && (
                    <linearGradient id="colorCompare" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  )}
                </defs>
                <XAxis
                  dataKey="date"
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  tickFormatter={(value) => value.split('/')[0]}
                  data={chartData}
                />
                <YAxis
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px',
                    color: darkMode ? 'white' : 'black'
                  }}
                  formatter={(value) => [formatPrice(value), 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  data={chartData}
                />
                {compareCoin && compareChartData.length > 0 && (
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompare)"
                    data={compareChartData}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Coins Table */}
        <div className={`${darkMode ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-md border ${darkMode ? 'border-white/20' : 'border-black/10'} rounded-lg overflow-hidden animate-fade-in`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-white/5' : 'bg-black/5'}>
                <tr>
                  <th className={`text-left p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Star className="w-4 h-4" />
                  </th>
                  <th 
                    className={`text-left p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer hover:bg-white/10`}
                    onClick={() => handleSort('market_cap_rank')}
                  >
                    #
                  </th>
                  <th 
                    className={`text-left p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer hover:bg-white/10`}
                    onClick={() => handleSort('name')}
                  >
                    Coin
                  </th>
                  <th 
                    className={`text-right p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer hover:bg-white/10`}
                    onClick={() => handleSort('current_price')}
                  >
                    Price
                  </th>
                  <th className={`text-center p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} hidden lg:table-cell`}>
                    7D Trend
                  </th>
                  <th 
                    className={`text-right p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer hover:bg-white/10`}
                    onClick={() => handleSort('price_change_percentage_24h')}
                  >
                    24h Change
                  </th>
                  <th 
                    className={`text-right p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} hidden md:table-cell cursor-pointer hover:bg-white/10`}
                    onClick={() => handleSort('market_cap')}
                  >
                    Market Cap
                  </th>
                  <th 
                    className={`text-right p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} hidden lg:table-cell cursor-pointer hover:bg-white/10`}
                    onClick={() => handleSort('total_volume')}
                  >
                    Volume (24h)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    onClick={() => handleCoinClick(coin)}
                    className={`border-t ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-white/50'} cursor-pointer transition-all animate-fade-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <button
                        onClick={(e) => toggleFavorite(coin.id, e)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            favorites.includes(coin.id)
                              ? 'fill-yellow-400 text-yellow-400'
                              : darkMode ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </td>
                    <td className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{coin.market_cap_rank}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                        <div>
                          <div className="font-semibold">{coin.name}</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase`}>{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-semibold">
                      {formatPrice(coin.current_price)}
                    </td>
                    <td className="p-4 text-center hidden lg:table-cell">
                      <Sparkline 
                        data={sparklines[coin.id]} 
                        isPositive={coin.price_change_percentage_24h >= 0}
                      />
                    </td>
                    <td className="p-4 text-right">
                      <div
                        className={`flex items-center justify-end gap-1 px-2 py-1 rounded-lg ${
                          coin.price_change_percentage_24h >= 0
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-semibold">
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className={`p-4 text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'} hidden md:table-cell`}>
                      {formatLargeNumber(coin.market_cap)}
                    </td>
                    <td className={`p-4 text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'} hidden lg:table-cell`}>
                      <div className="flex flex-col items-end">
                        <span>{formatLargeNumber(coin.total_volume)}</span>
                        <div className="w-20 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-purple-500"
                            style={{ width: `${Math.min((coin.total_volume / coin.market_cap) * 100 * 10, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCoins.length === 0 && (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'} animate-fade-in`}>
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl">No cryptocurrencies found matching "{searchTerm}"</p>
            <p className="text-sm mt-2">Try searching for Bitcoin, Ethereum, or other popular coins</p>
          </div>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all hover:scale-110 animate-fade-in z-50"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}

        {/* Footer */}
        <div className={`mt-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-600'} text-sm`}>
          <p>Data provided by CoinGecko API • Updates every 60 seconds</p>
          <p className="mt-1">Click on any coin to view its price chart • Use Compare Mode to compare two coins</p>
          <p className="mt-1">⭐ Star your favorite coins to track them easily</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CryptoDashboard;