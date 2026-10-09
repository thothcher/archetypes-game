import Link from "next/link";

export const metadata = { title: "Not found · ვერ მოიძებნა", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <p className="mono dim">404</p>
      <h1 className="display">
        Lost in the <em>unconscious.</em>
      </h1>
      <p lang="ka" className="nf-ka">
        არაცნობიერში დაიკარგე.
      </p>
      <div className="end-actions">
        <Link className="cta" href="/">
          Back to the vessel
        </Link>
        <Link className="cta ghost" href="/ka/" lang="ka">
          ჭურჭელთან დაბრუნება
        </Link>
      </div>
    </main>
  );
}
