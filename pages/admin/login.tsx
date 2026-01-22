import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("admin_auth", "true");
        router.push("/admin");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 pb-2">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-default-500">Portfolio Admin Panel</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              label="Password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              errorMessage={error}
              isInvalid={!!error}
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
            >
              Login
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
