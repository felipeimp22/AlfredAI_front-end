import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'
import restaurantApi from '../../services/api'

const TesterContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${props => props.theme.colors.backgroundLighter};
  border: 1px solid ${props => props.theme.colors.grayDark};
  border-radius: 8px;
  padding: 1rem;
  width: 350px;
  z-index: 1000;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textMuted};
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Field = styled.div`
  margin-bottom: 0.75rem;
`;

const Label = styled.div`
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.textMuted};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background-color: ${props => props.theme.colors.backgroundLight};
  border: 1px solid ${props => props.theme.colors.grayDark};
  border-radius: 4px;
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.gray};
    cursor: not-allowed;
  }
`;

const StatusDisplay = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: ${props => 
    props.success ? 'rgba(76, 175, 80, 0.1)' : 
    props.error ? 'rgba(244, 67, 54, 0.1)' : 'transparent'};
  border: 1px solid ${props => 
    props.success ? 'rgba(76, 175, 80, 0.5)' : 
    props.error ? 'rgba(244, 67, 54, 0.5)' : 'transparent'};
  border-radius: 4px;
  color: ${props => 
    props.success ? '#4CAF50' : 
    props.error ? '#F44336' : props.theme.colors.text};
  font-size: 0.9rem;
`;

const ResponseContainer = styled.pre`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.colors.backgroundLight};
  border-radius: 4px;
  color: ${props => props.theme.colors.text};
  font-size: 0.8rem;
  max-height: 200px;
  overflow-y: auto;
  word-break: break-word;
  white-space: pre-wrap;
`;

const ApiTester = ({ onClose }) => {
  const { theme } = useTheme();
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:3002');
  const [testPrompt, setTestPrompt] = useState('What are the most popular dishes?');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: 'info', message: 'Ready to test API connection' });

  // Test connection on initial render
  useEffect(() => {
    testConnection();
  }, []);
  
  const testConnection = async () => {
    setLoading(true);
    setStatus({ type: 'info', message: 'Testing API connection...' });
    
    try {
      const result = await restaurantApi.testConnection();
      if (result.success) {
        setStatus({ type: 'success', message: 'API connection successful!' });
      } else {
        setStatus({ type: 'error', message: `Connection test failed: ${result.message}` });
      }
      setResult(result);
    } catch (error) {
      console.error('Connection test error:', error);
      setStatus({ type: 'error', message: `Error: ${error.message}` });
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  const sendTestRequest = async () => {
    setLoading(true);
    setStatus({ type: 'info', message: 'Sending test request...' });
    
    try {
      // Make direct fetch request to bypass any axios or API service issues
      const response = await fetch(`${apiUrl}/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testPrompt }),
      });
      
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = responseText;
      }
      
      setResult(responseData);
      setStatus({ 
        type: 'success', 
        message: `Request successful! Status: ${response.status}`
      });
    } catch (error) {
      console.error('Test request error:', error);
      setStatus({ type: 'error', message: `Error: ${error.message}` });
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <TesterContainer theme={theme}>
      <Title theme={theme}>
        API Connection Tester
        <CloseButton theme={theme} onClick={onClose}>×</CloseButton>
      </Title>
      
      <Field>
        <Label theme={theme}>API URL</Label>
        <Input 
          theme={theme} 
          value={apiUrl} 
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="http://localhost:3002"
        />
      </Field>
      
      <Field>
        <Label theme={theme}>Test Prompt</Label>
        <Input 
          theme={theme} 
          value={testPrompt} 
          onChange={(e) => setTestPrompt(e.target.value)}
          placeholder="What are the most popular dishes?"
        />
      </Field>
      
      <div>
        <Button 
          theme={theme} 
          onClick={testConnection} 
          disabled={loading}
        >
          Test Connection
        </Button>
        
        <Button 
          theme={theme} 
          onClick={sendTestRequest} 
          disabled={loading || !testPrompt.trim()}
        >
          Send Test Request
        </Button>
      </div>
      
      <StatusDisplay 
        theme={theme}
        success={status.type === 'success'}
        error={status.type === 'error'}
      >
        {status.message}
      </StatusDisplay>
      
      {result && (
        <ResponseContainer theme={theme}>
          {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
        </ResponseContainer>
      )}
    </TesterContainer>
  );
};

export default ApiTester;