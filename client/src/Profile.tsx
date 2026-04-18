import React, { useEffect, useState } from "react";
import axios from "axios";
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
  education: Array<{ school: string; degree: string; year: string }>;
  contact: {
    email: string;
    phone: string;
    linkedin?: string;
    location?: string;
  };
};

export default function Profile() {
  const [data, setData] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<ProfileType>("/api/profile")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function downloadPDF() {
    const el = document.getElementById("profile");
    if (!el) return;
    const originalBg = el.style.background;
    el.style.background = "#ffffff";
    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = (pdf as any).getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      const ratio = canvas.width / imgWidth;
      const sliceHeightPx = Math.round(pageHeight * ratio);
      let y = 0;
      while (y < canvas.height) {
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = Math.min(sliceHeightPx, canvas.height - y);
        const ctx = slice.getContext("2d")!;
        ctx.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          slice.height,
          0,
          0,
          canvas.width,
          slice.height,
        );
        const pageData = slice.toDataURL("image/png");
        pdf.addImage(pageData, "PNG", 0, 0, imgWidth, pageHeight);
        y += slice.height;
        if (y < canvas.height) pdf.addPage();
      }
    }
    pdf.save("profile.pdf");
    el.style.background = originalBg;
  }

  if (loading) return <div>Loading profile…</div>;
  if (!data) return <div>Failed to load profile.</div>;

  return (
    <div>
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
              {(data as any).shortSummary ?? data.summary}
            </p>
          </div>

          <div className="banner-center">
            <div className="banner-photo">
              {/* show photo if provided, otherwise initials */}
              {(data as any).photo ? (
                <img src={(data as any).photo} alt={data.name} />
              ) : (
                <div className="photo-initials">
                  {data.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
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
            <div className="contact-item">
              <span className="contact-icon">in</span>
              <a href={data.contact.linkedin} target="_blank" rel="noreferrer">
                {data.contact.linkedin}
              </a>
            </div>
          </div>
        </div>
        <hr className="divider" />

        <section className="segment about">
          <h2>Summary</h2>
          {Array.isArray((data as any).summaryPoints) ? (
            <ul className="summary-points">
              {(data as any).summaryPoints.map((p: string, i: number) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          ) : (
            <p>{data.summary}</p>
          )}
        </section>

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
        <section className="segment">
          <h3>Education</h3>
          {data.education.map((e, idx) => (
            <div key={`${e.school}-${idx}`} className="edu-item">
              {e.degree} - {e.year}, {e.school}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
