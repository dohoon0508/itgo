import { Link, useSearchParams } from 'react-router-dom'
import { MENTOR_CATEGORIES } from '../data/mentors'
import { mentors } from '../data/mentors'

export default function LandingPage() {
  const [searchParams] = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'
  const featuredMentors = mentors.slice(0, 3)

  return (
    <>
      {justRegistered && (
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 text-primary-800 text-sm text-center">
            ✓ 멘토 등록 신청이 완료되었습니다. 검토 후 연락드리겠습니다.
          </div>
        </div>
      )}
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-800 leading-tight">
            실무자와 연결되어,<br />진로의 방향을 찾다
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            잇고(IT GO)는 현직 실무자의 경험 기반 상담으로 청년의 진로 고민을 연결합니다.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/mentors"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-card transition"
            >
              멘토 찾기
            </Link>
            <Link
              to="/mentor-register"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-medium bg-white text-navy-700 border-2 border-navy-700 hover:bg-navy-50 transition"
            >
              멘토로 참여하기
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">직무별 멘토 찾기</h2>
          <p className="text-sm text-gray-500 mb-6">관심 있는 분야의 멘토를 만나 보세요.</p>
          <div className="flex flex-wrap gap-3">
            {MENTOR_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/mentors?category=${cat.id}`}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition shadow-card"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">왜 잇고인가요?</h2>
          <p className="text-sm text-gray-500 mb-8">정보만으로는 부족할 때, 경험을 나눕니다.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">1</div>
              <h3 className="mt-4 font-semibold text-gray-800">실무자 직접 상담</h3>
              <p className="mt-2 text-sm text-gray-600">현직에서 일하는 실무자가 직접 상담해 드려요. 생생한 업무 이야기를 들을 수 있습니다.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">2</div>
              <h3 className="mt-4 font-semibold text-gray-800">경험 기반 인사이트</h3>
              <p className="mt-2 text-sm text-gray-600">단순 정보가 아니라, 실제 경험에서 나온 조언으로 진로 선택에 도움을 드립니다.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHover transition">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">3</div>
              <h3 className="mt-4 font-semibold text-gray-800">진로 동기 형성 지원</h3>
              <p className="mt-2 text-sm text-gray-600">방향성뿐 아니라, 한 걸음 내딛을 수 있는 동기와 구체적인 다음 액션을 함께 찾아요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Mentors */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">추천 멘토</h2>
          <p className="text-sm text-gray-500 mb-8">많은 멘티가 만족한 멘토들을 소개합니다.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {featuredMentors.map((m) => (
              <Link
                key={m.id}
                to={`/mentors/${m.id}`}
                className="block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition border border-gray-100"
              >
                <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                  <span className="text-4xl text-primary-300 font-bold">{m.name[0]}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{m.name}</h3>
                  <p className="text-sm text-gray-500">{m.role} · {m.company}</p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{m.intro}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-amber-600 font-medium">★ {m.rating}</span>
                    <span className="text-sm font-medium text-primary-600">30분 {m.price30.toLocaleString()}원~</span>
                  </div>
                  <span className="inline-block mt-3 w-full text-center py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium">
                    상담 신청
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/mentors" className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-primary-600 border border-primary-200 hover:bg-primary-50 transition">
              멘토 전체 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
