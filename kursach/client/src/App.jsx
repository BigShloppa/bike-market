import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import BikePage from './pages/BikePage.jsx';
import CreateBikePage from './pages/CreateBikePage.jsx';
import EditBikePage from './pages/EditBikePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import SellerPage from './pages/SellerPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bikes/:id" element={<BikePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<ProtectedRoute><CreateBikePage /></ProtectedRoute>} />
            <Route path="/bikes/:id/edit" element={<ProtectedRoute><EditBikePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/sellers/:id" element={<SellerPage />} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/chat/:bikeId/:peerId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}