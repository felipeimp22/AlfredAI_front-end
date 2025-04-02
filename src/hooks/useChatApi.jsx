import { useState, useEffect, useCallback } from 'react'
import restaurantApi from '../services/api'
import { useDashboard } from '../contexts/DashboardContext'

/**
 * Custom hook for chat functionality
 * @returns {Object} Chat state and methods
 */
const useChatApi = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasChartData, setHasChartData] = useState(false)
  const [chartData, setChartData] = useState(null)
  
  const { setCurrentDashboard } = useDashboard()
  
  // Load chat history from localStorage on initial render
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('alfred-chat-history')
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      }
    } catch (err) {
      console.error('Error parsing saved chat history:', err)
      localStorage.removeItem('alfred-chat-history')
    }
  }, [])
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('alfred-chat-history', JSON.stringify(messages))
      } catch (err) {
        console.error('Error saving chat history:', err)
      }
    }
  }, [messages])
  
  /**
   * Send a message to the API and handle the response
   * @param {string} message - User message
   */
  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    
    setLoading(true)
    setError(null)
    setHasChartData(false)
    setChartData(null)
    
    // Add a temporary "thinking" message
    const thinkingMessageId = Date.now();
    setMessages(prev => [
      ...prev, 
      { 
        role: 'assistant', 
        content: 'Thinking...', 
        id: thinkingMessageId,
        temporary: true
      }
    ]);
    
    try {
      console.log('Sending message to API:', message);
      const response = await restaurantApi.sendChatQuery(message);
      console.log('API Response:', response);
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMessageId));
      
      // Check if response is just a string
      if (typeof response === 'string') {
        const assistantMessage = {
          role: 'assistant',
          content: response
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }
      
      // Check if response includes chart data
      if (response.chart) {
        setHasChartData(true)
        setChartData(response.chart)
        
        // Update dashboard context with chart data
        setCurrentDashboard({
          title: response.chart.options?.title || 'Untitled Dashboard',
          chartType: response.chart.type,
          chartData: response.chart.data,
          chartOptions: response.chart.options,
          query: message,
          timestamp: new Date().toISOString()
        })
      }
      
      // Get the message content from the response
      const messageContent = response.message || 
                            (typeof response === 'object' ? JSON.stringify(response) : response);
      
      // Add assistant response to chat
      const assistantMessage = {
        role: 'assistant',
        content: messageContent,
        data: response.data || null
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Error sending message:', err)
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMessageId));
      
      const errorMessage = err.message || 'Sorry, I encountered an error. Please try again.';
      setError(errorMessage)
      
      // Add error message to chat
      const errorAssistantMessage = {
        role: 'assistant',
        content: errorMessage
      }
      
      setMessages(prev => [...prev, errorAssistantMessage])
    } finally {
      setLoading(false)
    }
  }, [setCurrentDashboard])
  
  /**
   * Clear the chat history
   */
  const clearChat = useCallback(() => {
    setMessages([])
    setHasChartData(false)
    setChartData(null)
    localStorage.removeItem('alfred-chat-history')
  }, [])
  
  return {
    messages,
    loading,
    error,
    hasChartData,
    chartData,
    sendMessage,
    clearChat
  }
}

export default useChatApi