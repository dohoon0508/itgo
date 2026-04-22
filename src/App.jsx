import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import MentorListPage from './pages/MentorListPage'
import MentorDetailPage from './pages/MentorDetailPage'
import BookingPage from './pages/BookingPage'
import MyPage from './pages/MyPage'
import MentorRegisterPage from './pages/MentorRegisterPage'
import DemoReportPage from './pages/DemoReportPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<DemoReportPage />} />
        <Route path="/mentors" element={<MentorListPage />} />
        <Route path="/mentors/:id" element={<MentorDetailPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mentor-register" element={<MentorRegisterPage />} />
      </Routes>
    </Layout>
  )
}
