---
name: homepage-orchestrator
description: "웹사이트 URL과 관련 정보 마크다운으로 원본 페이지를 복제하는 작업을 조율한다. 페이지 복제, 클론, 홈페이지 생성, 화면 설계, 클라이언트 요구 반영, 설계 검증, 컨펌 후 구현, 단계 재실행, 수정, 보완, 업데이트, 다시 실행, 이전 결과 개선, 상용 가능 여부·요구 충족·보안 검수를 요청하면 사용한다. 하네스 구축·점검과 회고는 대상이 아니다. 회고와 피드백 반영은 evolve 스킬을 사용한다."
---

# 웹사이트 복제 오케스트레이터

클라이언트의 요구와 제공된 URL·마크다운으로 원본 웹페이지를 복제한다. 컨펌된 개선만 원본과 다르게 반영한다. 기준 설명은 `README.md`에 있다.

## 실행 모드: 혼합

| 단계 | 실행 모드 | 선택 이유 |
| --- | --- | --- |
| 0~1단계 | 메인 에이전트가 직접 수행 | 기존 산출물과 입력 유무를 먼저 갈라야 한다. |
| 2단계 요구 | 지속형 에이전트 | 클라이언트의 말이 이어지고, 같은 대응 담당이 이전 요구를 기억해야 한다. |
| 3~4단계 설계·검증 | 지속형 에이전트 | 반려와 수정이 같은 설계 담당에게 돌아가야 한다. |
| 5단계 컨펌 | 지속형 에이전트 | 확정과 수정을 같은 대응 담당이 판정해야 한다. |
| 6단계 구현 | 워크플로 조율 | 단계 목록이 확정된 뒤의 실패 테스트, 구현, 검증, 커밋 순서는 코드로 고정할 수 있다. |
| 7~8단계 최적화·추적 | 지속형 에이전트 | 같은 파일을 순서대로 고치고, 통과 뒤에만 문서를 써야 한다. |

사용자가 이 스킬을 실행하는 것은 6단계 `Workflow` 사용에 대한 동의다. 컨펌 전에는 `Workflow`를 호출하지 않는다.

이름 있는 에이전트는 하나의 협업 그룹으로 동작한다. 별도의 팀 객체는 만들지 않는다.

## 에이전트 구성

동시에 오래 띄워 두는 인원은 설계 단계의 4명이다. 구현 워크플로는 단계마다 구현과 QA만 호출한다. 중규모이며 상용 검수까지 포함해도 한 번에 전원을 띄우지 않는다.

| 세션 이름 | `subagent_type` | 모델 | 이유 | 스킬 | 산출물 |
| --- | --- | --- | --- | --- | --- |
| liaison | client-liaison | sonnet | 기록과 컨펌 판별은 절차가 분명하고 응답이 빨라야 한다 | client-intake | `01_client-liaison_requirements.md`, `04_client-liaison_confirmation.md` |
| designer | page-designer | opus | 원본과 요구를 한 구조로 맞추는 설계다 | page-design | `02_page-designer_design.md`, `05_page-designer_stages.md` |
| visual | web-designer | opus | 원본 화면의 시각 관계를 명세하는 설계다 | web-visual | `02_web-designer_visual.md` |
| reviewer | design-reviewer | opus | 요구와 원본을 교차 검증한다 | design-review | `03_design-reviewer_verdict.md` |
| implementer | page-implementer | opus | 단계 범위의 테스트와 구현이다 | stage-implementation | `06_page-implementer_stage-<id>.md` |
| qa | qa-inspector | opus | 명세와 구현을 교차 검증한다 | page-qa | `07_qa-inspector_stage-<id>.md` |
| hardener | site-hardener | opus | 통과한 동작을 유지한 채 성능·안전·보안을 본다 | site-hardening | `08_site-hardener_report.md` |
| commercial | commercial-web-reviewer | opus | 요구 일치·상용 가능·보안을 웹 전문가로 검수한다 | commercial-web-review | `13_commercial-web-reviewer_verdict.md` |
| tracer | trace-writer | sonnet | 이미 있는 기록을 표로 옮긴다 | trace-map | `docs/stage-code-map.md` |

## 작업 절차

### 0단계: 기존 작업 확인

1. `_workspace/`가 없으면 처음부터 진행한다.
2. `_workspace/`가 있고 일부만 다시 해달라는 요청이면 그 단계의 에이전트만 다시 호출한다. 프롬프트에 기존 산출물 경로를 넣는다.
3. `_workspace/`가 있고 URL이나 사이트가 이전 입력과 다르면 `_workspace`를 시각 접미사가 붙은 디렉터리로 옮긴 뒤 새로 만든다. 시각은 `args`나 셸의 현재 시각으로 붙이고, 워크플로 스크립트 안에서는 시각을 만들지 않는다.
4. 6단계 워크플로가 중단되었고 직전 `runId`가 있으면 `resumeFromRunId`로 재개한다. 바뀌지 않은 호출은 캐시를 쓴다.
5. 구현 단계의 일부 재실행은 컨펌 파일이 `confirmed`일 때만 한다.

### 1단계: 준비

1. 대상 URL, 관련 정보 경로, 클라이언트의 요청을 구분한다.
2. `_workspace/00_input/`에 이번 입력을 적는다.
3. 사용자에게 보내는 문안은 liaison의 `01_client-liaison_reply.md`만 사용한다. 다른 에이전트의 보고서를 그대로 붙이지 않는다.

### 2단계: 요구

**실행 모드:** 지속형 에이전트 협업

1. `Agent(name: "liaison", subagent_type: "client-liaison")`로 대응 담당을 실행한다. 프롬프트에 클라이언트 발화와 `_workspace/` 경로를 넣는다.
2. `TaskCreate`로 "요구 기록"을 liaison에 배정한다.
3. URL과 관련 정보 경로가 요구 파일에 생기기 전에는 3단계로 가지 않는다.

### 3단계: 설계

**실행 모드:** 지속형 에이전트 협업

1. 요구 파일을 동결한다. 절차는 아래 산출물 동결을 따른다.
2. `Agent(name: "designer", subagent_type: "page-designer")`를 실행하고 페이지 설계와 단계 목록이 생긴 뒤 동결한다.
3. 이어서 `Agent(name: "visual", subagent_type: "web-designer")`를 실행한다. 시각 담당은 페이지 설계에 없는 화면을 만들면 안 되므로, 설계가 끝나기 전에 시각 명세를 시작하지 않는다.
4. 두 산출물이 모두 생긴 뒤에만 4단계로 간다.

### 4단계: 설계 검증

**실행 모드:** 지속형 에이전트 협업

1. 설계, 단계 목록, 시각 명세를 동결한 뒤 reviewer를 실행한다.
2. `SendMessage`로 reviewer에게 동결된 경로를 검토하라고 한다.
3. `status`가 `pass`면 5단계로 간다.
4. `revise`면 반려 대상에게만 해당 항목을 고치게 하고, 고친 파일을 다시 동결한 뒤 reviewer를 다시 호출한다.
5. 같은 항목이 세 번 반려되면 구현으로 넘어가지 않고 liaison가 클라이언트에게 결정을 묻게 한다.

### 5단계: 컨펌 게이트

**실행 모드:** 지속형 에이전트 협업

1. liaison가 설계 요약이 아니라, 원본과 다른 점과 구현 단계 이름을 클라이언트 문안으로 쓴다.
2. 클라이언트의 답이 `confirmed`가 아니면 요구를 고치고 3단계로 돌아간다. 구현 워크플로를 시작하지 않는다.
3. `confirmed`이면 컨펌 파일과 그 범위의 설계 해시를 동결한다. 이 해시가 6단계의 입력이다.

### 6단계: 단계별 구현

**실행 모드:** 워크플로 조율

단계 목록의 순서대로, 한 번에 한 단계만 아래 스크립트를 `Workflow`로 실행한다. `args.stage`에는 그 단계의 식별자, 이름, 증명할 동작을 넣는다. `args`에는 요구, 설계, 시각 명세, 단계 목록, 컨펌 파일, 사이트 경로도 넣는다.

```javascript
export const meta = {
  name: 'homepage-stage',
  description: '한 구현 단계의 실패 테스트, 구현, 검증, 로컬 커밋',
  phases: [
    { title: '실패테스트', detail: '없는 동작을 증명하는 테스트를 작성하고 실패를 확인한다' },
    { title: '구현', detail: '실패가 확인된 테스트를 통과하는 구현만 한다' },
    { title: '검증', detail: '테스트와 설계가 맞는지 검사한다' },
    { title: '커밋', detail: '검증을 통과한 단계만 로컬 커밋한다' },
  ],
}

const RED = { type: 'object', required: ['failed', 'testCommand', 'summary'], properties: {
  failed: { type: 'boolean' }, testCommand: { type: 'string' }, summary: { type: 'string' } } }
const IMPL = { type: 'object', required: ['changed', 'summary'], properties: {
  changed: { type: 'boolean' }, summary: { type: 'string' } } }
const QA = { type: 'object', required: ['passed', 'summary'], properties: {
  passed: { type: 'boolean' }, summary: { type: 'string' } } }
const COMMIT = { type: 'object', required: ['committed', 'sha', 'summary'], properties: {
  committed: { type: 'boolean' }, sha: { type: 'string' }, summary: { type: 'string' } } }

phase('실패테스트')
const redResults = [await agent(
  `stage-implementation 스킬의 실패 테스트만 수행하라. 단계 ${args.stage.id} ${args.stage.title}. 증명할 것: ${args.stage.proof}. 컨펌: ${args.confirmationPath}. 제품 구현과 커밋은 하지 마라. 반환은 사용자 문안이 아니라 데이터다.`,
  { agentType: 'page-implementer', phase: '실패테스트', schema: RED, label: `red:${args.stage.id}` }
)].filter(Boolean)
log(`실패 테스트 결과 ${redResults.length}건, 누락 ${1 - redResults.length}건`)
const red = redResults[0]
if (!red || red.failed !== true) {
  log('테스트가 실패하지 않아 구현으로 넘어가지 않는다.')
  return { stage: args.stage.id, status: 'invalid-red', red: red ?? null }
}

phase('구현')
const implResults = [await agent(
  `stage-implementation 스킬의 구현만 수행하라. 단계 ${args.stage.id}. 실패한 명령: ${red.testCommand}. 설계 ${args.designPath}, 시각 ${args.visualPath}. 커밋하지 마라.`,
  { agentType: 'page-implementer', phase: '구현', schema: IMPL, label: `impl:${args.stage.id}` }
)].filter(Boolean)
log(`구현 결과 ${implResults.length}건, 누락 ${1 - implResults.length}건`)

phase('검증')
const qaResults = [await agent(
  `page-qa 스킬로 단계 ${args.stage.id}만 검증하라. 테스트 명령: ${red.testCommand}. 제품 코드는 수정하지 마라.`,
  { agentType: 'qa-inspector', phase: '검증', schema: QA, label: `qa:${args.stage.id}` }
)].filter(Boolean)
log(`검증 결과 ${qaResults.length}건, 누락 ${1 - qaResults.length}건`)
const qa = qaResults[0]
if (!qa || qa.passed !== true) {
  log('검증을 통과하지 못해 커밋하지 않는다.')
  return { stage: args.stage.id, status: 'qa-failed', red, impl: implResults[0] ?? null, qa: qa ?? null }
}

phase('커밋')
const commitResults = [await agent(
  `stage-implementation 스킬의 커밋만 수행하라. 단계 ${args.stage.id} ${args.stage.title}. 통과 명령: ${red.testCommand}. QA ${qa.summary}. 푸시하지 마라.`,
  { agentType: 'page-implementer', phase: '커밋', schema: COMMIT, label: `commit:${args.stage.id}` }
)].filter(Boolean)
log(`커밋 결과 ${commitResults.length}건, 누락 ${1 - commitResults.length}건`)
const commit = commitResults[0]
if (!commit || commit.committed !== true) {
  return { stage: args.stage.id, status: 'commit-failed', red, impl: implResults[0] ?? null, qa, commit: commit ?? null }
}
return { stage: args.stage.id, status: 'committed', red, impl: implResults[0] ?? null, qa, commit }
```

반환이 `invalid-red`면 그 단계를 커밋하지 않고 liaison가 단계 범위를 클라이언트에게 묻게 한다. `qa-failed`면 실패 테스트를 다시 작성하지 않는다. `Agent(name: "implementer", subagent_type: "page-implementer")`로 구현만 고치게 한 뒤, `Agent(name: "qa", subagent_type: "qa-inspector")`로 같은 명령을 다시 검증한다. 이 재시도는 두 번까지다. 그래도 실패하면 커밋하지 않고 다음 단계로 가지 않는다. 통과하면 같은 단계의 커밋만 다시 `Workflow`로 실행하지 말고, implementer에게 커밋 호출만 지시한다.

### 7단계: 최적화

**실행 모드:** 지속형 에이전트 협업

1. 모든 단계가 커밋되었고 단계 QA가 통과일 때만 hardener를 실행한다. 재시도 뒤에 implementer가 커밋한 단계도 커밋된 단계로 본다.
2. 단계 산출물을 동결한 뒤 `Agent(name: "hardener", subagent_type: "site-hardener")`를 호출한다.
3. 이어서 qa에게 최적화 검증을 요청한다. 실패하면 hardener에게 그 항목만 다시 고치게 하고 qa를 한 번 더 호출한다. 두 번째도 실패하면 상용 검수와 추적 문서를 쓰지 않는다.

### 7.5단계: 상용 웹 검수

**실행 모드:** 지속형 에이전트 협업

1. 최적화 QA가 통과한 뒤에만 `Agent(name: "commercial", subagent_type: "commercial-web-reviewer")`를 호출한다. `commercial-web-review` 스킬을 따른다.
2. 클라이언트가 상용 가능 여부·요구 충족 검수만 따로 요청해도 이 단계를 실행한다. 이 경우 최신 `sites/<식별자>/`와 요구 파일을 넘긴다.
3. `status`가 `pass`여야 8단계로 간다. `revise`면 반려 대상(implementer·hardener·designer·liaison)에게만 해당 항목을 고치게 한 뒤 commercial을 다시 호출한다. 재검수는 두 번까지다.
4. `block`이거나 재검수 후에도 `pass`가 아니면 추적 문서를 쓰지 않고, liaison가 상용 불가 이유와 미결 요구를 클라이언트 문안으로 알린다.
5. `commercialReady`가 false여도 `status`가 `pass`이면(미결만 남은 경우) 8단계로 갈 수 있다. 완료 문안에는 상용 미완 사유를 넣는다.

### 8단계: 대응 문서와 보고

**실행 모드:** 지속형 에이전트 협업

1. 상용 웹 검수가 `pass`인 뒤에만 tracer를 실행한다.
2. `docs/stage-code-map.md`가 생긴 뒤 liaison가 클라이언트에게 완료 문안을 쓴다. 문안에는 사이트 경로, 단계 수, 원본과 다르게 확정된 항목, 상용 검수 요약(`commercialReady`와 미결)을 넣는다.
3. `_workspace/`는 지우지 않는다.

## 산출물 동결

단계를 넘길 때마다 다음을 수행한다.

1. 직전 산출물을 맡은 에이전트가 완료를 보고했는지 확인한다.
2. 그 에이전트에게 기존 파일을 더 이상 고치지 말고, 수정이 필요하면 새 버전 파일로 쓰라고 알린다.
3. `shasum`으로 그 단계 파일의 해시를 `_workspace/freeze_<phase>.sha`에 남긴다.
4. 다음 에이전트에게 산출물 경로와 해시 파일 경로를 함께 넘긴다.
5. 다음 단계가 읽기 직전에 `shasum -c`로 확인한다. 해시가 다르면 바뀐 파일을 읽고, 이미 그 이전 내용을 읽은 단계를 다시 실행할지 정한다.

## 데이터 전달

| 구간 | 방법 |
| --- | --- |
| 요구 → 설계·시각 | 동결된 요구 파일 경로 |
| 설계·시각 → 검증 | 동결된 파일 경로 |
| 검증 → 대응 | 검증 결과 파일. 리더가 SendMessage로 중계한다 |
| 컨펌 → 구현 | 컨펌 파일과 설계 해시를 Workflow `args`로 전달 |
| 구현 → 최적화 | 단계 반환값과 QA 파일 |
| 최적화 → 상용 검수 | 최적화 보고서·최적화 QA·요구·사이트 경로 |
| 상용 검수 → 추적 | `13_commercial-web-reviewer_verdict.md` (`status: pass`) |

최종 산출물은 `sites/<식별자>/`와 `docs/stage-code-map.md`뿐이다. 나머지 중간 산출물은 `_workspace/`에 남긴다.

## 오류 처리

| 상황 | 대응 |
| --- | --- |
| 에이전트가 응답하지 않음 | SendMessage로 상태를 확인하고 한 번 더 지시한다. 실패하면 같은 유형을 새 세션 이름으로 실행하고 산출물 경로를 넘긴다. |
| 사용량 한도, 인증 만료, 권한 거부 | 다시 실행하지 않는다. 있는 산출물만 확인하고, 없는 내용을 `_workspace/`에 기록해 사용자에게 알린다. 한도이면 풀리는 시각도 알린다. 에이전트의 판단은 추측해 채우지 않는다. |
| 절반 이상의 설계 담당이 실패 | 사용자에게 알리고 계속할지 확인한다. |
| 워크플로 호출이 비어 있음 | `.filter(Boolean)` 뒤 누락 수를 기록하고, 그 단계 없이 다음 단계로 가지 않는다. |
| 요구와 원본이 충돌 | 지우지 않고 설계의 차이 목록에 둘 다 남긴다. |
| 작업 상태가 갱신되지 않음 | TaskList로 확인한 뒤 리더가 TaskUpdate로 갱신한다. |

## 테스트 시나리오

### 정상 흐름

1. 클라이언트가 대상 URL과 `samples/` 아래 관련 정보 마크다운, 원본 유지 요청을 말한다.
2. liaison가 요구를 기록하고, designer와 visual이 설계를 만들며, reviewer가 `pass`를 반환한다.
3. 클라이언트가 "이 설계대로 구현해 줘"라고 하면 컨펌이 `confirmed`가 되고, 단계마다 실패 테스트 다음 구현과 로컬 커밋이 이어진다.
4. 모든 단계 뒤에 최적화와 `docs/stage-code-map.md`가 생긴다.

### 오류 흐름: 컨펌 전 구현 요청

1. 요구만 있는 상태에서 클라이언트가 구현을 재촉한다.
2. 컨펌 파일이 `confirmed`가 아니므로 6단계 워크플로를 호출하지 않는다.
3. liaison가 아직 확정되지 않은 질문을 문안으로 남긴다.

### 오류 흐름: 테스트가 처음부터 통과

1. 6단계 실패 테스트 반환의 `failed`가 false다.
2. 구현과 커밋 단계로 넘어가지 않고 `invalid-red`로 멈춘다.
3. 클라이언트에게 그 단계가 이미 있는 동작을 가리킨다고 알린다.

### 오류 흐름: QA 무응답

1. 검증 호출 결과가 비어 있다.
2. 누락을 기록하고 커밋하지 않는다. qa를 새 세션 이름으로 한 번 더 호출한다.
3. 다시 비면 그 단계를 완료로 보고하지 않는다.
