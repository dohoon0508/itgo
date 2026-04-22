import { Link } from 'react-router-dom'

export default function DemoReportPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
      <div className="bg-gray-100 rounded-lg px-3 py-1.5 mb-2 flex flex-wrap items-center gap-x-3 text-sm text-gray-700">
        <span className="font-medium text-gray-800">홍길동</span>
        <span>010-0000-0000</span>
        <span>example@email.com</span>
      </div>

      {/* 같은 배치, 카드형 디자인 */}
      <div className="grid grid-cols-12 gap-3">
        {/* 1행: Case A | Case B | Case C | 상담목표(2행 합쳐서 긴 칸) */}
        <div className="col-span-12 sm:col-span-3 rounded-xl border border-gray-200 bg-white p-2 shadow-sm flex flex-col">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">고민 유형별 심층 분석</p>
          <p className="text-sm font-semibold text-primary-600 mb-1">Case A</p>
          <p className="text-xs text-gray-600 leading-snug flex-1">
            기획 직무로 취업을 준비 중인 대학생. 포트폴리오 구성과 실무 역량을 어떻게 쌓으면 좋을지 조언을 구하고자 서비스 기획 멘토에게 상담 신청.
          </p>
        </div>
        <div className="col-span-12 sm:col-span-3 rounded-xl border border-gray-200 bg-white p-2 shadow-sm flex flex-col">
          <p className="text-sm font-semibold text-primary-600 mb-1">Case B</p>
          <p className="text-xs text-gray-600 leading-snug flex-1">
            김민수 멘토님께 할 질문이 막막하다면, 버튼을 누르면 멘토 직무·상담 주제에 맞춰 자동으로 질문 문장을 만들어 드려요.
          </p>
        </div>
        <div className="col-span-12 sm:col-span-3 rounded-xl border border-gray-200 bg-white p-2 shadow-sm flex flex-col">
          <p className="text-sm font-semibold text-primary-600 mb-1">Case C</p>
          <p className="text-xs text-gray-600 leading-snug flex-1">
            개발자로 직무 전환을 고민 중인 비전공자. CS 면접 준비와 이직 시 고려할 점을 백엔드 개발 멘토에게 질문하기 위해 상담 예약.
          </p>
        </div>
        <div className="col-span-12 sm:col-span-3 row-span-2 rounded-xl border border-primary-100 bg-primary-50/50 p-4 shadow-sm flex flex-col">
          <p className="text-sm font-semibold text-navy-800 mb-3">상담 목표 및 선호도</p>
          <div className="space-y-2.5 flex-1">
            {[
              { label: '직무 이해', pct: 35 },
              { label: '준비 방향', pct: 30 },
              { label: '포트폴리오', pct: 20 },
              { label: '이직 고민', pct: 15 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-16 text-xs text-gray-700 shrink-0">{item.label}</span>
                <div className="flex-1 min-w-0 h-2.5 bg-white rounded-full overflow-hidden border border-primary-100">
                  <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${item.pct}%` }} />
                </div>
                <span className="w-6 text-xs text-gray-600 shrink-0">{item.pct}%</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-primary-100/80">
            {['직무 이해', '준비 방향', '포트폴리오 피드백', '이직 고민'].map((goal, i) => (
              <div key={goal} className="flex justify-between text-[11px] text-gray-600 py-0.5">
                <span>{goal}</span><span className="font-medium text-primary-600">{i + 1}위</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2행: 질문 예시 A | B | C (로드맵 삭제) */}
        <div className="col-span-12 sm:col-span-3 rounded-xl border border-primary-200 bg-primary-50/60 p-2 shadow-sm flex flex-col">
          <p className="text-[10px] text-primary-600/80 uppercase tracking-wide mb-0.5">질문 자동 생성 예시</p>
          <p className="text-sm font-semibold text-primary-700 mb-1">Case A</p>
          <ul className="text-xs text-gray-700 space-y-1 list-none flex-1">
            <li className="flex gap-1"><span className="text-primary-500 shrink-0">①</span> 김민수 멘토님, 기획자 관점에서 포트폴리오 산출물 알려주실 수 있을까요?</li>
            <li className="flex gap-1"><span className="text-primary-500 shrink-0">②</span> 실무에서 중요하게 보는 역량을 듣고 싶습니다.</li>
          </ul>
        </div>
        <div className="col-span-12 sm:col-span-3 rounded-xl border border-primary-200 bg-primary-50/60 p-2 shadow-sm flex flex-col">
          <p className="text-sm font-semibold text-primary-700 mb-1">Case B</p>
          <ul className="text-xs text-gray-700 space-y-1 list-none flex-1">
            <li className="flex gap-1"><span className="text-primary-500 shrink-0">①</span> 이준호 멘토님, CS 면접 준비 주제 여쭤보고 싶습니다.</li>
            <li className="flex gap-1"><span className="text-primary-500 shrink-0">②</span> 이직 시 유의할 점 알려주실 수 있을까요?</li>
          </ul>
        </div>
        <div className="col-span-12 sm:col-span-3 rounded-xl border border-primary-200 bg-primary-50/60 p-2 shadow-sm flex flex-col">
          <p className="text-sm font-semibold text-primary-700 mb-1">Case C</p>
          <ul className="text-xs text-gray-700 space-y-1 list-none flex-1">
            <li className="flex gap-1"><span className="text-primary-500 shrink-0">①</span> 오지훈 멘토님, 자기소개서 강조점 알려주실 수 있을까요?</li>
            <li className="flex gap-1"><span className="text-primary-500 shrink-0">②</span> 면접 시 피해야 할 답변을 듣고 싶습니다.</li>
          </ul>
        </div>

        {/* 3행: 포트폴리오(6) | 상담목표(6) */}
        <div className="col-span-12 sm:col-span-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-navy-800">포트폴리오 핵심 요소 중요도 순위</p>
          </div>
          <div className="p-3">
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-4 gap-px bg-gray-100 text-[11px]">
                <div className="bg-gray-50 py-2 px-3 font-medium text-gray-500">구분</div>
                <div className="bg-gray-50 py-2 px-3 font-medium text-gray-500">요소</div>
                <div className="bg-gray-50 py-2 px-3 font-medium text-gray-500">중요도</div>
                <div className="bg-gray-50 py-2 px-3 font-medium text-gray-500">순위</div>
                {[
                  ['직무 이해', '핵심', '20%', '1'],
                  ['준비 방향', '핵심', '37%', '2'],
                  ['포트폴리오', '핵심', '57%', '3'],
                ].map((row, i) => row.map((cell, j) => (
                  <div key={`${i}-${j}`} className="bg-white py-2 px-3 text-gray-700">{cell}</div>
                )))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-navy-800">상담 목표 및 선호도 통계</p>
          </div>
          <div className="p-3">
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-3 gap-px bg-gray-100 text-[11px]">
                <div className="bg-gray-50 py-2 px-3 font-medium text-gray-500">상담 목표 유형</div>
                <div className="bg-gray-50 py-2 px-3 font-medium text-gray-500">응답 비율</div>
                <div className="bg-gray-50 py-2 px-3 font-medium text-gray-500">순위</div>
                {[
                  ['직무 이해', '35%', '1'],
                  ['준비 방향', '30%', '2'],
                  ['포트폴리오 피드백', '20%', '3'],
                  ['이직 고민', '15%', '4'],
                ].map((row, i) => row.map((cell, j) => (
                  <div key={`${i}-${j}`} className="bg-white py-2 px-3 text-gray-700">{cell}</div>
                )))}
              </div>
            </div>
          </div>
        </div>

        {/* 4행: 상담 예약 요약 (12) */}
        <div className="col-span-12 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-navy-800">상담 예약 요약</p>
          </div>
          <div className="p-3 overflow-x-auto">
            <div className="rounded-lg border border-gray-100 overflow-hidden min-w-[600px]">
              <div className="grid grid-cols-7 gap-px bg-gray-100 text-[11px]">
                {['순위', '일시', '시간', '멘토', '상담일', '상태', '현황'].map((h) => (
                  <div key={h} className="bg-gray-50 py-2 px-3 font-medium text-gray-500">{h}</div>
                ))}
                {[
                  ['1', '2025.02.24', '14:00', '홍길동', '멘토피드백 설문', '예정', '시장'],
                  ['2', '2025.02.20', '19:00', '이준호', '상담 완료', '완료', '현황'],
                  ['3', '2025.02.15', '11:00', '최서윤', '상담 완료', '완료', '현황'],
                ].map((row, i) => row.map((cell, j) => (
                  <div key={`${i}-${j}`} className="bg-white py-2 px-3 text-gray-700">{cell}</div>
                )))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-[10px] text-gray-500">* 잇고 IT GO 데이터 분석팀 · WHO · 멘토 피드백 설문 · Vision Research 등</p>
        <p className="text-[11px] font-medium text-navy-800 mt-0.5">잇고 IT GO [사용자 상담 신청 현황 및 유형 분석 보고서]</p>
      </div>
      <div className="mt-2 text-center">
        <Link to="/" className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-xs font-medium text-primary-600 border border-primary-200 hover:bg-primary-50 transition">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
