"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Home() {
  const [announcementTime, setAnnouncementTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState("Memuat...");

  useEffect(() => {
    async function getAnnouncementTime() {
      const { data, error } = await supabase
        .from("pengaturan")
        .select("waktu_pengumuman")
        .limit(1)
        .single();

      if (error) {
        console.error(error);
        setTimeLeft("Gagal memuat waktu pengumuman");
        return;
      }

      setAnnouncementTime(new Date(data.waktu_pengumuman).getTime());
    }

    getAnnouncementTime();
  }, []);

  useEffect(() => {
    if (!announcementTime) return;

    function updateCountdown() {
      const now = Date.now();
      const distance = announcementTime - now;

      if (distance <= 0) {
        setTimeLeft("PENGUMUMAN SUDAH DIBUKA");
        return;
      }

      const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
          (1000 * 60)
      );

      const seconds = Math.floor(
        (distance % (1000 * 60)) / 1000
      );

      setTimeLeft(
        `${days} : ${hours
          .toString()
          .padStart(2, "0")} : ${minutes
          .toString()
          .padStart(2, "0")} : ${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [announcementTime]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef5ff, #ffffff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "35px 25px",
          textAlign: "center",
          boxShadow: "0 15px 45px rgba(0,0,0,0.10)",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "20px",
            background: "#1261d6",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
            fontSize: "25px",
            fontWeight: "bold",
          }}
        >
          OS
        </div>

        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "27px",
            color: "#172033",
          }}
        >
          Pengumuman Seleksi OSIS
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
            marginBottom: "30px",
          }}
        >
          Hasil Seleksi Calon Pengurus OSIS
        </p>

        <div
          style={{
            background: "#eef5ff",
            borderRadius: "18px",
            padding: "25px 15px",
          }}
        >
          <p
            style={{
              color: "#1261d6",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            PENGUMUMAN AKAN DIBUKA DALAM
          </p>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#172033",
              letterSpacing: "2px",
            }}
          >
            {timeLeft}
          </div>

          <p
            style={{
              marginTop: "12px",
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            Waktu pengumuman ditentukan oleh panitia
          </p>
        </div>

        <p
          style={{
            marginTop: "25px",
            fontSize: "13px",
            color: "#7a8394",
            lineHeight: "1.6",
          }}
        >
          Hasil seleksi dapat dilihat setelah waktu
          pengumuman resmi dibuka.
        </p>
      </div>
    </main>
  );
}
