import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { FaSave, FaCheck, FaTimes } from 'react-icons/fa'

const ButtonContainer = styled(motion.div)`
  position: relative;
`

const SaveButton = styled(motion.button)`
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
  
  &:disabled {
    background-color: ${props => props.theme.colors.gray};
    cursor: not-allowed;
  }
`

const SavedNotification = styled(motion.div)`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.colors.backgroundLighter};
  border: 1px solid ${props => props.success ? props.theme.colors.success : props.theme.colors.error};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  z-index: 10;
  white-space: nowrap;
`

const NotificationIcon = styled.span`
  color: ${props => props.success ? props.theme.colors.success : props.theme.colors.error};
  display: flex;
  align-items: center;
  justify-content: center;
`

const notificationVariants = {
  hidden: { 
    opacity: 0,
    y: -10
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2
    }
  }
}

const SaveDashboardButton = ({ onSave, disabled = false }) => {
  const { theme } = useTheme()
  const [notification, setNotification] = useState({ show: false, success: true })
  
  const handleSave = async () => {
    try {
      await onSave()
      setNotification({ show: true, success: true })
      setTimeout(() => setNotification({ show: false, success: true }), 3000)
    } catch (error) {
      setNotification({ show: true, success: false })
      setTimeout(() => setNotification({ show: false, success: false }), 3000)
    }
  }
  
  return (
    <ButtonContainer>
      <AnimatePresence>
        {notification.show && (
          <SavedNotification
            theme={theme}
            success={notification.success}
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <NotificationIcon success={notification.success} theme={theme}>
              {notification.success ? <FaCheck /> : <FaTimes />}
            </NotificationIcon>
            {notification.success 
              ? 'Dashboard saved successfully!' 
              : 'Failed to save dashboard'}
          </SavedNotification>
        )}
      </AnimatePresence>
      
      <SaveButton
        theme={theme}
        disabled={disabled}
        onClick={handleSave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaSave />
        Save Dashboard
      </SaveButton>
    </ButtonContainer>
  )
}

export default SaveDashboardButton