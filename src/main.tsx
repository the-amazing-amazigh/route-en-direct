
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/leaflet.css' // Add the leaflet CSS

createRoot(document.getElementById("root")!).render(<App />);
