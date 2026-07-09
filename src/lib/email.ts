import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "SuperAção RH <noreply@superacaorh.com.br>";

// Templates de e-mail
function baseTemplate(content: string) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: #142033; padding: 24px; text-align: center;">
        <h1 style="color: #c9a563; margin: 0; font-size: 20px;">SuperAção RH</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 12px;">Gestão em Recrutamento</p>
      </div>
      <div style="padding: 32px 24px;">
        ${content}
      </div>
      <div style="background: #f5f5f5; padding: 16px 24px; text-align: center; font-size: 12px; color: #7d8086;">
        <p>SuperAção RH · www.superacaorh.com.br</p>
        <p>Este é um e-mail automático, não responda.</p>
      </div>
    </div>
  `;
}

// E-mail: Candidato mudou de etapa
export async function sendStageChangeEmail(
  to: string,
  candidateName: string,
  jobTitle: string,
  newStage: string,
  note?: string
) {
  const stageLabels: Record<string, string> = {
    triagem: "Triagem",
    entrevista_rh: "Entrevista RH",
    entrevista_cliente: "Entrevista com o Cliente",
    teste_tecnico: "Teste Técnico",
    aprovado: "Aprovado",
    contratado: "Contratado",
    reprovado: "Processo encerrado",
  };

  const label = stageLabels[newStage] || newStage;
  const isPositive = !["reprovado", "desistente"].includes(newStage);

  const content = baseTemplate(`
    <h2 style="color: #142033; margin: 0 0 16px;">Olá, ${candidateName.split(" ")[0]}!</h2>
    <p style="color: #3d4652; font-size: 15px;">
      Temos uma atualização sobre sua candidatura para a vaga de <strong>${jobTitle}</strong>.
    </p>
    <div style="background: ${isPositive ? "#f0fdf4" : "#fef2f2"}; border-left: 4px solid ${isPositive ? "#3d4f35" : "#dc2626"}; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #142033;">
        <strong>Nova etapa:</strong> ${label}
      </p>
      ${note ? `<p style="margin: 8px 0 0; font-size: 13px; color: #4b5563;">${note}</p>` : ""}
    </div>
    ${isPositive
      ? `<p style="color: #3d4652; font-size: 14px;">Parabéns pelo avanço! Continue acompanhando pelo portal.</p>`
      : `<p style="color: #3d4652; font-size: 14px;">Agradecemos sua participação no processo. Continue acompanhando novas oportunidades pelo portal.</p>`
    }
    <a href="https://www.superacaorh.com.br/login" style="display: inline-block; background: #142033; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
      Acessar minha conta
    </a>
  `);

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${isPositive ? "✓" : "•"} Atualização: ${jobTitle} — ${label}`,
    html: content,
  });
}

// E-mail: Confirmação de candidatura
export async function sendApplicationConfirmation(
  to: string,
  candidateName: string,
  jobTitle: string,
  companyName?: string
) {
  const content = baseTemplate(`
    <h2 style="color: #142033; margin: 0 0 16px;">Candidatura confirmada!</h2>
    <p style="color: #3d4652; font-size: 15px;">
      Olá, ${candidateName.split(" ")[0]}! Sua candidatura foi registrada com sucesso.
    </p>
    <div style="background: #f5f5f5; padding: 16px; margin: 24px 0; border-radius: 8px;">
      <p style="margin: 0; font-size: 14px; color: #142033;"><strong>Vaga:</strong> ${jobTitle}</p>
      ${companyName ? `<p style="margin: 4px 0 0; font-size: 13px; color: #4b5563;">Empresa: ${companyName}</p>` : ""}
    </div>
    <p style="color: #3d4652; font-size: 14px;">
      Acompanhe o andamento da sua candidatura pelo portal. Boa sorte!
    </p>
    <a href="https://www.superacaorh.com.br/candidato/candidaturas" style="display: inline-block; background: #142033; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
      Ver minhas candidaturas
    </a>
  `);

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `✓ Candidatura registrada: ${jobTitle}`,
    html: content,
  });
}

// E-mail: Entrevista agendada
export async function sendInterviewScheduled(
  to: string,
  candidateName: string,
  jobTitle: string,
  date: string,
  time: string,
  location?: string,
  interviewType?: string
) {
  const content = baseTemplate(`
    <h2 style="color: #142033; margin: 0 0 16px;">Entrevista agendada!</h2>
    <p style="color: #3d4652; font-size: 15px;">
      Olá, ${candidateName.split(" ")[0]}! Uma entrevista foi marcada para você.
    </p>
    <div style="background: #fffbeb; border-left: 4px solid #c9a563; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #142033;"><strong>Vaga:</strong> ${jobTitle}</p>
      ${interviewType ? `<p style="margin: 4px 0 0; font-size: 13px; color: #4b5563;">Tipo: ${interviewType}</p>` : ""}
      <p style="margin: 4px 0 0; font-size: 13px; color: #4b5563;">📅 Data: ${date}</p>
      <p style="margin: 4px 0 0; font-size: 13px; color: #4b5563;">🕐 Horário: ${time}</p>
      ${location ? `<p style="margin: 4px 0 0; font-size: 13px; color: #4b5563;">📍 Local: ${location}</p>` : ""}
    </div>
    <p style="color: #3d4652; font-size: 14px;">
      Prepare-se e boa sorte! Em caso de dúvidas, entre em contato conosco.
    </p>
  `);

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `📅 Entrevista agendada: ${jobTitle}`,
    html: content,
  });
}

// E-mail: Boas-vindas ao novo colaborador
export async function sendWelcomeCollaborator(
  to: string,
  name: string,
  tempPassword: string
) {
  const content = baseTemplate(`
    <h2 style="color: #142033; margin: 0 0 16px;">Bem-vindo(a) à equipe!</h2>
    <p style="color: #3d4652; font-size: 15px;">
      Olá, ${name.split(" ")[0]}! Sua conta de colaborador no sistema SuperAção RH foi criada.
    </p>
    <div style="background: #f5f5f5; padding: 16px; margin: 24px 0; border-radius: 8px;">
      <p style="margin: 0; font-size: 14px; color: #142033;"><strong>E-mail:</strong> ${to}</p>
      <p style="margin: 4px 0 0; font-size: 14px; color: #142033;"><strong>Senha temporária:</strong> ${tempPassword}</p>
    </div>
    <p style="color: #dc2626; font-size: 13px;">⚠ Troque sua senha no primeiro acesso.</p>
    <a href="https://www.superacaorh.com.br/login" style="display: inline-block; background: #142033; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
      Acessar o sistema
    </a>
  `);

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "🔑 Sua conta no SuperAção RH foi criada",
    html: content,
  });
}
