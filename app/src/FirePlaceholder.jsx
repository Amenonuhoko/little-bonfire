// Stand-in for the animated bonfire canvas (embers/stars/flame).
// Replaced with the real canvas render in the next pass.
export default function FirePlaceholder() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 50% 68%, rgba(255,140,50,.22) 0%, rgba(120,80,40,.05) 30%, transparent 60%), linear-gradient(180deg,#04050a 0%,#080a10 60%,#0a0c11 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '68%',
          width: 40,
          height: 40,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffdc98 0%, #ff8f2e 45%, transparent 75%)',
          animation: 'ddGlow 2.4s ease-in-out infinite',
        }}
      />
    </div>
  );
}
