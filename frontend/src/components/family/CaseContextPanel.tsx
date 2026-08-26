import Link from "next/link";
import {
  defaultPetitionGuidance,
} from "@/lib/case-context";
import { CaseRecord } from "@/lib/case-status";
import {
  KENYA_LAW_ABOUT,
  kenyaLawCauseListUrl,
  kenyaLawSearchUrl,
} from "@/lib/kenya-law";

export function CaseContextPanel({ caseRecord }: { caseRecord: CaseRecord }) {
  const searchUrl =
    caseRecord.kenya_law_url ?? kenyaLawSearchUrl(caseRecord.case_number);
  const petitionText =
    caseRecord.petition_guidance ??
    defaultPetitionGuidance(caseRecord.case_number);

  const hasContext =
    caseRecord.proceedings_summary ||
    caseRecord.last_ruling_summary ||
    caseRecord.sentence_outcome ||
    caseRecord.petition_guidance;

  return (
    <div className="space-y-6">
      <section className="site-panel p-6">
        <p className="site-mono-label text-xs">[ Case Context ]</p>
        <h2 className="mt-4 text-xl font-light text-site-on-dark">
          Proceedings & next steps
        </h2>
        <p className="mt-2 text-sm leading-7 text-site-on-dark-muted">
          Summaries are entered by court registry staff from official records.
          Kenya Law publishes judgments and laws — not live ongoing case files.
        </p>

        {hasContext ? (
          <dl className="mt-6 space-y-5 text-sm">
            {caseRecord.proceedings_summary ? (
              <div>
                <dt className="font-medium text-site-on-dark">
                  Recent proceedings
                </dt>
                <dd className="mt-2 leading-7 text-site-on-dark-muted">
                  {caseRecord.proceedings_summary}
                </dd>
              </div>
            ) : null}
            {caseRecord.last_ruling_summary ? (
              <div>
                <dt className="font-medium text-site-on-dark">
                  Last ruling / direction
                </dt>
                <dd className="mt-2 leading-7 text-site-on-dark-muted">
                  {caseRecord.last_ruling_summary}
                </dd>
              </div>
            ) : null}
            {caseRecord.sentence_outcome ? (
              <div>
                <dt className="font-medium text-site-on-dark">Sentence / outcome</dt>
                <dd className="mt-2 leading-7 text-site-on-dark-muted">
                  {caseRecord.sentence_outcome}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="font-medium text-site-on-dark">
                How to petition or appeal
              </dt>
              <dd className="mt-2 leading-7 text-site-on-dark-muted">
                {petitionText}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-6 text-sm leading-7 text-site-on-dark-muted">
            No detailed context has been added yet. General guidance on appeals
            and petitions is shown below. Ask the court clerk to update this
            record after the next hearing.
          </p>
        )}
      </section>

      <section className="site-panel p-6">
        <p className="site-mono-label text-xs">[ Kenya Law ]</p>
        <h2 className="mt-4 text-lg font-medium text-site-on-dark">
          {KENYA_LAW_ABOUT.title}
        </h2>
        <p className="mt-2 text-sm leading-7 text-site-on-dark-muted">
          {KENYA_LAW_ABOUT.description} Search for published judgments related
          to this case number, or browse cause lists and legislation.
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <li>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-site-mono underline underline-offset-4"
            >
              Search judgments for {caseRecord.case_number}
            </a>
          </li>
          <li>
            <a
              href={kenyaLawCauseListUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-site-mono underline underline-offset-4"
            >
              View court cause lists
            </a>
          </li>
          <li>
            <Link
              href="/rights"
              className="text-site-mono underline underline-offset-4"
            >
              Know your rights (HakiTrack)
            </Link>
          </li>
        </ul>
        <p className="mt-4 text-xs leading-5 text-site-on-dark-muted">
          Note: ongoing cases appear on Kenya Law mainly after a judgment is
          published. HakiTrack supplements that with clerk-updated hearing and
          bail information.
        </p>
      </section>
    </div>
  );
}
