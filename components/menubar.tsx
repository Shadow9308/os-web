"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, Bell, Search, Sun, Moon, Wifi, Battery, Volume2, Grid3X3 } from "lucide-react"

interface MenubarProps {
  time: Date
  onNotificationsToggle: () => void
  onSpotlightToggle: () => void
  onMissionControlToggle: () => void
  theme: "light" | "dark"
  onThemeToggle: () => void
}

export default function Menubar({
  time,
  onNotificationsToggle,
  onSpotlightToggle,
  onMissionControlToggle,
  theme,
  onThemeToggle,
}: MenubarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [wifiName, setWifiName] = useState("WebOS-Network")
  const [showWifiDropdown, setShowWifiDropdown] = useState(false)
  const [showBatteryDropdown, setShowBatteryDropdown] = useState(false)

  // Generate random battery level and wifi name on mount
  useEffect(() => {
    // Random battery level between 15 and 100
    const randomBattery = Math.floor(Math.random() * 86) + 15
    setBatteryLevel(randomBattery)

    // Random wifi name
    const wifiNames = [
      "WebOS-Network",
      "HomeWifi",
      "Skynet",
      "FBI Surveillance Van",
      "Pretty Fly for a WiFi",
      "WiFi Art Thou Romeo",
      "The LAN Before Time",
      "Bill Wi the Science Fi",
      "Wu-Tang LAN",
      "Hide Yo Kids Hide Yo WiFi",
    ]
    const randomWifi = wifiNames[Math.floor(Math.random() * wifiNames.length)]
    setWifiName(randomWifi)
  }, [])

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  const toggleWifiDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowWifiDropdown(!showWifiDropdown)
    setShowBatteryDropdown(false)
  }

  const toggleBatteryDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowBatteryDropdown(!showBatteryDropdown)
    setShowWifiDropdown(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowWifiDropdown(false)
      setShowBatteryDropdown(false)
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Get battery icon based on level
  const getBatteryIcon = () => {
    if (batteryLevel >= 90) return "🔋"
    if (batteryLevel >= 60) return "🔋"
    if (batteryLevel >= 30) return "🔋"
    if (batteryLevel >= 10) return "🪫"
    return "🪫"
  }

  return (
    <div
      className={`fixed top-0 z-50 flex h-8 w-full items-center justify-between px-4 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center font-semibold">
          <span className="mr-2">🖥️</span>
          <span>WebOS</span>
        </div>

        <div className="relative">
          <button
            className={`flex items-center px-2 py-1 ${
              activeMenu === "file"
                ? theme === "dark"
                  ? "rounded bg-white/20"
                  : "rounded bg-black/10"
                : theme === "dark"
                  ? "hover:bg-white/10"
                  : "hover:bg-black/5"
            }`}
            onClick={() => toggleMenu("file")}
          >
            File <ChevronDown className="ml-1 h-3 w-3" />
          </button>
          {activeMenu === "file" && (
            <div
              className={`absolute top-full mt-1 w-48 rounded-md py-1 shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                New Window
              </button>
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                Open...
              </button>
              <div className={`my-1 border-t ${theme === "dark" ? "border-white/20" : "border-black/10"}`}></div>
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                Close Window
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className={`flex items-center px-2 py-1 ${
              activeMenu === "edit"
                ? theme === "dark"
                  ? "rounded bg-white/20"
                  : "rounded bg-black/10"
                : theme === "dark"
                  ? "hover:bg-white/10"
                  : "hover:bg-black/5"
            }`}
            onClick={() => toggleMenu("edit")}
          >
            Edit <ChevronDown className="ml-1 h-3 w-3" />
          </button>
          {activeMenu === "edit" && (
            <div
              className={`absolute top-full mt-1 w-48 rounded-md py-1 shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                Undo
              </button>
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                Redo
              </button>
              <div className={`my-1 border-t ${theme === "dark" ? "border-white/20" : "border-black/10"}`}></div>
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                Cut
              </button>
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                Copy
              </button>
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                Paste
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className={`flex items-center px-2 py-1 ${
              activeMenu === "view"
                ? theme === "dark"
                  ? "rounded bg-white/20"
                  : "rounded bg-black/10"
                : theme === "dark"
                  ? "hover:bg-white/10"
                  : "hover:bg-black/5"
            }`}
            onClick={() => toggleMenu("view")}
          >
            View <ChevronDown className="ml-1 h-3 w-3" />
          </button>
          {activeMenu === "view" && (
            <div
              className={`absolute top-full mt-1 w-48 rounded-md py-1 shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                Show Hidden Files
              </button>
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                Icon View
              </button>
              <button
                className={`w-full px-4 py-1 text-left ${theme === "dark" ? "hover:bg-white/20" : "hover:bg-black/5"}`}
              >
                List View
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {/* WiFi dropdown */}
          <div className="relative">
            <button
              className={`flex items-center rounded-full p-1 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}
              onClick={toggleWifiDropdown}
              title="WiFi"
            >
              <Wifi className="h-4 w-4" />
            </button>

            {showWifiDropdown && (
              <div
                className={`absolute right-0 top-full mt-1 w-64 rounded-md py-2 shadow-lg ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">WiFi</span>
                    <span className="text-sm text-green-500">Connected</span>
                  </div>

                  <div className={`mb-4 rounded-md p-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wifi className="mr-2 h-4 w-4 text-green-500" />
                        <span className="font-medium">{wifiName}</span>
                      </div>
                      <span className="text-xs">✓</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Connected</div>
                  </div>

                  <div className="space-y-2">
                    <div className={`rounded-md p-2 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                      <div className="flex items-center">
                        <Wifi className="mr-2 h-4 w-4" />
                        <span>Neighbor's WiFi</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Secured</div>
                    </div>
                    <div className={`rounded-md p-2 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                      <div className="flex items-center">
                        <Wifi className="mr-2 h-4 w-4" />
                        <span>Coffee Shop</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Open Network</div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      className={`rounded-md px-3 py-1 text-sm ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      WiFi Settings
                    </button>
                    <button
                      className={`rounded-md px-3 py-1 text-sm ${
                        theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      Join Other...
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Battery dropdown */}
          <div className="relative">
            <button
              className={`flex items-center rounded-full p-1 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}
              onClick={toggleBatteryDropdown}
              title="Battery"
            >
              <Battery className="h-4 w-4" />
            </button>

            {showBatteryDropdown && (
              <div
                className={`absolute right-0 top-full mt-1 w-64 rounded-md py-2 shadow-lg ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2">
                  <div className="mb-2 font-medium">Battery</div>

                  <div className="mb-2 text-2xl font-bold">{batteryLevel}%</div>

                  <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-300">
                    <div
                      className={`h-full ${batteryLevel > 20 ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${batteryLevel}%` }}
                    ></div>
                  </div>

                  <div className="text-sm">
                    {batteryLevel > 80 ? (
                      <span>Battery is fully charged</span>
                    ) : batteryLevel > 20 ? (
                      <span>Battery is in good condition</span>
                    ) : (
                      <span className="text-red-500">Battery is running low</span>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      className={`w-full rounded-md px-3 py-1 text-sm ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      Battery Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Volume2 className="h-4 w-4" />
        </div>

        <button
          className={`rounded-full p-1 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          onClick={onThemeToggle}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          className={`rounded-full p-1 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          onClick={onMissionControlToggle}
          title="Mission Control"
        >
          <Grid3X3 className="h-4 w-4" />
        </button>

        <button
          className={`rounded-full p-1 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          onClick={onSpotlightToggle}
          title="Spotlight Search"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          className={`rounded-full p-1 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          onClick={onNotificationsToggle}
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <div className="text-sm">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    </div>
  )
}
