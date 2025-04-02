import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const HeaderContainer = styled.header`
  background-color: transparent;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndices.sticky};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`

const Logo = styled(Link)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  
  span {
    color: ${props => props.theme.colors.primary};
    margin-left: 0.25rem;
    text-shadow: ${props => props.theme.shadows.glow};
  }
`

const NavLinks = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => (props.isOpen ? '0' : '-100%')};
    width: 250px;
    height: 100vh;
    background-color: ${props => props.theme.colors.backgroundLighter};
    flex-direction: column;
    padding: 2rem;
    gap: 1.5rem;
    transition: right 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  }
`

const NavLink = styled(Link)`
  color: ${props => 
    props.active 
      ? props.theme.colors.primary 
      : props.theme.colors.text};
  font-weight: ${props => (props.active ? '600' : '400')};
  padding: 0.5rem;
  border-bottom: 2px solid ${props => 
    props.active 
      ? props.theme.colors.primary 
      : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 1rem;
  }
`

const AuthButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: ${props => props.filled ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.filled ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.filled ? 'transparent' : props.theme.colors.grayDark};
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.filled ? props.theme.colors.primaryLight : props.theme.colors.grayDark};
    color: ${props => props.filled ? 'white' : props.theme.colors.primary};
  }
  
  & + & {
    margin-left: 0.75rem;
  }
`

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.grayDark};
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.grayDark};
  }
`

const UserMenuContainer = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 1.5rem;
  background-color: ${props => props.theme.colors.backgroundLighter};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;
  width: 200px;
  z-index: ${props => props.theme.zIndices.dropdown};
  
  @media (max-width: 768px) {
    position: static;
    width: 100%;
    margin-top: 1rem;
  }
`

const UserMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: transparent;
  color: ${props => props.theme.colors.text};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.grayDark};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.grayDark};
  }
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: ${props => props.theme.zIndices.dropdown};
  
  @media (max-width: 768px) {
    display: block;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`

const Header = () => {
  const { theme } = useTheme()
  const { currentUser, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Handle scroll event to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  // Close mobile menu on location change
  useEffect(() => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location])
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('nav') && !e.target.closest('button')) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && !e.target.closest('#user-menu') && !e.target.closest('#user-button')) {
        setIsUserMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])
  
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  return (
    <HeaderContainer theme={theme} style={{ 
      boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.2)' : 'none' 
    }}>
      <HeaderContent>
        <Logo to="/" theme={theme}>
          ALFRED<span>.AI</span>
        </Logo>
        
        <MobileMenuButton 
          onClick={() => setIsMenuOpen(true)} 
          theme={theme}
          aria-label="Open menu"
        >
          <FaBars />
        </MobileMenuButton>
        
        <NavLinks isOpen={isMenuOpen} theme={theme}>
          <CloseButton
            onClick={() => setIsMenuOpen(false)}
            theme={theme}
            aria-label="Close menu"
          >
            <FaTimes />
          </CloseButton>
          
          <NavLink
            to="/"
            active={location.pathname === '/'}
            theme={theme}
          >
            Home
          </NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink
                to="/chat"
                active={location.pathname === '/chat'}
                theme={theme}
              >
                Chat
              </NavLink>
              
              <NavLink
                to="/dashboard"
                active={location.pathname === '/dashboard'}
                theme={theme}
              >
                Dashboard
              </NavLink>
            </>
          )}
          
          <AuthContainer>
            {isAuthenticated ? (
              <>
                <UserButton 
                  id="user-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  theme={theme}
                >
                  <FaUser />
                  {currentUser?.name?.split(' ')[0] || 'User'}
                </UserButton>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <UserMenuContainer
                      id="user-menu"
                      theme={theme}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <UserMenuItem 
                        onClick={handleLogout}
                        theme={theme}
                      >
                        <FaSignOutAlt />
                        Logout
                      </UserMenuItem>
                    </UserMenuContainer>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <AuthButton 
                  to="/login"
                  theme={theme}
                >
                  Login
                </AuthButton>
                
                <AuthButton 
                  to="/register"
                  filled
                  theme={theme}
                >
                  Register
                </AuthButton>
              </>
            )}
          </AuthContainer>
        </NavLinks>
      </HeaderContent>
    </HeaderContainer>
  )
}

export default Header