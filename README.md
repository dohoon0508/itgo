# 잇고(IT GO) 웹 프로토타입

진로 상담 플랫폼 **잇고(IT GO)** 의 클릭형 웹 프로토타입입니다.  
React + Tailwind + React Router 기반이며, 사업계획서/발표용 데모로 사용할 수 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173/ 로 접속합니다.

## 포함 화면

1. **랜딩페이지** – 메인 카피, CTA, 카테고리, 서비스 특징, 추천 멘토
2. **멘토 목록** – 검색·필터·정렬, 멘토 카드 리스트
3. **멘토 상세** – 프로필, 상담 주제, 가능 시간, 후기, 우측 예약 카드
4. **예약/신청** – 신청자 정보, 고민 내용, 상담 목표, 예약 요약
5. **마이페이지(멘티)** – 예정/완료/취소 탭, 상담 내역, 관심 멘토
6. **멘토 등록** – 멘토 지원 폼, 경력 인증 업로드 placeholder

## 기술 스택

- React 18, Vite, React Router DOM 6
- Tailwind CSS 3
- 한글 UI, 블루/네이비 포인트 컬러

## GitHub Pages 배포

1. 저장소 **Settings → Pages** 로 이동
2. **Build and deployment** 의 **Source** 를 **GitHub Actions** 로 선택 (필수)
3. `main` 브랜치에 푸시하면 자동으로 빌드·배포됩니다.
4. 배포 완료 후 접속 주소: `https://dohoon0508.github.io/itgo/`

(최초 배포 후 1~2분 정도 걸릴 수 있습니다.)

**배포가 실패할 때:**  
- **Settings → Pages** 에서 Source가 **GitHub Actions** 인지 확인하세요.  
- **Actions** 탭에서 실패한 run을 클릭한 뒤, 어떤 step에서 빨간색 X가 뜨는지와 로그의 에러 메시지를 확인하세요.

## 참고

- 실제 서버 연결 없이 프론트엔드만 동작합니다.
- 멘토 6명 더미 데이터가 포함되어 있습니다.
- 빌드: `npm run build` → `dist` 폴더에 산출물 생성.
