// src\App.jsx
import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './router'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import ApiTester from './components/common/ApiTester'
import { useTheme } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import styled from 'styled-components'

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`

const ContentContainer = styled.main`
  flex: 1;
`

const DebugButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
`

// Wrapper component to use AuthContext inside Router
function AppContent() {
  const { theme } = useTheme()
  const [showApiTester, setShowApiTester] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <AppContainer theme={theme}>
      <Header />
      <ContentContainer>
        <AppRoutes />
      </ContentContainer>
      
      {/* Only render Footer when not authenticated */}
      {!isAuthenticated && <Footer />}
      
      {!showApiTester && (
        <DebugButton 
          theme={theme}
          onClick={() => setShowApiTester(true)}
          title="Open API Tester"
        >
          🔧
        </DebugButton>
      )}
      
      {showApiTester && (
        <ApiTester onClose={() => setShowApiTester(false)} />
      )}
    </AppContainer>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App