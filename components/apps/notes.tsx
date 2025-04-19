"use client"

import { useState, useEffect } from "react"
import { Save, FileText, Trash2 } from "lucide-react"

interface NotesProps {
  theme: "light" | "dark"
  onSaveToDesktop: (fileName: string, content: string) => void
}

export default function Notes({ theme, onSaveToDesktop }: NotesProps) {
  const [content, setContent] = useState("")
  const [fileName, setFileName] = useState("untitled.txt")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [savedNotes, setSavedNotes] = useState<{ id: string; name: string; content: string }[]>([])

  // Load content from session storage on mount
  useEffect(() => {
    const savedContent = sessionStorage.getItem("notes-content")
    if (savedContent) {
      setContent(savedContent)
    }

    // Load saved notes from localStorage
    const savedNotesData = localStorage.getItem("saved-notes")
    if (savedNotesData) {
      try {
        setSavedNotes(JSON.parse(savedNotesData))
      } catch (e) {
        console.error("Failed to parse saved notes", e)
      }
    }
  }, [])

  // Save content to session storage when it changes
  useEffect(() => {
    sessionStorage.setItem("notes-content", content)
  }, [content])

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem("saved-notes", JSON.stringify(savedNotes))
  }, [savedNotes])

  const handleSave = () => {
    setShowSaveDialog(true)
  }

  const confirmSave = () => {
    // Save to desktop
    onSaveToDesktop(fileName, content)

    // Add to saved notes
    const newNote = {
      id: Date.now().toString(),
      name: fileName,
      content: content,
    }
    setSavedNotes([...savedNotes, newNote])

    setShowSaveDialog(false)
  }

  const loadNote = (noteContent: string) => {
    setContent(noteContent)
  }

  const deleteNote = (id: string) => {
    setSavedNotes(savedNotes.filter((note) => note.id !== id))
  }

  return (
    <div className={`flex h-full flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Toolbar */}
      <div
        className={`flex items-center justify-between border-b p-2 ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center">
          <button
            className={`mr-2 rounded p-1 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            onClick={handleSave}
            title="Save"
          >
            <Save className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm">
          {content.length} characters | {content.split(/\s+/).filter(Boolean).length} words
        </div>
      </div>

      {/* Main editor */}
      <div className="flex flex-1">
        {/* Sidebar with saved notes */}
        <div
          className={`w-48 overflow-y-auto border-r ${
            theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-100"
          }`}
        >
          <div className="p-2">
            <h3 className="mb-2 font-medium">Saved Notes</h3>
            {savedNotes.length === 0 ? (
              <div className="text-center text-sm text-gray-500">No saved notes</div>
            ) : (
              <div className="space-y-1">
                {savedNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`group flex cursor-pointer items-center justify-between rounded p-2 ${
                      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                    onClick={() => loadNote(note.content)}
                  >
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="truncate text-sm">{note.name}</span>
                    </div>
                    <button
                      className="hidden rounded p-1 text-red-500 group-hover:block"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNote(note.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Text area */}
        <textarea
          className={`flex-1 resize-none p-4 focus:outline-none ${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your notes here..."
        />
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-80 rounded-lg p-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h3 className="mb-4 text-lg font-medium">Save Note</h3>
            <div className="mb-4">
              <label className="mb-1 block text-sm">File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className={`w-full rounded border p-2 ${
                  theme === "dark" ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"
                }`}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className={`rounded px-4 py-2 ${
                  theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
              <button
                className={`rounded px-4 py-2 ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                onClick={confirmSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
