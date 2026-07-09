import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "SuperAção RH <noreply@superacaorh.com.br>";

export async function POST(request: Request) {
  const { email, name, role } = await request.json();

  if (!email || !name) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const isCandidato = role === "candidato";

  const content = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: #142033; padding: 24px; text-align: center;">
        <h1 style="color: #c9a563; margin: 0; font-size: 20px;">SuperAção RH</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 12px;">Gestão em Recrutamento</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #142033; margin: 0 0 16px;">Bem-vindo(a), ${name.split(" ")[0]}! 🎉</h2>
        <p style="color: #3d4652; font-size: 15px;">
          Sua conta foi criada com sucesso no sistema SuperAção RH.
        </p>
        ${isCandidato ? `
          <div style="background: #f5f5f5; padding: 16px; margin: 24px 0; border-radius: 8px;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #142033; font-weight: bold;">Próximos passos:</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #4b5563;">1. Preencha seu currículo completo</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #4b5563;">2. Adicione suas experiências e habilidades</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #4b5563;">3. Candidate-se às vagas disponíveis</p>
            <p style="margin: 0; font-size: 13px; color: #4b5563;">4. Acompanhe o andamento pelo portal</p>
          </div>
          <a href="https://www.superacaorh.com.br/candidato/curriculo" style="display: inline-block; background: #142033; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
            Preencher meu currículo
          </a>
        ` : `
          <div style="background: #f5f5f5; padding: 16px; margin: 24px 0; border-radius: 8px;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #142033; font-weight: bold;">Como empresa parceira você pode:</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #4b5563;">• Acompanhar suas vagas em andamento</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #4b5563;">• Ver os candidatos pré-selecionados</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #4b5563;">• Acompanhar SLA e métricas</p>
            <p style="margin: 0; font-size: 13px; color: #4b5563;">• Consultar histórico de contratações</p>
          </div>
          <a href="https://www.superacaorh.com.br/parceiro" style="display: inline-block; background: #142033; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
            Acessar portal do parceiro
          </a>
        `}
        <p style="color: #7d8086; font-size: 13px; margin-top: 24px;">
          Qualquer dúvida, entre em contato conosco pelo site ou WhatsApp.
        </p>
      </div>
      <div style="background: #f5f5f5; padding: 16px 24px; text-align: center; font-size: 12px; color: #7d8086;">
        <p>SuperAção RH · www.superacaorh.com.br</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Bem-vindo(a) à SuperAção RH, ${name.split(" ")[0]}!`,
      html: content,
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
