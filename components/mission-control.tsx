"use client"

import { X } from "lucide-react"

interface MissionControlProps {
  openApps: { id: string; title: string; icon: string; minimized: boolean }[]
  onAppClick: (id: string) => void
  onClose: () => void
  theme: "light" | "dark"
}

export default function MissionControl({ openApps, onAppClick, onClose, theme }: MissionControlProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black" onClick={onClose}>
      <div className="absolute right-4 top-4">
        <button className="rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700" onClick={onClose}>
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="mb-8 text-center text-white">
        <h2 className="text-2xl font-light">Mission Control</h2>
        <p className="text-sm opacity-80">All open applications</p>
      </div>

      {openApps.length === 0 ? (
        <div className="text-center text-white">
          <p>No open applications</p>
        </div>
      ) : (
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {openApps.map((app) => (
            <div
              key={app.id}
              className="group cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onAppClick(app.id)
              }}
            >
              <div
                className={`aspect-video overflow-hidden rounded-lg border shadow-lg transition-transform duration-300 group-hover:scale-105 ${
                  theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
                }`}
              >
                <div className={`flex h-8 items-center px-3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>

                  <div className="mx-auto flex items-center">
                    <span className="mr-2">{app.icon}</span>
                    <span className="text-sm font-medium">{app.title}</span>
                  </div>

                  <div className="w-16"></div>
                </div>

                <div
                  className={`flex h-[calc(100%-32px)] items-center justify-center ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl">{app.icon}</div>
                    <div className="mt-2">{app.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
