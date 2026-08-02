import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import  AppRoutes from './routes/AppRoutes.jsx'
export default function App() {
  return (
    <AppRoutes />
    // <div className="min-h-screen flex items-center justify-center bg-slate-100">
    //   <h1 className="text-5xl font-bold text-emerald-600">
    //     Mentra 🚀
    //   </h1>
    // </div>
  );
}