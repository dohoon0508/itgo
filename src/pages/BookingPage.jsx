import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { mentors } from '../data/mentors'

const GOAL_OPTIONS = [
  '직무 이해',
  '준비 방향',
  '포트폴리오 피드백',
  '이직 고민',
]

export default function BookingPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const duration = parseInt(searchParams.get('duration') || '30', 10)
  const slot = decodeURIComponent(searchParams.get('slot') || '')

  const mentor = mentors.find((m) => m.id === id)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [concern, setConcern] = useState('')
  const [goals, setGoals] = useState([])

  if (!mentor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">멘토 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/mentors')} className="mt-4 text-primary-600 font-medium">목록으로</button>
      </div>
    )
  }

  const price = duration === 30 ? mentor.price30 : mentor.price60

  const toggleGoal = (g) => {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 프로토타입: 제출 후 마이페이지로
    navigate('/mypage?booked=1')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-navy-800 mb-2">상담 예약</h1>
      <p className="text-sm text-gray-500 mb-8">멘토에게 전달할 정보를 입력해 주세요.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">신청자 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-2">고민 내용</h2>
          <p className="text-sm text-gray-500 mb-4">어떤 고민이 있는지 작성해 주세요. 멘토가 미리 파악하고 상담에 반영합니다.</p>
          <textarea
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="예: 기획 직무로 취업을 준비 중인데, 포트폴리오 구성과 실무 역량을 어떻게 쌓으면 좋을지 조언이 필요합니다."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-2">상담 목표 (복수 선택 가능)</h2>
          <p className="text-sm text-gray-500 mb-4">이번 상담에서 가장 얻고 싶은 것을 선택해 주세요.</p>
          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((g) => (
              <label key={g} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={goals.includes(g)}
                  onChange={() => toggleGoal(g)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
          <h2 className="font-semibold text-gray-800 mb-4">예약 요약</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">멘토</span>
              <span className="font-medium text-gray-800">{mentor.name} · {mentor.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상담 시간</span>
              <span className="font-medium text-gray-800">{slot || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상담 유형</span>
              <span className="font-medium text-gray-800">{duration}분</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-primary-200">
              <span className="text-gray-600">결제 금액</span>
              <span className="font-bold text-navy-800">{price.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 transition"
        >
          예약 완료
        </button>
      </form>
    </div>
  )
}
