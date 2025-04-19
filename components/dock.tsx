"use client"

import { useState, useRef, useEffect } from "react"

interface DockApp {
  id: string
  title: string
  icon: string
}

interface DockProps {
  apps: DockApp[]
  openApps: { id: string; title: string; icon: string; minimized: boolean }[]
  onAppClick: (id: string, title: string, icon: string) => void
  theme: "light" | "dark"
}

export default function Dock({ apps, openApps, onAppClick, theme }: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const [magnification, setMagnification] = useState<Record<string, number>>({})

  // Handle dock magnification effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dockRef.current) return

      const dockRect = dockRef.current.getBoundingClientRect()
      const dockCenter = dockRect.left + dockRect.width / 2
      const mouseX = e.clientX

      // Calculate magnification for each app based on distance from mouse
      const newMagnification: Record<string, number> = {}

      apps.forEach((app) => {
        const appElement = document.getElementById(`dock-app-${app.id}`)
        if (!appElement) return

        const appRect = appElement.getBoundingClientRect()
        const appCenter = appRect.left + appRect.width / 2
        const distance = Math.abs(mouseX - appCenter)

        // Apply magnification based on distance (closer = larger)
        if (distance < 100) {
          const scale = 1 + (1 - distance / 100) * 0.5 // Max 1.5x scale
          newMagnification[app.id] = scale
        } else {
          newMagnification[app.id] = 1
        }
      })

      setMagnification(newMagnification)
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [apps])

  return (
    <div
      ref={dockRef}
      className={`fixed bottom-4 left-1/2 flex -translate-x-1/2 items-end space-x-1 rounded-2xl p-2 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } shadow-lg`}
    >
      {apps.map((app) => {
        const isOpen = openApps.some((openApp) => openApp.id === app.id)
        const isHovered = hoveredApp === app.id
        const scale = magnification[app.id] || 1

        return (
          <div
            key={app.id}
            id={`dock-app-${app.id}`}
            className="relative flex flex-col items-center transition-all duration-150"
            style={{
              transform: `scale(${scale})`,
              zIndex: isHovered ? 1 : 0,
            }}
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
          >
            <button
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                isHovered
                  ? theme === "dark"
                    ? "bg-gray-700/90"
                    : "bg-gray-200/90"
                  : theme === "dark"
                    ? "bg-gray-800/50 hover:bg-gray-700/50"
                    : "bg-white/50 hover:bg-gray-100/50"
              }`}
              onClick={() => onAppClick(app.id, app.title, app.icon)}
            >
              <span className="text-2xl">{app.icon}</span>
            </button>

            {isOpen && <div className="mt-1 h-1 w-1 rounded-full bg-white" />}

            {isHovered && (
              <div
                className={`absolute bottom-full mb-2 whitespace-nowrap rounded px-2 py-1 text-xs ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-black/70 text-white"
                }`}
              >
                {app.title}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
