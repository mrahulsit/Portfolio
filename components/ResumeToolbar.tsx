"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function ResumeToolbar() {
  return (
    <div className="resume-toolbar">
      <Link className="back" href="/">
        <FaArrowLeft size={11} aria-hidden /> Back to site
      </Link>
      <button type="button" onClick={() => window.print()}>
        Download / Print PDF
      </button>
    </div>
  );
}
