"use client"

import type React from "react"
import { useState } from "react"
import DesktopWidget from "@/components/desktop-widget"
import { FileText } from "lucide-react"

interface DesktopProps {
  children: React.ReactNode
  theme: "light" | "dark"
  desktopFiles?: { id: string; name: string; content: string }[]
  onFileOpen?: (fileName: string, content: string) => void
}

export default function Desktop({ children, theme, desktopFiles = [], onFileOpen }: DesktopProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

  const desktopIcons = [
    { id: "documents", name: "Documents", icon: "📄" },
    { id: "pictures", name: "Pictures", icon: "🖼️" },
    { id: "downloads", name: "Downloads", icon: "📥" },
    { id: "trash", name: "Trash", icon: "🗑️" },
  ]

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowContextMenu(true)
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
  }

  const handleClick = () => {
    setSelectedIcon(null)
    setShowContextMenu(false)
  }

  const handleFileOpen = (fileName: string, content: string) => {
    if (onFileOpen) {
      onFileOpen(fileName, content)
    }
  }

  // Determine text color based on theme
  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-800"
  // Add a text shadow for better visibility on any background
  const textShadow = theme === "dark" ? "text-shadow-dark" : "text-shadow-light"

  return (
    <div className="relative h-full w-full pt-8" onClick={handleClick} onContextMenu={handleContextMenu}>
      {/* Add text shadow utility classes */}
      <style jsx global>{`
        .text-shadow-dark {
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        }
        .text-shadow-light {
          text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
        }
      `}</style>

      {/* Desktop icons */}
      <div className="grid grid-cols-1 gap-4 p-4">
        {desktopIcons.map((icon) => (
          <div
            key={icon.id}
            className={`flex w-24 cursor-pointer flex-col items-center rounded p-2 ${
              selectedIcon === icon.id
                ? theme === "dark"
                  ? "bg-gray-700/70"
                  : "bg-gray-300/70"
                : theme === "dark"
                  ? "hover:bg-gray-800/50"
                  : "hover:bg-gray-200/50"
            } drop-shadow-md`}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIcon(icon.id)
            }}
            onDoubleClick={(e) => {
              e.stopPropagation()
              // Handle double click (open folder)
            }}
          >
            <div className="text-3xl">{icon.icon}</div>
            <div className={`mt-1 text-center text-sm font-medium ${textColor} ${textShadow}`}>{icon.name}</div>
          </div>
        ))}

        {/* Desktop files */}
        {desktopFiles.map((file) => (
          <div
            key={file.id}
            className={`flex w-24 cursor-pointer flex-col items-center rounded p-2 ${
              selectedIcon === file.id
                ? theme === "dark"
                  ? "bg-gray-700/70"
                  : "bg-gray-300/70"
                : theme === "dark"
                  ? "hover:bg-gray-800/50"
                  : "hover:bg-gray-200/50"
            } drop-shadow-md`}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIcon(file.id)
            }}
            onDoubleClick={(e) => {
              e.stopPropagation()
              handleFileOpen(file.name, file.content)
            }}
          >
            <div className="text-3xl">
              <FileText className={`h-10 w-10 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
            </div>
            <div className={`mt-1 text-center text-sm font-medium ${textColor} ${textShadow}`}>{file.name}</div>
          </div>
        ))}
      </div>

      {/* Desktop widgets */}
      <div className="absolute right-4 top-16 w-64">
        <DesktopWidget title="Weather" theme={theme}>
          <div className="flex items-center justify-between">
            <div className="text-4xl">🌤️</div>
            <div>
              <div className="text-2xl font-bold">72°F</div>
              <div className="text-sm">Sunny</div>
            </div>
          </div>
        </DesktopWidget>

        <DesktopWidget title="Calendar" theme={theme}>
          <div className="text-center">
            <div className="text-xl font-bold">{new Date().toLocaleDateString(undefined, { weekday: "long" })}</div>
            <div className="text-3xl font-bold">{new Date().getDate()}</div>
            <div className="text-sm">
              {new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </div>
          </div>
        </DesktopWidget>
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <div
          className={`absolute z-50 w-48 rounded-md py-1 shadow-lg ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <button
            className={`w-full px-4 py-2 text-left ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            New Folder
          </button>
          <button
            className={`w-full px-4 py-2 text-left ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            New File
          </button>
          <div className={`my-1 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}></div>
          <button
            className={`w-full px-4 py-2 text-left ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            Change Background
          </button>
          <button
            className={`w-full px-4 py-2 text-left ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            Sort Icons
          </button>
        </div>
      )}

      {children}
    </div>
  )
}
