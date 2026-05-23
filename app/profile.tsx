"use client";

import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type ProfileType = {
  name: string;
  title: string;
  location: string;
  summary: string;
  summaryPoints?: string[];
  shortSummary?: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    years: string;
    bullets: string[];
  }>;
  projects?: Array<{
    name: string;
    years: string;
    description: string;
  }>;
  education: Array<{ school: string; degree: string; year: string }>;
  contact: {
    email: string;
    phone: string;
    linkedin?: string;
    location?: string;
  };
};

export default function ProfilePage() {
  const [data, setData] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((profileData) => {
        setData(profileData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setLoading(false);
      });
  }, []);

  async function downloadPDF() {
    const el = document.getElementById("profile");
    if (!el) return;

    const originalBg = el.style.background;
    const originalBodyBg = document.body.style.background;
    const appEl = document.querySelector(".app") as HTMLElement | null;
    const originalAppBg = appEl ? appEl.style.background : "";

    document.body.style.background = "#ffffff";
    if (appEl) appEl.style.background = "#ffffff";
    el.style.background = "#ffffff";

    const scaleFactor = Math.max(2, (window.devicePixelRatio || 1) * 2);
    const canvas = await html2canvas(el, {
      scale: scaleFactor,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageGap = 10;
    const printablePageHeight = Math.max(0, pageHeight - pageGap);

    const imgProps = (pdf as any).getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      const ratio = canvas.width / imgWidth;
      const sliceHeightPx = Math.round(printablePageHeight * ratio);
      const overlap = Math.round(40 * (scaleFactor / 2));

      const headingEls = Array.from(
        el.querySelectorAll("h1, h2, h3, h4, h5, h6"),
      ) as HTMLElement[];
      const headingTopsPx = headingEls.map((h) =>
        Math.round(h.offsetTop * scaleFactor),
      );

      let y = 0;
      while (y < canvas.height) {
        const slice = document.createElement("canvas");
        slice.width = canvas.width;

        let srcY = Math.max(0, y - overlap);
        const remainingFromSrc = canvas.height - srcY;
        let sH = Math.min(sliceHeightPx, remainingFromSrc);

        const sliceBottom = y + sH;
        const nearBottomThreshold = Math.round(80 * scaleFactor);
        const headingToMove = headingTopsPx.find(
          (ht) =>
            ht > y + Math.round(10 * scaleFactor) &&
            ht >= sliceBottom - nearBottomThreshold &&
            ht < sliceBottom,
        );

        if (headingToMove) {
          sH = Math.max(0, headingToMove - y - overlap);
          srcY = Math.max(0, y - overlap);
        }

        slice.height = sH;
        const ctx = slice.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high" as any;
        ctx.drawImage(
          canvas,
          0,
          srcY,
          canvas.width,
          sH,
          0,
          0,
          canvas.width,
          sH,
        );

        const pageData = slice.toDataURL("image/png");
        const destHeight = sH / ratio;
        pdf.addImage(pageData, "PNG", 0, 0, imgWidth, destHeight);
        y += sH || sliceHeightPx;
        if (y < canvas.height) pdf.addPage();
      }
    }

    pdf.save("profile.pdf");

    el.style.background = originalBg;
    document.body.style.background = originalBodyBg;
    if (appEl) appEl.style.background = originalAppBg;
  }

  if (loading) return <div className="loading">Loading profile…</div>;
  if (!data) return <div className="error">Failed to load profile.</div>;

  return (
    <div className="app">
      <div className="toolbar">
        <button className="btn" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      <div id="profile" className="profile-card">
        <div className="banner">
          <div className="banner-left">
            <h1 className="banner-name">{data.name}</h1>
            <p className="banner-title">{data.title}</p>
            <p className="banner-summary">
              {data.shortSummary || data.summary}
            </p>
          </div>

          <div className="banner-center">
            <div className="banner-photo">
              <div className="photo-initials">
                {data.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            </div>
          </div>

          <div className="banner-right">
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <span>{data.contact.phone}</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>{data.contact.location}</span>
            </div>
            {data.contact.linkedin && (
              <div className="contact-item">
                <span className="contact-icon">in</span>
                <a
                  href={data.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            )}
          </div>
        </div>
        <hr className="divider" />

        <section className="segment about">
          <h2>Summary</h2>
          {Array.isArray(data.summaryPoints) ? (
            <ul className="summary-points">
              {data.summaryPoints.map((p: string, i: number) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          ) : (
            <p>{data.summary}</p>
          )}
        </section>

        <div className="two-col">
          <div>
            <section className="segment">
              <h3>Experience</h3>
              {data.experience.map((e, idx) => (
                <div key={`${e.company}-${idx}`} className="exp-item">
                  <div className="exp-header">
                    <div>
                      <div className="role">{e.role}</div>
                      <div className="company">{e.company}</div>
                    </div>
                    <div className="exp-years">{e.years}</div>
                  </div>
                  <ul className="exp-bullets">
                    {e.bullets.map((b, i) => (
                      <li key={`${i}-${b}`}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>

          <aside>
            <section className="segment">
              <h3>Skills</h3>
              <ul className="skills">
                {data.skills.map((s) => (
                  <li key={s} className="skill-chip">
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            {data.projects && data.projects.length > 0 && (
              <section className="segment">
                <h3>Projects</h3>
                {data.projects.map((p, idx) => (
                  <div key={`${p.name}-${idx}`} className="project-item">
                    <div className="project-header">
                      <div className="project-name">{p.name}</div>
                      <div className="project-years">{p.years}</div>
                    </div>
                    <ul className="project-bullets">
                      <li>{p.description}</li>
                    </ul>
                  </div>
                ))}
              </section>
            )}

            <section className="segment">
              <h3>Education</h3>
              {data.education.map((e, idx) => (
                <div key={`${e.school}-${idx}`} className="edu-item">
                  {e.degree} - {e.year}, {e.school}
                </div>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
