"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, MapPin, Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow, AlertTriangle } from "lucide-react"
import { useWeather } from "@/hooks/useWeather"
import { motion } from "framer-motion"

const getWeatherIcon = (weatherCode: number, isDay: boolean) => {
  // Clear sky
  if (weatherCode === 0) {
    return <Sun className="h-6 w-6 md:h-8 md:w-8 text-yellow-400 flex-shrink-0" />
  }
  // Mainly clear, partly cloudy
  if (weatherCode === 1 || weatherCode === 2) {
    return <Cloud className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
  }
  // Overcast
  if (weatherCode === 3) {
    return <Cloud className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
  }
  // Fog
  if (weatherCode === 45 || weatherCode === 48) {
    return <Cloud className="h-6 w-6 md:h-8 md:w-8 text-blue-300" />
  }
  // Drizzle, rain
  if ((weatherCode >= 51 && weatherCode <= 57) || (weatherCode >= 61 && weatherCode <= 67)) {
    return <CloudRain className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
  }
  // Snow
  if (weatherCode >= 71 && weatherCode <= 77) {
    return <CloudSnow className="h-6 w-6 md:h-8 md:w-8 text-cyan-300" />
  }
  // Showers
  if (weatherCode >= 80 && weatherCode <= 82) {
    return <CloudRain className="h-6 w-6 md:h-8 md:w-8 text-indigo-500" />
  }
  // Thunderstorm
  if (weatherCode >= 95 && weatherCode <= 99) {
    return <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
  }
  
  return <Sun className="h-6 w-6 md:h-8 md:w-8 text-yellow-400 flex-shrink-0" />
}

const getWeatherGradient = (weatherCode: number) => {
  if (weatherCode === 0) return "from-yellow-400 via-orange-500 to-pink-500"
  if (weatherCode === 1 || weatherCode === 2) return "from-purple-400 via-pink-400 to-red-400"
  if (weatherCode === 3) return "from-gray-400 via-gray-500 to-gray-600"
  if (weatherCode >= 51 && weatherCode <= 67) return "from-blue-500 via-indigo-500 to-purple-500"
  if (weatherCode >= 71 && weatherCode <= 77) return "from-cyan-400 via-blue-400 to-indigo-400"
  if (weatherCode >= 95 && weatherCode <= 99) return "from-orange-500 via-red-500 to-pink-500"
  return "from-blue-400 via-purple-400 to-pink-400"
}

const popularCities = [
  "London", "New York", "Tokyo", "Paris", "Sydney", 
  "Berlin", "Moscow", "Dubai", "Singapore", "Toronto"
]

const getErrorMessage = (error: unknown, cityName: string): string => {
  if (error instanceof Error) {
    switch (error.message) {
      case 'City not found':
        return `🌍 Oops! We couldn't find "${cityName}". Please check the spelling and try again.`
      case 'Failed to fetch city coordinates':
        return `🔍 Unable to locate "${cityName}". Please try a different search term.`
      case 'Failed to fetch weather data':
        return '🌦️ Weather data is temporarily unavailable. Please try again later.'
      case 'City parameter is required':
        return '⚠️ Please enter a city name to search for weather information.'
      case 'City name must be at least 2 characters long':
        return '📝 City name must be at least 2 characters long. Please enter a valid city name.'
      case 'Network connection failed':
        return '📡 Network connection issue. Please check your internet connection and try again.'
      case 'Weather service unavailable':
        return '🌦️ Weather service is temporarily unavailable. Please try again in a few minutes.'
      default:
        return `❌ ${error.message}`
    }
  }
  
  // Handle network errors
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as { message: string }).message
    if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
      return '📡 Network connection issue. Please check your internet connection and try again.'
    }
  }
  
  return '⚠️ Something went wrong. Please try searching for a different city.'
}

export default function Home() {
  const [city, setCity] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  const { data: weatherData, isLoading, error } = useWeather(city)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const trimmedQuery = searchQuery.trim()
      if (trimmedQuery.length < 2) {
        setValidationError('City name must be at least 2 characters long')
        setCity("") // Clear city to hide weather data
      } else {
        setValidationError(null)
        setCity(trimmedQuery)
      }
    }
  }

  const gradient = weatherData ? getWeatherGradient(weatherData.current.weatherCode) : "from-blue-400 via-purple-400 to-pink-400"

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} animate-gradient-x`}>
      {/* Floating particles background - reduced on mobile for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-lg leading-tight">
              Weather Now
            </h1>

          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium px-4">
            Get current weather conditions for any city ✨
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto mb-6 sm:mb-8 lg:mb-10 px-4"
        >
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Enter city name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 sm:h-14 text-base sm:text-lg bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/70 rounded-2xl px-4 sm:px-6 pr-14 sm:pr-16 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/30 rounded-xl transition-all duration-300"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </Button>
          </form>
        </motion.div>

        {/* Error State */}
        {(error || validationError) && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto mb-6 px-4"
          >
            <Alert className="bg-red-500/20 backdrop-blur-md border-red-400/50 text-white">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              <div className="flex-1">
                <AlertDescription className="text-white/90 text-sm sm:text-base mb-3">
                  {validationError || getErrorMessage(error, city)}
                </AlertDescription>
                <div className="flex gap-2 flex-wrap mb-3">
                  <Button 
                    onClick={() => {
                      setValidationError(null)
                      setCity(searchQuery)
                    }} 
                    size="sm" 
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs"
                  >
                    🔄 Try Again
                  </Button>
                  <Button 
                    onClick={() => {
                      setValidationError(null)
                      setCity("")
                      setSearchQuery("")
                    }} 
                    size="sm" 
                    variant="outline"
                    className="bg-transparent hover:bg-white/10 text-white border-white/30 text-xs"
                  >
                    ✏️ Search Different City
                  </Button>
                </div>
                {(error?.message === 'City not found' || validationError) && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-white/70 mb-2">💡 Try searching for one of these popular cities:</p>
                    <div className="flex flex-wrap gap-1">
                      {popularCities.slice(0, 6).map((popularCity) => (
                        <Button
                          key={popularCity}
                          onClick={() => {
                            setValidationError(null)
                            setSearchQuery(popularCity)
                            setCity(popularCity)
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 px-2 py-1 h-auto"
                        >
                          {popularCity}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Alert>
          </motion.div>
        )}

        {/* Weather Display */}
        {city && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 px-4"
          >
            {/* Main Weather Card */}
            <Card className="bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-white leading-tight">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-pink-300 flex-shrink-0" />
                  <span className="break-words">
                    {weatherData ? `${weatherData.city.name}, ${weatherData.city.country}` : city}
                  </span>
                </CardTitle>
                <CardDescription className="text-white/80 text-base sm:text-lg">
                  Current weather conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20 rounded-xl sm:rounded-2xl">
                        <CardContent className="p-3 sm:p-4">
                          <Skeleton className="h-3 w-16 sm:w-20 mb-2 bg-white/20" />
                          <Skeleton className="h-6 w-12 sm:h-8 sm:w-16 mb-1 bg-white/20" />
                          <Skeleton className="h-2.5 w-20 sm:h-3 sm:w-24 bg-white/20" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : weatherData ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Temperature */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gradient-to-br from-red-400/20 to-orange-400/20 backdrop-blur-md border-white/20 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 h-full">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-red-300 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-white/90">Temperature</span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-white mb-1 leading-tight">
                            {weatherData.current.temperature}°C
                          </div>
                          <div className="text-xs sm:text-sm text-white/70">
                            Feels like {weatherData.current.temperature}°C
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Humidity */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-md border-white/20 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 h-full">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-white/90">Humidity</span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-white mb-1 leading-tight">
                            {weatherData.daily?.maxHumidity || '--'}%
                          </div>
                          <div className="text-xs sm:text-sm text-white/70">Relative humidity</div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Wind Speed */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-md border-white/20 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 h-full">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <Wind className="h-4 w-4 sm:h-5 sm:w-5 text-green-300 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-white/90">Wind Speed</span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-white mb-1 leading-tight">
                            {weatherData.current.windSpeed} km/h
                          </div>
                          <div className="text-xs sm:text-sm text-white/70">Wind conditions</div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Weather Condition */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-md border-white/20 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 h-full">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            {getWeatherIcon(weatherData.current.weatherCode, weatherData.current.isDay)}
                            <span className="text-xs sm:text-sm font-medium text-white/90">Condition</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-black text-white mb-1 capitalize leading-tight">
                            {weatherData.current.weatherDescription}
                          </div>
                          <div className="text-xs sm:text-sm text-white/70">Weather status</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Additional Weather Details */}
            <Card className="bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white">Weather Details</CardTitle>
                <CardDescription className="text-white/80 text-base sm:text-lg">
                  More detailed weather information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isLoading ? (
                  <div className="space-y-3 sm:space-y-4">
                    <Skeleton className="h-3 w-full bg-white/20" />
                    <Skeleton className="h-3 w-3/4 bg-white/20" />
                    <Skeleton className="h-3 w-1/2 bg-white/20" />
                  </div>
                ) : weatherData ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <motion.div
                      whileHover={{ y: -3 }}
                      whileTap={{ y: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20"
                    >
                      <h3 className="font-bold text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 uppercase tracking-wide">Temperature Range</h3>
                      <p className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2 leading-tight">
                        <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                          {weatherData.daily?.maxTemp || '--'}°C
                        </span> / 
                        <span className="text-white/70"> {weatherData.daily?.minTemp || '--'}°C</span>
                      </p>
                      <p className="text-xs sm:text-sm text-white/60">High / Low</p>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ y: -3 }}
                      whileTap={{ y: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20"
                    >
                      <h3 className="font-bold text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 uppercase tracking-wide">Wind Details</h3>
                      <p className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2 leading-tight">{weatherData.current.windSpeed} km/h</p>
                      <p className="text-xs sm:text-sm text-white/60">Direction: {weatherData.current.windDirection}°</p>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ y: -3 }}
                      whileTap={{ y: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20"
                    >
                      <h3 className="font-bold text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 uppercase tracking-wide">Location</h3>
                      <p className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2 leading-tight">{weatherData.city.name}</p>
                      <p className="text-xs sm:text-sm text-white/60 break-words">
                        {weatherData.city.admin1 && `${weatherData.city.admin1}, `}
                        {weatherData.city.country}
                      </p>
                    </motion.div>
                    

                  </div>
                ) : (
                  <div className="text-center text-white/60 py-6 sm:py-8">
                    {/* Removed Sun icon and text as per user request to avoid perceived overlap */}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Forecast */}
            {weatherData?.weekly && (
              <Card className="bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white">7-Day Forecast</CardTitle>
                  <CardDescription className="text-white/80 text-base sm:text-lg">
                    Weekly weather outlook
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 sm:h-32 w-full bg-white/20 rounded-xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                      {weatherData.weekly.map((day, index) => {
                        const date = new Date(day.date);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const dayNumber = date.getDate();
                        
                        return (
                          <motion.div
                            key={day.date}
                            whileHover={{ y: -5 }}
                            whileTap={{ y: 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Card className={`bg-white/10 backdrop-blur-md border-white/20 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 h-full ${index === 0 ? 'border-blue-400/50' : ''}`}>
                              <CardContent className="p-3 sm:p-4 flex flex-col items-center">
                                <div className="text-xs font-bold text-white/80 mb-1">
                                  {index === 0 ? 'Today' : dayName}
                                </div>
                                <div className="text-xs text-white/60 mb-2">
                                  {dayNumber}
                                </div>
                                <div className="mb-2">
                                  {getWeatherIcon(day.weatherCode, true)}
                                </div>
                                <div className="text-sm font-bold text-white mb-1">
                                  {day.maxTemp}° <span className="text-white/60 font-normal">{day.minTemp}°</span>
                                </div>
                                <div className="text-xs text-white/60 text-center">
                                  {day.weatherDescription}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Initial State */}
        {!city && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto text-center px-4"
          >
            <Card className="bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center gap-4 sm:gap-6">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative w-24 h-24 sm:w-32 sm:h-32"
                  >
                    <img
                      src="/logo.svg"
                      alt="Weather Now Logo"
                      className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
                    Welcome to Weather Now
                  </h2>
                  <p className="text-lg sm:text-xl text-white/90 font-medium mb-3 sm:mb-4 px-2">
                    Perfect for outdoor enthusiasts like Jamie! 
                  </p>
                  <p className="text-base sm:text-lg text-white/80 px-4">
                    Get instant weather updates for any city to plan your activities 🌟
                  </p>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-4 sm:mt-6"
                  >
                    <p className="text-sm sm:text-base text-white/60">
                      Search for a city above to get started ↓
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Custom styles for animated gradient */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .animate-gradient-x {
            animation-duration: 20s;
          }
        }
        
        @media (max-width: 480px) {
          .animate-gradient-x {
            animation-duration: 25s;
          }
        }
      `}</style>
    </div>
  )
}