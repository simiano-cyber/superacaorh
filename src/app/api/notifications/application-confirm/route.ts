import { createClient as createServerClient } from "@/lib/supabase/server";
import { sendApplicationConfirmation } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { jobId } = await request.json();

  if (!jobId) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  // Buscar dados
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { data: job } = await supabase
    .from("jobs")
    .select("title, partner:partners(company_name)")
    .eq("id", jobId)
    .single();

  if (!profile?.email || !job) {
    return NextResponse.json({ error: "Dados não encontrados" }, { status: 404 });
  }

  try {
    await sendApplicationConfirmation(
      profile.email,
      profile.full_name,
      job.title,
      (job.partner as any)?.company_name
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
