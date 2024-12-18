// components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Set initial loading state

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      setLoading(false); 
      router.push("/tasks"); // Redirect to login if no token

    }
  }, [router]);

  if (loading) {
    return <div></div>; // Show loading state while checking
  }

  return <>{children}</>; // Render protected content once token is validated
};

export default ProtectedRoute;
