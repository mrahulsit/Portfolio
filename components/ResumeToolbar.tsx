"use client";

export default function ResumeToolbar() {
  return (
    <div className="resume-toolbar">
      <a className="back" href="/">
        ← Back to site
      </a>
      <button type="button" onClick={() => window.print()}>
        Download / Print PDF
      </button>
    </div>
  );
}
