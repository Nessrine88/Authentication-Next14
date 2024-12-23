"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify content type
        },
        body: JSON.stringify({
          user: { email, password },
        }),
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      // Retrieve the Authorization header from the response
      const authorizationHeader = response.headers.get("Authorization");
      const token = authorizationHeader?.split(" ")[1];
      if (token) {
        localStorage.setItem("token", token);
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect to logout page (or anywhere else)
      router.push("/tasks");

    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <span>Logging In...</span> // You can add a spinner here
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/registration" className="text-sm text-blue-500 hover:underline">
          You don&#39;t have an account?
          </Link>
        </div>

        <div className="text-center mt-2">
          <Link href="#" className="text-sm text-blue-500 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
