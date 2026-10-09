type Props = {
  current: 1 | 2 | 3
}

const STEPS = [
  { id: 1, label: '개인정보 동의' },
  { id: 2, label: '안전서약서' },
  { id: 3, label: '방문정보 입력' },
] as const

export default function WizardStepper({ current }: Props) {
  return (
    <ol className="wizard-stepper" aria-label="신청 단계">
      {STEPS.map((step) => (
        <li key={step.id} className={step.id === current ? 'is-current' : undefined}>
          {step.id} {step.label}
        </li>
      ))}
    </ol>
  )
}
