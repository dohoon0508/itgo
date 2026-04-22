import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { mentors } from '../data/mentors'
import {
  buildMenteePreReport,
  suggestCounselingGuide,
  buildPostSessionOutput,
  buildMentorOpsReport,
} from '../utils/aiPrototype'
import { getAuthUser } from '../utils/auth'

const TABS = [
  { id: 'scheduled', label: '예정' },
  { id: 'completed', label: '완료' },
  { id: 'cancelled', label: '취소' },
]

const menteeSessions = [
  { id: 'm1', mentorId: '1', mentorName: '김민수', role: 'IT서비스 기획자', date: '2025.02.24', time: '14:00', status: 'scheduled', duration: 30 },
  { id: 'm2', mentorId: '3', mentorName: '이준호', role: '백엔드 개발자', date: '2025.02.20', time: '19:00', status: 'completed', duration: 60 },
  { id: 'm3', mentorId: '4', mentorName: '최서윤', role: 'UIUX 디자이너', date: '2025.02.15', time: '11:00', status: 'completed', duration: 30 },
]

const mentorSessions = [
  { id: 's1', mentorId: '1', menteeName: '홍길동', role: '서비스 기획 관심 멘티', date: '2025.02.24', time: '14:00', status: 'scheduled', duration: 30 },
  { id: 's2', mentorId: '1', menteeName: '김하나', role: '개발 취업 준비 멘티', date: '2025.02.20', time: '19:00', status: 'completed', duration: 60 },
  { id: 's3', mentorId: '1', menteeName: '박민재', role: '직무 전환 고민 멘티', date: '2025.02.15', time: '11:00', status: 'completed', duration: 30 },
]

const savedMentorIds = ['2', '5']

export default function MyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const authUser = getAuthUser()
  const userRole = authUser?.role
  const justBooked = searchParams.get('booked') === '1'
  const [activeTab, setActiveTab] = useState('scheduled')
  const [preReports, setPreReports] = useState({})
  const [guideReports, setGuideReports] = useState({})
  const [postReports, setPostReports] = useState({})
  const [sessionNotes, setSessionNotes] = useState({})
  const [opsReport, setOpsReport] = useState(null)
  const [loadingId, setLoadingId] = useState('')
  const [isOpsGenerating, setIsOpsGenerating] = useState(false)

  const sourceSessions = userRole === 'mentor' ? mentorSessions : menteeSessions
  const scheduled = sourceSessions.filter((s) => s.status === 'scheduled')
  const completed = sourceSessions.filter((s) => s.status === 'completed')
  const cancelled = sourceSessions.filter((s) => s.status === 'cancelled')

  const listByTab =
    activeTab === 'scheduled' ? scheduled : activeTab === 'completed' ? completed : cancelled
  const savedMentors = mentors.filter((m) => savedMentorIds.includes(m.id))
  const waitAi = () => new Promise((resolve) => setTimeout(resolve, 1000))

  const handleGeneratePreReport = (session) => {
    setLoadingId(`pre-${session.id}`)
    waitAi().then(() => {
      setPreReports((prev) => ({ ...prev, [session.id]: buildMenteePreReport(session) }))
      setLoadingId('')
    })
  }

  const handleGenerateGuide = (session) => {
    setLoadingId(`guide-${session.id}`)
    waitAi().then(() => {
      setGuideReports((prev) => ({ ...prev, [session.id]: suggestCounselingGuide(session.role) }))
      setLoadingId('')
    })
  }

  const handleGeneratePostReport = (session) => {
    setLoadingId(`post-${session.id}`)
    waitAi().then(() => {
      setPostReports((prev) => ({
        ...prev,
        [session.id]: buildPostSessionOutput(sessionNotes[session.id] || ''),
      }))
      setLoadingId('')
    })
  }

  const handleGenerateOpsReport = () => {
    setIsOpsGenerating(true)
    waitAi().then(() => {
      setOpsReport(buildMentorOpsReport(sourceSessions))
      setIsOpsGenerating(false)
    })
  }

  if (!userRole) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-card text-center">
          <h1 className="text-xl font-bold text-navy-800">로그인이 필요합니다</h1>
          <p className="mt-2 text-sm text-gray-500">
            멘티/멘토 역할을 선택해서 로그인하면 해당 마이페이지를 볼 수 있어요.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-navy-800 mb-2">마이페이지</h1>
      <p className="text-sm text-gray-500 mb-6">
        {userRole === 'mentor'
          ? '예정된 상담 준비와 상담 후 리포트를 관리할 수 있어요.'
          : '상담 현황과 관심 멘토를 확인할 수 있어요.'}
      </p>

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
                    {(userRole === 'mentor' ? s.menteeName : s.mentorName)[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{userRole === 'mentor' ? s.menteeName : s.mentorName}</p>
                    <p className="text-sm text-gray-500">{s.role}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {s.date} {s.time} · {s.duration}분
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {s.status === 'scheduled' && (
                    <>
                      {userRole === 'mentee' ? (
                        <Link
                          to={`/mentors/${s.mentorId}`}
                          className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          상세 보기
                        </Link>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleGeneratePreReport(s)}
                            disabled={loadingId === `pre-${s.id}`}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:opacity-60"
                          >
                            {loadingId === `pre-${s.id}` ? 'AI 분석 중...' : '멘티 요약 리포트'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleGenerateGuide(s)}
                            disabled={loadingId === `guide-${s.id}`}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-navy-50 text-navy-700 hover:bg-navy-100 disabled:opacity-60"
                          >
                            {loadingId === `guide-${s.id}` ? 'AI 가이드 생성 중...' : '상담 진행 가이드'}
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {s.status === 'completed' && (
                    userRole === 'mentor' ? (
                      <div className="w-full sm:w-auto space-y-2">
                        <textarea
                          value={sessionNotes[s.id] || ''}
                          onChange={(e) => setSessionNotes((prev) => ({ ...prev, [s.id]: e.target.value }))}
                          placeholder="상담 메모 키워드 입력 (예: 포트폴리오 구조, 면접 답변)"
                          rows={2}
                          className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleGeneratePostReport(s)}
                          disabled={loadingId === `post-${s.id}`}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:opacity-60"
                        >
                          {loadingId === `post-${s.id}` ? 'AI 정리 중...' : '피드백/액션 정리'}
                        </button>
                      </div>
                    ) : (
                      <span className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700">
                        상담 완료
                      </span>
                    )
                  )}
                </div>

                {userRole === 'mentor' && preReports[s.id] && (
                  <div className="w-full mt-2 rounded-xl border border-primary-100 bg-primary-50/40 p-3 text-sm text-gray-700">
                    <p className="font-medium text-primary-700">멘티 요약 리포트</p>
                    <p className="mt-1">{preReports[s.id].summary}</p>
                    <ul className="mt-2 list-disc list-inside text-xs text-gray-600">
                      {preReports[s.id].keyNeeds.map((need) => <li key={need}>{need}</li>)}
                    </ul>
                    <p className="mt-1 text-xs text-gray-500">리스크: {preReports[s.id].riskPoint}</p>
                  </div>
                )}

                {userRole === 'mentor' && guideReports[s.id] && (
                  <div className="w-full mt-2 rounded-xl border border-navy-100 bg-navy-50/40 p-3 text-sm text-gray-700">
                    <p className="font-medium text-navy-700">상담 진행 가이드</p>
                    <div className="mt-1 space-y-1">
                      {guideReports[s.id].map((guide) => (
                        <p key={guide.step} className="text-xs text-gray-600">
                          <span className="font-medium">{guide.step}</span> - {guide.guide}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {userRole === 'mentor' && postReports[s.id] && (
                  <div className="w-full mt-2 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-sm text-gray-700">
                    <p className="font-medium text-emerald-700">상담 후 정리 보조</p>
                    <p className="mt-1 text-xs">{postReports[s.id].feedback}</p>
                    <ul className="mt-2 list-disc list-inside text-xs text-gray-600">
                      {postReports[s.id].actionItems.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved mentors */}
      {userRole === 'mentee' && (
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
      )}

      {userRole === 'mentor' && (
      <section className="mt-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="font-semibold text-gray-800">AI 수익·운영 리포트</h2>
          <button
            type="button"
            onClick={handleGenerateOpsReport}
            disabled={isOpsGenerating}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 disabled:opacity-60"
          >
            {isOpsGenerating ? 'AI 리포트 생성 중...' : '운영 리포트 생성'}
          </button>
        </div>
        {opsReport && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
            <div className="grid sm:grid-cols-4 gap-3 text-sm">
              <div className="rounded-xl bg-gray-50 p-3"><p className="text-gray-500">총 상담</p><p className="font-semibold text-navy-800">{opsReport.total}건</p></div>
              <div className="rounded-xl bg-gray-50 p-3"><p className="text-gray-500">완료율</p><p className="font-semibold text-navy-800">{opsReport.completedRate}%</p></div>
              <div className="rounded-xl bg-gray-50 p-3"><p className="text-gray-500">평균 평점</p><p className="font-semibold text-navy-800">★ {opsReport.avgRating}</p></div>
              <div className="rounded-xl bg-gray-50 p-3"><p className="text-gray-500">예상 수익</p><p className="font-semibold text-navy-800">{opsReport.expectedRevenue.toLocaleString()}원</p></div>
            </div>
            <p className="mt-3 text-xs text-gray-600">AI 인사이트: {opsReport.insight}</p>
          </div>
        )}
      </section>
      )}
    </div>
  )
}
