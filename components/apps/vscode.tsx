"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  Code,
  Settings,
  Search,
  GitBranch,
  Bug,
  Package,
  X,
} from "lucide-react"

interface VSCodeProps {
  theme: "light" | "dark"
}

interface FileTreeItem {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileTreeItem[]
  language?: string
  path: string
  expanded?: boolean
}

interface OpenFile {
  id: string
  name: string
  path: string
  content: string
  language: string
  isActive: boolean
}

export default function VSCode({ theme }: VSCodeProps) {
  const [sidebarWidth, setSidebarWidth] = useState(250)
  const [isResizing, setIsResizing] = useState(false)
  const [activeSidebarTab, setActiveSidebarTab] = useState<"explorer" | "search" | "git" | "debug" | "extensions">(
    "explorer",
  )
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([])
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [lineCount, setLineCount] = useState(0)

  // Mock file system data
  useEffect(() => {
    // Simulate loading the file system
    const mockFileTree: FileTreeItem[] = [
      {
        id: "src",
        name: "src",
        type: "folder",
        path: "/src",
        expanded: true,
        children: [
          {
            id: "app",
            name: "app",
            type: "folder",
            path: "/src/app",
            expanded: true,
            children: [
              {
                id: "page",
                name: "page.tsx",
                type: "file",
                path: "/src/app/page.tsx",
                language: "typescript",
              },
              {
                id: "layout",
                name: "layout.tsx",
                type: "file",
                path: "/src/app/layout.tsx",
                language: "typescript",
              },
              {
                id: "globals",
                name: "globals.css",
                type: "file",
                path: "/src/app/globals.css",
                language: "css",
              },
            ],
          },
          {
            id: "components",
            name: "components",
            type: "folder",
            path: "/src/components",
            expanded: true,
            children: [
              {
                id: "desktop-interface",
                name: "desktop-interface.tsx",
                type: "file",
                path: "/src/components/desktop-interface.tsx",
                language: "typescript",
              },
              {
                id: "window",
                name: "window.tsx",
                type: "file",
                path: "/src/components/window.tsx",
                language: "typescript",
              },
              {
                id: "dock",
                name: "dock.tsx",
                type: "file",
                path: "/src/components/dock.tsx",
                language: "typescript",
              },
            ],
          },
        ],
      },
      {
        id: "public",
        name: "public",
        type: "folder",
        path: "/public",
        expanded: false,
        children: [
          {
            id: "favicon",
            name: "favicon.ico",
            type: "file",
            path: "/public/favicon.ico",
            language: "binary",
          },
        ],
      },
      {
        id: "package",
        name: "package.json",
        type: "file",
        path: "/package.json",
        language: "json",
      },
      {
        id: "tsconfig",
        name: "tsconfig.json",
        type: "file",
        path: "/tsconfig.json",
        language: "json",
      },
      {
        id: "readme",
        name: "README.md",
        type: "file",
        path: "/README.md",
        language: "markdown",
      },
    ]

    setFileTree(mockFileTree)
  }, [])

  // Handle sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX
        if (newWidth > 100 && newWidth < 500) {
          setSidebarWidth(newWidth)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  // Mock file content
  const getFileContent = (path: string): string => {
    const fileContents: Record<string, string> = {
      "/src/app/page.tsx": `import DesktopInterface from "@/components/desktop-interface"

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#2a6cc8] bg-gradient-to-b from-[#2a6cc8] to-[#1d4fa0]">
      <DesktopInterface />
    </main>
  )
}`,
      "/src/app/layout.tsx": `export const metadata = {
  title: 'WebOS',
  description: 'A web-based operating system interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
      "/src/app/globals.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
}`,
      "/src/components/desktop-interface.tsx": `"use client"

import { useState, useEffect } from "react"
import Dock from "@/components/dock"
import Menubar from "@/components/menubar"
import Desktop from "@/components/desktop"
import Window from "@/components/window"
// ... more code here`,
      "/src/components/window.tsx": `"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface WindowProps {
  id: string
  title: string
  icon: string
  children: React.ReactNode
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onActivate: () => void
  theme: "light" | "dark"
}

export default function Window({
  id,
  title,
  icon,
  children,
  isActive,
  onClose,
  onMinimize,
  onActivate,
  theme,
}: WindowProps) {
  // ... window component code
}`,
      "/src/components/dock.tsx": `"use client"

import { useState } from "react"

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
  // ... dock component code
}`,
      "/package.json": `{
  "name": "webos",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "13.4.19",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.3.3"
  },
  "devDependencies": {
    "@types/node": "20.5.6",
    "@types/react": "18.2.21",
    "@types/react-dom": "18.2.7",
    "typescript": "5.2.2"
  }
}`,
      "/tsconfig.json": `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
      "/README.md": `# WebOS

A web-based operating system interface built with Next.js and React.

## Features

- Desktop environment with icons and wallpaper
- Draggable and resizable windows
- macOS-style dock
- Top menu bar with dropdown menus
- Dark mode / light mode toggle
- Multiple applications:
  - Clock
  - Notes
  - Calculator
  - Terminal
  - Weather
  - File Explorer
  - VS Code

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.`,
    }

    return fileContents[path] || `// No content available for ${path}`
  }

  // Toggle folder expansion
  const toggleFolder = (id: string) => {
    const updateTree = (items: FileTreeItem[]): FileTreeItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: updateTree(item.children) }
        }
        return item
      })
    }

    setFileTree(updateTree(fileTree))
  }

  // Open a file
  const openFile = (file: FileTreeItem) => {
    if (file.type !== "file") return

    // Check if file is already open
    const isOpen = openFiles.some((f) => f.id === file.id)

    if (!isOpen) {
      const content = getFileContent(file.path)
      const newFile: OpenFile = {
        id: file.id,
        name: file.name,
        path: file.path,
        content,
        language: file.language || "plaintext",
        isActive: true,
      }

      // Set all other files as inactive
      const updatedFiles = openFiles.map((f) => ({ ...f, isActive: false }))
      setOpenFiles([...updatedFiles, newFile])
    } else {
      // Set this file as active
      const updatedFiles = openFiles.map((f) => ({
        ...f,
        isActive: f.id === file.id,
      }))
      setOpenFiles(updatedFiles)
    }

    setActiveFileId(file.id)

    // Count lines in the file
    const content = getFileContent(file.path)
    setLineCount(content.split("\n").length)
  }

  // Close a file tab
  const closeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const fileIndex = openFiles.findIndex((f) => f.id === id)
    if (fileIndex === -1) return

    const newFiles = [...openFiles]
    newFiles.splice(fileIndex, 1)

    // If we're closing the active file, activate another one
    if (id === activeFileId && newFiles.length > 0) {
      const newActiveIndex = Math.min(fileIndex, newFiles.length - 1)
      newFiles[newActiveIndex].isActive = true
      setActiveFileId(newFiles[newActiveIndex].id)
    } else if (newFiles.length === 0) {
      setActiveFileId(null)
    }

    setOpenFiles(newFiles)
  }

  // Set a file as active when clicking its tab
  const setFileActive = (id: string) => {
    const updatedFiles = openFiles.map((f) => ({
      ...f,
      isActive: f.id === id,
    }))
    setOpenFiles(updatedFiles)
    setActiveFileId(id)
  }

  // Render file tree recursively
  const renderFileTree = (items: FileTreeItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className={`flex cursor-pointer items-center py-1 hover:bg-opacity-10 ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
          }`}
          onClick={() => (item.type === "folder" ? toggleFolder(item.id) : openFile(item))}
        >
          {item.type === "folder" ? (
            <>
              {item.expanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
              <Folder
                className={`ml-1 mr-1 h-4 w-4 shrink-0 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
              />
              <span className="truncate">{item.name}</span>
            </>
          ) : (
            <>
              <span className="w-4"></span>
              <File className={`ml-1 mr-1 h-4 w-4 shrink-0 ${getFileIconColor(item.language || "")}`} />
              <span className="truncate">{item.name}</span>
            </>
          )}
        </div>
        {item.type === "folder" && item.expanded && item.children && (
          <div>{renderFileTree(item.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  // Get color for file icon based on language
  const getFileIconColor = (language: string): string => {
    const colors: Record<string, string> = {
      typescript: theme === "dark" ? "text-blue-400" : "text-blue-600",
      javascript: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
      css: theme === "dark" ? "text-pink-400" : "text-pink-600",
      html: theme === "dark" ? "text-orange-400" : "text-orange-600",
      json: theme === "dark" ? "text-yellow-300" : "text-yellow-700",
      markdown: theme === "dark" ? "text-green-400" : "text-green-600",
    }

    return colors[language] || (theme === "dark" ? "text-gray-400" : "text-gray-600")
  }

  // Get syntax highlighting class based on language
  const getSyntaxClass = (language: string): string => {
    const classes: Record<string, string> = {
      typescript: "language-typescript",
      javascript: "language-javascript",
      css: "language-css",
      html: "language-html",
      json: "language-json",
      markdown: "language-markdown",
    }

    return classes[language] || ""
  }

  // Simple syntax highlighting (very basic implementation)
  const highlightSyntax = (content: string, language: string): React.ReactNode => {
    if (language === "typescript" || language === "javascript") {
      // Very basic highlighting for demonstration
      const keywords = [
        "import",
        "export",
        "from",
        "const",
        "let",
        "var",
        "function",
        "return",
        "if",
        "else",
        "for",
        "while",
        "class",
        "interface",
        "type",
        "extends",
        "implements",
        "new",
        "this",
        "super",
        "async",
        "await",
        "try",
        "catch",
      ]

      const lines = content.split("\n").map((line, i) => {
        // Simple tokenization for keywords, strings, and comments
        let highlightedLine = line

        // Highlight keywords
        keywords.forEach((keyword) => {
          const regex = new RegExp(`\\b${keyword}\\b`, "g")
          highlightedLine = highlightedLine.replace(
            regex,
            `<span class="${theme === "dark" ? "text-purple-400" : "text-purple-700"}">${keyword}</span>`,
          )
        })

        // Highlight strings
        highlightedLine = highlightedLine.replace(
          /(["'`])(.*?)\1/g,
          `<span class="${theme === "dark" ? "text-green-400" : "text-green-700"}">$&</span>`,
        )

        // Highlight comments
        highlightedLine = highlightedLine.replace(
          /(\/\/.*$)/g,
          `<span class="${theme === "dark" ? "text-gray-500" : "text-gray-500"}">$&</span>`,
        )

        return (
          <div key={i} className="flex">
            <div
              className={`w-12 shrink-0 select-none border-r pr-2 text-right ${
                theme === "dark" ? "border-gray-700 text-gray-500" : "border-gray-300 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <div className="pl-4" dangerouslySetInnerHTML={{ __html: highlightedLine }} />
          </div>
        )
      })

      return <div className="font-mono text-sm">{lines}</div>
    }

    // For other languages, just show line numbers without highlighting
    return (
      <div className="font-mono text-sm">
        {content.split("\n").map((line, i) => (
          <div key={i} className="flex">
            <div
              className={`w-12 shrink-0 select-none border-r pr-2 text-right ${
                theme === "dark" ? "border-gray-700 text-gray-500" : "border-gray-300 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <div className="pl-4">{line}</div>
          </div>
        ))}
      </div>
    )
  }

  const activeFile = openFiles.find((f) => f.id === activeFileId)

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden ${
        theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      {/* Title bar */}
      <div
        className={`flex h-9 items-center justify-between border-b px-4 ${
          theme === "dark" ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-100"
        }`}
      >
        <div className="flex items-center">
          <Code className="mr-2 h-5 w-5" />
          <span className="font-medium">Visual Studio Code</span>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center text-sm">
            <GitBranch className="mr-1 h-4 w-4" />
            <span>main</span>
          </div>
        </div>
      </div>

      {/* Menu bar */}
      <div
        className={`flex h-7 items-center border-b px-2 text-sm ${
          theme === "dark" ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-100"
        }`}
      >
        <div className="mr-4 cursor-pointer px-2 py-1 hover:bg-gray-700">File</div>
        <div className="mr-4 cursor-pointer px-2 py-1 hover:bg-gray-700">Edit</div>
        <div className="mr-4 cursor-pointer px-2 py-1 hover:bg-gray-700">Selection</div>
        <div className="mr-4 cursor-pointer px-2 py-1 hover:bg-gray-700">View</div>
        <div className="mr-4 cursor-pointer px-2 py-1 hover:bg-gray-700">Go</div>
        <div className="mr-4 cursor-pointer px-2 py-1 hover:bg-gray-700">Run</div>
        <div className="mr-4 cursor-pointer px-2 py-1 hover:bg-gray-700">Terminal</div>
        <div className="cursor-pointer px-2 py-1 hover:bg-gray-700">Help</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity bar */}
        <div
          className={`flex w-12 flex-col items-center border-r py-2 ${
            theme === "dark" ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"
          }`}
        >
          <button
            className={`mb-4 rounded p-2 ${
              activeSidebarTab === "explorer" ? (theme === "dark" ? "bg-gray-800" : "bg-gray-200") : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveSidebarTab("explorer")}
            title="Explorer"
          >
            <File className="h-5 w-5" />
          </button>
          <button
            className={`mb-4 rounded p-2 ${
              activeSidebarTab === "search" ? (theme === "dark" ? "bg-gray-800" : "bg-gray-200") : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveSidebarTab("search")}
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            className={`mb-4 rounded p-2 ${
              activeSidebarTab === "git" ? (theme === "dark" ? "bg-gray-800" : "bg-gray-200") : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveSidebarTab("git")}
            title="Source Control"
          >
            <GitBranch className="h-5 w-5" />
          </button>
          <button
            className={`mb-4 rounded p-2 ${
              activeSidebarTab === "debug" ? (theme === "dark" ? "bg-gray-800" : "bg-gray-200") : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveSidebarTab("debug")}
            title="Run and Debug"
          >
            <Bug className="h-5 w-5" />
          </button>
          <button
            className={`mb-4 rounded p-2 ${
              activeSidebarTab === "extensions"
                ? theme === "dark"
                  ? "bg-gray-800"
                  : "bg-gray-200"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveSidebarTab("extensions")}
            title="Extensions"
          >
            <Package className="h-5 w-5" />
          </button>

          <div className="mt-auto">
            <button className="rounded p-2 hover:bg-gray-700" title="Settings">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`h-full overflow-hidden border-r ${
            theme === "dark" ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-50"
          }`}
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Sidebar header */}
          <div
            className={`flex items-center justify-between border-b p-2 ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="font-medium uppercase tracking-wider">
              {activeSidebarTab === "explorer" && "Explorer"}
              {activeSidebarTab === "search" && "Search"}
              {activeSidebarTab === "git" && "Source Control"}
              {activeSidebarTab === "debug" && "Run and Debug"}
              {activeSidebarTab === "extensions" && "Extensions"}
            </div>
            {activeSidebarTab === "explorer" && (
              <div className="flex">
                <button className="rounded p-1 hover:bg-gray-700" title="New File">
                  <File className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar content */}
          <div className="h-[calc(100%-36px)] overflow-y-auto p-2 bg-gray-800">
            {activeSidebarTab === "explorer" && (
              <div>
                <div className="mb-2 font-medium">WEBOS</div>
                {renderFileTree(fileTree)}
              </div>
            )}
            {activeSidebarTab === "search" && (
              <div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Search"
                    className={`w-full rounded border p-1 ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-700 text-white placeholder:text-gray-400"
                        : "border-gray-300 bg-white text-black placeholder:text-gray-500"
                    }`}
                  />
                </div>
                <div className="text-sm text-gray-500">Search across all files in your workspace</div>
              </div>
            )}
            {activeSidebarTab === "git" && (
              <div>
                <div className="mb-2 text-sm">No changes detected in the workspace.</div>
              </div>
            )}
            {activeSidebarTab === "debug" && (
              <div>
                <div className="mb-2 text-sm">
                  No debug configurations found. Configure launch.json to enable debugging.
                </div>
                <button
                  className={`mt-2 rounded px-2 py-1 text-sm ${
                    theme === "dark" ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  Create launch.json
                </button>
              </div>
            )}
            {activeSidebarTab === "extensions" && (
              <div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Search Extensions"
                    className={`w-full rounded border p-1 ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-700 text-white placeholder:text-gray-400"
                        : "border-gray-300 bg-white text-black placeholder:text-gray-500"
                    }`}
                  />
                </div>
                <div className="mt-4 text-sm">
                  <div className="mb-2 font-medium">Recommended</div>
                  <div
                    className={`mb-2 cursor-pointer rounded p-2 ${
                      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-medium">ESLint</div>
                    <div className="text-xs text-gray-500">Integrates ESLint into VS Code</div>
                  </div>
                  <div
                    className={`mb-2 cursor-pointer rounded p-2 ${
                      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-medium">Prettier</div>
                    <div className="text-xs text-gray-500">Code formatter using prettier</div>
                  </div>
                  <div
                    className={`cursor-pointer rounded p-2 ${
                      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-medium">Tailwind CSS IntelliSense</div>
                    <div className="text-xs text-gray-500">Intelligent Tailwind CSS tooling</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 top-0 w-1 cursor-col-resize"
            style={{ left: `${sidebarWidth + 48}px` }}
            onMouseDown={() => setIsResizing(true)}
          ></div>
        </div>

        {/* Editor area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tabs */}
          <div
            className={`flex h-9 items-center border-b overflow-x-auto ${
              theme === "dark" ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-100"
            }`}
          >
            {openFiles.map((file) => (
              <div
                key={file.id}
                className={`flex h-full min-w-[120px] max-w-[200px] cursor-pointer items-center border-r px-3 ${
                  file.isActive
                    ? theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                    : theme === "dark"
                      ? "bg-gray-900 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setFileActive(file.id)}
              >
                <File className={`mr-2 h-4 w-4 ${getFileIconColor(file.language)}`} />
                <span className="truncate">{file.name}</span>
                <button className="ml-2 rounded-full p-1 hover:bg-gray-700" onClick={(e) => closeFile(file.id, e)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Editor content */}
          <div className={`flex-1 overflow-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            {activeFile ? (
              <div className="h-full">
                <div className="p-2">{highlightSyntax(activeFile.content, activeFile.language)}</div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-gray-800">
                <div className="text-center text-gray-500">
                  <Code className="mx-auto mb-4 h-16 w-16 opacity-20" />
                  <h3 className="text-xl font-medium">No file is open</h3>
                  <p className="mt-2">Open a file from the explorer to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div
            className={`flex h-6 items-center justify-between border-t px-2 text-xs ${
              theme === "dark" ? "border-gray-700 bg-gray-700 text-gray-300" : "border-gray-200 bg-blue-600 text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <GitBranch className="mr-1 h-3.5 w-3.5" />
                <span>main</span>
              </div>
              {activeFile && (
                <>
                  <div>
                    <span>{activeFile.language === "typescript" ? "TypeScript" : activeFile.language}</span>
                  </div>
                  <div>
                    <span>UTF-8</span>
                  </div>
                  <div>
                    <span>LF</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {activeFile && (
                <>
                  <div>
                    <span>Ln {lineCount}, Col 1</span>
                  </div>
                  <div>
                    <span>Spaces: 2</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
