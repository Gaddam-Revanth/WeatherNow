import { useQuery } from "@tanstack/react-query"

interface WeatherData {
  city: {
    name: string
    country: string
    admin1: string
    latitude: number
    longitude: number
  }
  current: {
    temperature: number
    windSpeed: number
    windDirection: number
    weatherCode: number
    weatherDescription: string
    isDay: boolean
    time: string
    surfacePressure: number
    visibility: number
    uvIndex: number
  }
  daily: {
    maxTemp: number
    minTemp: number
    maxHumidity: number
    maxWindSpeed: number
    weatherCode: number
    uvIndexMax: number
  } | null
  weekly: Array<{
    date: string
    maxTemp: number
    minTemp: number
    maxHumidity: number
    maxWindSpeed: number
    weatherCode: number
    weatherDescription: string
  }> | null
}

export function useWeather(city: string) {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: async (): Promise<WeatherData> => {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch weather data")
      }
      
      return response.json()
    },
    enabled: !!city && city.length > 0,
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}