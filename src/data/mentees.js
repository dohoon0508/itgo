export const menteePersonas = [
  {
    id: 'mentee-001',
    name: '김지우',
    type: '쉬었음 청년 / 진로 재탐색형',
    age: 25,
    education: '인문계열 전공 졸업',
    status: '졸업 후 8개월째 취업 준비를 쉬고 있음',
    interests: ['서비스기획', '마케팅', '데이터'],
    experiences: [
      '교내 서포터즈 활동',
      '간단한 공모전 참여 경험',
      '블로그 글쓰기 경험',
    ],
    strengths: ['글쓰기', '사용자 관찰', '꼼꼼한 정리'],
    concerns: [
      '어떤 직무가 맞는지 모르겠음',
      '공백기가 길어져 자신감이 떨어짐',
      '포트폴리오를 어떻게 시작해야 할지 모름',
    ],
    preferredWorkStyle: ['사람과 소통하는 일', '기획하고 정리하는 일'],
    avoidWorkStyle: ['반복적인 단순 업무', '혼자 오래 개발만 하는 업무'],
    goal: '3개월 안에 지원 가능한 직무를 정하고 포트폴리오 방향을 잡고 싶음',
    aiSummary:
      '사용자는 졸업 후 공백기를 겪고 있으며, 자신의 경험을 직무 역량으로 연결하는 데 어려움을 느끼고 있다. 글쓰기와 정리 능력이 강점이므로 서비스기획, 콘텐츠마케팅, CRM/마케팅 데이터 직무를 우선 탐색할 수 있다.',
    recommendedJobs: [
      {
        title: '서비스기획',
        matchScore: 92,
        reason: '사용자 관찰, 글쓰기, 정리 능력을 바탕으로 문제를 구조화하는 역량과 잘 맞음',
        preparation: ['서비스 분석 글 작성', '간단한 화면 기획서 작성', '포트폴리오 1개 제작'],
      },
      {
        title: '콘텐츠마케팅',
        matchScore: 84,
        reason: '블로그 글쓰기 경험과 서포터즈 활동을 콘텐츠 제작 경험으로 연결할 수 있음',
        preparation: ['콘텐츠 기획안 작성', '마케팅 사례 분석', 'SNS 운영 경험 정리'],
      },
      {
        title: 'CRM/마케팅 데이터',
        matchScore: 78,
        reason: '꼼꼼한 정리 능력과 사용자 관심사를 바탕으로 고객 분석 직무로 확장 가능함',
        preparation: ['GA 기초 학습', '엑셀/SQL 기초', '고객 세그먼트 분석 사례 정리'],
      },
    ],
    generatedQuestions: [
      '제가 가진 서포터즈와 글쓰기 경험을 서비스기획 직무 역량으로 어떻게 연결할 수 있을까요?',
      '공백기가 있는 상태에서 포트폴리오를 시작하려면 어떤 프로젝트부터 만드는 것이 좋을까요?',
      '서비스기획 직무를 준비할 때 3개월 안에 가장 먼저 해야 할 일은 무엇인가요?',
      '비전공자가 서비스기획 직무에 지원할 때 면접에서 어떤 경험을 강조하면 좋을까요?',
    ],
  },
]

export function getMenteePersonaById(id) {
  return menteePersonas.find((mentee) => mentee.id === id) || menteePersonas[0]
}
