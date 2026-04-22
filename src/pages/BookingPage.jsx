import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { mentors } from '../data/mentors'
import {
  getMentorQuestionTemplates,
  recommendCareerPaths,
  recommendMentorsForMentee,
  buildExecutionPlan,
} from '../utils/aiPrototype'

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
  const [aiExampleIndex, setAiExampleIndex] = useState(null)
  const [major, setMajor] = useState('')
  const [experience, setExperience] = useState('')
  const [interest, setInterest] = useState('')
  const [careerRecommendations, setCareerRecommendations] = useState([])
  const [mentorRecommendations, setMentorRecommendations] = useState([])
  const [executionPlan, setExecutionPlan] = useState(null)
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)
  const [isGeneratingCareer, setIsGeneratingCareer] = useState(false)
  const [isGeneratingMentorRec, setIsGeneratingMentorRec] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)

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

  const mentorTemplates = getMentorQuestionTemplates(mentor)
  const waitAi = () => new Promise((resolve) => setTimeout(resolve, 1000))

  const handleGenerateAiQuestion = () => {
    setIsGeneratingQuestion(true)
    waitAi().then(() => {
      const nextIndex =
        aiExampleIndex === null ? 0 : (aiExampleIndex + 1) % mentorTemplates.length
      setAiExampleIndex(nextIndex)
      setConcern(mentorTemplates[nextIndex])
      setIsGeneratingQuestion(false)
    })
  }

  const handleGenerateCareerRecommendation = () => {
    setIsGeneratingCareer(true)
    waitAi().then(() => {
      setCareerRecommendations(
        recommendCareerPaths({
          major,
          experience,
          interest,
        })
      )
      setIsGeneratingCareer(false)
    })
  }

  const handleGenerateMentorRecommendation = () => {
    setIsGeneratingMentorRec(true)
    waitAi().then(() => {
      setMentorRecommendations(
        recommendMentorsForMentee({
          concern,
          goals,
        })
      )
      setIsGeneratingMentorRec(false)
    })
  }

  const handleGenerateExecutionPlan = () => {
    setIsGeneratingPlan(true)
    waitAi().then(() => {
      setExecutionPlan(
        buildExecutionPlan({
          concern,
          goals,
        })
      )
      setIsGeneratingPlan(false)
    })
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
          <p className="text-sm text-gray-500 mb-3">
            어떤 고민이 있는지 작성해 주세요. 멘토가 미리 파악하고 상담에 반영합니다.
          </p>
          <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs sm:text-sm text-gray-500">
              <span className="font-medium text-primary-600">{mentor.name}</span> 멘토님께 할 질문이 막막하다면, 버튼을 누르면 멘토 직무·상담 주제에 맞춰 자동으로 질문 문장을 만들어 드려요.
            </p>
            <button
              type="button"
              onClick={handleGenerateAiQuestion}
              disabled={isGeneratingQuestion}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100 transition"
            >
              {isGeneratingQuestion ? 'AI 문장 생성 중...' : '멘토에게 할 질문 자동 생성'}
            </button>
          </div>
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

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 space-y-5">
          <h2 className="font-semibold text-gray-800">AI 직무/멘토 추천</h2>
          <p className="text-sm text-gray-500">전공·경험·관심사를 입력하면 추천 직무와 멘토를 제안해 드립니다.</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="전공 (예: 경영학)"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
            />
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="경험 (예: 공모전, 인턴)"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
            />
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="관심사 (예: 데이터, 서비스)"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleGenerateCareerRecommendation}
              disabled={isGeneratingCareer}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 disabled:opacity-60"
            >
              {isGeneratingCareer ? 'AI 분석 중...' : '직무/산업군 추천'}
            </button>
            <button
              type="button"
              onClick={handleGenerateMentorRecommendation}
              disabled={isGeneratingMentorRec}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-navy-50 text-navy-700 border border-navy-100 hover:bg-navy-100 disabled:opacity-60"
            >
              {isGeneratingMentorRec ? 'AI 매칭 중...' : '적합 멘토 추천'}
            </button>
          </div>

          {careerRecommendations.length > 0 && (
            <div className="rounded-xl border border-primary-100 bg-primary-50/40 p-4">
              <p className="text-sm font-semibold text-primary-700 mb-2">추천 직무/산업군</p>
              <div className="space-y-2">
                {careerRecommendations.map((item) => (
                  <div key={`${item.category}-${item.role}`} className="text-sm text-gray-700">
                    <span className="font-medium">{item.role}</span> · {item.industry}
                    <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mentorRecommendations.length > 0 && (
            <div className="rounded-xl border border-navy-100 bg-navy-50/40 p-4">
              <p className="text-sm font-semibold text-navy-700 mb-2">추천 멘토 TOP 3</p>
              <div className="space-y-2">
                {mentorRecommendations.map((item) => (
                  <div key={item.id} className="text-sm text-gray-700">
                    <span className="font-medium">{item.rank}위 {item.name}</span> · {item.role}
                    <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-gray-800">AI 실행 목표 설정</h2>
              <p className="text-sm text-gray-500">상담 후 바로 실천할 1주/2주/1개월 액션을 제안합니다.</p>
            </div>
            <button
              type="button"
              onClick={handleGenerateExecutionPlan}
              disabled={isGeneratingPlan}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 disabled:opacity-60"
            >
              {isGeneratingPlan ? 'AI 계획 생성 중...' : '실행 목표 생성'}
            </button>
          </div>

          {executionPlan && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
              <p className="text-sm text-gray-700">{executionPlan.summary}</p>
              <div className="mt-3 space-y-1.5">
                {executionPlan.actions.map((action) => (
                  <label key={action.period} className="flex items-start gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    <span><span className="font-medium">{action.period}</span> - {action.item}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                추천 점검 시간: {executionPlan.reminderOptions.join(' / ')}
              </p>
            </div>
          )}
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
