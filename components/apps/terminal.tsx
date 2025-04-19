"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface TerminalProps {
  theme: "light" | "dark"
}

export default function Terminal({ theme }: TerminalProps) {
  const [history, setHistory] = useState<{ type: "command" | "output"; content: string }[]>([
    { type: "output", content: "WebOS Terminal v1.0.0" },
    { type: "output", content: "Type 'help' to see available commands" },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentDirectory, setCurrentDirectory] = useState("/home/user")
  const [fileSystem, setFileSystem] = useState<Record<string, any>>({
    "/": {
      type: "directory",
      children: {
        home: {
          type: "directory",
          children: {
            user: {
              type: "directory",
              children: {
                Documents: {
                  type: "directory",
                  children: {
                    "notes.txt": {
                      type: "file",
                      content: "Important notes for the project",
                      size: "32B",
                      modified: "2023-04-15",
                    },
                    "todo.md": {
                      type: "file",
                      content: "# Todo List\n- Finish WebOS project\n- Add more features\n- Fix bugs",
                      size: "64B",
                      modified: "2023-04-18",
                    },
                  },
                },
                Downloads: {
                  type: "directory",
                  children: {
                    "image.jpg": {
                      type: "file",
                      content: "[binary data]",
                      size: "1.2MB",
                      modified: "2023-04-10",
                    },
                  },
                },
                Desktop: {
                  type: "directory",
                  children: {
                    "shortcut.lnk": {
                      type: "file",
                      content: "[link to application]",
                      size: "1KB",
                      modified: "2023-04-05",
                    },
                  },
                },
                ".bashrc": {
                  type: "file",
                  content: "# Bash configuration file\nalias ll='ls -la'\nalias cls='clear'",
                  size: "128B",
                  modified: "2023-03-20",
                },
              },
            },
          },
        },
        usr: {
          type: "directory",
          children: {
            bin: {
              type: "directory",
              children: {},
            },
            lib: {
              type: "directory",
              children: {},
            },
          },
        },
        etc: {
          type: "directory",
          children: {
            hosts: {
              type: "file",
              content: "127.0.0.1 localhost\n::1 localhost",
              size: "32B",
              modified: "2023-01-01",
            },
          },
        },
      },
    },
  })

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    // Focus input when terminal is clicked
    const handleClick = () => {
      inputRef.current?.focus()
    }

    terminalRef.current?.addEventListener("click", handleClick)

    return () => {
      terminalRef.current?.removeEventListener("click", handleClick)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      navigateHistory(-1)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      navigateHistory(1)
    } else if (e.key === "Tab") {
      e.preventDefault()
      autocompleteCommand()
    }
  }

  const navigateHistory = (direction: number) => {
    if (commandHistory.length === 0) return

    const newIndex = historyIndex + direction

    if (newIndex >= -1 && newIndex < commandHistory.length) {
      setHistoryIndex(newIndex)
      setCurrentCommand(newIndex === -1 ? "" : commandHistory[newIndex])
    }
  }

  const autocompleteCommand = () => {
    const args = currentCommand.trim().split(" ")

    // If we're trying to autocomplete a command
    if (args.length === 1) {
      const availableCommands = [
        "help",
        "clear",
        "echo",
        "date",
        "ls",
        "cd",
        "pwd",
        "cat",
        "mkdir",
        "touch",
        "rm",
        "whoami",
        "uname",
        "exit",
        "history",
        "grep",
        "find",
        "ps",
        "top",
        "ifconfig",
        "ping",
        "wget",
        "curl",
        "sudo",
      ]

      const matchingCommands = availableCommands.filter((cmd) => cmd.startsWith(args[0].toLowerCase()))

      if (matchingCommands.length === 1) {
        setCurrentCommand(matchingCommands[0])
      } else if (matchingCommands.length > 1) {
        setHistory([
          ...history,
          { type: "command", content: currentCommand },
          { type: "output", content: matchingCommands.join("  ") },
        ])
      }
    }

    // If we're trying to autocomplete a path
    if (args.length > 1 && (args[0] === "cd" || args[0] === "ls" || args[0] === "cat")) {
      const path = args[args.length - 1]

      // Get the directory to search in
      let searchDir = currentDirectory
      if (path.includes("/")) {
        const lastSlash = path.lastIndexOf("/")
        searchDir = path.startsWith("/")
          ? path.substring(0, lastSlash) || "/"
          : `${currentDirectory}/${path.substring(0, lastSlash)}`.replace(/\/\//g, "/")
      }

      // Get the prefix to match
      const prefix = path.includes("/") ? path.substring(path.lastIndexOf("/") + 1) : path

      // Find matching files/directories
      const dirContent = getDirectoryContents(searchDir)
      const matches = Object.keys(dirContent).filter((item) => item.startsWith(prefix))

      if (matches.length === 1) {
        const matchPath = path.includes("/")
          ? `${path.substring(0, path.lastIndexOf("/") + 1)}${matches[0]}`
          : matches[0]

        // If it's a directory, add a trailing slash
        const isDir = dirContent[matches[0]].type === "directory"
        const completedPath = isDir ? `${matchPath}/` : matchPath

        // Replace the last argument with the completed path
        const newArgs = [...args]
        newArgs[newArgs.length - 1] = completedPath
        setCurrentCommand(newArgs.join(" "))
      } else if (matches.length > 1) {
        setHistory([
          ...history,
          { type: "command", content: currentCommand },
          { type: "output", content: matches.join("  ") },
        ])
      }
    }
  }

  const getDirectoryContents = (path: string) => {
    // Normalize path
    const normalizedPath = path.replace(/\/+/g, "/")

    // Split path into components
    const components = normalizedPath.split("/").filter(Boolean)

    // Start at root
    let current = fileSystem["/"]

    // Navigate to the specified directory
    for (const component of components) {
      if (current.type !== "directory" || !current.children[component]) {
        return {}
      }
      current = current.children[component]
    }

    return current.type === "directory" ? current.children : {}
  }

  const executeCommand = () => {
    if (!currentCommand.trim()) return

    // Add command to history
    setHistory([...history, { type: "command", content: currentCommand }])

    // Add to command history
    setCommandHistory([currentCommand, ...commandHistory])
    setHistoryIndex(-1)

    // Process command
    const output = processCommand(currentCommand)
    setHistory((prev) => [...prev, { type: "output", content: output }])

    // Clear current command
    setCurrentCommand("")
  }

  const processCommand = (cmd: string): string => {
    const args = cmd.trim().split(" ")
    const command = args[0].toLowerCase()

    switch (command) {
      case "help":
        return `
Available commands:
  help - Show this help message
  clear - Clear the terminal
  echo [text] - Print text
  date - Show current date and time
  ls [path] - List files in directory
  cd [path] - Change directory
  pwd - Print working directory
  cat [file] - Display file contents
  mkdir [dir] - Create directory
  touch [file] - Create empty file
  rm [file/dir] - Remove file or directory
  whoami - Show current user
  uname - Show system information
  history - Show command history
  grep [pattern] [file] - Search for pattern in file
  find [path] [name] - Find files by name
  ps - List processes
  ifconfig - Show network configuration
  ping [host] - Ping a host
  credits - Show GitHub information
  exit - Close terminal
`

      case "credits":
        return `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   WebOS - A web-based operating system interface              ║
║                                                               ║
║   Created by: Shadow                                          ║
║   GitHub: https://github.com/Shadow9308                       ║
║                                                               ║
║   Thank you for using WebOS!                                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`

      case "clear":
        setHistory([])
        return ""

      case "echo":
        return args.slice(1).join(" ")

      case "date":
        return new Date().toString()

      case "ls":
        let path = args[1] || currentDirectory

        // Handle relative paths
        if (!path.startsWith("/")) {
          path = `${currentDirectory}/${path}`.replace(/\/\//g, "/")
        }

        try {
          const contents = getDirectoryContents(path)
          if (Object.keys(contents).length === 0) {
            return `ls: cannot access '${path}': No such file or directory`
          }

          return Object.entries(contents)
            .map(([name, info]: [string, any]) => {
              const isDir = info.type === "directory"
              return `${isDir ? "" : ""}${name}${isDir ? "/" : ""}${isDir ? "" : ""}`
            })
            .join("  ")
        } catch (error) {
          return `ls: cannot access '${path}': No such file or directory`
        }

      case "cd":
        if (!args[1]) {
          setCurrentDirectory("/home/user")
          return ""
        }

        let newPath = args[1]

        // Handle special paths
        if (newPath === "~") {
          setCurrentDirectory("/home/user")
          return ""
        }

        if (newPath === "..") {
          const parts = currentDirectory.split("/").filter(Boolean)
          if (parts.length > 0) {
            parts.pop()
            setCurrentDirectory("/" + parts.join("/"))
          }
          return ""
        }

        // Handle relative paths
        if (!newPath.startsWith("/")) {
          newPath = `${currentDirectory}/${newPath}`.replace(/\/\//g, "/")
        }

        // Check if path exists and is a directory
        try {
          const pathComponents = newPath.split("/").filter(Boolean)
          let current = fileSystem["/"]

          for (const component of pathComponents) {
            if (component === "") continue
            if (!current.children[component]) {
              return `cd: ${newPath}: No such file or directory`
            }
            current = current.children[component]
          }

          if (current.type !== "directory") {
            return `cd: ${newPath}: Not a directory`
          }

          setCurrentDirectory(newPath)
          return ""
        } catch (error) {
          return `cd: ${newPath}: No such file or directory`
        }

      case "pwd":
        return currentDirectory

      case "cat":
        if (!args[1]) {
          return "cat: missing file operand"
        }

        let filePath = args[1]

        // Handle relative paths
        if (!filePath.startsWith("/")) {
          filePath = `${currentDirectory}/${filePath}`.replace(/\/\//g, "/")
        }

        try {
          const pathComponents = filePath.split("/").filter(Boolean)
          let current = fileSystem["/"]

          for (let i = 0; i < pathComponents.length - 1; i++) {
            if (!current.children[pathComponents[i]]) {
              return `cat: ${filePath}: No such file or directory`
            }
            current = current.children[pathComponents[i]]
          }

          const fileName = pathComponents[pathComponents.length - 1]
          if (!current.children[fileName]) {
            return `cat: ${filePath}: No such file or directory`
          }

          if (current.children[fileName].type !== "file") {
            return `cat: ${filePath}: Is a directory`
          }

          return current.children[fileName].content
        } catch (error) {
          return `cat: ${filePath}: No such file or directory`
        }

      case "whoami":
        return "user@webos"

      case "uname":
        return "WebOS v1.0.0 running on Next.js"

      case "history":
        return commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join("\n")

      case "ps":
        return `
  PID TTY          TIME CMD
    1 ?        00:00:01 systemd
  123 ?        00:00:00 webos-server
  456 ?        00:00:02 window-manager
  789 tty1     00:00:01 bash
  790 tty1     00:00:00 ps
`

      case "ifconfig":
        return `
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::1  prefixlen 64  scopeid 0x20<link>
        ether 00:00:00:00:00:00  txqueuelen 1000  (Ethernet)
        RX packets 12345  bytes 1234567 (1.2 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 12345  bytes 1234567 (1.2 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 1234  bytes 123456 (123.4 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1234  bytes 123456 (123.4 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
`

      case "ping":
        if (!args[1]) {
          return "ping: missing host operand"
        }
        return `
PING ${args[1]} (127.0.0.1) 56(84) bytes of data.
64 bytes from localhost (127.0.0.1): icmp_seq=1 ttl=64 time=0.01 ms
64 bytes from localhost (127.0.0.1): icmp_seq=2 ttl=64 time=0.02 ms
64 bytes from localhost (127.0.0.1): icmp_seq=3 ttl=64 time=0.01 ms
64 bytes from localhost (127.0.0.1): icmp_seq=4 ttl=64 time=0.02 ms

--- ${args[1]} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3ms
rtt min/avg/max/mdev = 0.01/0.015/0.02/0.005 ms
`

      case "exit":
        return "Use the window close button to exit the terminal"

      default:
        return `Command not found: ${args[0]}`
    }
  }

  return (
    <div
      ref={terminalRef}
      className={`h-full overflow-auto p-2 font-mono text-sm ${
        theme === "dark" ? "bg-black text-green-400" : "bg-black text-green-500"
      }`}
    >
      {history.map((entry, index) => (
        <div key={index} className="whitespace-pre-wrap break-words">
          {entry.type === "command" ? (
            <div>
              <span className="text-blue-400">{currentDirectory} $</span> {entry.content}
            </div>
          ) : (
            <div>{entry.content}</div>
          )}
        </div>
      ))}

      <div className="flex">
        <span className="text-blue-400">{currentDirectory} $</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="ml-1 flex-1 bg-transparent outline-none"
          autoFocus
        />
      </div>
    </div>
  )
}
