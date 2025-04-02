import { useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import ChatHistory from '../components/chat/ChatHistory'
import ChatInput from '../components/chat/ChatInput'
import useChatApi from '../hooks/useChatApi'
import { FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px); /* Account for header and footer */
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`

const ChatHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.grayDark};
`

const ChatTitle = styled.h1`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`

const ClearChatButton = styled(motion.button)`
  background-color: transparent;
  color: ${props => props.theme.colors.textMuted};
  border: 1px solid ${props => props.theme.colors.grayDark};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.error};
    border-color: ${props => props.theme.colors.error};
  }
`

const ChartDataAlert = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.colors.backgroundLighter};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: ${props => props.theme.shadows.glow};
  z-index: 100;
`

const ChartAlertText = styled.span`
  color: ${props => props.theme.colors.text};
`

const ViewDashboardButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
`

const Chat = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const {
    messages,
    loading,
    error,
    hasChartData,
    chartData,
    sendMessage,
    clearChat
  } = useChatApi()
  
  // Set document title
  useEffect(() => {
    document.title = 'Chat with ALFRED.AI | Restaurant Assistant'
  }, [])
  
  const handleViewDashboard = () => {
    navigate('/dashboard')
  }
  
  return (
    <ChatContainer>
      <ChatHeader theme={theme}>
        <ChatTitle theme={theme}>
          Chat with <span>Alfred</span>
        </ChatTitle>
        
        {messages.length > 0 && (
          <ClearChatButton
            theme={theme}
            onClick={clearChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash size={14} />
            Clear Chat
          </ClearChatButton>
        )}
      </ChatHeader>
      
      <ChatHistory
        messages={messages}
        onSuggestionClick={sendMessage}
      />
      
      <ChatInput
        onSend={sendMessage}
        isLoading={loading}
      />
      
      {hasChartData && (
        <ChartDataAlert
          theme={theme}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <ChartAlertText theme={theme}>
            Chart data is available for your query
          </ChartAlertText>
          <ViewDashboardButton
            theme={theme}
            onClick={handleViewDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Dashboard
          </ViewDashboardButton>
        </ChartDataAlert>
      )}
    </ChatContainer>
  )
}

export default Chat