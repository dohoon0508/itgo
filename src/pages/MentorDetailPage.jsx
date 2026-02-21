import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mentors } from '../data/mentors'

export default function MentorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mentor = mentors.find((m) => m.id === id)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [duration, setDuration] = useState(30)

  if (!mentor) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">멘토를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/mentors')} className="mt-4 text-primary-600 font-medium">목록으로</button>
      </div>
    )
  }

  const price = duration === 30 ? mentor.price30 : mentor.price60

  const handleBooking = () => {
    if (!selectedSlot) return
    navigate(`/booking/${mentor.id}?duration=${duration}&slot=${encodeURIComponent(selectedSlot)}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Info + Reviews */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-gray-100">
            <div className="flex gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-3xl font-bold text-primary-600 flex-shrink-0">
                {mentor.name[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-800">{mentor.name}</h1>
                <p className="text-gray-600">{mentor.role} · {mentor.company}</p>
                <p className="text-sm text-gray-500 mt-1">경력 {mentor.careerYears}년</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-amber-600 font-medium">★ {mentor.rating}</span>
                  <span className="text-gray-400 text-sm">리뷰 {mentor.reviewCount}개</span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-gray-700 leading-relaxed">{mentor.intro}</p>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">상담 가능 주제</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Time slots */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">상담 가능 시간</h3>
            <p className="text-sm text-gray-500 mb-4">원하는 날짜와 시간을 선택해 주세요.</p>
            <div className="space-y-4">
              {mentor.slots.map((slot) => (
                <div key={slot.date}>
                  <p className="text-sm font-medium text-gray-700 mb-2">{slot.date}</p>
                  <div className="flex flex-wrap gap-2">
                    {slot.times.map((time) => {
                      const value = `${slot.date} ${time}`
                      const isSelected = selectedSlot === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSelectedSlot(value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">후기</h3>
            <div className="space-y-4">
              {mentor.reviews.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{r.author}</span>
                    <span className="text-amber-600 text-sm">★ {r.rating}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{r.text}</p>
                  <p className="mt-1 text-xs text-gray-400">{r.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Fixed booking card */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">상담 예약</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">상담 유형</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDuration(30)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${duration === 30 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    30분
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuration(60)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${duration === 60 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    60분
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">선택한 시간</p>
                <p className="text-sm text-gray-600">{selectedSlot || '날짜·시간을 선택해 주세요'}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">상담료</span>
                  <span className="text-lg font-bold text-navy-800">{price.toLocaleString()}원</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBooking}
                disabled={!selectedSlot}
                className="w-full py-3.5 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                예약 요청
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
