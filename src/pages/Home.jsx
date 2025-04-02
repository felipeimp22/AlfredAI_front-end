// src\pages\Home.jsx
import { useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import HeroSection from '../components/home/HeroSection'
import { FaRobot, FaChartBar, FaComment } from 'react-icons/fa'

// Note: ParallaxBackground import has been removed

const HomeContainer = styled.div`
  position: relative;
  overflow: hidden;
`

const FeaturesSection = styled.section`
  padding: 6rem 0;
  background-color: ${props => props.theme.colors.backgroundLight};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.primary},
      transparent
    );
  }
`

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${props => props.theme.colors.text};
  
  span {
    color: ${props => props.theme.colors.primary};
    text-shadow: ${props => props.theme.shadows.glow};
  }
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`

const FeatureCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.backgroundLighter};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.glow};
  }
`

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  text-shadow: ${props => props.theme.shadows.glow};
`

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textMuted};
  line-height: 1.6;
`

const CTASection = styled.section`
  padding: 5rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
`

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  
  span {
    color: ${props => props.theme.colors.primary};
    text-shadow: ${props => props.theme.shadows.glow};
  }
`

const CTADescription = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  color: ${props => props.theme.colors.textMuted};
`

const CTAButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
    box-shadow: ${props => props.theme.shadows.glow};
    transform: translateY(-3px);
  }
`

const features = [
  {
    id: 1,
    icon: <FaRobot />,
    title: 'AI-Powered Insights',
    description: 'Ask questions in natural language and get restaurant-specific insights powered by advanced AI models.'
  },
  {
    id: 2,
    icon: <FaChartBar />,
    title: 'Interactive Visualizations',
    description: 'Turn complex data into beautiful, interactive visualizations that help you understand your business at a glance.'
  },
  {
    id: 3,
    icon: <FaComment />,
    title: 'Conversational Interface',
    description: 'Chat naturally with Alfred to analyze sales, track inventory, and understand customer preferences.'
  }
]

const Home = () => {
  const { theme } = useTheme()
  
  // Set document title
  useEffect(() => {
    document.title = 'ALFRED.AI | Restaurant Assistant'
  }, [])
  
  return (
    <HomeContainer>
      <HeroSection />
      {/* ParallaxBackground component has been removed */}
      
      <FeaturesSection theme={theme}>
        <SectionTitle theme={theme}>
          Powerful <span>Features</span>
        </SectionTitle>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              theme={theme}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <FeatureIcon theme={theme}>{feature.icon}</FeatureIcon>
              <FeatureTitle theme={theme}>{feature.title}</FeatureTitle>
              <FeatureDescription theme={theme}>
                {feature.description}
              </FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
      
      <CTASection>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <CTATitle theme={theme}>
            Ready to <span>Transform</span> Your Restaurant?
          </CTATitle>
          <CTADescription theme={theme}>
            Start using Alfred today and unlock the power of AI-driven insights for your business.
          </CTADescription>
          <CTAButton
            theme={theme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/chat'}
          >
            Start Chatting with Alfred
          </CTAButton>
        </motion.div>
      </CTASection>
    </HomeContainer>
  )
}

export default Home