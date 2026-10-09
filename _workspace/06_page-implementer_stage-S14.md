# S14 구현 기록

## 실패 테스트
- 명령: `cd sites/terea && npm test -- tests/s14-face-photo.test.tsx`
- 결과: failed: true
- 요약: 얼굴 사진 등록 UI 부재. 구현 전.

## 구현
- VisitInfo에 얼굴 사진(안면 인식용) file input 추가.

## 재실행
- 명령: `cd sites/terea && npm test -- tests/s14-face-photo.test.tsx`
- 결과: passed
