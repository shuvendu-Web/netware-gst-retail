import { useState, useEffect } from 'react';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type WeatherIconType = 
  | 'sun' 
  | 'moon' 
  | 'cloud-sun' 
  | 'cloud-moon' 
  | 'cloud' 
  | 'cloud-rain' 
  | 'cloud-lightning' 
  | 'cloud-fog' 
  | 'snowflake';

export interface WeatherInfo {
  temperature: number;
  condition: string;
  city: string;
  iconType: WeatherIconType;
  isNight: boolean;
  windSpeed?: number;
}

export function useWeatherAndTime() {
  const [now, setNow] = useState<Date>(new Date());
  const [weather, setWeather] = useState<WeatherInfo>({
    temperature: 26,
    condition: 'Pleasant Weather',
    city: 'Bengaluru',
    iconType: 'sun',
    isNight: false,
  });

  // Keep time updated every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();

  // Determine time of day
  let timeOfDay: TimeOfDay = 'morning';
  let greeting = 'Good Morning!';
  let greetingEmoji = '☀️';
  let greetingSubtitle = "Start your day with high sales and seamless GST billing.";

  if (hours >= 4 && hours < 12) {
    timeOfDay = 'morning';
    greeting = 'Good Morning!';
    greetingEmoji = '☀️';
    greetingSubtitle = 'Start your morning with fresh orders, quick billing & stock updates.';
  } else if (hours >= 12 && hours < 17) {
    timeOfDay = 'afternoon';
    greeting = 'Good Afternoon!';
    greetingEmoji = '🌤️';
    greetingSubtitle = 'Peak operational hours. Monitor live transactions & customer queues.';
  } else if (hours >= 17 && hours < 22) {
    timeOfDay = 'evening';
    greeting = 'Good Evening!';
    greetingEmoji = '🌆';
    greetingSubtitle = "Review today's ledger balances, daily sales & GST tax summaries.";
  } else {
    timeOfDay = 'night';
    greeting = 'Good Night!';
    greetingEmoji = '🌙';
    greetingSubtitle = 'Summary closed for the day. Safe bookkeeping & restful evening.';
  }

  const isNightTime = hours >= 19 || hours < 5;

  // Format date and time
  const formattedDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Card theme gradients based on time of day
  const cardGradient = {
    morning: 'from-amber-100/90 via-orange-50/80 to-indigo-100/80 border-amber-200/70 text-slate-800',
    afternoon: 'from-sky-100 via-blue-50/80 to-indigo-100 border-sky-200/70 text-slate-800',
    evening: 'from-purple-100 via-pink-100/80 to-amber-100/70 border-purple-200/70 text-slate-800',
    night: 'from-slate-900 via-indigo-950 to-purple-950 border-indigo-500/30 text-white',
  }[timeOfDay];

  // Fetch local weather
  useEffect(() => {
    let isMounted = true;

    // Detect city based on browser timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    let defaultCity = 'Bengaluru';
    let defaultLat = 12.9716;
    let defaultLon = 77.5946;

    if (tz.includes('Kolkata') || tz.includes('India')) {
      defaultCity = 'Bengaluru';
      defaultLat = 12.9716;
      defaultLon = 77.5946;
    } else if (tz.includes('New_York')) {
      defaultCity = 'New York';
      defaultLat = 40.7128;
      defaultLon = -74.006;
    } else if (tz.includes('London')) {
      defaultCity = 'London';
      defaultLat = 51.5074;
      defaultLon = -0.1278;
    } else if (tz.includes('Dubai')) {
      defaultCity = 'Dubai';
      defaultLat = 25.2048;
      defaultLon = 55.2708;
    } else if (tz.includes('Singapore')) {
      defaultCity = 'Singapore';
      defaultLat = 1.3521;
      defaultLon = 103.8198;
    }

    async function fetchWeather(lat: number, lon: number, cityName: string) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!res.ok) throw new Error('Weather API error');
        const data = await res.json();
        const cw = data.current_weather;
        if (!cw) return;

        const isNight = cw.is_day === 0;
        const code = cw.weathercode;
        let condition = 'Clear Sky';
        let iconType: WeatherIconType = isNight ? 'moon' : 'sun';

        if (code === 0) {
          condition = isNight ? 'Clear Night' : 'Sunny';
          iconType = isNight ? 'moon' : 'sun';
        } else if (code >= 1 && code <= 3) {
          condition = isNight ? 'Partly Cloudy' : 'Partly Sunny';
          iconType = isNight ? 'cloud-moon' : 'cloud-sun';
        } else if (code === 45 || code === 48) {
          condition = 'Misty Fog';
          iconType = 'cloud-fog';
        } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
          condition = 'Light Rain';
          iconType = 'cloud-rain';
        } else if (code >= 71 && code <= 77) {
          condition = 'Snowy';
          iconType = 'snowflake';
        } else if (code >= 95) {
          condition = 'Thunderstorm';
          iconType = 'cloud-lightning';
        }

        if (isMounted) {
          setWeather({
            temperature: Math.round(cw.temperature),
            condition,
            city: cityName,
            iconType,
            isNight,
            windSpeed: cw.windspeed
          });
        }
      } catch {
        // Fallback gracefully to time-of-day weather
        if (isMounted) {
          setWeather({
            temperature: isNightTime ? 22 : 28,
            condition: isNightTime ? 'Clear Evening' : 'Sunny',
            city: defaultCity,
            iconType: isNightTime ? 'moon' : 'sun',
            isNight: isNightTime,
          });
        }
      }
    }

    // Try HTML5 Geolocation with graceful timeout, fallback to timezone coords
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Local Weather');
        },
        () => {
          fetchWeather(defaultLat, defaultLon, defaultCity);
        },
        { timeout: 4000 }
      );
    } else {
      fetchWeather(defaultLat, defaultLon, defaultCity);
    }

    return () => {
      isMounted = false;
    };
  }, [isNightTime]);

  return {
    now,
    timeOfDay,
    greeting,
    greetingEmoji,
    greetingSubtitle,
    formattedDate,
    formattedTime,
    cardGradient,
    weather,
  };
}
