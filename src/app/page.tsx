import Image from "next/image";
import ProductCard from "./components/ProductCard";
import UsersPage from "./users/page";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <div>
        <h1>Hello World</h1>
        <ProductCard />
        <div>
          <Link href="/users">
            <button>Go to Users Page</button>
          </Link>
        </div>
        <div>
          <Button variant="outline">Click Me</Button>
        </div>
      </div>
    </main>
  );
}
