import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { FaChartBar, FaChartPie, FaChartLine, FaClock, FaTrash } from 'react-icons/fa'

const ListContainer = styled.div`
  margin-bottom: 2rem;
`

const ListTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const EmptyMessage = styled.p`
  color: ${props => props.theme.colors.textMuted};
  font-style: italic;
  padding: 1rem;
  text-align: center;
  background-color: ${props => props.theme.colors.backgroundLight};
  border-radius: 8px;
`

const DashboardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`

const DashboardCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.backgroundLighter};
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  position: relative;
  box-shadow: ${props => props.active 
    ? props.theme.shadows.glow 
    : props.theme.shadows.md};
  border: 1px solid ${props => props.active 
    ? props.theme.colors.primary 
    : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.glow};
  }
`

const DashboardTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  padding-right: 1.5rem; /* Space for delete button */
`

const DashboardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.9rem;
`

const ChartTypeIcon = styled.span`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`

const DashboardQuery = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textMuted};
  margin-top: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: italic;
`

const DeleteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textMuted};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    color: ${props => props.theme.colors.error};
  }
`

// Helper function to get appropriate icon for chart type
const getChartIcon = (type) => {
  switch (type) {
    case 'pie':
    case 'doughnut':
      return <FaChartPie />;
    case 'line':
    case 'area':
      return <FaChartLine />;
    case 'bar':
    default:
      return <FaChartBar />;
  }
};

// Helper function to format date
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  
  const date = new Date(timestamp);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString(undefined, options);
};

const SavedDashboardList = ({ 
  dashboards = [], 
  activeDashboardId = null,
  onSelect,
  onDelete
}) => {
  const { theme } = useTheme()
  
  if (dashboards.length === 0) {
    return (
      <ListContainer>
        <ListTitle theme={theme}>Saved Dashboards</ListTitle>
        <EmptyMessage theme={theme}>
          No dashboards saved yet. Create visualizations in the chat and save them here.
        </EmptyMessage>
      </ListContainer>
    );
  }
  
  return (
    <ListContainer>
      <ListTitle theme={theme}>
        Saved Dashboards
        <span style={{ color: theme.colors.textMuted, fontSize: '0.9rem' }}>
          {dashboards.length} {dashboards.length === 1 ? 'dashboard' : 'dashboards'}
        </span>
      </ListTitle>
      
      <DashboardList>
        <AnimatePresence>
          {dashboards.map((dashboard) => (
            <DashboardCard
              key={dashboard.id}
              theme={theme}
              active={dashboard.id === activeDashboardId}
              onClick={() => onSelect(dashboard.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <DashboardTitle theme={theme}>
                {dashboard.title || 'Untitled Dashboard'}
              </DashboardTitle>
              
              <DashboardMeta theme={theme}>
                <ChartTypeIcon theme={theme}>
                  {getChartIcon(dashboard.chartType)}
                </ChartTypeIcon>
                {dashboard.chartType}
              </DashboardMeta>
              
              <DashboardMeta theme={theme}>
                <FaClock />
                {formatDate(dashboard.created)}
              </DashboardMeta>
              
              {dashboard.query && (
                <DashboardQuery theme={theme} title={dashboard.query}>
                  "{dashboard.query}"
                </DashboardQuery>
              )}
              
              <DeleteButton 
                theme={theme}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(dashboard.id);
                }}
                title="Delete dashboard"
              >
                <FaTrash />
              </DeleteButton>
            </DashboardCard>
          ))}
        </AnimatePresence>
      </DashboardList>
    </ListContainer>
  );
};

export default SavedDashboardList;