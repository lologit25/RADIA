import career from "@/data/career.json";
import { pad } from "@/lib/projects";
import { SectionHead, T } from "./Bits";

/**
 * Education, laid out like the reference's numbered process block: oversized
 * dim titles that light up as they cross the middle of the screen, each with a
 * small accent number and a mono caption under a hairline.
 */
export function Education({ index, total }: { index: number; total: number }) {
  return (
    <section className="education" id="formacion">
      <SectionHead index={index} total={total} label={<T es="Formación" en="Education" />} />

      <header className="education-head">
        <span className="tag rv">
          <T es="Formación" en="Education" />
        </span>
        <h2 className="education-title">
          <span className="mask rv">
            <span>
              <T es="Dónde estudié." en="Where I studied." />
            </span>
          </span>
        </h2>
      </header>

      <ol className="edu-steps" data-focus>
        {career.education.map((item, i) => (
          <li key={item.place}>
            <h3>
              <sup>{pad(i + 1)}</sup>
              {item.place}
            </h3>
            <p>
              <T es={item.role.es} en={item.role.en} />
              <br />
              <T es={item.period.es} en={item.period.en} /> · {item.location}
              {"badge" in item && item.badge ? (
                <>
                  {" · "}
                  <span className="edu-now">
                    <T es={item.badge.es} en={item.badge.en} />
                  </span>
                </>
              ) : null}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
