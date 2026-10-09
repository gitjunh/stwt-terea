---
name: trace-map
description: "완료된 구현 단계와 최적화 항목을 구현 파일, 테스트, 커밋에 짝짓는 문서를 작성한다. 모든 단계와 최적화가 끝난 뒤 단계별 코드 대응 문서를 요청할 때 사용한다. 기능 구현, 테스트 수정, 최적화, 컨펌 전 문서화에는 사용하지 않는다."
---

# 단계와 코드 대응

대응 문서는 나중에 어떤 커밋이 어떤 요구를 구현했는지 찾게 한다. 기록에 없는 파일을 단계에 연결하면 그 문서가 근거가 되지 못한다.

## 시작 조건

모든 단계의 QA가 통과이고, `_workspace/09_qa-inspector_hardening.md`의 `passed`가 true일 때만 최종 문서를 쓴다.

## 절차

1. `_workspace/05_page-designer_stages.md`의 단계 번호를 기준으로 삼는다.
2. 각 단계의 `_workspace/06_page-implementer_stage-<id>.md`와 `_workspace/07_qa-inspector_stage-<id>.md`에서 테스트 명령과 판정을 가져온다.
3. 그 단계 기록과 커밋 메시지에 실제로 있는 파일만 적는다.
4. `_workspace/08_site-hardener_report.md`의 변경은 단계 산출물과 따로 `최적화`로 적는다.

코드와 테스트는 수정하지 않는다.

## 출력

같은 내용을 `_workspace/10_trace-writer_map.md`와 `docs/stage-code-map.md`에 쓴다.

```markdown
# 단계별 구현 대응
| 단계 | 증명할 동작 | 테스트 | 구현 파일 | 커밋 | QA |
| --- | --- | --- | --- | --- | --- |

## 최적화
| 항목 | 파일 | 이유 | 이후 QA |
| --- | --- | --- | --- |
```

대응을 찾지 못한 단계는 빈칸으로 완료 처리하지 않고, 파일 맨 위에 빠진 단계를 적는다.
