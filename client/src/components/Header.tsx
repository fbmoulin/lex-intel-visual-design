import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src="/images/logo-lex-intelligentia.jpeg" 
                alt="Lex Intelligentia" 
                className="h-10 w-10 object-contain rounded-lg"
              />
              <span className="text-lg font-bold lex-gradient-text hidden sm:block">
                Lex • Intelligentia
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/templates" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden md:block">
              Templates
            </Link>
            <Link href="/my-petitions" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden md:block">
              Minhas Petições
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              title={`Alternar para modo ${theme === "dark" ? "claro" : "escuro"}`}
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/templates">
              <Button className="lex-button">Começar Agora</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
