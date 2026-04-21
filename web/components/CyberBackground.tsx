export function CyberBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#08081a] to-[#0a0a1a]" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath fill='%2300f5ff' fill-opacity='0.4' d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5z'/%3E%3C/svg%3E")`,
          backgroundSize: "28px 49px",
        }}
      />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.35)_3px)] opacity-25" />
    </div>
  );
}
