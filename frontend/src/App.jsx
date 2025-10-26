import { useState } from 'react'
import './App.css'
import RequestForm from './compnents/RequestForm'
import ProjectCreationForm from './compnents/ProjectCreationForm'
import ProjectsTable from './compnents/ProjectsTable'

function App() {
  const [currentView, setCurrentView] = useState('request') // 'request', 'project', or 'projects'
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Holiday Bungalow',
      client: 'DCSL',
      location: 'Batticaloa Plant',
      status: 'Completed',
      pre_budget: 2500000.00,
      curr_budget: 2750000.00,
      start_date: '2023-01-15',
      end_date: '2023-06-30',
      images: '../project_images/Holiday_Bungalow/holiday_bungalow_DCSL_batticalo_plant.png',
      deleted: false
    },
    {
      id: 2,
      name: 'Warehouse',
      client: 'DCSL',
      location: 'Batticaloa Plant',
      status: 'Completed',
      pre_budget: 1800000.00,
      curr_budget: 1950000.00,
      start_date: '2023-03-01',
      end_date: '2023-08-15',
      images: '../project_images/Warehouse/warehouse_DCSL_batticalo_plant.png',
      deleted: false
    },
    {
      id: 3,
      name: 'Sub Grid',
      client: 'CEB',
      location: 'Grid Station, Habarana',
      status: 'Completed',
      pre_budget: 3200000.00,
      curr_budget: 3100000.00,
      start_date: '2023-02-10',
      end_date: '2023-07-20',
      images: '',
      deleted: false
    },
    {
      id: 4,
      name: 'Office Complex',
      client: 'ABC Corporation',
      location: 'Colombo 03',
      status: 'In Progress',
      pre_budget: 5000000.00,
      curr_budget: 5200000.00,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      images: '',
      deleted: false
    },
    {
      id: 5,
      name: 'Residential Building',
      client: 'XYZ Developers',
      location: 'Kandy',
      status: 'Planning',
      pre_budget: 7500000.00,
      curr_budget: 7500000.00,
      start_date: '2024-06-01',
      end_date: '2025-06-01',
      images: '',
      deleted: false
    },
    {
      id: 6,
      name: 'Shopping Mall',
      client: 'Retail Corp',
      location: 'Negombo',
      status: 'On Hold',
      pre_budget: 12000000.00,
      curr_budget: 8500000.00,
      start_date: '2023-09-01',
      end_date: '2024-09-01',
      images: '',
      deleted: true
    },
    {
      id: 7,
      name: 'Hotel Complex',
      client: 'Tourism Ltd',
      location: 'Galle',
      status: 'Planning',
      pre_budget: 15000000.00,
      curr_budget: 15000000.00,
      start_date: '2024-03-01',
      end_date: '2025-03-01',
      images: '',
      deleted: true
    }
  ])

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">BuildSmart</h1>
          <nav className="nav-links">
            <button 
              className={`nav-link ${currentView === 'request' ? 'active' : ''}`}
              onClick={() => setCurrentView('request')}
            >
              Request
            </button>
            <button 
              className={`nav-link ${currentView === 'project' ? 'active' : ''}`}
              onClick={() => setCurrentView('project')}
            >
              Create Project
            </button>
            <button 
              className={`nav-link ${currentView === 'projects' ? 'active' : ''}`}
              onClick={() => setCurrentView('projects')}
            >
              Projects
            </button>
          </nav>
          <button className="staff-login-btn">Staff Login</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {currentView === 'request' && <RequestForm />}
        {currentView === 'project' && <ProjectCreationForm projects={projects} setProjects={setProjects} />}
        {currentView === 'projects' && <ProjectsTable projects={projects} setProjects={setProjects} />}
      </main>
    </div>
  )
}

export default App
