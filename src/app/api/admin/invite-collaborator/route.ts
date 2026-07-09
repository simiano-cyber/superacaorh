import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Verificar se o usuário logado é admin
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  // Pegar dados do body
  const { email, full_name } = await request.json();

  if (!email || !full_name) {
    return NextResponse.json({ error: "E-mail e nome são obrigatórios" }, { status: 400 });
  }

  // Usar service role para criar o usuário
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Gerar senha temporária
  const tempPassword = Math.random().toString(36).slice(-10) + "A1!";

  // Criar usuário
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      full_name,
      role: "admin",
    },
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // Criar profile como admin
  if (newUser.user) {
    await supabaseAdmin.from("profiles").upsert({
      id: newUser.user.id,
      role: "admin",
      full_name,
      email,
    });
  }

  // Enviar link de reset de senha (para o colaborador definir sua própria senha)
  await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  return NextResponse.json({
    success: true,
    message: `Colaborador ${full_name} criado. Um e-mail de definição de senha será enviado.`,
    tempPassword, // Exibir temporariamente para o admin passar ao colaborador
  });
}
