import { Button } from "@/components/ui/button";
import { Scale, Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <Scale className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Lex Intel Visual Design</h1>
                <p className="text-xs text-muted-foreground">Desenvolvido por Lex Intelligentia</p>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/templates" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
              Templates
            </Link>
            <Link href="/my-petitions" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
              Minhas Petições
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleTheme} title={`Alternar para modo ${theme === "dark" ? "claro" : "escuro"}`}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/templates">
              <Button>Começar Agora</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
