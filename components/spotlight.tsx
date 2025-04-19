"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Calculator, ImageIcon, Globe } from "lucide-react"

interface SpotlightProps {
  onClose: () => void
  onAppOpen: (id: string, title: string, icon: string) => void
  theme: "light" | "dark"
}

export default function Spotlight({ onClose, onAppOpen, theme }: SpotlightProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const apps = [
    { id: "finder", title: "Finder", icon: "📁", keywords: ["files", "folder", "browse"] },
    { id: "files", title: "Files", icon: "🗂️", keywords: ["explorer", "documents", "browse"] },
    { id: "terminal", title: "Terminal", icon: "💻", keywords: ["command", "prompt", "shell", "bash"] },
    { id: "notes", title: "Notes", icon: "📝", keywords: ["text", "write", "document"] },
    { id: "calculator", title: "Calculator", icon: "🧮", keywords: ["math", "compute", "numbers"] },
    { id: "clock", title: "Clock", icon: "🕒", keywords: ["time", "alarm", "watch"] },
    { id: "weather", title: "Weather", icon: "🌤️", keywords: ["forecast", "temperature", "climate"] },
    { id: "vscode", title: "VS Code", icon: "📘", keywords: ["code", "editor", "development", "programming"] },
    {
      id: "wallpaper",
      title: "Wallpaper",
      icon: <ImageIcon className="h-5 w-5" />,
      keywords: ["background", "picture", "desktop"],
    },
  ]

  // Additional search categories
  const webSearches = [
    {
      id: "google",
      title: "Search Google for",
      icon: <Globe className="h-5 w-5" />,
      action: (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    },
    {
      id: "wikipedia",
      title: "Search Wikipedia for",
      icon: <Globe className="h-5 w-5" />,
      action: (q: string) => `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`,
    },
  ]

  const calculations = [
    {
      id: "calc",
      title: "Calculate",
      icon: <Calculator className="h-5 w-5" />,
      regex: /^[\d\s+\-*/$$$$.]+$/,
      action: (q: string) => {
        try {
          // eslint-disable-next-line no-eval
          return eval(q).toString()
        } catch (e) {
          return "Invalid calculation"
        }
      },
    },
  ]

  const filteredApps =
    query.trim() === ""
      ? apps
      : apps.filter(
          (app) =>
            app.title.toLowerCase().includes(query.toLowerCase()) ||
            app.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())),
        )

  const showWebSearches = query.trim() !== ""
  const showCalculation = query.trim() !== "" && calculations[0].regex.test(query)

  // Combine all results
  const allResults = [
    ...filteredApps,
    ...(showWebSearches ? webSearches : []),
    ...(showCalculation ? calculations : []),
  ]

  useEffect(() => {
    // Reset selected index when results change
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    // Focus input when spotlight opens
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % allResults.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % allResults.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const selected = allResults[selectedIndex]

      if (selected) {
        if ("action" in selected) {
          // It's a web search or calculation
          if (selected.id === "calc") {
            // For calculations, just show the result
            setQuery(selected.action(query))
          } else {
            // For web searches, open in a new tab
            window.open(selected.action(query), "_blank")
            onClose()
          }
        } else {
          // It's an app
          onAppOpen(selected.id, selected.title, selected.icon)
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32" onClick={onClose}>
      <div
        className={`w-full max-w-xl overflow-hidden rounded-xl shadow-2xl ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center gap-2 p-4 ${
            theme === "dark" ? "border-b border-gray-700" : "border-b border-gray-200"
          }`}
        >
          <Search className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search apps, files, web, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent text-lg outline-none ${
              theme === "dark" ? "placeholder:text-gray-500" : "placeholder:text-gray-400"
            }`}
          />
          <button
            onClick={onClose}
            className={`rounded-full p-1 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {allResults.length === 0 ? (
            <div className="flex h-16 items-center justify-center text-gray-500">
              <p>No results found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Apps section */}
              {filteredApps.length > 0 && (
                <div>
                  <div
                    className={`px-3 py-1 text-xs font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Applications
                  </div>
                  {filteredApps.map((app, index) => (
                    <button
                      key={app.id}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left ${
                        selectedIndex === index
                          ? theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-100"
                      }`}
                      onClick={() => onAppOpen(app.id, app.title, app.icon)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <div className="font-medium">{app.title}</div>
                        <div
                          className={`text-xs ${
                            selectedIndex === index
                              ? "text-white/70"
                              : theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                          }`}
                        >
                          {app.keywords.join(", ")}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Web searches section */}
              {showWebSearches && (
                <div>
                  <div
                    className={`px-3 py-1 text-xs font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Web Search
                  </div>
                  {webSearches.map((search, index) => (
                    <button
                      key={search.id}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left ${
                        selectedIndex === filteredApps.length + index
                          ? theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-100"
                      }`}
                      onClick={() => window.open(search.action(query), "_blank")}
                      onMouseEnter={() => setSelectedIndex(filteredApps.length + index)}
                    >
                      {search.icon}
                      <div>
                        <div className="font-medium">
                          {search.title} "{query}"
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Calculation section */}
              {showCalculation && (
                <div>
                  <div
                    className={`px-3 py-1 text-xs font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Calculator
                  </div>
                  <button
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left ${
                      selectedIndex === filteredApps.length + (showWebSearches ? webSearches.length : 0)
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                    }`}
                    onClick={() => setQuery(calculations[0].action(query))}
                    onMouseEnter={() =>
                      setSelectedIndex(filteredApps.length + (showWebSearches ? webSearches.length : 0))
                    }
                  >
                    <Calculator className="h-5 w-5" />
                    <div>
                      <div className="font-medium">
                        {query} = {calculations[0].action(query)}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={`border-t p-2 text-xs ${theme === "dark" ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}
        >
          <div className="flex justify-between">
            <div>Press ↑↓ to navigate</div>
            <div>Press Enter to select</div>
            <div>Press Esc to close</div>
          </div>
        </div>
      </div>
    </div>
  )
}
