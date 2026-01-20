import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EquipmentDetail from './pages/EquipmentDetail';
import EquipmentList from './pages/EquipmentList';
import CategoryPage from './pages/CategoryPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminReportsPage from './pages/AdminReportsPage';
import RenterDashboardPage from './pages/RenterDashboardPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './utils/PrivateRoute';
import './App.css';

function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/equipment" element={<EquipmentList />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <PrivateRoute>
                  <AdminReportsPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/renter/dashboard" 
              element={
                <PrivateRoute role="buyer">
                  <RenterDashboardPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/owner/dashboard" 
              element={
                <PrivateRoute role="seller">
                  <OwnerDashboardPage />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;