import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { FaStar } from 'react-icons/fa'

const Card = styled(motion.div)`
  position: absolute;
  width: 180px;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.backgroundLighter};
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.glow};
  }
`

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
`

const CardContent = styled.div`
  padding: 0.75rem;
`

const FoodTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StarIcon = styled(FaStar)`
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
`

const Rating = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`

/**
 * Parallax Food Card Component
 * @param {Object} props
 * @param {string} props.image - Image URL
 * @param {string} props.title - Food item title
 * @param {number} props.rating - Rating value
 * @param {Object} props.position - Position coordinates {x, y}
 * @param {number} props.delay - Animation delay
 */
const FoodCard = ({ image, title, rating, position, delay = 0 }) => {
  const { theme } = useTheme()
  
  return (
    <Card 
      theme={theme}
      style={{ top: position.y, left: position.x }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      drag
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      dragElastic={0.1}
    >
      <ImageContainer>
        <img src={image} alt={title} />
      </ImageContainer>
      <CardContent>
        <FoodTitle theme={theme}>{title}</FoodTitle>
        <RatingContainer>
          <StarIcon theme={theme} />
          <Rating theme={theme}>{rating}</Rating>
        </RatingContainer>
      </CardContent>
    </Card>
  )
}

export default FoodCard