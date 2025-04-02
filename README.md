# ALFRED.AI - Restaurant Assistant Frontend
### Disclaimer

I know the code may be messy and not following all best practices, but this was an 8 hour challenge.
---
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF)
![License](https://img.shields.io/badge/license-MIT-green)

A modern, intuitive frontend for the Restaurant Assistant application that provides AI-powered insights, interactive visualizations, and a smooth user experience.

<p align="center">
  <img src="https://i.imgur.com/PLACEHOLDER.png" alt="ALFRED.AI Screenshot" width="600">
</p>

## ✨ Features

- **Sleek Dark Theme** with orange accent colors and subtle neon effects
- **Responsive Design** that works beautifully on all device sizes
- **Interactive Parallax Effects** on the home page for an engaging user experience
- **Real-time Chat Interface** for natural language queries about your restaurant
- **Dynamic Visualization Dashboard** with multiple chart types and customization options
- **Authentication System** with login, registration, and protected routes
- **Vector Search Integration** for lightning-fast AI responses

## 🛠️ Technology Stack

- **React 18** with Hooks and Context API
- **React Router** for seamless navigation
- **Styled Components** for component-scoped styling
- **Framer Motion** for smooth animations and transitions
- **Chart.js** with React Chart.js 2 for data visualization
- **Axios** for API communication
- **JWT Authentication** for secure user sessions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Backend API running (see [Backend Repository](https://github.com/yourusername/restaurant-assistant-backend))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/restaurant-assistant-frontend.git
   cd restaurant-assistant-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the project root:
   ```
   VITE_API_URL=http://localhost:3002
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## 📱 Pages

### Home

The landing page features an engaging parallax effect with floating food cards that react to mouse movement. A prominent call-to-action guides users to start using the assistant.

### Login & Register

Clean, user-friendly authentication forms with validation and error handling.

### Chat

An intuitive chat interface where users can ask questions about their restaurant data and receive AI-powered responses. When the AI detects a request for visualization, it offers to create a chart.

### Dashboard

A powerful visualization hub where users can:
- View generated charts based on restaurant data
- Switch between different chart types (bar, line, pie, etc.)
- Save and manage multiple dashboards
- View detailed data alongside visualizations

## 📁 Project Structure

```
restaurant-assistant-frontend/
├── public/               # Static assets served directly
├── src/
│   ├── assets/           # Static assets imported by components
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Shared components like Header, Footer
│   │   ├── chat/         # Chat interface components
│   │   ├── dashboard/    # Dashboard and chart components
│   │   └── home/         # Home page components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Top-level page components
│   ├── services/         # API services and client
│   ├── styles/           # Global styles and theme
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── router.jsx        # Routing configuration
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── README.md             # This file
└── vite.config.js        # Vite configuration
```

## 🖥️ Development

### Development Mode Authentication

For development purposes, the frontend includes a local authentication fallback that allows you to proceed without a functioning backend auth system:

```javascript
// In src/services/authService.js
const localAuthEnabled = true; // Set to false to disable local auth fallback
```

With this enabled, you can use:
- Email: `admin@example.com`
- Password: `adminpassword`

This is useful for frontend development when the backend authentication system is still being set up.

### API Communication

The application communicates with the backend API through the `services/api.js` module. All requests include proper error handling and authorization headers when needed.

If you need to modify API endpoints or handling, this is the central place to do so.

### Adding New Chart Types

To add a new chart type to the dashboard:

1. Update `chartUtils.js` to include the new chart type detection and formatting
2. Add the new chart type to the ChartTypeSelector component
3. Implement the rendering in the Chart component

## 🔀 Routing System

The application uses React Router with a public/private route structure:

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Private Routes
- `/chat` - Chat interface (requires authentication)
- `/dashboard` - Dashboard (requires authentication)

The `PrivateRoute` component in `src/components/common/PrivateRoute.jsx` handles the authentication check and redirects unauthenticated users to the login page.

## 🎨 Theming

The application uses a dark theme with orange accents, implemented through styled-components and a centralized theme object. To modify the theme:

1. Update the theme variables in `src/styles/theme.js`
2. The changes will automatically propagate throughout the application

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
