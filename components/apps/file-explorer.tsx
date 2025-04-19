"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, File, Folder, Home, HardDrive, ArrowLeft, ArrowRight, RefreshCw, Grid, List } from "lucide-react"

interface FileExplorerProps {
  theme: "light" | "dark"
}

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  size?: string
  modified?: string
  icon?: React.ReactNode
}

export default function FileExplorer({ theme }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState<string[]>(["Home"])
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const fileSystem: Record<string, FileItem[]> = {
    Home: [
      {
        id: "documents",
        name: "Documents",
        type: "folder",
        modified: "Apr 15, 2023",
        icon: <Folder className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "downloads",
        name: "Downloads",
        type: "folder",
        modified: "Apr 18, 2023",
        icon: <Folder className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "pictures",
        name: "Pictures",
        type: "folder",
        modified: "Apr 10, 2023",
        icon: <Folder className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "music",
        name: "Music",
        type: "folder",
        modified: "Mar 25, 2023",
        icon: <Folder className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "videos",
        name: "Videos",
        type: "folder",
        modified: "Feb 12, 2023",
        icon: <Folder className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "readme",
        name: "readme.txt",
        type: "file",
        size: "2 KB",
        modified: "Apr 19, 2023",
        icon: <File className="h-5 w-5 text-gray-500" />,
      },
    ],
    Documents: [
      {
        id: "work",
        name: "Work",
        type: "folder",
        modified: "Apr 14, 2023",
        icon: <Folder className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "personal",
        name: "Personal",
        type: "folder",
        modified: "Apr 12, 2023",
        icon: <Folder className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "resume",
        name: "resume.pdf",
        type: "file",
        size: "245 KB",
        modified: "Apr 10, 2023",
        icon: <File className="h-5 w-5 text-red-500" />,
      },
      {
        id: "notes",
        name: "notes.txt",
        type: "file",
        size: "12 KB",
        modified: "Apr 5, 2023",
        icon: <File className="h-5 w-5 text-gray-500" />,
      },
    ],
    Pictures: [
      {
        id: "vacation",
        name: "Vacation",
        type: "folder",
        modified: "Mar 20, 2023",
        icon: <Folder className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "family",
        name: "Family",
        type: "folder",
        modified: "Feb 15, 2023",
        icon: <Folder className="h-5 w-5 text-blue-500" />,
      },
      {
        id: "profile",
        name: "profile.jpg",
        type: "file",
        size: "1.2 MB",
        modified: "Apr 2, 2023",
        icon: <File className="h-5 w-5 text-purple-500" />,
      },
      {
        id: "background",
        name: "background.png",
        type: "file",
        size: "2.4 MB",
        modified: "Mar 28, 2023",
        icon: <File className="h-5 w-5 text-purple-500" />,
      },
    ],
  }

  const currentItems = fileSystem[currentPath[currentPath.length - 1]] || []

  const navigateTo = (folderId: string) => {
    setCurrentPath([...currentPath, folderId])
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

    if (item.type === "folder") {
      navigateTo(item.name)
    }
  }

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === "folder") {
      navigateTo(item.name)
    } else {
      // Open file
      console.log("Opening file:", item.name)
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
            >
              <Home className="mr-2 h-5 w-5" />
              <span>Home</span>
            </div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <HardDrive className="mr-2 h-5 w-5" />
              <span>Local Disk</span>
            </div>
            <div className="mt-4 font-medium">Favorites</div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <Folder className="mr-2 h-5 w-5 text-blue-500" />
              <span>Documents</span>
            </div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <Folder className="mr-2 h-5 w-5 text-blue-500" />
              <span>Pictures</span>
            </div>
            <div
              className={`flex items-center rounded p-2 ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <Folder className="mr-2 h-5 w-5 text-blue-500" />
              <span>Downloads</span>
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
                  <div className="mb-1 text-3xl">{item.icon}</div>
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
                      <span className="mr-2">{item.icon}</span>
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
