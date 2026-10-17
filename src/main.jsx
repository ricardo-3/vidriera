import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles/activities.css';
import './styles/spatial.css';
import './styles/guided.css';
import './styles/scene.css';
import './styles/home.css';

// Keep assets and chapter links rooted at this Site after History API navigation.
const base=document.querySelector('base')||document.createElement('base');
base.href=new URL(base.getAttribute('href')||'.',location.href).href;
if(!base.isConnected)document.head.prepend(base);
createRoot(document.getElementById('root')).render(<App siteBase={base.href}/>);
