import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'
import ChatMessage from './ChatMessage'

const HistoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textMuted};
`

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`

const EmptyStateText = styled.p`
  margin-bottom: 1.5rem;
  max-width: 500px;
`

const SuggestionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
`

const SuggestionButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundLighter};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.grayDark};
  border-radius: 20px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.grayDark};
    border-color: ${props => props.theme.colors.primary};
  }
`

const suggestions = [
  "What are our most popular dishes?",
  "Show me a chart of monthly sales",
  "Which customers spent the most last month?",
  "What ingredients are running low?",
  "Who are our best staff members?"
]

const ChatHistory = ({ messages, onSuggestionClick }) => {
  const { theme } = useTheme()
  const messagesEndRef = useRef(null)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  return (
    <HistoryContainer>
      {messages.length === 0 ? (
        <EmptyState theme={theme}>
          <EmptyStateTitle theme={theme}>
            Welcome to Alfred AI
          </EmptyStateTitle>
          <EmptyStateText theme={theme}>
            I'm your restaurant assistant powered by AI. Ask me anything about your restaurant's data, from sales and inventory to customer preferences.
          </EmptyStateText>
          
          <EmptyStateText theme={theme}>
            Try asking one of these questions:
          </EmptyStateText>
          
          <SuggestionContainer>
            {suggestions.map((suggestion, index) => (
              <SuggestionButton
                key={index}
                theme={theme}
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </SuggestionButton>
            ))}
          </SuggestionContainer>
        </EmptyState>
      ) : (
        messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.content || message}
            isUser={message.role === 'user'}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </HistoryContainer>
  )
}

export default ChatHistory