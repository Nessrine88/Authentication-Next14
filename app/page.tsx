import Link from "next/link";
import Hero from "./components/Hero";
export default function Home() {
  return (
    <div className=" font-[family-name:var(--font-geist-sans)] pt-28">
     <h1>Welcome to my app</h1>
     <Link href="/login">Login</Link>
     <Link href="/registration">Register</Link>
     <Hero />
    </div>
  );
}
