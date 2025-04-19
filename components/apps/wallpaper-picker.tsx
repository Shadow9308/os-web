"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check, Upload, Folder, X, Plus, Trash2 } from "lucide-react"

interface WallpaperPickerProps {
  theme: "light" | "dark"
  currentWallpaper: string
  isDynamicWallpaper: boolean
  onWallpaperChange: (wallpaper: string, isDynamic?: boolean) => void
}

export default function WallpaperPicker({
  theme,
  currentWallpaper,
  isDynamicWallpaper,
  onWallpaperChange,
}: WallpaperPickerProps) {
  const [activeCategory, setActiveCategory] = useState<"featured" | "landscapes" | "abstract" | "solid" | "custom">(
    "featured",
  )
  const [customWallpapers, setCustomWallpapers] = useState<{ id: string; name: string; path: string }[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadName, setUploadName] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load custom wallpapers from localStorage on component mount
  useEffect(() => {
    const savedWallpapers = localStorage.getItem("customWallpapers")
    if (savedWallpapers) {
      try {
        setCustomWallpapers(JSON.parse(savedWallpapers))
      } catch (e) {
        console.error("Failed to parse custom wallpapers", e)
      }
    }
  }, [])

  // Save custom wallpapers to localStorage when they change
  useEffect(() => {
    localStorage.setItem("customWallpapers", JSON.stringify(customWallpapers))
  }, [customWallpapers])

  const wallpapers = {
    featured: [
      { id: "mojave-day", name: "Mojave (Day)", path: "/wallpapers/mojave-day.jpg" },
      { id: "catalina", name: "Catalina", path: "/wallpapers/catalina.jpg" },
      { id: "big-sur", name: "Big Sur", path: "/wallpapers/big-sur.jpg" },
      { id: "monterey", name: "Monterey", path: "/wallpapers/monterey.jpg" },
      { id: "ventura", name: "Ventura", path: "/wallpapers/ventura.jpg" },
    ],
    landscapes: [
      { id: "mountains", name: "Mountains", path: "/wallpapers/mountains.jpg" },
      { id: "beach", name: "Beach", path: "/wallpapers/beach.jpg" },
      { id: "forest", name: "Forest", path: "/wallpapers/forest.jpg" },
      { id: "desert", name: "Desert", path: "/wallpapers/desert.jpg" },
    ],
    abstract: [
      { id: "abstract1", name: "Waves", path: "/wallpapers/abstract1.jpg" },
      { id: "abstract2", name: "Geometric", path: "/wallpapers/abstract2.jpg" },
      { id: "abstract3", name: "Fluid", path: "/wallpapers/abstract3.jpg" },
    ],
    solid: [
      { id: "solid-blue", name: "Blue", path: "#1a1a2e" },
      { id: "solid-dark", name: "Dark", path: "#121212" },
      { id: "solid-green", name: "Green", path: "#1a2e1a" },
      { id: "solid-purple", name: "Purple", path: "#2e1a2e" },
      { id: "solid-navy", name: "Navy", path: "#0a192f" },
    ],
  }

  const dynamicWallpapers = [
    {
      id: "mojave-dynamic",
      name: "Mojave Dynamic",
      preview: "/wallpapers/mojave-day.jpg",
      path: "/wallpapers/mojave-day.jpg", // This is just the default, it will change based on time
    },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setSelectedFile(file)

    // Set a default name based on the file name
    const fileName = file.name.split(".")[0]
    setUploadName(fileName)
  }

  const handleUpload = () => {
    if (!selectedFile || !uploadName.trim()) return

    // In a real app, you would upload the file to a server here
    // For this demo, we'll just store the file in memory using an object URL
    const url = previewUrl || URL.createObjectURL(selectedFile)

    const newWallpaper = {
      id: `custom-${Date.now()}`,
      name: uploadName.trim(),
      path: url,
    }

    setCustomWallpapers([...customWallpapers, newWallpaper])
    setShowUploadModal(false)
    setPreviewUrl(null)
    setSelectedFile(null)
    setUploadName("")
    setActiveCategory("custom")
  }

  const deleteCustomWallpaper = (id: string) => {
    const wallpaper = customWallpapers.find((w) => w.id === id)
    if (wallpaper && wallpaper.path.startsWith("blob:")) {
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(wallpaper.path)
    }

    setCustomWallpapers(customWallpapers.filter((w) => w.id !== id))

    // If the deleted wallpaper was the current one, switch to a default
    if (currentWallpaper === wallpaper?.path) {
      onWallpaperChange("/wallpapers/mojave-day.jpg", false)
    }
  }

  const handleSolidColorSelect = (color: string) => {
    // For solid colors, we pass the hex value directly
    onWallpaperChange(color, false)
  }

  return (
    <div className={`flex h-full flex-col ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`flex border-b p-4 ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
        <h2 className="text-xl font-semibold">Desktop & Screen Saver</h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-48 border-r ${theme === "dark" ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-100"}`}
        >
          <div className="p-4">
            <h3 className="mb-2 font-medium uppercase text-xs text-gray-500">Desktop Pictures</h3>
            <ul>
              <li>
                <button
                  className={`w-full rounded-md px-3 py-1.5 text-left ${
                    activeCategory === "featured"
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => setActiveCategory("featured")}
                >
                  Featured
                </button>
              </li>
              <li>
                <button
                  className={`w-full rounded-md px-3 py-1.5 text-left ${
                    activeCategory === "landscapes"
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => setActiveCategory("landscapes")}
                >
                  Landscapes
                </button>
              </li>
              <li>
                <button
                  className={`w-full rounded-md px-3 py-1.5 text-left ${
                    activeCategory === "abstract"
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => setActiveCategory("abstract")}
                >
                  Abstract
                </button>
              </li>
              <li>
                <button
                  className={`w-full rounded-md px-3 py-1.5 text-left ${
                    activeCategory === "solid"
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => setActiveCategory("solid")}
                >
                  Solid Colors
                </button>
              </li>
              <li>
                <button
                  className={`w-full rounded-md px-3 py-1.5 text-left ${
                    activeCategory === "custom"
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => setActiveCategory("custom")}
                >
                  <div className="flex items-center">
                    <Folder className="mr-2 h-4 w-4" />
                    <span>My Wallpapers</span>
                  </div>
                </button>
              </li>
            </ul>

            <div className="mt-6">
              <button
                className={`flex w-full items-center justify-center rounded-md px-3 py-2 ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-black"
                }`}
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload Image</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Dynamic wallpapers section */}
          {activeCategory === "featured" && (
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-medium">Dynamic Wallpapers</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {dynamicWallpapers.map((wallpaper) => (
                  <div
                    key={wallpaper.id}
                    className={`group relative cursor-pointer overflow-hidden rounded-lg ${
                      isDynamicWallpaper && wallpaper.id === "mojave-dynamic"
                        ? theme === "dark"
                          ? "ring-2 ring-blue-500"
                          : "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => onWallpaperChange(wallpaper.path, true)}
                  >
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <img
                        src={wallpaper.preview || "/placeholder.svg?height=200&width=300"}
                        alt={wallpaper.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                      {isDynamicWallpaper && wallpaper.id === "mojave-dynamic" && (
                        <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm font-medium">{wallpaper.name}</div>
                    <div className="text-xs text-gray-500">Changes with time of day</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Static wallpapers */}
          {(activeCategory === "featured" || activeCategory === "landscapes" || activeCategory === "abstract") && (
            <div>
              <h3 className="mb-4 text-lg font-medium">
                {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {wallpapers[activeCategory as keyof typeof wallpapers].map((wallpaper) => (
                  <div
                    key={wallpaper.id}
                    className={`group relative cursor-pointer overflow-hidden rounded-lg ${
                      !isDynamicWallpaper && currentWallpaper === wallpaper.path
                        ? theme === "dark"
                          ? "ring-2 ring-blue-500"
                          : "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => onWallpaperChange(wallpaper.path, false)}
                  >
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <img
                        src={wallpaper.path || "/placeholder.svg?height=200&width=300"}
                        alt={wallpaper.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                      {!isDynamicWallpaper && currentWallpaper === wallpaper.path && (
                        <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm font-medium">{wallpaper.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solid colors */}
          {activeCategory === "solid" && (
            <div>
              <h3 className="mb-4 text-lg font-medium">Solid Colors</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {wallpapers.solid.map((color) => (
                  <div
                    key={color.id}
                    className={`group relative cursor-pointer overflow-hidden rounded-lg ${
                      !isDynamicWallpaper && currentWallpaper === color.path
                        ? theme === "dark"
                          ? "ring-2 ring-blue-500"
                          : "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => handleSolidColorSelect(color.path)}
                  >
                    <div
                      className="relative aspect-video overflow-hidden rounded-lg"
                      style={{ backgroundColor: color.path }}
                    >
                      {!isDynamicWallpaper && currentWallpaper === color.path && (
                        <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm font-medium">{color.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom wallpapers */}
          {activeCategory === "custom" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">My Wallpapers</h3>
                <button
                  className={`flex items-center rounded-md px-3 py-1.5 ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-black"
                  }`}
                  onClick={() => setShowUploadModal(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  <span>Add New</span>
                </button>
              </div>

              {customWallpapers.length === 0 ? (
                <div
                  className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 ${
                    theme === "dark" ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"
                  }`}
                >
                  <Folder className="mb-2 h-12 w-12 opacity-50" />
                  <p className="mb-4 text-center">No custom wallpapers yet</p>
                  <button
                    className={`flex items-center rounded-md px-4 py-2 ${
                      theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => setShowUploadModal(true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload Your First Wallpaper</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {customWallpapers.map((wallpaper) => (
                    <div
                      key={wallpaper.id}
                      className={`group relative cursor-pointer overflow-hidden rounded-lg ${
                        !isDynamicWallpaper && currentWallpaper === wallpaper.path
                          ? theme === "dark"
                            ? "ring-2 ring-blue-500"
                            : "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <div className="relative aspect-video overflow-hidden rounded-lg">
                        <img
                          src={wallpaper.path || "/placeholder.svg"}
                          alt={wallpaper.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                        {!isDynamicWallpaper && currentWallpaper === wallpaper.path && (
                          <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}

                        {/* Delete button */}
                        <button
                          className="absolute right-2 top-2 hidden rounded-full bg-red-500 p-1 group-hover:block"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteCustomWallpaper(wallpaper.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>

                        {/* Apply button */}
                        <button
                          className="absolute bottom-2 right-2 hidden rounded-md bg-blue-500 px-2 py-1 text-xs text-white group-hover:block"
                          onClick={(e) => {
                            e.stopPropagation()
                            onWallpaperChange(wallpaper.path, false)
                          }}
                        >
                          Apply
                        </button>
                      </div>
                      <div className="mt-2 text-sm font-medium">{wallpaper.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-full max-w-md rounded-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Upload Wallpaper</h3>
              <button
                className="rounded-full p-1 hover:bg-gray-700"
                onClick={() => {
                  setShowUploadModal(false)
                  setPreviewUrl(null)
                  setSelectedFile(null)
                  setUploadName("")
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Wallpaper Name</label>
              <input
                type="text"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                className={`w-full rounded-md border px-3 py-2 ${
                  theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"
                }`}
                placeholder="Enter a name for your wallpaper"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Select Image</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              {previewUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1"
                    onClick={() => {
                      setPreviewUrl(null)
                      setSelectedFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  className={`flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                    theme === "dark" ? "border-gray-700" : "border-gray-300"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">Click to select an image</p>
                  <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF up to 10MB</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className={`rounded-md px-4 py-2 ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-black"
                }`}
                onClick={() => {
                  setShowUploadModal(false)
                  setPreviewUrl(null)
                  setSelectedFile(null)
                  setUploadName("")
                }}
              >
                Cancel
              </button>
              <button
                className={`rounded-md px-4 py-2 ${
                  !selectedFile || !uploadName.trim()
                    ? "bg-gray-500 cursor-not-allowed text-gray-300"
                    : theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                onClick={handleUpload}
                disabled={!selectedFile || !uploadName.trim()}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
