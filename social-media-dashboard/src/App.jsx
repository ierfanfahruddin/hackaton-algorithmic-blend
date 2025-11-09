import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import MainLayout from './components/layout/MainLayout';
import FacebookAnalytics from './pages/facebook/FacebookAnalytics';
import InstagramAnalytics from './pages/instagram/InstagramAnalytics';
import PostContent from './pages/postContent/PostContent';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/facebook" replace />} />
            <Route path="/facebook" element={<FacebookAnalytics />} />
            <Route path="/instagram" element={<InstagramAnalytics />} />
            <Route path="/post-content" element={<PostContent />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  )
}

export default App
