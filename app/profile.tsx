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
  educationSummary?: string;
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
    try {
      const el = document.getElementById("profile");
      if (!el) {
        alert("Profile element not found");
        return;
      }

      const originalBg = el.style.background;
      const originalBodyBg = document.body.style.background;
      const appEl = document.querySelector(".app") as HTMLElement | null;
      const originalAppBg = appEl ? appEl.style.background : "";

      document.body.style.background = "#ffffff";
      if (appEl) appEl.style.background = "#ffffff";
      el.style.background = "#ffffff";

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        allowTaint: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = (pdf as any).getImageProperties(imgData);
      const imgWidth = pageWidth - 10;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      if (imgHeight <= pageHeight - 10) {
        pdf.addImage(imgData, "PNG", 5, 5, imgWidth, imgHeight);
      } else {
        const ratio = canvas.width / imgWidth;
        const maxHeightPx = Math.round((pageHeight - 10) * ratio);

        let yPos = 0;
        let isFirstPage = true;

        while (yPos < canvas.height) {
          if (!isFirstPage) {
            pdf.addPage();
          }

          const sliceHeight = Math.min(maxHeightPx, canvas.height - yPos);
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceHeight;

          const ctx = sliceCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(
              canvas,
              0,
              yPos,
              canvas.width,
              sliceHeight,
              0,
              0,
              canvas.width,
              sliceHeight,
            );
          }

          const sliceImgData = sliceCanvas.toDataURL("image/png", 1.0);
          const sliceHeight_mm = sliceHeight / ratio;
          pdf.addImage(sliceImgData, "PNG", 5, 5, imgWidth, sliceHeight_mm);

          yPos += sliceHeight;
          isFirstPage = false;
        }
      }

      pdf.save("profile.pdf");

      el.style.background = originalBg;
      document.body.style.background = originalBodyBg;
      if (appEl) appEl.style.background = originalAppBg;
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
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
          </aside>
        </div>

        <section className="segment">
          <h3>Education</h3>
          <div className="edu-summary">{data.educationSummary}</div>
        </section>
      </div>
    </div>
  );
}
