/** Re-mounted on every navigation: an ink sheet slides off the incoming page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="curtain" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0 0H1200V20C1130 20 1120 96 1060 96S1000 30 930 30 860 118 780 118 700 40 620 40 560 84 500 84 430 26 360 26 300 104 220 104 150 34 90 34 40 60 0 60Z" />
        </svg>
      </div>
      {children}
    </>
  );
}
