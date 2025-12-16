export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-20 bg-background">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo-lex-intelligentia.jpeg" 
              alt="Lex Intelligentia" 
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold lex-gradient-text">Lex Intel Visual Design</p>
              <p className="text-xs text-muted-foreground">
                Desenvolvido por <span className="text-primary">Lex Intelligentia</span>
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              Transformando petições jurídicas com Visual Law e Legal Design
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © {new Date().getFullYear()} Lex Intelligentia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
