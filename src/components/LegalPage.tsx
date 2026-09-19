import { ReactNode } from "react";

interface Props {
  title: string;
  updated: string;
  children: ReactNode;
}

export default function LegalPage({ title, updated, children }: Props) {
  return (
    <section className="wrap legal-page">
      <div className="legal-card glass-rim">
        <div className="legal-head">
          <h1>{title}</h1>
          <span className="legal-updated">시행일: {updated}</span>
        </div>
        <div className="legal-body">{children}</div>
      </div>
    </section>
  );
}