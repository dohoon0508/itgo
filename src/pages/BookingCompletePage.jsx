import { Link, useSearchParams } from 'react-router-dom'

export default function BookingCompletePage() {
  const [searchParams] = useSearchParams()
  const mentorName = searchParams.get('mentorName') || '멘토'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8 text-center">
        <p className="text-xs font-medium text-primary-600">예약 완료</p>
        <h1 className="mt-2 text-2xl font-bold text-navy-800">상담 신청이 접수되었습니다</h1>
        <p className="mt-3 text-sm text-gray-600">
          {mentorName} 멘토님 상담 예약 요청이 접수되었습니다. 마이페이지에서 예약 상태를 확인하거나 취소할 수 있습니다.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/mypage"
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700"
          >
            마이페이지로 이동
          </Link>
          <Link
            to="/mentors"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
          >
            멘토 더 보기
          </Link>
        </div>
      </div>
    </div>
  )
}
