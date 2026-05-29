import { colors, gradients, radius } from '../../domain/constants/tokens';

const STEP_LABELS = ['Assistido', 'Saúde', 'Cuidador', 'Local', 'Finalizar'];

export function ProgressBar({ currentStep, totalSteps = 5 }) {
  const pct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: colors.secondary }}>
          Etapa {currentStep} de {totalSteps}
        </span>
        <span style={{ fontSize: '13px', color: colors.primary, fontWeight: 500 }}>
          {pct}%
        </span>
      </div>

      {/* Bar */}
      <div style={{ height: '8px', background: colors.border, borderRadius: radius.full, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: gradients.primary,
          borderRadius: radius.full,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                background: isComplete || isCurrent ? gradients.primary : colors.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 600,
                color: isComplete || isCurrent ? colors.white : colors.muted,
                flexShrink: 0,
              }}>
                {isComplete ? '✓' : stepNum}
              </div>
              <span style={{
                fontSize: '11px',
                color: isCurrent ? colors.primary : isComplete ? colors.okText : colors.muted,
                fontWeight: isCurrent ? 600 : 400,
                textAlign: 'center',
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
