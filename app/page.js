"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [announcementTime, setAnnouncementTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState("Memuat...");
  const [opened, setOpened] = useState(false);

  const [pesertaId, setPesertaId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        const response = await fetch("/api/pengumuman");
        const data = await response.json();

        if (!response.ok) {
          setError("Gagal memuat waktu pengumuman.");
          return;
        }

        setAnnouncementTime(
          new Date(data.waktu_pengumuman).getTime()
        );
      } catch {
        setError("Gagal terhubung ke server.");
      }
    }

    loadAnnouncement();
  }, []);

  useEffect(() => {
    if (!announcementTime) return;

    function updateCountdown() {
      const distance = announcementTime - Date.now();

      if (distance <= 0) {
        setOpened(true);
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
        `${days} : ${String(hours).padStart(2, "0")} : ${String(
          minutes
        ).padStart(2, "0")} : ${String(seconds).padStart(
          2,
          "0"
        )}`
      );
    }

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [announcementTime]);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          peserta_id: pesertaId,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login gagal.");
        return;
      }

      setResult(data.peserta);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

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
          background: "#fff",
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
            color: "#fff",
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

        {error && (
          <div
            style={{
              background: "#fff1f2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {!opened && !result && (
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
                marginTop: "12px",
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
              Silakan kembali setelah waktu pengumuman resmi.
            </p>
          </div>
        )}

        {opened && !result && (
          <form onSubmit={handleLogin}>
            <div style={{ textAlign: "left" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: "bold",
                  color: "#172033",
                }}
              >
                ID Peserta
              </label>

              <input
                value={pesertaId}
                onChange={(e) => setPesertaId(e.target.value)}
                placeholder="Masukkan ID peserta"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  marginBottom: "16px",
                  boxSizing: "border-box",
                  fontSize: "15px",
                }}
              />

              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: "bold",
                  color: "#172033",
                }}
              >
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  marginBottom: "20px",
                  boxSizing: "border-box",
                  fontSize: "15px",
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#1261d6",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {loading ? "Memeriksa..." : "Lihat Hasil Seleksi"}
              </button>
            </div>
          </form>
        )}

        {result && (
          <div>
            <div
              style={{
                background:
                  result.status === "LULUS"
                    ? "#eff6ff"
                    : "#fff1f2",
                borderRadius: "18px",
                padding: "25px 15px",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  color: "#6b7280",
                }}
              >
                HASIL SELEKSI
              </p>

              <h2
                style={{
                  margin: "0 0 18px",
                  fontSize: "34px",
                  color:
                    result.status === "LULUS"
                      ? "#1261d6"
                      : "#dc2626",
                }}
              >
                {result.status}
              </h2>

             
