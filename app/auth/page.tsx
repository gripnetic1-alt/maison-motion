import Link from "next/link";
import { Brand } from "@/components/brand";
import { AuthShell } from "./auth-shell";

export default function AuthPage() { return <main className="auth-page"><aside className="auth-aside"><Link href="/"><Brand /></Link><div><p className="eyebrow">Le studio des lieux</p><h1 className="serif">On commence par<br /><em>une adresse.</em></h1><p>Créez votre espace et transformez votre prochaine série de photos en visite qui reste en tête.</p></div><p className="auth-quote">“Le bon film ne montre pas un bien. Il montre ce que la vie pourrait y être.”</p></aside><section className="auth-panel"><AuthShell /></section></main>; }
