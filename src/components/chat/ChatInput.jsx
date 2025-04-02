import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { FaPaperPlane } from 'react-icons/fa'

const InputContainer = styled.div`
  padding: 1.5rem;
  background-color: transparent;
  border-top: 1px solid ${props => props.theme.colors.grayDark};
  position: sticky;
  bottom: 0;
  z-index: 10;
`

const InputWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0 auto;
  max-width: 900px;
  position: relative;
`

const TextArea = styled.textarea`
  flex: 1;
  min-height: 60px;
  max-height: 150px;
  padding: 1rem;
  padding-right: 3rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.grayDark};
  background-color: ${props => props.theme.colors.backgroundLighter};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  font-size: 1rem;
  resize: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(255, 95, 0, 0.2);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray};
  }
`

const SendButton = styled(motion.button)`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:disabled {
    background-color: ${props => props.theme.colors.gray};
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
`

const InputInfoText = styled.div`
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textMuted};
  text-align: center;
`

const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('')
  const textAreaRef = useRef(null)
  const { theme } = useTheme()
  
  // Auto-resize textarea based on content
  useEffect(() => {
    const textArea = textAreaRef.current
    if (!textArea) return
    
    textArea.style.height = 'auto'
    textArea.style.height = `${Math.min(textArea.scrollHeight, 150)}px`
  }, [message])
  
  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  const handleSend = () => {
    if (message.trim() === '' || isLoading) return
    
    onSend(message.trim())
    setMessage('')
    
    // Reset textarea height
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'
    }
  }
  
  return (
    <InputContainer theme={theme}>
      <InputWrapper>
        <TextArea 
          ref={textAreaRef}
          theme={theme}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Alfred about your restaurant..."
          disabled={isLoading}
        />
        
        <SendButton
          theme={theme}
          disabled={message.trim() === '' || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          aria-label="Send message"
        >
          <FaPaperPlane size={16} />
        </SendButton>
      </InputWrapper>
      
      <InputInfoText theme={theme}>
        {isLoading ? 'Alfred is thinking...' : 'Press Enter to send, Shift+Enter for a new line'}
      </InputInfoText>
    </InputContainer>
  )
}

export default ChatInput