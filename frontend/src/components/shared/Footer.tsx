function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted-foreground mx-auto flex h-16 max-w-6xl items-center justify-between px-4 font-mono text-xs md:px-0">
        <span>&copy; {new Date().getFullYear()} Motion Booth</span>
        <span>Keep the moment in motion.</span>
      </div>
    </footer>
  );
}

export default Footer;
