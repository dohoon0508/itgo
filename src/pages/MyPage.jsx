import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  buildMenteePreReport,
  suggestCounselingGuide,
  buildPostSessionOutput,
  buildMentorOpsReport,
  buildExecutionPlan,
  analyzeMenteePersona,
  recommendJobsByPersona,
  recommendMentorsByPersona,
} from '../utils/aiPrototype'
import { getAuthUser } from '../utils/auth'
import { getMenteePersonaById } from '../data/mentees'
import { cancelReservation, getReservations } from '../utils/reservations'
import {
  addMentorInteraction,
  deleteMentorInteraction,
  getMentorInteractions,
  markInteractionRead,
} from '../utils/mentorInteractions'

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
  { id: 's1', mentorId: '1', menteeId: 'mentee-001', menteeName: '김지우', role: '서비스 기획 관심 멘티', date: '2025.02.24', time: '14:00', status: 'scheduled', duration: 30 },
  { id: 's2', mentorId: '1', menteeId: 'mentee-002', menteeName: '이하린', role: '개발 취업 준비 멘티', date: '2025.02.20', time: '19:00', status: 'completed', duration: 60 },
  { id: 's3', mentorId: '1', menteeId: 'mentee-003', menteeName: '박민지', role: '직무 전환 고민 멘티', date: '2025.02.15', time: '11:00', status: 'completed', duration: 30 },
]

export default function MyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const authUser = getAuthUser()
  const userRole = authUser?.role
  const currentMentee = getMenteePersonaById(authUser?.currentMenteeId)
  const justBooked = searchParams.get('booked') === '1'

  const [activeTab, setActiveTab] = useState('scheduled')
  const [preReports, setPreReports] = useState({})
  const [guideReports, setGuideReports] = useState({})
  const [sessionNotes, setSessionNotes] = useState({})
  const [opsReport, setOpsReport] = useState(null)
  const [loadingId, setLoadingId] = useState('')
  const [isOpsGenerating, setIsOpsGenerating] = useState(false)
  const [isAnalyzingPersona, setIsAnalyzingPersona] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isGeneratingMentorRecs, setIsGeneratingMentorRecs] = useState(false)
  const [mentorRecommendations, setMentorRecommendations] = useState([])
  const [reservationList, setReservationList] = useState(() => getReservations().filter((item) => item.status !== 'cancelled'))
  const [mentorActionPlans, setMentorActionPlans] = useState({})
  const [shareDoneBySession, setShareDoneBySession] = useState({})
  const [editingPlanSessionId, setEditingPlanSessionId] = useState(null)
  const [editingPlanText, setEditingPlanText] = useState('')
  const [sharedInteractions, setSharedInteractions] = useState(() => getMentorInteractions())
  const [mentorSessionList, setMentorSessionList] = useState(mentorSessions)

  const sourceSessions = userRole === 'mentor' ? mentorSessionList : menteeSessions
  const scheduled = sourceSessions.filter((s) => s.status === 'scheduled')
  const completed = sourceSessions.filter((s) => s.status === 'completed')
  const cancelled = sourceSessions.filter((s) => s.status === 'cancelled')
  const listByTab = activeTab === 'scheduled' ? scheduled : activeTab === 'completed' ? completed : cancelled
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
      const reservation = getLatestReservationForMentee(session.menteeId, session.menteeName)
      setGuideReports((prev) => ({
        ...prev,
        [session.id]: suggestCounselingGuide({
          sessionType: session.role,
          concernText: reservation?.concernText || '',
          selectedQuestions: reservation?.questionSelections || [],
        }),
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

  const handleStartPersonaAnalysis = () => {
    setIsAnalyzingPersona(true)
    waitAi().then(() => {
      const personaInsight = analyzeMenteePersona(currentMentee)
      const jobs = recommendJobsByPersona(currentMentee)
      setAnalysisResult({ personaInsight, jobs })
      setIsAnalyzingPersona(false)
    })
  }

  const handleGenerateMentorRecommendations = () => {
    setIsGeneratingMentorRecs(true)
    waitAi().then(() => {
      setMentorRecommendations(recommendMentorsByPersona(currentMentee))
      setIsGeneratingMentorRecs(false)
    })
  }

  const handleCancelReservation = (reservationId) => {
    cancelReservation(reservationId)
    setReservationList(getReservations().filter((item) => item.status !== 'cancelled'))
  }

  const handleGenerateMentorActionPlan = (session) => {
    setLoadingId(`plan-${session.id}`)
    waitAi().then(() => {
      const postSummary = buildPostSessionOutput(sessionNotes[session.id] || '')
      const summary = buildExecutionPlan({
        concern: sessionNotes[session.id] || `${session.menteeName} 멘티 상담 후속 액션`,
        goals: ['준비 방향'],
      })
      setMentorActionPlans((prev) => ({
        ...prev,
        [session.id]: {
          ...summary,
          diagnosis: postSummary.diagnosis,
          feedback: postSummary.feedback,
          nextFollowUp: postSummary.nextFollowUp,
        },
      }))
      setLoadingId('')
    })
  }

  const handleStartEditActionPlan = (sessionId) => {
    const plan = mentorActionPlans[sessionId]
    if (!plan) return
    setEditingPlanSessionId(sessionId)
    const mergedText = [
      `핵심 진단: ${plan.diagnosis || ''}`,
      `피드백 정리: ${plan.feedback || ''}`,
      `요약: ${plan.summary || ''}`,
      '실행 과제:',
      ...(plan.actions || []).map((a) => `- ${a.period} - ${a.item}`),
      `다음 상담 연결: ${plan.nextFollowUp || ''}`,
    ].join('\n')
    setEditingPlanText(mergedText)
  }

  const handleSaveActionPlan = (sessionId) => {
    const lines = editingPlanText.split('\n').map((line) => line.trim()).filter(Boolean)
    const readField = (prefix) => {
      const line = lines.find((item) => item.startsWith(prefix))
      return line ? line.replace(prefix, '').trim() : ''
    }
    const diagnosis = readField('핵심 진단:')
    const feedback = readField('피드백 정리:')
    const summary = readField('요약:')
    const nextFollowUp = readField('다음 상담 연결:')

    const actionStartIdx = lines.findIndex((line) => line.startsWith('실행 과제'))
    const actionLines = actionStartIdx > -1
      ? lines.slice(actionStartIdx + 1).filter((line) => line.startsWith('-'))
      : []
    const parsedActions = actionLines.length > 0
      ? actionLines.map((line, idx) => {
        const cleaned = line.replace(/^-+\s*/, '')
        const splitIdx = cleaned.indexOf(' - ')
        if (splitIdx > -1) {
          return { period: cleaned.slice(0, splitIdx).trim(), item: cleaned.slice(splitIdx + 3).trim() }
        }
        return { period: `단계 ${idx + 1}`, item: cleaned }
      })
      : (mentorActionPlans[sessionId]?.actions || [])

    setMentorActionPlans((prev) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        diagnosis,
        feedback,
        summary,
        nextFollowUp,
        actions: parsedActions,
      },
    }))
    setEditingPlanSessionId(null)
    setEditingPlanText('')
  }

  const handleCancelEditActionPlan = () => {
    setEditingPlanSessionId(null)
    setEditingPlanText('')
  }

  const handleShareMentorAction = (session) => {
    const actionPlan = mentorActionPlans[session.id]
    if (!actionPlan) return
    addMentorInteraction({
      sessionId: session.id,
      mentorName: '김민수 멘토',
      menteeId: session.menteeId || 'mentee-001',
      menteeName: session.menteeName,
      feedback: [actionPlan?.diagnosis, actionPlan?.feedback].filter(Boolean).join('\n'),
      actionItems: actionPlan?.actions?.map((a) => `${a.period} - ${a.item}`) || [],
      summary: [actionPlan?.summary, actionPlan?.nextFollowUp].filter(Boolean).join('\n'),
    })
    setSharedInteractions(getMentorInteractions())
    setShareDoneBySession((prev) => ({ ...prev, [session.id]: true }))
  }

  const handleDeleteInteraction = (interactionId) => {
    deleteMentorInteraction(interactionId)
    setSharedInteractions(getMentorInteractions())
  }

  const handleClearMenteeInteractions = () => {
    const rest = getMentorInteractions().filter((item) => item.menteeId !== currentMentee.id)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('itgo_mentor_interactions', JSON.stringify(rest))
    }
    setSharedInteractions(rest)
  }

  const handleCompleteSession = (sessionId) => {
    setMentorSessionList((prev) => prev.map((s) => (s.id === sessionId ? { ...s, status: 'completed' } : s)))
  }

  const getLatestReservationForMentee = (menteeId, menteeName) => {
    return reservationList.find((item) => (menteeId && item.menteeId === menteeId) || item.menteeName === menteeName)
  }

  const formatConcernText = (rawText) => {
    const text = (rawText || '').trim()
    if (!text) {
      return {
        lines: [],
      }
    }

    const normalized = text
      .replace(/\n-\s*/g, '\n')
      .replace(/\s-\s/g, '\n')
      .split('\n')
      .map((line) => line.trim().replace(/^-+\s*/, ''))
      .filter(Boolean)

    if (normalized.length === 0) {
      return {
        lines: [],
      }
    }

    return {
      lines: normalized,
    }
  }

  const handleBookWithMentor = (mentor) => {
    const params = new URLSearchParams({
      duration: '30',
      prefillName: currentMentee.name,
      aiQuestion: '',
      goal: currentMentee.goal,
      recommendedJob: analysisResult?.jobs?.[0]?.title || '',
      menteeId: currentMentee.id,
    })
    navigate(`/booking/${mentor.id}?${params.toString()}`)
  }

  if (!userRole) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-card text-center">
          <h1 className="text-xl font-bold text-navy-800">로그인이 필요합니다</h1>
          <p className="mt-2 text-sm text-gray-500">멘티/멘토 역할을 선택해서 로그인하면 해당 마이페이지를 볼 수 있어요.</p>
          <button type="button" onClick={() => navigate('/login')} className="mt-6 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700">
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
        {userRole === 'mentor' ? '예정된 상담 준비와 상담 후 리포트를 관리할 수 있어요.' : '페르소나 기반 AI 분석으로 직무·멘토·질문 추천을 확인할 수 있어요.'}
      </p>

      {justBooked && (
        <div className="mb-6 p-4 rounded-xl bg-primary-50 border border-primary-100 text-primary-800 text-sm">
          ✓ 예약이 완료되었습니다. 멘토가 확인 후 연락드릴 예정이에요.
        </div>
      )}

      {userRole === 'mentee' && (
        <>
          <section className="grid lg:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
              <h3 className="font-semibold text-navy-800 mb-3">기본 프로필</h3>
              <div className="space-y-1.5 text-sm text-gray-700">
                <p><span className="font-medium">이름:</span> {currentMentee.name}</p>
                <p><span className="font-medium">유형:</span> {currentMentee.type}</p>
                <p><span className="font-medium">현재 상태:</span> {currentMentee.status}</p>
                <p><span className="font-medium">목표:</span> {currentMentee.goal}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
              <h3 className="font-semibold text-navy-800 mb-3">경험/강점</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-medium">전공:</span> {currentMentee.education}</p>
                <p><span className="font-medium">활동 경험:</span> {currentMentee.experiences.join(', ')}</p>
                <p><span className="font-medium">강점:</span> {currentMentee.strengths.join(', ')}</p>
                <p><span className="font-medium">선호 업무:</span> {currentMentee.preferredWorkStyle.join(', ')}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card mb-6">
            <h3 className="font-semibold text-navy-800 mb-3">현재 고민</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {currentMentee.concerns.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="mt-3 text-xs text-gray-500">기피 업무 스타일: {currentMentee.avoidWorkStyle.join(', ')}</p>
            <button type="button" onClick={handleStartPersonaAnalysis} disabled={isAnalyzingPersona} className="mt-4 px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60">
              {isAnalyzingPersona ? 'AI 진단 중...' : 'AI로 나의 상태 진단하기'}
            </button>
          </section>

          {(isAnalyzingPersona || analysisResult) && (
            <section className="rounded-2xl border border-primary-100 bg-primary-50/40 p-5 shadow-card mb-6">
              <p className="text-xs font-medium text-primary-600 mb-1">AI 분석</p>
              {isAnalyzingPersona || !analysisResult ? (
                <p className="text-sm text-gray-600">AI가 입력된 경험과 고민을 분석하고 있습니다...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-700">{analysisResult.personaInsight.summary}</p>
                  <p className="text-sm text-gray-700 mt-2">{analysisResult.personaInsight.judgement}</p>
                  <p className="text-sm text-gray-700 mt-1">{analysisResult.personaInsight.strengths}</p>
                  <div className="mt-4 grid md:grid-cols-3 gap-3">
                    {analysisResult.jobs.map((job) => (
                      <div key={job.title} className="rounded-xl border border-primary-100 bg-white p-3">
                        <p className="text-sm font-semibold text-navy-800">{job.title}</p>
                        <p className="text-xs text-primary-600 mt-0.5">AI 적합도 {job.matchScore}%</p>
                        <p className="text-xs text-gray-600 mt-1">{job.reason}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          <section className="rounded-2xl border border-navy-100 bg-navy-50/30 p-5 shadow-card mb-6">
            <p className="text-xs font-medium text-navy-600 mb-2">AI 추천</p>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="font-semibold text-navy-800">추천 멘토</h3>
              <button type="button" onClick={handleGenerateMentorRecommendations} disabled={isGeneratingMentorRecs} className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-navy-700 border border-navy-200 hover:bg-navy-50 disabled:opacity-60">
                {isGeneratingMentorRecs ? 'AI 추천 중...' : 'AI를 통해 멘토 추천 받기'}
              </button>
            </div>
            {(isGeneratingMentorRecs || mentorRecommendations.length > 0) && (
              <div className="space-y-3">
                {mentorRecommendations.map((mentor) => (
                  <div key={mentor.id} className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="font-semibold text-gray-800">{mentor.name} · {mentor.role}</p>
                    <p className="text-xs text-gray-500">{mentor.company} · {mentor.careerYears}년차 · ★ {mentor.rating}</p>
                    <p className="mt-2 text-sm text-gray-600">{mentor.recommendationReason}</p>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => handleBookWithMentor(mentor)} className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700">상담 신청</button>
                      <Link to={`/mentors/${mentor.id}`} className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50">프로필 보기</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card mb-6">
            <h3 className="font-semibold text-navy-800 mb-3">내 예약 신청 내역</h3>
            {reservationList.length === 0 ? <p className="text-sm text-gray-500">아직 신청한 예약이 없습니다.</p> : (
              <div className="space-y-3">
                {reservationList.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-base font-semibold text-gray-800">{item.mentorName} · {item.mentorRole}</p>
                    <p className="text-sm text-gray-600 mt-2">{item.concernText ? `질문 ${item.concernText.slice(0, 100)}${item.concernText.length > 100 ? '...' : ''}` : '질문 미입력'}</p>
                    <div className="mt-3 flex justify-start">
                      <button type="button" onClick={() => handleCancelReservation(item.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 whitespace-nowrap">예약 취소</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {sharedInteractions.filter((i) => i.menteeId === currentMentee.id).length > 0 && (
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 shadow-card mb-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-navy-800">멘토 피드백/액션 공유함</h3>
                <button
                  type="button"
                  onClick={handleClearMenteeInteractions}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50"
                >
                  전체 삭제
                </button>
              </div>
              <div className="space-y-3 mt-3">
                {sharedInteractions.filter((i) => i.menteeId === currentMentee.id).map((item) => (
                  <div key={item.id} className="rounded-xl border border-emerald-100 bg-white p-4">
                    <p className="text-sm font-semibold text-gray-800">{item.mentorName}님이 보낸 액션 제안</p>
                    {item.feedback && <p className="mt-2 text-sm text-gray-700">{item.feedback}</p>}
                    {item.summary && <p className="mt-1 text-xs text-gray-500">{item.summary}</p>}
                    {item.actionItems?.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-xs text-gray-600">
                        {item.actionItems.map((action) => <li key={action}>{action}</li>)}
                      </ul>
                    )}
                    {!item.read && (
                      <button type="button" onClick={() => { markInteractionRead(item.id); setSharedInteractions(getMentorInteractions()) }} className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50">
                        확인 완료
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteInteraction(item.id)}
                      className="mt-3 ml-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {userRole === 'mentor' && (
        <>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8">
            {TABS.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-white text-navy-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <section className="mb-10">
            <h2 className="font-semibold text-gray-800 mb-4">내 상담 현황</h2>
            {listByTab.length === 0 ? <p className="text-sm text-gray-500">예정된 상담이 없습니다.</p> : (
              <div className="space-y-4">
                {listByTab.map((s) => {
                  const latestReservation = getLatestReservationForMentee(s.menteeId, s.menteeName)
                  const formattedConcern = formatConcernText(latestReservation?.concernText)
                  const mappedMentee = s.menteeId ? getMenteePersonaById(s.menteeId) : null
                  const menteeProfile = mappedMentee?.id === s.menteeId ? mappedMentee : null
                  return (
                  <div key={s.id} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                    <div className="mb-3 rounded-xl border border-gray-200 bg-gray-50/70 p-3">
                      <p className="text-xs font-medium text-gray-500">상담 일정</p>
                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {s.date} {s.time} · {s.duration}분
                      </p>
                      {latestReservation?.slot && (
                        <p className="mt-1 text-xs text-gray-600">멘티가 선택한 희망 시간: {latestReservation.slot}</p>
                      )}
                    </div>

                    <div className="mb-3 rounded-xl border border-primary-100 bg-primary-50/40 p-3">
                      <p className="text-sm font-medium text-primary-700">멘티 프로필 요약</p>
                      <div className="mt-2 grid md:grid-cols-2 gap-2 text-xs text-gray-700">
                        <p><span className="font-medium">이름:</span> {s.menteeName}</p>
                        <p><span className="font-medium">유형:</span> {menteeProfile?.type || s.role || '정보 없음'}</p>
                        <p><span className="font-medium">현재 상태:</span> {menteeProfile?.status || '정보 없음'}</p>
                        <p><span className="font-medium">목표:</span> {menteeProfile?.goal || '정보 없음'}</p>
                        <p><span className="font-medium">전공:</span> {menteeProfile?.education || '정보 없음'}</p>
                        <p><span className="font-medium">관심 분야:</span> {menteeProfile?.interests?.join(', ') || '정보 없음'}</p>
                      </div>
                    </div>

                    {preReports[s.id] && (
                      <div className="rounded-xl border border-primary-100 bg-primary-50/40 p-3 text-sm text-gray-700">
                        <p className="font-medium text-primary-700">멘티 요약 리포트</p>
                        <p className="mt-1">{preReports[s.id].summary}</p>
                      </div>
                    )}

                    {latestReservation && (
                      <div className="w-full mt-2 rounded-xl border border-gray-200 bg-gray-50/80 p-4 text-sm text-gray-700">
                        <p className="font-medium text-gray-900">상담 요청 내용</p>
                        {formattedConcern.lines.length > 0 ? (
                          <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-700">
                            {formattedConcern.lines.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm text-gray-500">멘티가 전달한 상담 요청 내용이 없습니다.</p>
                        )}
                      </div>
                    )}

                    {s.status === 'scheduled' ? (
                      <div className="w-full mt-2 rounded-xl border border-navy-100 bg-navy-50/30 p-3 text-sm text-gray-700">
                        <p className="font-medium text-navy-700">간단 상담 가이드</p>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-gray-600">
                          <li>오프닝 5분 - 멘티의 핵심 고민 1순위와 오늘 상담 목표를 짧게 정렬합니다.</li>
                          <li>진단 10분 - 사전 질문 {Math.min((latestReservation?.questionSelections || []).length || formattedConcern.lines.length, 3)}개를 중심으로 경험/역량/목표 갭을 확인합니다.</li>
                          <li>솔루션 10분 - 오늘 바로 실행 가능한 액션 2개를 정하고 우선순위를 확정합니다.</li>
                          <li>마무리 5분 - 다음 점검 시점과 확인 지표를 합의하고 상담을 종료합니다.</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="w-full mt-2 rounded-xl border border-violet-100 bg-violet-50/40 p-3 text-sm text-gray-700">
                        <p className="font-medium text-violet-700">상담 후 리포트 작성 가이드</p>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-gray-600">
                          <li>핵심 진단 - 멘티의 현재 상태/문제 원인을 2~3줄로 요약합니다.</li>
                          <li>피드백 정리 - 상담 중 합의된 방향과 보완 포인트를 우선순위로 적습니다.</li>
                          <li>실행 과제 - 이번 주 바로 할 일 2~3개를 기한과 함께 명확히 적습니다.</li>
                          <li>다음 상담 연결 - 점검 시점, 확인 지표, 다음 질문을 한 줄로 남깁니다.</li>
                        </ul>
                      </div>
                    )}

                    {guideReports[s.id] && (
                      <div className="w-full mt-2 rounded-xl border border-navy-100 bg-navy-50/40 p-3 text-sm text-gray-700">
                        <p className="font-medium text-navy-700">상담 진행 가이드</p>
                        {guideReports[s.id].map((guide) => (
                          <p key={guide.step} className="text-xs text-gray-600"><span className="font-medium">{guide.step}</span> - {guide.guide}</p>
                        ))}
                      </div>
                    )}

                    {s.status === 'completed' && (
                      <div className="mt-2">
                        <textarea value={sessionNotes[s.id] || ''} onChange={(e) => setSessionNotes((prev) => ({ ...prev, [s.id]: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="상담 메모 키워드 입력" />
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" onClick={() => handleGenerateMentorActionPlan(s)} disabled={loadingId === `plan-${s.id}`} className="px-3 py-2 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">{loadingId === `plan-${s.id}` ? 'AI 정리 중...' : '피드백/실행 가이드'}</button>
                        </div>
                      </div>
                    )}

                    {mentorActionPlans[s.id] && (
                      <div className="w-full mt-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-sm text-gray-700">
                        <p className="font-medium text-emerald-700">AI 피드백/실행 가이드</p>
                        {mentorActionPlans[s.id].diagnosis && (
                          <p className="mt-2 text-xs text-gray-700">
                            <span className="font-medium text-gray-800">핵심 진단 - </span>
                            {mentorActionPlans[s.id].diagnosis}
                          </p>
                        )}
                        {mentorActionPlans[s.id].feedback && (
                          <p className="mt-1 text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                            <span className="font-medium text-gray-800">피드백 정리 - </span>
                            {mentorActionPlans[s.id].feedback}
                          </p>
                        )}
                        {editingPlanSessionId === s.id ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editingPlanText}
                              onChange={(e) => setEditingPlanText(e.target.value)}
                              rows={12}
                              className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-xs text-gray-700 leading-relaxed"
                            />
                            <div className="flex gap-2 justify-end">
                              <button type="button" onClick={handleCancelEditActionPlan} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">취소</button>
                              <button type="button" onClick={() => handleSaveActionPlan(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700">수정 저장</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mt-2 text-xs font-medium text-gray-800">실행 과제</p>
                            <ul className="mt-1 list-disc list-inside text-xs text-gray-600">
                              {mentorActionPlans[s.id].actions.map((action) => <li key={`${action.period}-${action.item}`}>{action.period} - {action.item}</li>)}
                            </ul>
                            {mentorActionPlans[s.id].nextFollowUp && (
                              <p className="mt-2 text-xs text-gray-700">
                                <span className="font-medium text-gray-800">다음 상담 연결 - </span>
                                {mentorActionPlans[s.id].nextFollowUp}
                              </p>
                            )}
                            <div className="mt-2 flex justify-end">
                              <button type="button" onClick={() => handleStartEditActionPlan(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-200 text-emerald-700 hover:bg-emerald-100">수정하기</button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {s.status === 'scheduled' && (
                      <div className="w-full mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleCompleteSession(s.id)} className="px-3 py-2 rounded-lg text-xs font-medium bg-emerald-600 text-white">상담 완료 처리</button>
                      </div>
                    )}

                    {mentorActionPlans[s.id] && (
                      <div className="w-full mt-2 flex justify-end">
                        <button type="button" onClick={() => handleShareMentorAction(s)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white hover:bg-primary-700">멘티에게 액션 공유</button>
                      </div>
                    )}
                    {shareDoneBySession[s.id] && (
                      <p className="mt-2 text-xs text-emerald-700">공유가 완료되었습니다.</p>
                    )}
                  </div>
                )})}
              </div>
            )}
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="font-semibold text-gray-800">AI 수익·운영 리포트</h2>
              <button type="button" onClick={handleGenerateOpsReport} disabled={isOpsGenerating} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 disabled:opacity-60">
                {isOpsGenerating ? 'AI 리포트 생성 중...' : '운영 리포트 생성'}
              </button>
            </div>
            {opsReport && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
                <p className="text-sm text-gray-600">AI 인사이트: {opsReport.insight}</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
