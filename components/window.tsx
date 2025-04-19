"use client"

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
  const [position, setPosition] = useState({ x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 })
  const [size, setSize] = useState({ width: 600, height: 400 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [preMaximizeState, setPreMaximizeState] = useState({ position: { x: 0, y: 0 }, size: { width: 0, height: 0 } })

  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      } else if (isResizing) {
        const newWidth = resizeStart.width + (e.clientX - resizeStart.x)
        const newHeight = resizeStart.height + (e.clientY - resizeStart.y)

        setSize({
          width: Math.max(300, newWidth),
          height: Math.max(200, newHeight),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart])

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current && e.target === e.currentTarget) {
      onActivate()
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    onActivate()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore previous size and position
      setPosition(preMaximizeState.position)
      setSize(preMaximizeState.size)
    } else {
      // Save current size and position
      setPreMaximizeState({
        position: { ...position },
        size: { ...size },
      })

      // Maximize
      setPosition({ x: 0, y: 0 })
      setSize({
        width: window.innerWidth,
        height: window.innerHeight - 32, // Account for menubar
      })
    }

    setIsMaximized(!isMaximized)
  }

  return (
    <div
      ref={windowRef}
      className={`absolute overflow-hidden rounded-lg shadow-xl transition-shadow ${
        isActive
          ? "shadow-2xl " + (theme === "dark" ? "ring-1 ring-gray-600" : "ring-1 ring-gray-300")
          : "shadow-lg opacity-95"
      } ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: isActive ? 10 : 5,
      }}
      onClick={onActivate}
    >
      <div
        className={`flex h-8 items-center px-3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex space-x-2">
          <button className="group relative h-3 w-3 rounded-full bg-red-500 hover:bg-red-600" onClick={onClose}>
            <span className="absolute left-1/2 top-1/2 hidden h-1.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-900 group-hover:block"></span>
            <span className="absolute left-1/2 top-1/2 hidden h-0.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-900 group-hover:block"></span>
          </button>
          <button
            className="group relative h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
            onClick={onMinimize}
          >
            <span className="absolute left-1/2 top-1/2 hidden h-0.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-yellow-900 group-hover:block"></span>
          </button>
          <button
            className="group relative h-3 w-3 rounded-full bg-green-500 hover:bg-green-600"
            onClick={toggleMaximize}
          >
            <span className="absolute left-1/2 top-1/2 hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 border border-green-900 group-hover:block"></span>
          </button>
        </div>

        <div className="mx-auto flex items-center">
          <span className="mr-2">{icon}</span>
          <span className="text-sm font-medium">{title}</span>
        </div>

        <div className="w-16"></div>
      </div>

      <div className="h-[calc(100%-32px)] overflow-auto">{children}</div>

      {!isMaximized && (
        <div className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize" onMouseDown={handleResizeMouseDown} />
      )}
    </div>
  )
}
