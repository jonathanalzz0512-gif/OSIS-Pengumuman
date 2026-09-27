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

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance / (1000 * 60 * 60)) % 24
      );
      const minutes = Math.floor(
        (distance / (1000 * 60)) % 60
      );
      const seconds = Math.floor(
        (distance / 1000) % 60
      );

      setTimeLeft(
        `${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik`
      );
    }

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [announcementTime]);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

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
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "#f3f6fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1>Pengumuman Seleksi OSIS</h1>

        <p>
          Website Pengumuman Seleksi Calon Pengurus OSIS
        </p>

        {!opened ? (
          <>
            <h2>Pengumuman Dibuka Dalam</h2>

            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                margin: "25px 0",
              }}
            >
              {timeLeft}
            </div>

            {error && (
              <p style={{ color: "red" }}>
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            <h2 style={{ color: "#2563eb" }}>
              Pengumuman Sudah Dibuka
            </h2>

            <p>Silakan masukkan ID peserta dan password.</p>

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="ID Peserta"
                value={pesertaId}
                onChange={(e) =>
                  setPesertaId(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {loading ? "Memeriksa..." : "Lihat Pengumuman"}
              </button>
            </form>

            {error && (
              <p style={{ color: "red", marginTop: "15px" }}>
                {error}
              </p>
            )}

            {result && (
              <div
                style={{
                  marginTop: "25px",
                  padding: "20px",
                  borderRadius: "12px",
                  background:
                    result.status === "LULUS"
                      ? "#dbeafe"
                      : "#fee2e2",
                }}
              >
                <h2>{result.nama}</h2>

                <p>
                  ID Peserta: {result.participant_id}
                </p>

                <p>
                  Kelas: {result.kelas}
                </p>

                <h2>{result.status}</h2>

                <p>{result.pernyataan}</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
