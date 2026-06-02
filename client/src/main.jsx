import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const applyStoredTheme = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const storedTheme = localStorage.getItem('skillhub_theme') === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    document.documentElement.style.colorScheme = storedTheme;
};

applyStoredTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)