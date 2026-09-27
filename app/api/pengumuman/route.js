import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pengaturan")
      .select("waktu_pengumuman")
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Gagal mengambil waktu pengumuman." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      waktu_pengumuman: data.waktu_pengumuman,
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
