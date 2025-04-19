"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface DesktopWidgetProps {
  title: string
  children: React.ReactNode
  theme: "light" | "dark"
}

export default function DesktopWidget({ title, children, theme }: DesktopWidgetProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`mb-4 overflow-hidden rounded-lg shadow-lg ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`flex cursor-pointer items-center justify-between p-2 ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <h3 className="font-medium">{title}</h3>
        {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </div>

      {!collapsed && <div className="p-3">{children}</div>}
    </div>
  )
}
