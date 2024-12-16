import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className=" font-[family-name:var(--font-geist-sans)]">
     <h1>Welcome to my app</h1>
     <Link href="/login">Login</Link>
     <Link href="/registration">Register</Link>
    </div>
  );
}
