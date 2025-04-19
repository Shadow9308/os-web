"use client"

import { X } from "lucide-react"

interface NotificationCenterProps {
  notifications: { id: string; title: string; message: string; time: Date }[]
  onClose: () => void
  theme: "light" | "dark"
}

export default function NotificationCenter({ notifications, onClose, theme }: NotificationCenterProps) {
  return (
    <div
      className="fixed right-0 top-8 z-40 h-[calc(100vh-32px)] w-80 overflow-y-auto shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`h-full ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <div
          className={`flex items-center justify-between p-4 ${
            theme === "dark" ? "border-b border-gray-700" : "border-b border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            onClick={onClose}
            className={`rounded-full p-1 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-2">
          {notifications.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-center text-gray-500">
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg p-3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-xs text-gray-500">
                      {notification.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
