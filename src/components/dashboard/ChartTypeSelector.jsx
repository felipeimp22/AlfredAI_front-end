import { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  FaChartBar, 
  FaChartPie, 
  FaChartLine, 
  FaTable,
  FaChartArea,
  FaExpand
} from 'react-icons/fa'

const SelectorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

const ChartTypeButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: ${props => 
    props.active 
      ? props.theme.colors.primary
      : props.theme.colors.backgroundLighter};
  color: ${props => 
    props.active 
      ? 'white'
      : props.theme.colors.text};
  border: 1px solid ${props => 
    props.active 
      ? props.theme.colors.primary
      : props.theme.colors.grayDark};
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props =>
      props.active
        ? props.theme.colors.primary
        : props.theme.colors.grayDark};
    border-color: ${props =>
      props.active
        ? props.theme.colors.primary
        : props.theme.colors.gray};
  }
  
  svg {
    font-size: 1rem;
  }
`

const chartTypes = [
  { id: 'bar', label: 'Bar', icon: <FaChartBar /> },
  { id: 'line', label: 'Line', icon: <FaChartLine /> },
  { id: 'pie', label: 'Pie', icon: <FaChartPie /> },
  { id: 'doughnut', label: 'Doughnut', icon: <FaChartPie /> },
  { id: 'area', label: 'Area', icon: <FaChartArea /> },
  { id: 'table', label: 'Table', icon: <FaTable /> }
]

const ChartTypeSelector = ({ selectedType, onTypeChange, onFullscreen }) => {
  const { theme } = useTheme()
  
  return (
    <SelectorContainer>
      {chartTypes.map((type) => (
        <ChartTypeButton
          key={type.id}
          theme={theme}
          active={selectedType === type.id}
          onClick={() => onTypeChange(type.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {type.icon}
          {type.label}
        </ChartTypeButton>
      ))}
      
      <ChartTypeButton
        theme={theme}
        onClick={onFullscreen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Toggle fullscreen"
        style={{ marginLeft: 'auto' }}
      >
        <FaExpand />
      </ChartTypeButton>
    </SelectorContainer>
  )
}

export default ChartTypeSelector