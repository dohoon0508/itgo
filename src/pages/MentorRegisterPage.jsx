import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MENTOR_CATEGORIES } from '../data/mentors'
import { generateMentorProfileDraft, recommendMentorTags } from '../utils/aiPrototype'

export default function MentorRegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    careerYears: '',
    intro: '',
    topics: '',
    price30: '',
    price60: '',
  })
  const [recommendedTags, setRecommendedTags] = useState([])
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const waitAi = () => new Promise((resolve) => setTimeout(resolve, 1000))

  const handleGenerateIntro = () => {
    setIsGeneratingIntro(true)
    waitAi().then(() => {
      setForm((prev) => ({
        ...prev,
        intro: generateMentorProfileDraft(prev),
      }))
      setIsGeneratingIntro(false)
    })
  }

  const handleGenerateTags = () => {
    setIsGeneratingTags(true)
    waitAi().then(() => {
      const tags = recommendMentorTags(form)
      setRecommendedTags(tags)
      setForm((prev) => ({
        ...prev,
        topics: tags.join(', '),
      }))
      setIsGeneratingTags(false)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 프로토타입: 제출 후 랜딩으로
    navigate('/?registered=1')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-navy-800 mb-2">멘토 등록</h1>
      <p className="text-sm text-gray-500 mb-8">실무 경험을 나누고 싶다면 멘토로 지원해 주세요. 검토 후 연락드립니다.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">기본 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="홍길동"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">소속 (회사/단체)</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="예: (주)○○서비스"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">직무</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 outline-none"
              >
                <option value="">선택해 주세요</option>
                {MENTOR_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">경력 연차</label>
              <input
                type="number"
                name="careerYears"
                value={form.careerYears}
                onChange={handleChange}
                min="1"
                placeholder="예: 5"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-2">소개</h2>
          <p className="text-sm text-gray-500 mb-4">멘티에게 보여질 프로필 소개를 작성해 주세요.</p>
          <button
            type="button"
            onClick={handleGenerateIntro}
            disabled={isGeneratingIntro}
            className="mb-3 px-3 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 disabled:opacity-60"
          >
            {isGeneratingIntro ? 'AI 소개글 생성 중...' : 'AI 소개글 초안 생성'}
          </button>
          <textarea
            name="intro"
            value={form.intro}
            onChange={handleChange}
            placeholder="예: B2C 서비스 기획 5년차입니다. 0→1 런칭과 지표 개선 경험이 있으며, 진로 고민부터 실무 노하우까지 나눌 수 있습니다."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-2">상담 가능 주제</h2>
          <p className="text-sm text-gray-500 mb-4">쉼표로 구분해 입력해 주세요. (예: 취업 준비, 포트폴리오 피드백, 직무 전환)</p>
          <button
            type="button"
            onClick={handleGenerateTags}
            disabled={isGeneratingTags}
            className="mb-3 px-3 py-2 rounded-lg text-sm font-medium bg-navy-50 text-navy-700 border border-navy-100 hover:bg-navy-100 disabled:opacity-60"
          >
            {isGeneratingTags ? 'AI 태그 분석 중...' : '경력 기반 태그 자동 추천'}
          </button>
          <input
            type="text"
            name="topics"
            value={form.topics}
            onChange={handleChange}
            placeholder="취업 준비, 직무 이해, 포트폴리오 피드백, 이직 고민"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
          />
          {recommendedTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {recommendedTags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-primary-50 text-primary-700 border border-primary-100">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">희망 상담료 (원)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">30분 상담</label>
              <input
                type="number"
                name="price30"
                value={form.price30}
                onChange={handleChange}
                min="0"
                placeholder="25000"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">60분 상담</label>
              <input
                type="number"
                name="price60"
                value={form.price60}
                onChange={handleChange}
                min="0"
                placeholder="45000"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-400 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-2">경력 인증 자료</h2>
          <p className="text-sm text-gray-500 mb-4">재직 증명서, 경력 기술서 등 경력을 확인할 수 있는 자료를 업로드해 주세요. (선택)</p>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 text-sm">
            파일을 드래그하거나 클릭하여 업로드
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 transition"
        >
          멘토 등록 신청
        </button>
      </form>
    </div>
  )
}
