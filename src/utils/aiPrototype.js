import { mentors } from '../data/mentors'

const KEYWORD_CATEGORY_MAP = [
  { keywords: ['기획', 'pm', '서비스', '프로덕트'], category: 'planning' },
  { keywords: ['마케팅', '광고', '브랜딩', '퍼포먼스'], category: 'marketing' },
  { keywords: ['개발', '코딩', '백엔드', '프론트', 'cs', '알고리즘'], category: 'dev' },
  { keywords: ['디자인', 'ux', 'ui', 'figma', '포트폴리오'], category: 'design' },
  { keywords: ['데이터', 'sql', '분석', '대시보드'], category: 'data' },
  { keywords: ['채용', '면접', '자소서', '이력서', 'hr'], category: 'hr' },
]

const INDUSTRY_BY_CATEGORY = {
  planning: 'IT 서비스',
  marketing: '디지털 마케팅',
  dev: '테크',
  design: '디지털 프로덕트',
  data: '데이터 기반 서비스',
  hr: 'HR/채용',
}

function pickTopCategory(text = '') {
  const normalized = text.toLowerCase()
  const score = {}
  KEYWORD_CATEGORY_MAP.forEach(({ keywords, category }) => {
    score[category] = (score[category] || 0) + keywords.filter((k) => normalized.includes(k)).length
  })
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1])
  if (!sorted.length || sorted[0][1] === 0) return 'planning'
  return sorted[0][0]
}

export function getMentorQuestionTemplates(mentor) {
  const { name, role } = mentor
  const templatesByCategory = {
    planning: [
      `${name} 멘토님, ${role}로 일하시는 관점에서 여쭤보고 싶습니다. 서비스 기획·PM 취업을 준비 중인데, 포트폴리오에 꼭 넣어야 할 산출물과 실무에서 중요하게 보는 역량을 알려주실 수 있을까요?`,
      `${name} 멘토님께 ${role} 경험을 바탕으로 조언을 구하고 싶습니다. 기획 직무로 전환을 고민 중인데, 준비 기간과 단계별로 해야 할 일을 구체적으로 듣고 싶어요.`,
    ],
    marketing: [
      `${name} 멘토님, ${role}로서 디지털 마케팅 실무와 인턴 준비 방향을 여쭤보고 싶습니다. 실무에서 자주 쓰는 툴과 지표, 그리고 준비 시 강조하면 좋을 점을 알려주실 수 있을까요?`,
      `${name} 멘토님께 마케팅 직무 관련 질문 드립니다. 퍼포먼스 마케팅과 브랜드 마케팅 중 제 성향에 맞는 방향과, 그에 맞는 준비 방법을 조언해 주시면 감사하겠습니다.`,
    ],
    dev: [
      `${name} 멘토님, ${role} 실무 경험을 바탕으로 여쭤보고 싶습니다. 개발자 취업을 위해 CS 면접에서 꼭 준비해야 할 주제와, 이직 시 유의할 점을 알려주실 수 있을까요?`,
      `${name} 멘토님께 백엔드 개발 실무와 커리어 관련 질문 드립니다. 신입/주니어가 실무에서 가장 먼저 쌓아야 할 역량과, 면접에서 강조하면 좋은 포인트를 듣고 싶어요.`,
    ],
    design: [
      `${name} 멘토님, ${role} 관점에서 포트폴리오와 디자인 취업 준비에 대해 여쭤보고 싶습니다. 피그마 실무 워크플로와, 채용 시 중요하게 보는 포트폴리오 구성 요령을 알려주실 수 있을까요?`,
      `${name} 멘토님께 UI/UX 디자인 직무 관련 질문 드립니다. 포트폴리오 스토리텔링과 실무에서 요구하는 스킬 수준을 구체적으로 듣고 싶습니다.`,
    ],
    data: [
      `${name} 멘토님, ${role}로 일하시는 관점에서 데이터 직무와 SQL·대시보드 실무에 대해 여쭤보고 싶습니다. 데이터 분석가 취업 준비 시 단계별로 쌓아야 할 역량을 알려주실 수 있을까요?`,
      `${name} 멘토님께 데이터 직무 관련 질문 드립니다. 실무에서 쓰는 도구와, 채용 시 중요하게 보는 포인트를 구체적으로 듣고 싶어요.`,
    ],
    hr: [
      `${name} 멘토님, HR·채용 현장 경험을 바탕으로 여쭤보고 싶습니다. 자기소개서에서 강조해야 할 점과, 면접 시 피해야 할 답변, 커리어 전환을 고민할 때 유의할 점을 알려주실 수 있을까요?`,
      `${name} 멘토님께 채용 담당자 관점에서 질문 드립니다. 이력서·자기소개서 피드백과 면접 준비 시 실무자가 좋게 보는 표현을 구체적으로 듣고 싶습니다.`,
    ],
  }
  return templatesByCategory[mentor.category] || templatesByCategory.planning
}

export function recommendCareerPaths({ major = '', experience = '', interest = '' }) {
  const sourceText = `${major} ${experience} ${interest}`
  const topCategory = pickTopCategory(sourceText)
  const base = [
    {
      category: topCategory,
      role: topCategory === 'dev' ? '백엔드 개발자' : topCategory === 'planning' ? '서비스 기획자' : topCategory === 'data' ? '데이터 분석가' : topCategory === 'design' ? 'UI/UX 디자이너' : topCategory === 'marketing' ? '퍼포먼스 마케터' : 'HR 담당자',
      industry: INDUSTRY_BY_CATEGORY[topCategory],
      reason: '입력한 전공/경험/관심 키워드와 가장 많이 일치하는 분야입니다.',
    },
  ]
  const fallback = ['planning', 'dev', 'data', 'design', 'marketing', 'hr']
    .filter((c) => c !== topCategory)
    .slice(0, 2)
    .map((category) => ({
      category,
      role: category === 'dev' ? '프론트엔드 개발자' : category === 'planning' ? '서비스 기획자' : category === 'data' ? 'BI 분석가' : category === 'design' ? '프로덕트 디자이너' : category === 'marketing' ? '그로스 마케터' : '채용 담당자',
      industry: INDUSTRY_BY_CATEGORY[category],
      reason: '현재 관심사와 인접 역량으로 확장 가능한 대안 경로입니다.',
    }))
  return [...base, ...fallback]
}

export function recommendMentorsForMentee({ concern = '', goals = [] }) {
  const text = `${concern} ${goals.join(' ')}`
  const targetCategory = pickTopCategory(text)
  const ranked = mentors
    .map((mentor) => {
      let score = 0
      if (mentor.category === targetCategory) score += 3
      goals.forEach((goal) => {
        if (mentor.intro.includes(goal) || mentor.tags.some((tag) => goal.includes(tag) || tag.includes(goal))) score += 2
      })
      mentor.tags.forEach((tag) => {
        if (text.includes(tag)) score += 1
      })
      return { mentor, score }
    })
    .sort((a, b) => b.score - a.score || b.mentor.rating - a.mentor.rating)
    .slice(0, 3)
    .map(({ mentor }, idx) => ({
      rank: idx + 1,
      id: mentor.id,
      name: mentor.name,
      role: mentor.role,
      reason: idx === 0 ? '입력한 고민 키워드와 상담 목표 일치도가 가장 높습니다.' : idx === 1 ? '연관 주제 상담 경험과 멘티 후기 평점이 높습니다.' : '보완 관점에서 함께 상담하면 시야를 넓힐 수 있습니다.',
    }))
  return ranked
}

export function buildExecutionPlan({ concern = '', goals = [] }) {
  const focus = goals.length ? goals[0] : '직무 이해'
  const noteLines = (concern || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const keywordToAction = [
    {
      match: (text) => text.includes('공백기'),
      action: { period: '1주', item: '공백기 설명용 STAR 예시 2개 정리 및 자기소개 문장 3개 작성' },
    },
    {
      match: (text) => text.includes('포트폴리오'),
      action: { period: '1주', item: '포트폴리오 주제 2개 확정 후 목차/산출물 구조 1차 작성' },
    },
    {
      match: (text) => text.includes('면접'),
      action: { period: '2주', item: '예상 면접 질문 5개 답변 스크립트 작성 및 1회 리허설' },
    },
    {
      match: (text) => text.includes('이력서') || text.includes('자소서'),
      action: { period: '2주', item: '이력서/자기소개서 핵심 문장 개선 후 멘토 피드백 1회 반영' },
    },
    {
      match: (text) => text.includes('지원 일정') || text.includes('일정'),
      action: { period: '3주', item: '3주 지원 캘린더 작성 및 주간 점검 루틴(주 1회) 실행' },
    },
    {
      match: (text) => text.includes('자신감'),
      action: { period: '3주', item: '작은 성공경험 과제 2개 실행 후 성과/학습 포인트 기록' },
    },
  ]

  const customizedActions = noteLines
    .map((line) => keywordToAction.find((rule) => rule.match(line))?.action)
    .filter(Boolean)

  const uniqueActions = Array.from(
    new Map(customizedActions.map((action) => [`${action.period}-${action.item}`, action])).values()
  ).slice(0, 3)

  const fallbackActions = [
    { period: '1주', item: `${focus} 관련 정보 3개 조사 후 인사이트 정리` },
    { period: '2주', item: '멘토 피드백 반영해 이력서/포트폴리오 초안 1회 개선' },
    { period: '1개월', item: '모의 면접 또는 실전 지원 2회 실행 후 회고 작성' },
  ]

  const periodOrder = {
    '1주': 1,
    '2주': 2,
    '3주': 3,
    '4주': 4,
    '1개월': 5,
  }

  const sortedActions = (uniqueActions.length > 0 ? uniqueActions : fallbackActions).slice()
    .sort((a, b) => {
      const aOrder = periodOrder[a.period] || 99
      const bOrder = periodOrder[b.period] || 99
      if (aOrder !== bOrder) return aOrder - bOrder
      return a.item.localeCompare(b.item, 'ko')
    })

  return {
    summary: concern
      ? `상담 메모의 핵심 키워드(${noteLines.length || 1}개)를 기반으로 실행 우선순위를 구성했습니다.`
      : '입력한 목표를 기준으로 실행 계획을 제안합니다.',
    actions: sortedActions,
    reminderOptions: ['매주 월요일 오전 9시', '매주 수요일 오후 8시', '매주 금요일 오전 10시'],
  }
}

export function generateMentorProfileDraft({ name = '', role = '', company = '', careerYears = '', topics = '' }) {
  const topicText = topics || '취업 준비, 직무 이해, 커리어 전환'
  return `${name || '멘토'}은(는) ${company || '현업 기업'}에서 ${role || '실무'}를 담당하며 ${careerYears || '수'}년간 경험을 쌓았습니다. ${topicText} 관련 상담을 통해 멘티가 바로 실행할 수 있는 액션 중심 조언을 제공합니다.`
}

export function recommendMentorTags({ role = '', intro = '', topics = '' }) {
  const text = `${role} ${intro} ${topics}`
  const tags = new Set()
  if (text.match(/기획|pm|서비스/)) ['서비스기획', 'PM취업', '문제정의'].forEach((t) => tags.add(t))
  if (text.match(/마케팅|광고|브랜딩/)) ['퍼포먼스', '브랜딩', '데이터분석'].forEach((t) => tags.add(t))
  if (text.match(/개발|백엔드|프론트|코딩/)) ['개발자취업', 'CS면접', '프로젝트'].forEach((t) => tags.add(t))
  if (text.match(/디자인|ux|ui|figma/i)) ['포트폴리오', '피그마', 'UX리서치'].forEach((t) => tags.add(t))
  if (text.match(/데이터|sql|분석/i)) ['데이터직무', 'SQL', '대시보드'].forEach((t) => tags.add(t))
  if (text.match(/채용|면접|자소서|hr/i)) ['면접', '자기소개서', '커리어전환'].forEach((t) => tags.add(t))
  if (tags.size === 0) ['직무이해', '취업준비', '커리어전환'].forEach((t) => tags.add(t))
  return Array.from(tags).slice(0, 6)
}

export function buildMenteePreReport(session) {
  const targetName = session.menteeName || '멘티'
  return {
    summary: `${targetName} 멘티와의 ${session.duration}분 상담 예정. 멘티는 직무 방향성과 준비 전략에 대한 조언을 원합니다.`,
    keyNeeds: ['현재 역량 진단', '직무별 준비 우선순위 설정', '다음 2주 실행 계획 확정'],
    riskPoint: '질문 범위가 넓어 시간이 분산될 수 있어, 핵심 질문 2개부터 확인이 필요합니다.',
  }
}

export function suggestCounselingGuide(input = '일반') {
  const sessionType = typeof input === 'string' ? input : input?.sessionType || '일반'
  const concernText = typeof input === 'string' ? '' : (input?.concernText || '')
  const selectedQuestions = Array.isArray(input?.selectedQuestions) ? input.selectedQuestions : []

  const base = [
    { step: '오프닝 5분', guide: '현재 고민의 맥락과 기대 결과를 명확히 확인' },
    { step: '진단 15분', guide: '경험/역량/목표 갭을 질문 기반으로 진단' },
    { step: '솔루션 20분', guide: '실행 가능한 액션 2~3개로 구체화' },
    { step: '마무리 5분', guide: '다음 점검 일정과 성공 지표 합의' },
  ]

  const joinedQuestions = selectedQuestions.join(' ')
  const combined = `${sessionType} ${concernText} ${joinedQuestions}`.toLowerCase()

  if (combined.includes('포트폴리오')) {
    base[2].guide = '포트폴리오 개선 포인트를 우선순위로 정리하고, 1차 산출물 범위를 합의'
  }
  if (combined.includes('공백기')) {
    base[1].guide = '공백기 맥락을 강점 중심 서사로 재구성하고, 자기소개 문장 초안을 함께 작성'
  }
  if (combined.includes('면접')) {
    base[3].guide = '예상 질문 3개와 답변 구조를 확정하고 다음 상담 전 리허설 과제를 설정'
  }
  if (combined.includes('서비스') || combined.includes('기획') || combined.includes('pm')) {
    base[2].guide = '서비스/기획 관점의 문제정의-개선안-성과지표 흐름으로 액션을 구체화'
  }
  if (selectedQuestions.length > 0) {
    base[0].guide = `멘티가 사전 선택한 핵심 질문 ${Math.min(selectedQuestions.length, 3)}개를 우선 순서대로 확인`
  }

  return base
}

export function buildPostSessionOutput(note = '') {
  const lines = (note || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const focusKeywords = []
  if (note.includes('공백기')) focusKeywords.push('공백기 설명 보완')
  if (note.includes('포트폴리오')) focusKeywords.push('포트폴리오 구조화')
  if (note.includes('면접')) focusKeywords.push('면접 답변 고도화')
  if (note.includes('이력서') || note.includes('자소서')) focusKeywords.push('지원 문서 개선')
  if (note.includes('일정')) focusKeywords.push('지원 일정 관리')
  if (note.includes('자신감')) focusKeywords.push('자신감 회복 루틴')

  const diagnosis = note
    ? `멘티는 ${focusKeywords[0] || '직무 방향성 정렬'} 이슈가 우선이며, 현재 상태와 목표 사이의 갭을 줄이기 위한 단기 실행이 필요한 상태입니다.`
    : '멘티는 목표 대비 준비 우선순위를 명확히 정리할 필요가 있습니다.'

  const feedback = note
    ? `상담 메모 ${lines.length}개 항목을 분석해 우선순위를 ${focusKeywords.join(', ') || '직무 방향성 정렬'}로 설정했습니다. 이번 주에는 범위를 좁혀 결과물을 남기는 방식으로 진행합니다.`
    : '상담에서 합의한 방향을 기준으로 작은 단위 실행부터 시작하는 것이 좋습니다.'

  const actionItems = lines.length > 0
    ? lines.slice(0, 3).map((line, idx) => `${idx + 1}) ${line} -> 이번 주 실행 과제로 전환`)
    : [
        '핵심 목표 1개 선정 후 주간 단위 체크',
        '포트폴리오/이력서 항목 1회 업데이트',
        '다음 상담 전 사전 질문 3개 준비',
      ]

  const nextFollowUp = note
    ? '다음 상담에서 실행 과제 완료 여부, 결과물 품질, 지원 일정 진행률을 함께 점검합니다.'
    : '다음 상담에서 실행 과제 진행률과 보완 포인트를 점검합니다.'

  return { diagnosis, feedback, actionItems, nextFollowUp }
}

export function buildMentorOpsReport(sessions = []) {
  const total = sessions.length || 6
  const completed = sessions.filter((s) => s.status === 'completed').length || 4
  const avgRating = 4.8
  const expectedRevenue = sessions.reduce((sum, s) => sum + (s.duration === 60 ? 54000 : 30000), 0) || 228000
  return {
    total,
    completedRate: Math.round((completed / total) * 100),
    avgRating,
    expectedRevenue,
    insight: '저녁 시간대(19:00~21:00) 상담 전환율이 높아 해당 슬롯 확장을 추천합니다.',
  }
}

function normalizeCategoryFromInterest(interest = '') {
  if (interest.includes('기획')) return 'planning'
  if (interest.includes('마케팅')) return 'marketing'
  if (interest.includes('개발')) return 'dev'
  if (interest.includes('디자인')) return 'design'
  if (interest.includes('데이터')) return 'data'
  if (interest.includes('채용') || interest.includes('hr')) return 'hr'
  return 'planning'
}

export function analyzeMenteePersona(persona) {
  return {
    summary: persona.aiSummary,
    judgement: '현재 사용자는 진로 재탐색 단계로 판단됩니다.',
    strengths: `${persona.strengths.join(', ')} 강점을 기반으로 실행 가능한 직무 탐색이 유리합니다.`,
  }
}

export function recommendJobsByPersona(persona) {
  return persona.recommendedJobs
}

export function calculateMentorMatchScore(mentee, mentor) {
  let score = 50
  const interestCategories = (mentee.interests || []).map(normalizeCategoryFromInterest)
  if (interestCategories.includes(mentor.category)) score += 40

  const concernText = (mentee.concerns || []).join(' ')
  const concernKeywords = ['포트폴리오', '취업', '직무', '공백기', '면접']
  const tagMatches = mentor.tags.filter((tag) =>
    concernKeywords.some((keyword) => concernText.includes(keyword) && (tag.includes(keyword) || keyword.includes(tag)))
  ).length
  if (tagMatches > 0) score += 20

  if (mentor.rating >= 4.8) score += 10
  if (mentor.reviewCount >= 20) score += 5

  if (mentor.tags.some((tag) => ['포트폴리오', '취업', 'PM취업', '개발자취업'].some((k) => tag.includes(k)))) {
    score += 8
  }

  return Math.min(score, 98)
}

export function recommendMentorsByPersona(persona) {
  return mentors
    .map((mentor) => {
      const matchScore = calculateMentorMatchScore(persona, mentor)
      return {
        ...mentor,
        matchScore,
        recommendationReason:
          `${persona.name}님의 관심 직무(${persona.interests.join(', ')})와 멘토의 상담 분야가 잘 맞고, ` +
          `상담 태그(${mentor.tags.join(', ')})가 현재 고민과 연결되어 추천합니다.`,
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
}

export function generateQuestionsForPersona({ persona, mentor }) {
  const base = persona.generatedQuestions || []
  if (!mentor) return base

  const mentorSpecific = [
    `${mentor.name} 멘토님, ${mentor.role} 관점에서 제가 ${persona.goal} 목표를 달성하려면 어떤 준비 순서로 시작하는 것이 좋을까요?`,
    `${mentor.name} 멘토님, 제 강점(${persona.strengths.join(', ')})을 ${mentor.role} 지원서와 면접에서 어떻게 강조하면 좋을까요?`,
  ]
  return [...base.slice(0, 3), ...mentorSpecific].slice(0, 4)
}
