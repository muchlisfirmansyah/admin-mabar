import type { Route } from "./+types/home";
import { MabarApp } from "../components/MabarApp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Mabar" },
    { name: "description", content: "Aplikasi admin mabar badminton" },
  ];
}

export default function Home() {
  return <MabarApp />;
}
