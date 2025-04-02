// src\components\home\HeroSection.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion, useSpring, transform } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'

// Food card imports and definitions
const foodImages = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80',
  fruit: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80',
  fries: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80',
  salmon: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80'
};

const HeroContainer = styled.div`
  position: relative;
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  z-index: 1;
`

const ContentWrapper = styled(motion.div)`
  max-width: 700px;
  padding: 0 2rem;
  position: relative;
  z-index: 10; /* Higher z-index to appear above food cards */
`

const SubTitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: ${props => props.theme.colors.textMuted};
  margin-bottom: 1.5rem;
`

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
  
  span {
    display: block;
    color: ${props => props.theme.colors.primary};
    text-shadow: ${props => props.theme.shadows.glowStrong};
  }
`

const Button = styled(motion.button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
    box-shadow: ${props => props.theme.shadows.glow};
    transform: translateY(-3px);
    
    &::before {
      transform: translateX(100%);
      transition: transform 0.8s ease;
    }
  }
`

const GlowEffect = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(
    circle,
    rgba(255, 95, 0, 0.4) 0%,
    rgba(255, 95, 0, 0.1) 50%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.7;
  z-index: 1;
  
  &.top-right {
    top: 10%;
    right: 15%;
  }
  
  &.bottom-left {
    bottom: 15%;
    left: 10%;
  }
`

// Food card components
const FoodCardsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;
`;

const FoodCard = styled(motion.div)`
  position: absolute;
  width: 180px;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.backgroundLighter};
  box-shadow: ${props => props.theme.shadows.md};
  transition: box-shadow 0.3s ease;
  pointer-events: auto;
  transform-style: preserve-3d;
  will-change: transform;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 140px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${FoodCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 0.75rem;
`;

const FoodTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StarIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  
  &::before {
    content: "★";
  }
`;

const Rating = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const foodItems = [
  {
    id: 1,
    image: foodImages.burger,
    title: 'X-Burger',
    rating: 5.0,
    initialPosition: { x: '15%', y: '20%' },
    depth: 0.85
  },
  {
    id: 2,
    image: foodImages.salad,
    title: 'Salada',
    rating: 4.9,
    initialPosition: { x: '75%', y: '30%' },
    depth: 0.6
  },
  {
    id: 3,
    image: foodImages.fruit,
    title: 'Maça e Pera',
    rating: 4.7,
    initialPosition: { x: '85%', y: '70%' },
    depth: 0.4
  },
  {
    id: 4,
    image: foodImages.fries,
    title: 'Batata Frita',
    rating: 4.9,
    initialPosition: { x: '65%', y: '80%' },
    depth: 0.7
  },
  {
    id: 5,
    image: foodImages.salmon,
    title: 'Arroz e Salmão',
    rating: 4.8,
    initialPosition: { x: '20%', y: '75%' },
    depth: 0.5
  }
];

const HeroSection = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Spring configs for super smooth motion
  const springConfig = { 
    stiffness: 150, 
    damping: 15, 
    mass: 0.1,
    restDelta: 0.001,
    restSpeed: 0.001
  };
  
  // Create spring motion values
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);
  
  const handleGetStarted = () => {
    navigate('/chat');
  };
  
  // Update springs when cursor moves
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate cursor position relative to container center (-1 to 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      // Update spring targets
      springX.set(x);
      springY.set(y);
      
      // Also store the raw values for non-spring effects
      setCursorPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [springX, springY]);
  
  return (
    <HeroContainer ref={containerRef}>
      <GlowEffect className="top-right" />
      <GlowEffect className="bottom-left" />
      
      {/* Food Cards with Parallax Effect */}
      <FoodCardsContainer>
        {foodItems.map((item, index) => {
          // For super smooth parallax, each card gets different movement range based on depth
          const moveRange = 40 * item.depth; // Pixels to move (depth factor affects amount)
          
          return (
            <FoodCard
              key={item.id}
              theme={theme}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
              }}
              transition={{
                opacity: { duration: 0.6, delay: index * 0.15 },
                scale: { duration: 0.6, delay: index * 0.15, type: "spring" }
              }}
              style={{
                left: item.initialPosition.x,
                top: item.initialPosition.y,
                x: springX.get() * moveRange,
                y: springY.get() * moveRange
              }}
              drag
              dragConstraints={containerRef}
              dragElastic={0.05}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
              whileHover={{ 
                scale: 1.05, 
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <CardImage>
                <img src={item.image} alt={item.title} />
              </CardImage>
              <CardContent>
                <FoodTitle theme={theme}>{item.title}</FoodTitle>
                <RatingContainer>
                  <StarIcon theme={theme} />
                  <Rating theme={theme}>{item.rating}</Rating>
                </RatingContainer>
              </CardContent>
            </FoodCard>
          );
        })}
      </FoodCardsContainer>
      
      <ContentWrapper
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <SubTitle
          theme={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          This is the new generation Welcome to
        </SubTitle>
        
        <Title
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          ALFRED <span>AI</span>
        </Title>
        
        <Button
          theme={theme}
          onClick={handleGetStarted}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Get Started
        </Button>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default HeroSection;