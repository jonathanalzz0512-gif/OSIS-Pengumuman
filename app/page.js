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

      const days = Math
