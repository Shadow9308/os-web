"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, Sun, Thermometer } from "lucide-react"

interface WeatherProps {
  theme: "light" | "dark"
}

export default function Weather({ theme }: WeatherProps) {
  const [activeTab, setActiveTab] = useState("today")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading weather data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const weatherData = {
    location: "San Francisco, CA",
    current: {
      temp: 72,
      condition: "Sunny",
      icon: <Sun className="h-12 w-12 text-yellow-400" />,
      humidity: 45,
      wind: 8,
      feelsLike: 74,
    },
    forecast: [
      { day: "Mon", temp: 72, icon: <Sun className="h-6 w-6 text-yellow-400" /> },
      { day: "Tue", temp: 68, icon: <Cloud className="h-6 w-6 text-gray-400" /> },
      { day: "Wed", temp: 65, icon: <CloudRain className="h-6 w-6 text-blue-400" /> },
      { day: "Thu", temp: 70, icon: <Cloud className="h-6 w-6 text-gray-400" /> },
      { day: "Fri", temp: 75, icon: <Sun className="h-6 w-6 text-yellow-400" /> },
    ],
  }

  return (
    <div className={`h-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      {/* Tabs */}
      <div className={`flex border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "today"
              ? theme === "dark"
                ? "border-b-2 border-blue-400 text-blue-400"
                : "border-b-2 border-blue-500 text-blue-600"
              : ""
          }`}
          onClick={() => setActiveTab("today")}
        >
          Today
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "forecast"
              ? theme === "dark"
                ? "border-b-2 border-blue-400 text-blue-400"
                : "border-b-2 border-blue-500 text-blue-600"
              : ""
          }`}
          onClick={() => setActiveTab("forecast")}
        >
          Forecast
        </button>
      </div>

      {loading ? (
        <div className="flex h-[calc(100%-44px)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
      ) : (
        <>
          {activeTab === "today" && (
            <div className="p-6">
              <h2 className="text-xl font-bold">{weatherData.location}</h2>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  {weatherData.current.icon}
                  <div className="ml-4">
                    <div className="text-4xl font-bold">{weatherData.current.temp}°F</div>
                    <div className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                      {weatherData.current.condition}
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white shadow"}`}>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex items-center">
                      <Thermometer className="mr-2 h-4 w-4" />
                      <span className="text-sm">Feels like: {weatherData.current.feelsLike}°F</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">💧</span>
                      <span className="text-sm">Humidity: {weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">💨</span>
                      <span className="text-sm">Wind: {weatherData.current.wind} mph</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium">Hourly Forecast</h3>
                <div
                  className={`mt-2 grid grid-cols-6 gap-2 overflow-x-auto rounded-lg p-4 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white shadow"
                  }`}
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="text-sm">{i === 0 ? "Now" : `${(i + new Date().getHours()) % 24}:00`}</div>
                      <div className="my-2 flex justify-center">
                        {i % 3 === 0 ? (
                          <Sun className="h-6 w-6 text-yellow-400" />
                        ) : (
                          <Cloud className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        {Math.round(weatherData.current.temp - i * 2 + Math.random() * 5)}°
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "forecast" && (
            <div className="p-6">
              <h2 className="text-xl font-bold">5-Day Forecast</h2>

              <div className={`mt-6 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white shadow"}`}>
                {weatherData.forecast.map((day, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 ${
                      i < weatherData.forecast.length - 1
                        ? theme === "dark"
                          ? "border-b border-gray-700"
                          : "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <div className="font-medium">{day.day}</div>
                    <div className="flex items-center">{day.icon}</div>
                    <div className="text-right">
                      <span className="text-lg font-medium">{day.temp}°</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-medium">Weather Details</h3>
                <div
                  className={`mt-2 grid grid-cols-2 gap-4 rounded-lg p-4 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white shadow"
                  }`}
                >
                  <div>
                    <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Sunrise</div>
                    <div className="text-lg font-medium">6:42 AM</div>
                  </div>
                  <div>
                    <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Sunset</div>
                    <div className="text-lg font-medium">7:38 PM</div>
                  </div>
                  <div>
                    <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Chance of Rain</div>
                    <div className="text-lg font-medium">10%</div>
                  </div>
                  <div>
                    <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Pressure</div>
                    <div className="text-lg font-medium">1012 hPa</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
