import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAuthUser, logout, onAuthChange } from '../utils/auth'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [authUser, setAuthUser] = useState(getAuthUser())
  const isActive = (path) => location.pathname === path

  useEffect(() => onAuthChange(() => setAuthUser(getAuthUser())), [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-navy-700">잇고</span>
            <span className="text-sm text-primary-600 font-medium">IT GO</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              to="/mentors"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/mentors') ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              멘토 찾기
            </Link>
            <Link
              to="/mentor-register"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition hidden sm:inline ${isActive('/mentor-register') ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              멘토 등록
            </Link>
            <Link
              to="/mypage"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/mypage') ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              상담내역
            </Link>
            {authUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 sm:ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                로그아웃
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-1 sm:ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-navy-700 text-white hover:bg-navy-800 transition"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <p className="font-bold text-navy-700 text-lg">잇고 IT GO</p>
              <p className="text-sm text-gray-500 mt-1">실무자와 연결되어, 진로의 방향을 찾다</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <a href="#!" className="hover:text-gray-700">이용약관</a>
              <a href="#!" className="hover:text-gray-700">개인정보처리방침</a>
              <a href="#!" className="hover:text-gray-700">고객센터</a>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6">© 2025 잇고(IT GO). 프로토타입 버전입니다.</p>
        </div>
      </footer>
    </div>
  )
}
