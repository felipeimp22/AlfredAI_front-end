import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import { DashboardProvider } from './contexts/DashboardContext'
import './styles/global.css'

// Create a simple error boundary for development
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#1a1a1a', 
          color: '#f5f5f5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          borderRadius: '8px',
          margin: '20px',
          border: '1px solid #FF5F00'
        }}>
          <h2 style={{ color: '#FF5F00' }}>Something went wrong</h2>
          <p>The application encountered an error. Please check the console for more details.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#FF5F00',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Reload Page
          </button>
          {this.state.error && (
            <pre style={{ 
              marginTop: '20px', 
              padding: '10px', 
              backgroundColor: '#222', 
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <DashboardProvider>
          <App />
        </DashboardProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)