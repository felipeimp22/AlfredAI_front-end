import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'

const foodImages = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80',
  fruit: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80',
  fries: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80',
  salmon: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80'
};

const ParallaxContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`;

const Card = styled(motion.div)`
  position: absolute;
  width: 180px;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.backgroundLighter};
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  pointer-events: all;
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: ${props => props.theme.shadows.glow};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 140px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${Card}:hover & img {
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
    position: { x: '15%', y: '25%' },
    delay: 0.1
  },
  {
    id: 2,
    image: foodImages.salad,
    title: 'Salada',
    rating: 4.9,
    position: { x: '60%', y: '45%' },
    delay: 0.2
  },
  {
    id: 3,
    image: foodImages.fruit,
    title: 'Maça e Pera',
    rating: 4.7,
    position: { x: '80%', y: '15%' },
    delay: 0.3
  },
  {
    id: 4,
    image: foodImages.fries,
    title: 'Batata Frita',
    rating: 4.9,
    position: { x: '75%', y: '75%' },
    delay: 0.4
  },
  {
    id: 5,
    image: foodImages.salmon,
    title: 'Arroz e Salmão',
    rating: 4.8,
    position: { x: '30%', y: '65%' },
    delay: 0.5
  }
];

const ParallaxBackground = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  };
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <ParallaxContainer ref={containerRef} onMouseMove={handleMouseMove}>
      {foodItems.map((item) => (
        <Card
          key={item.id}
          theme={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: item.delay }}
          style={{
            left: item.position.x,
            top: item.position.y,
            x: (mousePosition.x / window.innerWidth - 0.5) * 40,
            y: (mousePosition.y / window.innerHeight - 0.5) * 40,
          }}
          drag
          dragConstraints={containerRef}
        >
          <ImageContainer>
            <img src={item.image} alt={item.title} />
          </ImageContainer>
          <CardContent>
            <FoodTitle theme={theme}>{item.title}</FoodTitle>
            <RatingContainer>
              <StarIcon theme={theme} />
              <Rating theme={theme}>{item.rating}</Rating>
            </RatingContainer>
          </CardContent>
        </Card>
      ))}
    </ParallaxContainer>
  );
};

export default ParallaxBackground;