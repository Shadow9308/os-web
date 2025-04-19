"use client"

import { useState, useEffect } from "react"
import Dock from "@/components/dock"
import Menubar from "@/components/menubar"
import Desktop from "@/components/desktop"
import Window from "@/components/window"
import NotificationCenter from "@/components/notification-center"
import Spotlight from "@/components/spotlight"
import Terminal from "@/components/apps/terminal"
import Weather from "@/components/apps/weather"
import FileExplorer from "@/components/apps/file-explorer"
import VSCode from "@/components/apps/vscode"
import WallpaperPicker from "@/components/apps/wallpaper-picker"
import MissionControl from "@/components/mission-control"
import Notes from "@/components/apps/notes"
import Finder from "@/components/apps/finder"
import { Clock, Sun, Moon } from "lucide-react"

export default function DesktopInterface() {
  const [time, setTime] = useState(new Date())
  const [openApps, setOpenApps] = useState<{ id: string; title: string; icon: string; minimized: boolean }[]>([])
  const [activeAppId, setActiveAppId] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [showMissionControl, setShowMissionControl] = useState(false)
  const [notifications, setNotifications] = useState<{ id: string; title: string; message: string; time: Date }[]>([])
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [wallpaper, setWallpaper] = useState<string>("/wallpapers/mojave-day.jpg")
  const [isDynamicWallpaper, setIsDynamicWallpaper] = useState(false)
  const [useSolidBackground, setUseSolidBackground] = useState(false)
  const [solidBackgroundColor, setSolidBackgroundColor] = useState("#1a1a2e") // Dark blue color for dark mode
  const [desktopFiles, setDesktopFiles] = useState<{ id: string; name: string; content: string }[]>([])

  // Set appropriate wallpaper when theme changes
  useEffect(() => {
    if (theme === "dark") {
      // Check if the current wallpaper is a solid color (starts with #)
      if (wallpaper.startsWith("#")) {
        setUseSolidBackground(true)
        setSolidBackgroundColor(wallpaper)
      } else {
        // Use default solid background color for dark mode
        setUseSolidBackground(true)
        setSolidBackgroundColor("#1a1a2e") // Dark blue that matches the UI
      }
    } else {
      // For light mode, check if we're using a solid color
      if (wallpaper.startsWith("#")) {
        setUseSolidBackground(true)
        setSolidBackgroundColor(wallpaper)
      } else {
        // Use image wallpaper for light mode
        setUseSolidBackground(false)
        if (isDynamicWallpaper) {
          updateDynamicWallpaper()
        }
      }
    }
  }, [theme, isDynamicWallpaper, wallpaper])

  // Load desktop files from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("saved-notes")
    if (savedNotes) {
      try {
        const notes = JSON.parse(savedNotes)
        setDesktopFiles(notes)
      } catch (e) {
        console.error("Failed to parse saved notes", e)
      }
    }
  }, [])

  const updateDynamicWallpaper = () => {
    if (!isDynamicWallpaper) return

    const hour = new Date().getHours()
    if (theme === "dark") {
      // Use solid background in dark mode
      setUseSolidBackground(true)
    } else {
      // Light mode - use time-based wallpapers
      setUseSolidBackground(false)
      if (hour >= 6 && hour < 12) {
        setWallpaper("/wallpapers/mojave-day.jpg")
      } else if (hour >= 12 && hour < 18) {
        setWallpaper("/wallpapers/mojave-day.jpg")
      } else if (hour >= 18 && hour < 20) {
        setWallpaper("/wallpapers/mojave-day.jpg")
      } else {
        setWallpaper("/wallpapers/mojave-day.jpg")
      }
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
      updateDynamicWallpaper()
    }, 1000)

    return () => clearInterval(timer)
  }, [isDynamicWallpaper, theme])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + Space for Spotlight
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault()
        setShowSpotlight((prev) => !prev)
      }

      // F3 or Command/Ctrl + Up for Mission Control
      if (e.key === "F3" || ((e.metaKey || e.ctrlKey) && e.key === "ArrowUp")) {
        e.preventDefault()
        setShowMissionControl((prev) => !prev)
      }

      // Escape to close spotlight and mission control
      if (e.key === "Escape") {
        setShowSpotlight(false)
        setShowMissionControl(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const openApp = (id: string, title: string, icon: string) => {
    if (!openApps.find((app) => app.id === id)) {
      const newApp = { id, title, icon, minimized: false }
      setOpenApps([...openApps, newApp])
    } else {
      // Unminimize if already open but minimized
      setOpenApps(openApps.map((app) => (app.id === id ? { ...app, minimized: false } : app)))
    }
    setActiveAppId(id)
  }

  const closeApp = (id: string) => {
    setOpenApps(openApps.filter((app) => app.id !== id))
    if (activeAppId === id) {
      setActiveAppId(openApps.length > 1 ? openApps.filter((app) => app.id !== id)[0]?.id : null)
    }
  }

  const minimizeApp = (id: string) => {
    setOpenApps(openApps.map((app) => (app.id === id ? { ...app, minimized: true } : app)))
    setActiveAppId(openApps.find((app) => app.id !== id && !app.minimized)?.id || null)
  }

  const activateApp = (id: string) => {
    setActiveAppId(id)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
    addNotification("System", `Switched to ${theme === "light" ? "dark" : "light"} mode`)
  }

  const addNotification = (title: string, message: string) => {
    const newNotification = {
      id: Date.now().toString(),
      title,
      message,
      time: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
    }, 5000)
  }

  const changeWallpaper = (newWallpaper: string, isDynamic = false) => {
    // Check if it's a solid color (starts with #)
    if (newWallpaper.startsWith("#")) {
      setUseSolidBackground(true)
      setSolidBackgroundColor(newWallpaper)
      setWallpaper(newWallpaper)
    } else {
      // It's an image
      if (theme === "dark") {
        // Keep using solid background in dark mode unless it's a custom wallpaper
        const isCustomWallpaper = !newWallpaper.startsWith("/wallpapers/") || newWallpaper.startsWith("blob:")
        if (isCustomWallpaper) {
          setUseSolidBackground(false)
          setWallpaper(newWallpaper)
        } else {
          setUseSolidBackground(true)
          setWallpaper(newWallpaper) // Store the path even though we're using solid background
        }
      } else {
        setUseSolidBackground(false)
        setWallpaper(newWallpaper)
      }
    }
    setIsDynamicWallpaper(isDynamic)
    addNotification("System", "Wallpaper changed successfully")
  }

  const saveNoteToDesktop = (fileName: string, content: string) => {
    const newFile = {
      id: Date.now().toString(),
      name: fileName,
      content: content,
    }

    // Update desktop files
    const updatedFiles = [...desktopFiles, newFile]
    setDesktopFiles(updatedFiles)

    // Save to localStorage
    localStorage.setItem("saved-notes", JSON.stringify(updatedFiles))

    addNotification("Notes", `Saved ${fileName} to Desktop`)
  }

  const openFile = (fileName: string, content: string) => {
    // Open the file in Notes app
    openApp("notes", "Notes", "📝")

    // We would need to pass the content to the Notes app
    // This would require a more complex state management approach
    // For now, we'll just show a notification
    addNotification("Finder", `Opened ${fileName}`)
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${theme === "dark" ? "text-white" : "text-black"}`}
      style={
        useSolidBackground
          ? { backgroundColor: solidBackgroundColor }
          : {
              backgroundImage: `url(${wallpaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
      }
    >
      <Menubar
        time={time}
        onNotificationsToggle={() => setShowNotifications(!showNotifications)}
        onSpotlightToggle={() => setShowSpotlight(!showSpotlight)}
        onMissionControlToggle={() => setShowMissionControl(!showMissionControl)}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <Desktop theme={theme} desktopFiles={desktopFiles} onFileOpen={openFile}>
        {openApps.map(
          (app) =>
            !app.minimized && (
              <Window
                key={app.id}
                id={app.id}
                title={app.title}
                icon={app.icon}
                isActive={activeAppId === app.id}
                onClose={() => closeApp(app.id)}
                onMinimize={() => minimizeApp(app.id)}
                onActivate={() => activateApp(app.id)}
                theme={theme}
              >
                {app.id === "clock" && (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Clock className={`mx-auto h-24 w-24 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                      <div className="mt-4 text-4xl font-light">{time.toLocaleTimeString()}</div>
                      <div className={`mt-2 text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {time.toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {app.id === "notes" && <Notes theme={theme} onSaveToDesktop={saveNoteToDesktop} />}

                {app.id === "calculator" && (
                  <div
                    className={`flex h-full flex-col items-center justify-center p-4 ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <div
                      className={`mb-4 w-full rounded p-2 text-right text-2xl ${
                        theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"
                      }`}
                    >
                      0
                    </div>
                    <div className="grid w-full grid-cols-4 gap-2">
                      {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "=", "+"].map((btn) => (
                        <button
                          key={btn}
                          className={`rounded p-2 text-lg ${
                            theme === "dark"
                              ? "bg-gray-700 hover:bg-gray-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-black"
                          }`}
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {app.id === "terminal" && <Terminal theme={theme} />}

                {app.id === "weather" && <Weather theme={theme} />}

                {app.id === "files" && <FileExplorer theme={theme} />}

                {app.id === "finder" && <Finder theme={theme} onOpenFile={openFile} />}

                {app.id === "vscode" && <VSCode theme={theme} />}

                {app.id === "wallpaper" && (
                  <WallpaperPicker
                    theme={theme}
                    currentWallpaper={wallpaper}
                    isDynamicWallpaper={isDynamicWallpaper}
                    onWallpaperChange={changeWallpaper}
                  />
                )}
              </Window>
            ),
        )}
      </Desktop>

      {showNotifications && (
        <NotificationCenter notifications={notifications} onClose={() => setShowNotifications(false)} theme={theme} />
      )}

      {showSpotlight && (
        <Spotlight
          onClose={() => setShowSpotlight(false)}
          onAppOpen={(id, title, icon) => {
            openApp(id, title, icon)
            setShowSpotlight(false)
          }}
          theme={theme}
        />
      )}

      {showMissionControl && (
        <MissionControl
          openApps={openApps.filter((app) => !app.minimized)}
          onAppClick={(id) => {
            activateApp(id)
            setShowMissionControl(false)
          }}
          onClose={() => setShowMissionControl(false)}
          theme={theme}
        />
      )}

      <Dock
        apps={[
          { id: "finder", title: "Finder", icon: "📁" },
          { id: "files", title: "Files", icon: "🗂️" },
          { id: "terminal", title: "Terminal", icon: "💻" },
          { id: "notes", title: "Notes", icon: "📝" },
          { id: "calculator", title: "Calculator", icon: "🧮" },
          { id: "clock", title: "Clock", icon: "🕒" },
          { id: "weather", title: "Weather", icon: "🌤️" },
          { id: "vscode", title: "VS Code", icon: "📘" },
          { id: "wallpaper", title: "Wallpaper", icon: "🖼️" },
        ]}
        openApps={openApps}
        onAppClick={openApp}
        theme={theme}
      />

      {/* Quick theme toggle button */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-4 right-4 rounded-full p-2 shadow-lg ${
          theme === "dark"
            ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>
    </div>
  )
}
