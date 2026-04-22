import { useNavigate } from 'react-router-dom'
import { loginAsRole } from '../utils/auth'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = (role) => {
    loginAsRole(role)
    navigate('/mypage')
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8">
        <h1 className="text-2xl font-bold text-navy-800">로그인</h1>
        <p className="mt-2 text-sm text-gray-500">
          프로토타입 데모용 로그인입니다. 역할을 선택해 진입해 주세요.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleLogin('mentee')}
            className="px-4 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition"
          >
            멘티로 로그인
          </button>
          <button
            type="button"
            onClick={() => handleLogin('mentor')}
            className="px-4 py-3 rounded-xl bg-navy-700 text-white font-medium hover:bg-navy-800 transition"
          >
            멘토로 로그인
          </button>
        </div>
      </div>
    </div>
  )
}
