import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// GET - Listar comentários
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const candidateId = searchParams.get("candidateId");
  const applicationId = searchParams.get("applicationId");

  let query = supabaseAdmin
    .from("internal_comments")
    .select("*, author:profiles(full_name)")
    .order("created_at", { ascending: false });

  if (candidateId) query = query.eq("candidate_id", candidateId);
  if (applicationId) query = query.eq("application_id", applicationId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - Criar comentário
export async function POST(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json();
  const { candidate_id, application_id, content } = body;

  if (!content) return NextResponse.json({ error: "Conteúdo obrigatório" }, { status: 400 });

  const { data, error } = await supabaseAdmin.from("internal_comments").insert({
    candidate_id: candidate_id || null,
    application_id: application_id || null,
    author_id: user.id,
    content,
  }).select("*, author:profiles(full_name)").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
