import { createClient as createServerClient } from "@/lib/supabase/server";
import { sendStageChangeEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { applicationId, newStage, note } = await request.json();

  if (!applicationId || !newStage) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  // Buscar dados da candidatura
  const { data: application } = await supabase
    .from("applications")
    .select(`
      *,
      candidate:candidates(
        profile:profiles(full_name, email)
      ),
      job:jobs(title)
    `)
    .eq("id", applicationId)
    .single();

  if (!application?.candidate?.profile?.email) {
    return NextResponse.json({ error: "Candidato não encontrado" }, { status: 404 });
  }

  // Enviar e-mail
  try {
    await sendStageChangeEmail(
      application.candidate.profile.email,
      application.candidate.profile.full_name,
      application.job.title,
      newStage,
      note
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
