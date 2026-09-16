"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export function AuthShell() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [submitted, setSubmitted] = useState(false);
  return <div className="auth-form"><p className="eyebrow">{mode === "signup" ? "Créer un espace" : "Ravi de vous revoir"}</p><h2 className="serif">{mode === "signup" ? "Votre studio vous attend." : "Retour au studio."}</h2><p>{mode === "signup" ? "Un aperçu gratuit. Pas de carte bancaire. Juste votre prochaine histoire." : "Retrouvez vos actifs, storyboards et films en cours."}</p>{submitted ? <div className="notice">Votre espace de démonstration est prêt. <Link href="/dashboard"><u>Ouvrir le dashboard →</u></Link></div> : <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><div className="form-field">{mode === "signup" && <><label htmlFor="name">Votre nom</label><input id="name" required placeholder="Marie Lambert" /></>}</div><div className="form-field"><label htmlFor="email">Adresse email</label><input id="email" type="email" required placeholder="vous@agence.fr" /></div><div className="form-field"><label htmlFor="password">Mot de passe</label><input id="password" type="password" minLength={8} required placeholder="8 caractères minimum" /></div><button className="button lime auth-submit" type="submit">{mode === "signup" ? "Créer mon espace" : "Se connecter"} <ArrowRight size={15} /></button></form>}<div className="auth-footnote">{mode === "signup" ? "Déjà un compte ? " : "Pas encore de compte ? "}<button className="text-link" style={{ border: 0, background: "none", padding: 0 }} onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setSubmitted(false); }}>{mode === "signup" ? "Se connecter" : "Créer un espace"}</button><br /><br />En continuant, vous acceptez nos conditions et notre politique de confidentialité.</div></div>;
}
