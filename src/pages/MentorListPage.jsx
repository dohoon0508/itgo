import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { mentors, MENTOR_CATEGORIES } from '../data/mentors'

const SORT_OPTIONS = [
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '최신순' },
  { value: 'rating', label: '평점순' },
]

export default function MentorListPage() {
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || ''
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState(categoryFromUrl)
  const [sort, setSort] = useState('popular')
  const [careerFilter, setCareerFilter] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const filteredAndSorted = useMemo(() => {
    let list = [...mentors]
    if (keyword.trim()) {
      const k = keyword.toLowerCase()
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(k) ||
          m.role.toLowerCase().includes(k) ||
          m.company.toLowerCase().includes(k) ||
          m.intro.toLowerCase().includes(k)
      )
    }
    if (category) list = list.filter((m) => m.category === category)
    if (careerFilter) {
      const minYears = parseInt(careerFilter, 10)
      list = list.filter((m) => m.careerYears >= minYears)
    }
    if (maxPrice) {
      const price = parseInt(maxPrice, 10)
      list = list.filter((m) => m.price30 <= price)
    }
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'newest') list.sort((a, b) => (b.id > a.id ? 1 : -1))
    if (sort === 'popular') list.sort((a, b) => b.reviewCount - a.reviewCount)
    return list
  }, [keyword, category, careerFilter, maxPrice, sort])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-navy-800 mb-2">멘토 찾기</h1>
      <p className="text-sm text-gray-500 mb-6">직무·키워드로 나에게 맞는 멘토를 검색해 보세요.</p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="직무 또는 키워드 검색 (예: 기획, 포트폴리오)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full max-w-xl px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="text-sm text-gray-500 self-center">필터:</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none"
        >
          <option value="">전체 직무</option>
          {MENTOR_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={careerFilter}
          onChange={(e) => setCareerFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none"
        >
          <option value="">경력 연차</option>
          <option value="3">3년 이상</option>
          <option value="5">5년 이상</option>
          <option value="7">7년 이상</option>
        </select>
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none"
        >
          <option value="">상담 비용</option>
          <option value="30000">3만 원 이하</option>
          <option value="50000">5만 원 이하</option>
          <option value="100000">10만 원 이하</option>
        </select>
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">총 {filteredAndSorted.length}명의 멘토</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Mentor cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        {filteredAndSorted.map((m) => (
          <Link
            key={m.id}
            to={`/mentors/${m.id}`}
            className="flex gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-cardHover transition"
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-2xl font-bold text-primary-600">
              {m.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800">{m.name}</h3>
              <p className="text-sm text-gray-500">{m.role} · {m.company} ({m.careerYears}년차)</p>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{m.intro}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-amber-600 text-sm font-medium">★ {m.rating}</span>
                <span className="text-gray-400 text-sm">리뷰 {m.reviewCount}</span>
                <span className="text-primary-600 text-sm font-medium">30분 {m.price30.toLocaleString()}원~</span>
              </div>
              <span className="inline-block mt-3 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition">
                상담 신청
              </span>
            </div>
          </Link>
        ))}
      </div>
      {filteredAndSorted.length === 0 && (
        <p className="text-center text-gray-500 py-12">조건에 맞는 멘토가 없습니다. 필터를 조정해 보세요.</p>
      )}
    </div>
  )
}
