import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { FaRobot, FaUser } from 'react-icons/fa'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const MessageContainer = styled(motion.div)`
  display: flex;
  padding: 1.5rem;
  
  &:nth-child(odd) {
    background-color: ${props => props.theme.colors.backgroundLight};
  }
`

const MessageBubble = styled.div`
  flex: 1;
  display: flex;
  gap: 1rem;
`

const AvatarWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${props => 
    props.isUser 
      ? props.theme.colors.grayDark
      : props.theme.colors.primary};
  color: white;
  box-shadow: ${props => 
    props.isUser 
      ? 'none' 
      : props.theme.shadows.glow};
`

const MessageContent = styled.div`
  flex: 1;
`

const Sender = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => 
    props.isUser 
      ? props.theme.colors.text
      : props.theme.colors.primary};
`

const Text = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  
  p {
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  pre {
    margin: 1rem 0;
    border-radius: 8px;
    overflow: hidden;
  }
  
  code {
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: underline;
    
    &:hover {
      text-decoration: none;
    }
  }
  
  strong {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
`

// Helper function to convert markdown-like content to JSX
const formatMessage = (content) => {
  if (!content) return null
  
  // Process code blocks
  const codeBlockRegex = /```([\w-]+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  const segments = []
  let match
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      segments.push(
        <p key={`text-${lastIndex}`}>
          {content.slice(lastIndex, match.index)}
        </p>
      )
    }
    
    // Add code block
    const language = match[1] || 'javascript'
    segments.push(
      <SyntaxHighlighter
        key={`code-${match.index}`}
        language={language}
        style={atomOneDark}
      >
        {match[2].trim()}
      </SyntaxHighlighter>
    )
    
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    segments.push(
      <p key={`text-${lastIndex}`}>
        {content.slice(lastIndex).split('\n\n').map((paragraph, i) => (
          <React.Fragment key={i}>
            {paragraph
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br />')}
            {i < content.slice(lastIndex).split('\n\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    )
  }
  
  return segments.length > 0 ? segments : <p>{content}</p>
}

// Parse HTML content from API (for bold text and line breaks)
const createMarkup = (htmlContent) => {
  return { __html: htmlContent }
}

const ChatMessage = ({ message, isUser }) => {
  const { theme } = useTheme()
  
  return (
    <MessageContainer
      theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MessageBubble>
        <AvatarWrapper theme={theme} isUser={isUser}>
          {isUser ? <FaUser size={18} /> : <FaRobot size={18} />}
        </AvatarWrapper>
        
        <MessageContent>
          <Sender theme={theme} isUser={isUser}>
            {isUser ? 'You' : 'Alfred AI'}
          </Sender>
          
          <Text 
            theme={theme}
            dangerouslySetInnerHTML={createMarkup(
              (message.content || message)
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br />')
            )}
          />
        </MessageContent>
      </MessageBubble>
    </MessageContainer>
  )
}

export default ChatMessage