import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiSend, FiFile, FiX, FiMic } from 'react-icons/fi'

const ChatInput = ({ onSubmit, sidebarCollapsed }) => {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Initialize Web Speech API for voice recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setMessage(prev => prev + (prev ? ' ' : '') + transcript)
        setIsRecording(false)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }
      
      recognitionInstance.onend = () => {
        setIsRecording(false)
      }
      
      setRecognition(recognitionInstance)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() || attachments.length > 0) {
      onSubmit(message, attachments)
      setMessage('')
      setAttachments([])
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newAttachments = files.map(file => {
      const isImage = file.type.startsWith('image/')
      return {
        file,
        type: isImage ? 'image' : 'document',
        name: file.name,
        size: file.size,
        preview: isImage ? URL.createObjectURL(file) : null
      }
    })
    setAttachments([...attachments, ...newAttachments])
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const handleVoiceRecord = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      recognition.start()
      setIsRecording(true)
    }
  }

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index)
    // Revoke object URLs to prevent memory leaks
    if (attachments[index].preview) {
      URL.revokeObjectURL(attachments[index].preview)
    }
    setAttachments(newAttachments)
  }

  // Calculate left margin based on sidebar state
  const leftMargin = sidebarCollapsed ? '80px' : '280px'

  return (
    <>
      {/* Hidden file input - accepts both images and documents */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-3 z-10"
        style={{ left: `calc(${leftMargin} + 1.5rem)`, right: '1.5rem' }}
      >
        <form onSubmit={handleSubmit} className="relative">
          {/* Attachments preview */}
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 flex flex-wrap gap-2"
            >
              {attachments.map((attachment, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow-sm dark:bg-slate-900 dark:border-slate-700"
                >
                  {attachment.preview ? (
                    <img src={attachment.preview} alt={attachment.name} className="w-6 h-6 rounded object-cover" />
                  ) : (
                    <FiFile className="text-gray-600" size={16} />
                  )}
                  <span className="text-xs text-gray-700 dark:text-slate-200 max-w-[100px] truncate">
                    {attachment.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="text-gray-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border border-gray-200 rounded-2xl p-2.5 shadow-lg dark:bg-slate-900/95 dark:border-slate-700 dark:shadow-[0_18px_45px_rgba(15,23,42,0.85)]"
          >
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <FiPlus size={20} />
              </motion.button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about compliance requirements..."
                className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:placeholder-gray-300 dark:focus:placeholder-slate-400 transition-all"
              />
              <motion.button
                type="button"
                onClick={handleVoiceRecord}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording
                    ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                    : 'hover:bg-gray-100 text-gray-600 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                <FiMic size={20} />
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors shadow-md shadow-blue-500/40"
              >
                <FiSend size={20} />
              </motion.button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </>
  )
}

export default ChatInput
