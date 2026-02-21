import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { mentors } from '../data/mentors'

const TABS = [
  { id: 'scheduled', label: '예정' },
  { id: 'completed', label: '완료' },
  { id: 'cancelled', label: '취소' },
]

// 프로토타입용 더미 상담 내역
const dummySessions = [
  { id: 's1', mentorId: '1', mentorName: '김서연', role: '서비스 기획자', date: '2025.02.24', time: '14:00', status: 'scheduled', duration: 30 },
  { id: 's2', mentorId: '3', mentorName: '박지훈', role: '프론트엔드 개발자', date: '2025.02.20', time: '19:00', status: 'completed', duration: 60 },
  { id: 's3', mentorId: '4', mentorName: '최유나', role: 'UX 디자이너', date: '2025.02.15', time: '11:00', status: 'completed', duration: 30 },
]

const savedMentorIds = ['2', '5']

export default function MyPage() {
  const [searchParams] = useSearchParams()
  const justBooked = searchParams.get('booked') === '1'
  const [activeTab, setActiveTab] = useState('scheduled')

  const scheduled = dummySessions.filter((s) => s.status === 'scheduled')
  const completed = dummySessions.filter((s) => s.status === 'completed')
  const cancelled = dummySessions.filter((s) => s.status === 'cancelled')

  const listByTab =
    activeTab === 'scheduled' ? scheduled : activeTab === 'completed' ? completed : cancelled
  const savedMentors = mentors.filter((m) => savedMentorIds.includes(m.id))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-navy-800 mb-2">마이페이지</h1>
      <p className="text-sm text-gray-500 mb-6">상담 현황과 관심 멘토를 확인할 수 있어요.</p>

      {justBooked && (
        <div className="mb-6 p-4 rounded-xl bg-primary-50 border border-primary-100 text-primary-800 text-sm">
          ✓ 예약이 완료되었습니다. 멘토가 확인 후 연락드릴 예정이에요.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-white text-navy-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Session list */}
      <section className="mb-10">
        <h2 className="font-semibold text-gray-800 mb-4">내 상담 현황</h2>
        {listByTab.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 text-sm">
            {activeTab === 'scheduled' && '예정된 상담이 없습니다.'}
            {activeTab === 'completed' && '완료된 상담이 없습니다.'}
            {activeTab === 'cancelled' && '취소된 상담이 없습니다.'}
          </div>
        ) : (
          <div className="space-y-4">
            {listByTab.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                    {s.mentorName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{s.mentorName}</p>
                    <p className="text-sm text-gray-500">{s.role}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {s.date} {s.time} · {s.duration}분
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {s.status === 'scheduled' && (
                    <>
                      <Link
                        to={`/mentors/${s.mentorId}`}
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        상세 보기
                      </Link>
                    </>
                  )}
                  {s.status === 'completed' && (
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100"
                    >
                      후기 작성
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved mentors */}
      <section>
        <h2 className="font-semibold text-gray-800 mb-4">관심 멘토</h2>
        <p className="text-sm text-gray-500 mb-4">저장해 둔 멘토 목록이에요. 언제든 상담을 신청할 수 있어요.</p>
        {savedMentors.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 text-sm">
            저장한 멘토가 없습니다. 멘토 찾기에서 관심 있는 멘토를 저장해 보세요.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {savedMentors.map((m) => (
              <Link
                key={m.id}
                to={`/mentors/${m.id}`}
                className="flex gap-3 p-4 bg-white rounded-2xl shadow-card border border-gray-100 hover:shadow-cardHover transition"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                  {m.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.role} · {m.company}</p>
                  <p className="text-sm text-primary-600 font-medium mt-1">상담 신청 →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
