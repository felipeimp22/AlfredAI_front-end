import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
`;

const LoginCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.backgroundLighter};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.md};
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, 
      ${props => props.theme.colors.primary} 0%, 
      ${props => props.theme.colors.primaryLight} 100%);
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.grayDark};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.backgroundLight};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}30;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.grayLight};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.grayLight};
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.gray};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
  background-color: #ff000020;
  color: #ff0000;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.9rem;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const { theme } = useTheme();
  const { login, error: authError, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  // Clear error when input changes
  useEffect(() => {
    if (error) setError('');
  }, [formData]);
  
  // Set error from auth context
  useEffect(() => {
    if (authError) setError(authError);
  }, [authError]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    
    // Validate inputs
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    
    try {
      await login({ email, password });
      
      // Navigate to the protected page the user was trying to access, or to chat
      const from = location.state?.from || '/chat';
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by auth context and set in useEffect
      console.error('Login error:', err);
    }
  };
  
  return (
    <PageContainer theme={theme}>
      <LoginCard
        theme={theme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title theme={theme}>
          Login to <span>ALFRED.AI</span>
        </Title>
        
        {error && (
          <ErrorMessage
            theme={theme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </ErrorMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Email</Label>
            <InputWrapper>
              <InputIcon theme={theme}>
                <FaEnvelope />
              </InputIcon>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                theme={theme}
              />
            </InputWrapper>
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>Password</Label>
            <InputWrapper>
              <InputIcon theme={theme}>
                <FaLock />
              </InputIcon>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                theme={theme}
              />
            </InputWrapper>
          </FormGroup>
          
          <Button
            type="submit"
            disabled={loading}
            theme={theme}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Logging in...' : 'Login'}
            {!loading && <FaSignInAlt />}
          </Button>
        </form>
        
        <RegisterLink theme={theme}>
          Don't have an account? <Link to="/register">Register</Link>
        </RegisterLink>
      </LoginCard>
    </PageContainer>
  );
};

export default Login;