import { T } from "./Bits";

const Row = ({ outline }: { outline?: boolean }) => (
  <p className={`band-row${outline ? " is-outline" : ""}`}>
    {Array.from({ length: 6 }, (_, i) => (
      <span key={i}>
        <T es="Redacción creativa" en="Creative copywriting" />
        <i />
      </span>
    ))}
  </p>
);

/** Two rows of oversized type that slide in opposite directions with the scroll. */
export function Band() {
  return (
    <div className="band" data-slide aria-hidden="true">
      <Row />
      <Row outline />
    </div>
  );
}
