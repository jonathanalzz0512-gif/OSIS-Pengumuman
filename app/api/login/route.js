import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function POST(request) {
  try {
    const { peserta_id, password } = await request.json();

    if (!peserta_id || !password) {
      return NextResponse.json(
        { error: "ID peserta dan password wajib diisi." },
        { status: 400 }
      );
    }

    const { data: pengaturan, error: pengaturanError } =
      await supabase
        .from("pengaturan")
        .select("waktu_pengumuman")
        .limit(1)
        .single();

    if (pengaturanError) {
      return NextResponse.json(
        { error: "Pengaturan pengumuman tidak ditemukan." },
        { status: 500 }
      );
    }

    const waktuPengumuman = new Date(
      pengaturan.waktu_pengumuman
    ).getTime();

    if (Date.now() < waktuPengumuman) {
      return NextResponse.json(
        {
          error:
            "Pengumuman belum dibuka. Silakan kembali sesuai waktu yang ditentukan.",
        },
        { status: 403 }
      );
    }

    const { data: peserta, error: pesertaError } = await supabase
      .from("peserta")
      .select("nama, kelas, peserta_id, password, status, pernyataan")
      .eq("peserta_id", peserta_id)
      .eq("password", password)
      .single();

    if (pesertaError || !peserta) {
      return NextResponse.json(
        { error: "ID peserta atau password salah." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      peserta: {
        nama: peserta.nama,
        kelas: peserta.kelas,
        peserta_id: peserta.peserta_id,
        status: peserta.status,
        pernyataan: peserta.pernyataan,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
