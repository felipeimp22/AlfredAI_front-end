import { createContext, useContext, useState, useEffect } from 'react'

const DashboardContext = createContext()

export const DashboardProvider = ({ children }) => {
  const [savedDashboards, setSavedDashboards] = useState([])
  const [currentDashboard, setCurrentDashboard] = useState(null)

  // Load saved dashboards from localStorage on initial render
  useEffect(() => {
    const storedDashboards = localStorage.getItem('restaurant-dashboards')
    if (storedDashboards) {
      setSavedDashboards(JSON.parse(storedDashboards))
    }
  }, [])

  // Save dashboards to localStorage whenever they change
  useEffect(() => {
    if (savedDashboards.length > 0) {
      localStorage.setItem('restaurant-dashboards', JSON.stringify(savedDashboards))
    }
  }, [savedDashboards])

  const saveDashboard = (dashboard) => {
    const timestamp = new Date().getTime()
    const newDashboard = {
      id: `dashboard-${timestamp}`,
      created: timestamp,
      ...dashboard
    }
    
    setSavedDashboards(prev => [...prev, newDashboard])
    setCurrentDashboard(newDashboard)
    return newDashboard.id
  }

  const deleteDashboard = (id) => {
    setSavedDashboards(prev => prev.filter(dashboard => dashboard.id !== id))
    if (currentDashboard?.id === id) {
      setCurrentDashboard(null)
    }
  }

  const loadDashboard = (id) => {
    const dashboard = savedDashboards.find(d => d.id === id)
    if (dashboard) {
      setCurrentDashboard(dashboard)
    }
    return dashboard
  }

  return (
    <DashboardContext.Provider 
      value={{ 
        savedDashboards, 
        currentDashboard, 
        setCurrentDashboard,
        saveDashboard, 
        deleteDashboard, 
        loadDashboard 
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}