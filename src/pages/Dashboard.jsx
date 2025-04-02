import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useDashboard } from '../contexts/DashboardContext'
import { useNavigate } from 'react-router-dom'
import Chart from '../components/dashboard/Chart'
import ChartTypeSelector from '../components/dashboard/ChartTypeSelector'
import SaveDashboardButton from '../components/dashboard/SaveDashboardButton'
import SavedDashboardList from '../components/dashboard/SavedDashboardList'
import { FaChartBar, FaArrowLeft, FaRedo } from 'react-icons/fa'

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const HeaderRight = styled.div`
  display: flex;
  gap: 1rem;
`

const DashboardTitle = styled.h1`
  font-size: 1.75rem;
  color: ${props => props.theme.colors.text};
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.grayDark};
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.grayDark};
  }
`

const RefreshButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.grayDark};
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.grayDark};
  }
`

const EmptyDashboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: ${props => props.theme.colors.backgroundLighter};
  border-radius: 12px;
  text-align: center;
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.textMuted};
  margin-bottom: 1.5rem;
`

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textMuted};
  margin-bottom: 2rem;
  max-width: 500px;
`

const CreateDashboardButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
`

const ChartSection = styled.div`
  margin-bottom: 3rem;
`

const Dashboard = () => {
  const { theme } = useTheme()
  const { 
    currentDashboard, 
    savedDashboards, 
    saveDashboard, 
    deleteDashboard, 
    loadDashboard 
  } = useDashboard()
  const navigate = useNavigate()
  
  const [selectedChart, setSelectedChart] = useState('bar')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dashboardTitle, setDashboardTitle] = useState('')
  
  // Set document title
  useEffect(() => {
    document.title = 'Dashboard | ALFRED.AI Restaurant Assistant'
  }, [])
  
  // Update chart type and title when dashboard changes
  useEffect(() => {
    if (currentDashboard) {
      setSelectedChart(currentDashboard.chartType || 'bar')
      setDashboardTitle(currentDashboard.title || 'Untitled Dashboard')
    } else if (savedDashboards.length > 0) {
      // Load the first saved dashboard if none is selected
      loadDashboard(savedDashboards[0].id)
    }
  }, [currentDashboard, savedDashboards, loadDashboard])
  
  const handleTypeChange = (type) => {
    setSelectedChart(type)
  }
  
  const handleSaveDashboard = () => {
    // Create a copy of the current dashboard with the selected chart type
    const dashboardToSave = {
      ...currentDashboard,
      chartType: selectedChart
    }
    
    saveDashboard(dashboardToSave)
    return Promise.resolve() // For the success notification
  }
  
  const handleNavToChatPage = () => {
    navigate('/chat')
  }
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }
  
  // Render empty state if no dashboard is available
  if (!currentDashboard && savedDashboards.length === 0) {
    return (
      <DashboardContainer>
        <DashboardHeader>
          <HeaderLeft>
            <DashboardTitle theme={theme}>
              <span>Dashboard</span>
            </DashboardTitle>
          </HeaderLeft>
          
          <HeaderRight>
            <BackButton
              theme={theme}
              onClick={handleNavToChatPage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft />
              Back to Chat
            </BackButton>
          </HeaderRight>
        </DashboardHeader>
        
        <EmptyDashboard theme={theme}>
          <EmptyIcon theme={theme}>
            <FaChartBar />
          </EmptyIcon>
          <EmptyTitle theme={theme}>No Dashboard Available</EmptyTitle>
          <EmptyText theme={theme}>
            You don't have any dashboards yet. Create one by asking Alfred to visualize data in the chat.
          </EmptyText>
          <CreateDashboardButton
            theme={theme}
            onClick={handleNavToChatPage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Chat
          </CreateDashboardButton>
        </EmptyDashboard>
      </DashboardContainer>
    )
  }
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderLeft>
          <DashboardTitle theme={theme}>
            <span>{dashboardTitle}</span>
          </DashboardTitle>
        </HeaderLeft>
        
        <HeaderRight>
          <BackButton
            theme={theme}
            onClick={handleNavToChatPage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft />
            Back to Chat
          </BackButton>
          
          <RefreshButton
            theme={theme}
            onClick={() => loadDashboard(currentDashboard.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh dashboard"
          >
            <FaRedo />
          </RefreshButton>
          
          <SaveDashboardButton
            onSave={handleSaveDashboard}
            disabled={!currentDashboard}
          />
        </HeaderRight>
      </DashboardHeader>
      
      <ChartSection>
        <ChartTypeSelector
          selectedType={selectedChart}
          onTypeChange={handleTypeChange}
          onFullscreen={toggleFullscreen}
        />
        
        {currentDashboard && (
          <Chart
            type={selectedChart}
            data={currentDashboard.chartData}
            options={currentDashboard.chartOptions}
            fullscreen={isFullscreen}
          />
        )}
      </ChartSection>
      
      <SavedDashboardList
        dashboards={savedDashboards}
        activeDashboardId={currentDashboard?.id}
        onSelect={loadDashboard}
        onDelete={deleteDashboard}
      />
    </DashboardContainer>
  )
}

export default Dashboard