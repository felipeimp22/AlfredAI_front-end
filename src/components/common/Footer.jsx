import React from 'react'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.backgroundLight};
  padding: 2rem 0;
  margin-top: auto;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 2rem;
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
  }
`

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.textMuted};
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`

const SocialLink = styled.a`
  color: ${props => props.theme.colors.textMuted};
  font-size: 1.5rem;
  transition: color 0.2s ease, transform 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.grayDark};
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.9rem;
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`

const Footer = () => {
  const { theme } = useTheme()
  const year = new Date().getFullYear()
  
  return (
    <FooterContainer theme={theme}>
      <FooterContent>
        <FooterSection>
          <FooterTitle theme={theme}>ALFRED.AI</FooterTitle>
          <p style={{ color: theme.colors.textMuted, marginBottom: '1rem' }}>
            AI-powered restaurant assistant for business insights and analytics through natural language.
          </p>
          <SocialLinks>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer" theme={theme}>
              <FaGithub />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer" theme={theme}>
              <FaTwitter />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer" theme={theme}>
              <FaLinkedin />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle theme={theme}>Navigation</FooterTitle>
          <FooterLink to="/" theme={theme}>Home</FooterLink>
          <FooterLink to="/chat" theme={theme}>Chat with Alfred</FooterLink>
          <FooterLink to="/dashboard" theme={theme}>Dashboard</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle theme={theme}>Resources</FooterTitle>
          <FooterLink to="#" theme={theme}>Documentation</FooterLink>
          <FooterLink to="#" theme={theme}>API Reference</FooterLink>
          <FooterLink to="#" theme={theme}>Examples</FooterLink>
          <FooterLink to="#" theme={theme}>Blog</FooterLink>
        </FooterSection>
      </FooterContent>
      
      <Copyright theme={theme}>
        © {year} <span>ALFRED.AI</span> | All rights reserved
      </Copyright>
    </FooterContainer>
  )
}

export default Footer