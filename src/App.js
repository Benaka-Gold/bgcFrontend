import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Protected from './components/authProtection/authProtection';
import Hr from './components/HR/hr';
// import Telecaller from './components/tellecaller/Dashboard';
import Tellecaller from './pages/telecaller/Dashboard'
import Auth from './pages/auth';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeleCallerDashboard from './pages/telecaller/TelecallerDashboard'
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/*" element={<Protected />}>
            <Route path="telecaller/*" element={<TeleCallerDashboard/>}/>
            <Route path="admin/*" element={<AdminDashboard />} />
            <Route path="hr/*" element={<Hr />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
