import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { mentors } from '../data/mentors'
import { getMenteePersonaById } from '../data/mentees'
import { getMentorQuestionTemplates } from '../utils/aiPrototype'
import { addReservation } from '../utils/reservations'

const GOAL_OPTIONS = [
  '직무 이해',
  '준비 방향',
  '포트폴리오 피드백',
  '이직 고민',
  '기타',
]

export default function BookingPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const duration = parseInt(searchParams.get('duration') || '30', 10)
  const slot = decodeURIComponent(searchParams.get('slot') || '')
  const prefillName = decodeURIComponent(searchParams.get('prefillName') || '')
  const prefillQuestion = decodeURIComponent(searchParams.get('aiQuestion') || '')
  const prefillGoal = decodeURIComponent(searchParams.get('goal') || '')
  const prefillRecommendedJob = decodeURIComponent(searchParams.get('recommendedJob') || '')
  const prefillMenteeId = decodeURIComponent(searchParams.get('menteeId') || '')
  const currentMentee = prefillMenteeId ? getMenteePersonaById(prefillMenteeId) : null
  const profileConcernSeeds = currentMentee?.concerns || []
  const initialQuestionPool = [...new Set([...(prefillQuestion ? [prefillQuestion] : []), ...profileConcernSeeds])]

  const mentor = mentors.find((m) => m.id === id)
  const [name, setName] = useState(prefillName || '')
  const [phone, setPhone] = useState('010-1234-5678')
  const [email, setEmail] = useState('mentee@example.com')
  const [selectedQuestions, setSelectedQuestions] = useState(initialQuestionPool)
  const [customConcern, setCustomConcern] = useState('')
  const [goals, setGoals] = useState(prefillGoal ? [prefillGoal] : [])
  const [generatedQuestions, setGeneratedQuestions] = useState(initialQuestionPool)
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)

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

  const concernText = [...selectedQuestions, customConcern.trim()].filter(Boolean).join('\n- ')
  const mentorTemplates = getMentorQuestionTemplates(mentor)
  const waitAi = () => new Promise((resolve) => setTimeout(resolve, 1000))

  const handleGenerateAiQuestion = () => {
    setIsGeneratingQuestion(true)
    waitAi().then(() => {
      const relationshipQuestions = [
        `${mentor.name} 멘토님, 제 현재 고민(${(currentMentee?.concerns || []).slice(0, 2).join(', ')})을 고려했을 때 ${mentor.role} 기준으로 우선순위를 어떻게 잡아야 할까요?`,
        `${mentor.name} 멘토님, 제 목표가 "${currentMentee?.goal || '직무 방향 설정'}"인데 지금 단계에서 가장 먼저 검증해야 할 준비 항목은 무엇인가요?`,
      ]
      const list = [
        ...new Set([
          ...generatedQuestions,
          ...mentorTemplates,
          ...relationshipQuestions,
        ]),
      ].slice(0, 8)
      setGeneratedQuestions(list)
      if (!selectedQuestions.length) {
        setSelectedQuestions(list.slice(0, 2))
      }
      setIsGeneratingQuestion(false)
    })
  }

  const toggleQuestion = (question) => {
    setSelectedQuestions((prev) =>
      prev.includes(question) ? prev.filter((q) => q !== question) : [...prev, question]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const reservation = addReservation({
      menteeName: name,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorRole: mentor.role,
      duration,
      slot,
      goals,
      recommendedJob: prefillRecommendedJob,
      concernText,
      questionSelections: selectedQuestions,
      customConcern,
    })
    navigate(`/booking-complete?reservationId=${reservation.id}&mentorName=${encodeURIComponent(mentor.name)}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-navy-800 mb-2">상담 예약</h1>
      <p className="text-sm text-gray-500 mb-8">멘토에게 전달할 정보를 입력해 주세요.</p>

      {(prefillQuestion || prefillRecommendedJob || currentMentee) && (
        <div className="mb-6 rounded-2xl border border-primary-100 bg-primary-50/60 p-4">
          <p className="text-xs font-medium text-primary-600 mb-1">AI 추천 연동</p>
          {currentMentee && <p className="text-sm text-gray-700">멘티: {currentMentee.name} · {currentMentee.type}</p>}
          {prefillRecommendedJob && <p className="text-sm text-gray-700">추천 직무: {prefillRecommendedJob}</p>}
          {prefillGoal && <p className="text-sm text-gray-700">상담 목표: {prefillGoal}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">신청자 정보</h2>
          <p className="text-xs text-gray-500 mb-4">기본 정보는 자동 입력되며 필요 시 수정할 수 있습니다.</p>
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
          <p className="text-sm text-gray-500 mb-4">나의 고민과 AI 질문을 선택하고, 직접 작성 내용을 추가해 주세요.</p>

          {profileConcernSeeds.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-navy-800 mb-2">나의 고민</p>
              <div className="space-y-2">
                {profileConcernSeeds.map((question, index) => (
                  <label key={`seed-${question}`} className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question)}
                      onChange={() => toggleQuestion(question)}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>{index + 1}. {question}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs sm:text-sm text-gray-500">
              <span className="font-medium text-primary-600">{mentor.name}</span> 멘토님과 나의 상태를 함께 고려해 상담 질문을 생성합니다.
            </p>
            <button
              type="button"
              onClick={handleGenerateAiQuestion}
              disabled={isGeneratingQuestion}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100 transition"
            >
              {isGeneratingQuestion ? 'AI 질문 생성 중...' : 'AI 질문 자동 생성'}
            </button>
          </div>

          {generatedQuestions.length > 0 && (
            <div className="space-y-2 mb-3">
              {generatedQuestions.filter((question) => !profileConcernSeeds.includes(question)).map((question, index) => (
                <label key={question} className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question)}
                    onChange={() => toggleQuestion(question)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>{index + 1}. {question}</span>
                </label>
              ))}
            </div>
          )}
          <p className="text-sm font-semibold text-navy-800 mb-2">직접 작성</p>
          <textarea
            value={customConcern}
            onChange={(e) => setCustomConcern(e.target.value)}
            placeholder="추가로 멘토에게 꼭 전달하고 싶은 고민/질문을 자유롭게 입력해 주세요."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
          />
          <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-600 mb-1">전달 예정 내용 미리보기</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {concernText ? `- ${concernText}` : '아직 선택/입력된 고민 내용이 없습니다.'}
            </p>
          </div>
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
            {prefillRecommendedJob && (
              <div className="flex justify-between">
                <span className="text-gray-600">추천 직무</span>
                <span className="font-medium text-gray-800">{prefillRecommendedJob}</span>
              </div>
            )}
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
