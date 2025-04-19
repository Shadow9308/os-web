"use client"

import { useState, useEffect } from "react"
import { ChevronRight, File, Folder, Home, ArrowLeft, ArrowRight, RefreshCw, Grid, List } from "lucide-react"

interface FinderProps {
  theme: "light" | "dark"
  onOpenFile: (filePath: string, content: string) => void
}

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  size?: string
  modified?: string
  content?: string
  children?: FileItem[]
}

export default function Finder({ theme, onOpenFile }: FinderProps) {
  const [currentPath, setCurrentPath] = useState<string[]>(["Home"])
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [fileSystem, setFileSystem] = useState<FileItem>({
    id: "root",
    name: "Root",
    type: "folder",
    children: [
      {
        id: "home",
        name: "Home",
        type: "folder",
        modified: new Date().toLocaleDateString(),
        children: [
          {
            id: "documents",
            name: "Documents",
            type: "folder",
            modified: new Date().toLocaleDateString(),
            children: [
              {
                id: "work",
                name: "Work",
                type: "folder",
                modified: new Date().toLocaleDateString(),
                children: [],
              },
              {
                id: "personal",
                name: "Personal",
                type: "folder",
                modified: new Date().toLocaleDateString(),
                children: [],
              },
              {
                id: "resume",
                name: "resume.pdf",
                type: "file",
                size: "245 KB",
                modified: new Date().toLocaleDateString(),
                content: "Resume content would be here",
              },
              {
                id: "notes",
                name: "notes.txt",
                type: "file",
                size: "12 KB",
                modified: new Date().toLocaleDateString(),
                content: "Important notes for the project",
              },
            ],
          },
          {
            id: "downloads",
            name: "Downloads",
            type: "folder",
            modified: new Date().toLocaleDateString(),
            children: [
              {
                id: "software",
                name: "software.dmg",
                type: "file",
                size: "1.2 GB",
                modified: new Date().toLocaleDateString(),
                content: "Software installation file",
              },
            ],
          },
          {
            id: "pictures",
            name: "Pictures",
            type: "folder",
            modified: new Date().toLocaleDateString(),
            children: [
              {
                id: "vacation",
                name: "Vacation",
                type: "folder",
                modified: new Date().toLocaleDateString(),
                children: [],
              },
              {
                id: "profile",
                name: "profile.jpg",
                type: "file",
                size: "1.2 MB",
                modified: new Date().toLocaleDateString(),
                content: "Profile picture data",
              },
            ],
          },
          {
            id: "desktop",
            name: "Desktop",
            type: "folder",
            modified: new Date().toLocaleDateString(),
            children: [],
          },
          {
            id: "readme",
            name: "readme.txt",
            type: "file",
            size: "2 KB",
            modified: new Date().toLocaleDateString(),
            content:
              "Welcome to WebOS!\n\nThis is a web-based operating system interface built with Next.js and React.",
          },
        ],
      },
      {
        id: "applications",
        name: "Applications",
        type: "folder",
        modified: new Date().toLocaleDateString(),
        children: [
          {
            id: "browser",
            name: "Web Browser.app",
            type: "file",
            size: "45 MB",
            modified: new Date().toLocaleDateString(),
            content: "Browser application",
          },
          {
            id: "notes",
            name: "Notes.app",
            type: "file",
            size: "15 MB",
            modified: new Date().toLocaleDateString(),
            content: "Notes application",
          },
          {
            id: "terminal",
            name: "Terminal.app",
            type: "file",
            size: "8 MB",
            modified: new Date().toLocaleDateString(),
            content: "Terminal application",
          },
        ],
      },
      {
        id: "system",
        name: "System",
        type: "folder",
        modified: new Date().toLocaleDateString(),
        children: [
          {
            id: "library",
            name: "Library",
            type: "folder",
            modified: new Date().toLocaleDateString(),
            children: [],
          },
        ],
      },
    ],
  })

  // Load desktop files from localStorage
  useEffect(() => {
    const loadDesktopFiles = () => {
      const savedNotes = localStorage.getItem("saved-notes")
      if (savedNotes) {
        try {
          const notes = JSON.parse(savedNotes)

          // Find the desktop folder
          const homeFolder = fileSystem.children?.find((item) => item.id === "home")
          if (homeFolder && homeFolder.children) {
            const desktopFolder = homeFolder.children.find((item) => item.id === "desktop")
            if (desktopFolder && desktopFolder.children) {
              // Add saved notes to desktop
              const updatedDesktopChildren = [...desktopFolder.children]

              notes.forEach((note: { id: string; name: string; content: string }) => {
                // Check if the note already exists
                if (!updatedDesktopChildren.some((item) => item.id === note.id)) {
                  updatedDesktopChildren.push({
                    id: note.id,
                    name: note.name,
                    type: "file",
                    size: `${Math.round(note.content.length / 100)} KB`,
                    modified: new Date().toLocaleDateString(),
                    content: note.content,
                  })
                }
              })

              // Update desktop folder
              desktopFolder.children = updatedDesktopChildren

              // Update file system
              setFileSystem({ ...fileSystem })
            }
          }
        } catch (e) {
          console.error("Failed to load desktop files", e)
        }
      }
    }

    loadDesktopFiles()
  }, [])

  const getCurrentFolder = (): FileItem | null => {
    if (currentPath.length === 0) return null

    let current: FileItem | undefined = fileSystem

    for (const pathPart of currentPath) {
      if (pathPart === "Root") continue

      if (!current.children) return null

      current = current.children.find((item) => item.name === pathPart)

      if (!current) return null
    }

    return current
  }

  const currentFolder = getCurrentFolder()
  const currentItems = currentFolder?.children || []

  const navigateTo = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
    setSelectedItem(null)
  }

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedItem(null)
    }
  }

  const navigateForward = () => {
    // This would require history tracking in a real app
  }

  const navigateHome = () => {
    setCurrentPath(["Home"])
    setSelectedItem(null)
  }

  const handleItemClick = (item: FileItem) => {
    setSelectedItem(item.id)
  }

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === "folder") {
      navigateTo(item.name)
    } else {
      // Open file
      if (item.content) {
        onOpenFile(item.name, item.content)
      }
    }
  }

  return (
    <div className={`flex h-full flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Toolbar */}
      <div
        className={`flex items-center gap-1 border-b p-2 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
      >
        <button
          className={`rounded p-1 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          onClick={navigateBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          className={`rounded p-1 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          onClick={navigateForward}
        >
          <ArrowRight className="h-5 w-5" />
        </button>
        <button
          className={`rounded p-1 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          onClick={navigateHome}
        >
          <Home className="h-5 w-5" />
        </button>
        <button className={`rounded p-1 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
          <RefreshCw className="h-5 w-5" />
        </button>

        {/* Path breadcrumb */}
        <div className={`ml-2 flex-1 rounded px-2 py-1 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
          {currentPath.map((path, index) => (
            <span key={path} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-gray-500" />}
              <span
                className={`cursor-pointer ${
                  index === currentPath.length - 1 ? (theme === "dark" ? "text-blue-400" : "text-blue-600") : ""
                }`}
                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
              >
                {path}
              </span>
            </span>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1">
          <button
            className={`rounded p-1 ${
              viewMode === "grid"
                ? theme === "dark"
                  ? "bg-gray-700"
                  : "bg-gray-200"
                : theme === "dark"
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            className={`rounded p-1 ${
              viewMode === "list"
                ? theme === "dark"
                  ? "bg-gray-700"
                  : "bg-gray-200"
                : theme === "dark"
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
            }`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-48 border-r ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
        >
          <div className="p-2">
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              onClick={navigateHome}
            >
              <Home className="mr-2 h-5 w-5" />
              <span>Home</span>
            </div>

            <div className="mt-4 font-medium">Favorites</div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setCurrentPath(["Home", "Documents"])
              }}
            >
              <Folder className="mr-2 h-5 w-5 text-blue-500" />
              <span>Documents</span>
            </div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setCurrentPath(["Home", "Desktop"])
              }}
            >
              <Folder className="mr-2 h-5 w-5 text-blue-500" />
              <span>Desktop</span>
            </div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setCurrentPath(["Home", "Downloads"])
              }}
            >
              <Folder className="mr-2 h-5 w-5 text-blue-500" />
              <span>Downloads</span>
            </div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setCurrentPath(["Home", "Pictures"])
              }}
            >
              <Folder className="mr-2 h-5 w-5 text-blue-500" />
              <span>Pictures</span>
            </div>

            <div className="mt-4 font-medium">Locations</div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setCurrentPath(["Applications"])
              }}
            >
              <Folder className="mr-2 h-5 w-5 text-purple-500" />
              <span>Applications</span>
            </div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setCurrentPath(["System"])
              }}
            >
              <Folder className="mr-2 h-5 w-5 text-gray-500" />
              <span>System</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-2">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-4 gap-4 p-2 md:grid-cols-6 lg:grid-cols-8">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex cursor-pointer flex-col items-center rounded p-2 text-center ${
                    selectedItem === item.id
                      ? theme === "dark"
                        ? "bg-blue-900/50"
                        : "bg-blue-100"
                      : theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <div className="mb-1 text-3xl">
                    {item.type === "folder" ? (
                      <Folder className="h-12 w-12 text-blue-500" />
                    ) : (
                      <File className="h-12 w-12 text-gray-500" />
                    )}
                  </div>
                  <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">{item.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <table className={`w-full border-collapse ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <thead>
                <tr className={theme === "dark" ? "border-b border-gray-700" : "border-b border-gray-200"}>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Modified</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`cursor-pointer ${
                      selectedItem === item.id
                        ? theme === "dark"
                          ? "bg-blue-900/50"
                          : "bg-blue-100"
                        : theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                  >
                    <td className="flex items-center px-4 py-2">
                      {item.type === "folder" ? (
                        <Folder className="mr-2 h-5 w-5 text-blue-500" />
                      ) : (
                        <File className="mr-2 h-5 w-5 text-gray-500" />
                      )}
                      {item.name}
                    </td>
                    <td className="px-4 py-2">
                      {item.type === "folder" ? "Folder" : item.name.split(".").pop()?.toUpperCase()}
                    </td>
                    <td className="px-4 py-2">{item.size || "-"}</td>
                    <td className="px-4 py-2">{item.modified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div
        className={`flex items-center justify-between border-t px-4 py-1 text-sm ${
          theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div>{currentItems.length} items</div>
        <div>{selectedItem ? "1 item selected" : ""}</div>
      </div>
    </div>
  )
}
