"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Input } from "@/features/ui";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      body: JSON.stringify({ email, name, password }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "회원가입에 실패했습니다.");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="clay-card floating-widget p-8">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="이름"
            placeholder="홍길동"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="이메일"
            placeholder="you@example.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="비밀번호"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            className="w-full"
            disabled={loading}
            size="lg"
            type="submit"
          >
            {loading ? "가입 중..." : "가입하기"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          이미 계정이 있으신가요?{" "}
          <Link
            className="text-foreground font-medium hover:underline"
            href="/login"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
