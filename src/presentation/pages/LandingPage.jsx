import { colors, gradients, radius, shadows } from '../../domain/constants/tokens';
import { ROUTES } from '../../domain/constants/routes';
import { useRouter } from '../../infrastructure/router/RouterContext';
import { Header } from '../components/Header';
import { HeartLogo } from '../components/HeartLogo';
import { Button } from '../components/ui';

const features = [
  { icon: '🛡️', title: 'Profissionais Qualificados', desc: 'Cuidadores treinados e certificados, com experiência comprovada no cuidado de idosos.' },
  { icon: '🕐', title: 'Disponibilidade Flexível', desc: 'Atendimento em diversos turnos e frequências, adaptado à sua rotina e necessidades.' },
  { icon: '👥', title: 'Atendimento Personalizado', desc: 'Cada assistido recebe cuidados individualizados, respeitando sua dignidade e autonomia.' },
];

const steps = [
  { num: '1', title: 'Cadastro', desc: 'Preencha o formulário com informações sobre o assistido e suas necessidades.' },
  { num: '2', title: 'Avaliação', desc: 'Nossa equipe analisa suas necessidades específicas com atenção.' },
  { num: '3', title: 'Seleção', desc: 'Indicamos o profissional mais adequado para o caso.' },
  { num: '4', title: 'Atendimento', desc: 'O cuidador inicia os serviços na data acordada.' },
];

const services = {
  basicos: ['Auxílio na alimentação e hidratação', 'Higiene pessoal e banho assistido', 'Mobilização e transferências seguras', 'Administração de medicamentos'],
  especializados: ['Acompanhamento de pacientes com Alzheimer', 'Cuidados pós-AVC e Parkinson', 'Assistência a pacientes acamados', 'Cuidados com sondas e curativos'],
};

export function LandingPage() {
  const { navigate } = useRouter();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <Header variant="landing" />

      {/* HERO */}
      <section style={{ background: gradients.heroBg, padding: '80px 0 60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 128px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '52px', fontWeight: 700, color: colors.heading, lineHeight: 1.15, margin: '0 0 20px' }}>
              Cuidado com Amor<br />e Dedicação
            </h1>
            <p style={{ fontSize: '18px', color: colors.secondary, lineHeight: 1.6, margin: '0 0 36px', maxWidth: '460px' }}>
              Encontre cuidadores qualificados e confiáveis para seus entes queridos. Cuidado especializado com amor e dedicação.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.CADASTRO)}>
                Começar Agora →
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}>
                Saiba Mais
              </Button>
            </div>
          </div>

          {/* Hero card visual */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
              borderRadius: radius.xxl,
              padding: '60px 40px',
              boxShadow: shadows.lg,
              textAlign: 'center',
              width: '380px',
            }}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>💙</div>
              <p style={{ fontSize: '18px', fontWeight: 600, color: colors.primary, margin: 0 }}>
                Cuidado com carinho e dedicação
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
                {['⭐ 4.9/5', '🏆 +500 cuidadores', '👴 Desde 2020'].map(t => (
                  <span key={t} style={{ fontSize: '12px', color: colors.secondary }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE ESCOLHER */}
      <section style={{ background: colors.bgPage, padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 128px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: colors.heading, textAlign: 'center', margin: '0 0 12px' }}>
            Por Que Escolher Nossos Serviços?
          </h2>
          <p style={{ fontSize: '16px', color: colors.secondary, textAlign: 'center', margin: '0 0 48px' }}>
            Excelência e compromisso em cada atendimento
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {features.map(f => (
              <div key={f.title} style={{
                background: colors.white, border: `1px solid ${colors.border}`,
                borderRadius: radius.xl, padding: '32px 28px',
                boxShadow: shadows.card,
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: '#EEF2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', marginBottom: '20px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.heading, margin: '0 0 12px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: colors.secondary, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ background: colors.white, padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 128px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: colors.heading, textAlign: 'center', margin: '0 0 12px' }}>
            Como Funciona?
          </h2>
          <p style={{ fontSize: '16px', color: colors.secondary, textAlign: 'center', margin: '0 0 56px' }}>
            Simples, rápido e seguro
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', position: 'relative' }}>
            {steps.map((s, i) => (
              <div key={s.title} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: gradients.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', fontWeight: 700, color: colors.white,
                  margin: '0 auto 16px',
                }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: colors.heading, margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: colors.secondary, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section style={{ background: colors.bgPage, padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 128px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: colors.heading, textAlign: 'center', margin: '0 0 12px' }}>
            Nossos Serviços
          </h2>
          <p style={{ fontSize: '16px', color: colors.secondary, textAlign: 'center', margin: '0 0 48px' }}>
            Cuidado completo para todas as necessidades
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[['Cuidados Básicos', services.basicos], ['Cuidados Especializados', services.especializados]].map(([title, items]) => (
              <div key={title} style={{
                background: colors.white, border: `1px solid ${colors.border}`,
                borderRadius: radius.xl, padding: '32px',
                boxShadow: shadows.card,
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: colors.heading, margin: '0 0 20px' }}>{title}</h3>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ color: colors.primary, fontWeight: 700, fontSize: '16px' }}>✓</span>
                    <span style={{ fontSize: '14px', color: colors.secondary }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: gradients.ctaBg, padding: '80px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: colors.white, margin: '0 0 16px' }}>
            Pronto para Começar?
          </h2>
          <p style={{ fontSize: '18px', color: '#DBEAFE', margin: '0 0 36px' }}>
            Entre na sua conta e encontre o cuidador ideal para o seu ente querido.
          </p>
          <Button variant="green" size="lg" onClick={() => navigate(ROUTES.CADASTRO)}>
            Criar conta ou Entrar
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#171717', padding: '56px 0 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 128px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '48px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <HeartLogo size={28} />
                <span style={{ fontSize: '18px', fontWeight: 600, color: colors.white }}>Cuidadores de Idosos</span>
              </div>
              <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>
                Cuidado com amor e dedicação para seus entes queridos.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: colors.white, margin: '0 0 16px' }}>Contato</h4>
              {['📞 (11) 1234-5678', '✉ contato@cuidadores.com.br', '🕐 Atendimento: 24 horas'].map(t => (
                <p key={t} style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 8px' }}>{t}</p>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: colors.white, margin: '0 0 16px' }}>Horários</h4>
              {['Seg a Sex: 24h', 'Sáb e Dom: 24h', 'Feriados: 24h'].map(t => (
                <p key={t} style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 8px' }}>{t}</p>
              ))}
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #374151', margin: '0 0 20px' }} />
          <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', margin: 0 }}>
            © 2026 Cuidadores de Idosos. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
