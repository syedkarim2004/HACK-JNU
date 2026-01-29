import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPlus, 
  FiMessageSquare, 
  FiTrash2, 
  FiEdit3, 
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal 
} from 'react-icons/fi'
import { useChatContext } from '../context/ChatContext'

const ChatSidebar = () => {
  const {
    chatList,
    activeChatId,
    loadChat,
    startNewChat,
    deleteChat,
    updateChatTitle,
    fetchChatList,
    isSidebarOpen,
    toggleSidebar
  } = useChatContext()

  const [groupedChats, setGroupedChats] = useState({
    today: [],
    yesterday: [],
    lastWeek: [],
    older: []
  })
  const [editingChatId, setEditingChatId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  // Group chats by time periods
  useEffect(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const grouped = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: []
    }

    chatList.forEach(chat => {
      const chatDate = new Date(chat.updatedAt)
      
      if (chatDate >= today) {
        grouped.today.push(chat)
      } else if (chatDate >= yesterday) {
        grouped.yesterday.push(chat)
      } else if (chatDate >= lastWeek) {
        grouped.lastWeek.push(chat)
      } else {
        grouped.older.push(chat)
      }
    })

    setGroupedChats(grouped)
  }, [chatList])

  const handleChatClick = (chatId) => {
    loadChat(chatId)
  }

  const handleNewChat = () => {
    startNewChat()
  }

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(chatId)
    }
  }

  const handleEditTitle = (chatId, currentTitle, e) => {
    e.stopPropagation()
    setEditingChatId(chatId)
    setEditTitle(currentTitle)
  }

  const handleSaveTitle = async (chatId) => {
    if (editTitle.trim()) {
      await updateChatTitle(chatId, editTitle.trim())
    }
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleCancelEdit = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  const ChatItem = ({ chat }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      onClick={() => handleChatClick(chat.id)}
      className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        activeChatId === chat.id 
          ? 'bg-blue-500/20 border border-blue-500/30' 
          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <FiMessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        {editingChatId === chat.id ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={() => handleSaveTitle(chat.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle(chat.id)
              if (e.key === 'Escape') handleCancelEdit()
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent border border-blue-500 rounded px-2 py-1 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
            autoFocus
          />
        ) : (
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {chat.title}
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {chat.messageCount} messages
        </p>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <button
          onClick={(e) => handleEditTitle(chat.id, chat.title, e)}
          className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <FiEdit3 className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => handleDeleteChat(chat.id, e)}
          className="p-1 text-slate-500 hover:text-red-500 transition-colors"
        >
          <FiTrash2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  )

  const ChatGroup = ({ title, chats }) => (
    chats.length > 0 && (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          {title}
        </h3>
        <div className="space-y-1">
          <AnimatePresence>
            {chats.map(chat => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  )

  return (
    <>
      {/* Toggle Button (Always Visible) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        {isSidebarOpen ? (
          <FiChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        ) : (
          <FiChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        )}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Chat History
              </h2>
              <button
                onClick={handleNewChat}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <FiPlus className="w-4 h-4" />
                New Chat
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatList.length === 0 ? (
                <div className="text-center py-8">
                  <FiMessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No conversations yet
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                    Start a new chat to begin
                  </p>
                </div>
              ) : (
                <>
                  <ChatGroup title="Today" chats={groupedChats.today} />
                  <ChatGroup title="Yesterday" chats={groupedChats.yesterday} />
                  <ChatGroup title="Last 7 Days" chats={groupedChats.lastWeek} />
                  <ChatGroup title="Older" chats={groupedChats.older} />
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {chatList.length} conversation{chatList.length !== 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatSidebar