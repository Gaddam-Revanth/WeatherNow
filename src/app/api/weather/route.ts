import { NextRequest, NextResponse } from 'next/server'

interface GeocodingResponse {
  results: Array<{
    id: number
    name: string
    latitude: number
    longitude: number
    country: string
    admin1?: string
  }>
}

interface WeatherResponse {
  latitude: number
  longitude: number
  current: {
    temperature_2m: number
    wind_speed_10m: number
    wind_direction_10m: number
    weather_code: number
    is_day: number
    time: string
    surface_pressure: number
    visibility: number
    uv_index: number
  }
  daily?: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    relative_humidity_2m_max: number[]
    wind_speed_10m_max: number[]
    weathercode: number[]
    uv_index_max: number[]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      )
    }

    // Validate city name format
    if (city.trim().length < 2) {
      return NextResponse.json(
        { error: 'City name must be at least 2 characters long' },
        { status: 400 }
      )
    }

    // First, get coordinates for the city using geocoding API
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=en`
    const geocodingResponse = await fetch(geocodingUrl)
    
    if (!geocodingResponse.ok) {
      console.error('Geocoding API error:', geocodingResponse.status, geocodingResponse.statusText)
      throw new Error('Failed to fetch city coordinates')
    }

    const geocodingData: GeocodingResponse = await geocodingResponse.json()

    if (!geocodingData.results || geocodingData.results.length === 0) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }

    const cityData = geocodingData.results[0]
    const { latitude, longitude, name, country, admin1 } = cityData

    // Now fetch weather data using the coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day,surface_pressure,visibility,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,wind_speed_10m_max,uv_index_max&forecast_days=7&timezone=auto`
    const weatherResponse = await fetch(weatherUrl)

    if (!weatherResponse.ok) {
      console.error('Weather API error:', weatherResponse.status, weatherResponse.statusText)
      throw new Error('Failed to fetch weather data')
    }

    const weatherData: WeatherResponse = await weatherResponse.json()

    // Validate the weather data structure
    if (!weatherData.current) {
      console.error('Weather API returned invalid data structure:', weatherData)
      return NextResponse.json({ error: 'Invalid weather data structure' }, { status: 500 })
    }

    // Get weather description based on weather code
    const getWeatherDescription = (code: number): string => {
      const weatherCodes: { [key: number]: string } = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Fog',
        51: 'Light drizzle',
        53: 'Drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Freezing drizzle',
        61: 'Light rain',
        63: 'Rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Freezing rain',
        71: 'Light snow',
        73: 'Snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Light showers',
        81: 'Showers',
        82: 'Heavy showers',
        85: 'Light snow showers',
        86: 'Snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm',
        99: 'Severe thunderstorm'
      }
      return weatherCodes[code] || 'Unknown'
    }

    // Construct the response
    const response = {
      city: {
        name,
        country,
        admin1: admin1 || '',
        latitude,
        longitude
      },
      current: {
        temperature: weatherData.current.temperature_2m,
        windSpeed: weatherData.current.wind_speed_10m,
        windDirection: weatherData.current.wind_direction_10m,
        weatherCode: weatherData.current.weather_code,
        weatherDescription: getWeatherDescription(weatherData.current.weather_code),
        isDay: weatherData.current.is_day === 1,
        time: weatherData.current.time,
        surfacePressure: weatherData.current.surface_pressure,
        visibility: weatherData.current.visibility,
        uvIndex: weatherData.current.uv_index
      },
      daily: weatherData.daily ? {
        maxTemp: weatherData.daily.temperature_2m_max[0],
        minTemp: weatherData.daily.temperature_2m_min[0],
        maxHumidity: weatherData.daily.relative_humidity_2m_max[0],
        maxWindSpeed: weatherData.daily.wind_speed_10m_max[0],
        weatherCode: weatherData.daily.weathercode[0]
      } : null,
      weekly: weatherData.daily ? weatherData.daily.time.map((day, index) => ({
        date: day,
        maxTemp: weatherData.daily?.temperature_2m_max[index],
        minTemp: weatherData.daily?.temperature_2m_min[index],
        maxHumidity: weatherData.daily?.relative_humidity_2m_max[index],
        maxWindSpeed: weatherData.daily?.wind_speed_10m_max[index],
        weatherCode: weatherData.daily?.weathercode[index],
        weatherDescription: weatherData.daily?.weathercode ? getWeatherDescription(weatherData.daily.weathercode[index]) : 'Unknown'
      })) : null
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Weather API error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Network connection failed' },
          { status: 503 }
        )
      }
      
      if (error.message.includes('Invalid weather data')) {
        return NextResponse.json(
          { error: 'Weather service unavailable' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}