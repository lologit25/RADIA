import career from "@/data/career.json";
import { pad } from "@/lib/projects";
import { SectionHead, T } from "./Bits";

const tilts = [-3, 2.2, -1.6, 2.8];

/** Education as a cascade of glass cards that swing and drift with the scroll. */
export function Education({ index, total }: { index: number; total: number }) {
  return (
    <section className="education" id="formacion">
      <SectionHead index={index} total={total} label={<T es="Formación" en="Education" />} />
      <div className="education-grid">
        <div className="education-copy">
          <h2 className="education-title">
            <span className="mask rv">
              <span>
                <T es="Formación." en="Education." />
              </span>
            </span>
          </h2>
          <p className="mono-note rv">
            ({pad(career.education.length)} <T es="etapas" en="stages" />)
          </p>
        </div>
        <ol className="edu-cards">
          {career.education.map((item, i) => (
            <li
              key={item.place}
              className="edu-card-slot rv"
              style={{ "--i": i, "--tilt": `${tilts[i % tilts.length]}deg` } as React.CSSProperties}
            >
              <article className="edu-card" data-drift>
                <header>
                  <h3>{item.place}.</h3>
                  <span className="edu-card-num">[{pad(i + 1)}]</span>
                </header>
                <p className="edu-card-role">
                  <T es={item.role.es} en={item.role.en} />
                </p>
                <footer>
                  <span>
                    <T es={item.period.es} en={item.period.en} />
                  </span>
                  {"badge" in item && item.badge ? (
                    <span className="edu-card-badge">
                      <i />
                      <T es={item.badge.es} en={item.badge.en} />
                    </span>
                  ) : (
                    <span>{item.location}</span>
                  )}
                </footer>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
