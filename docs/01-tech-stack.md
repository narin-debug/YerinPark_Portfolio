# 기술 스택

## 프레임워크
- Next.js (React)

## 애니메이션
- GSAP + ScrollTrigger
  - 가로 스크롤 갤러리(pin) 구현에 사용
  - 패럴랙스 구현에 사용
  - 텍스트 라인 리빌 구현에 사용
- 카드 호버 효과(이미지 크로스페이드, SVG 스트로크 리빌)는 CSS transition /
  SVG `stroke-dasharray`로 구현 (별도 라이브러리 불필요)

## 배포
- 코드 저장소: GitHub
- 배포: Vercel (GitHub 연동, push 시 자동 배포)

## 사용하지 않는 것
- Rive: 사용하지 않음. 원본 참고 사이트에는 Rive 기반 벡터 캐릭터
  애니메이션이 있었으나, 이번 프로젝트에서는 SVG + GSAP로 단순화하여
  대체하기로 결정함.
