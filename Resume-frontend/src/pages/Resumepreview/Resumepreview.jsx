import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { auth } from "../../Firebase/firebase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ShareModal from "./Sharemodal";

const ResumeLoader = () => {
  return (
    <div className="min-h-screen bg-[#0d081f] text-white px-6 md:px-24 py-10 font-sans animate-pulse">
      <div className="text-center border-b border-purple-700 pb-4 mb-8">
        <div className="h-10 bg-gray-600 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-5 bg-gray-700 rounded w-1/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/5 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4 mx-auto"></div>
      </div>

      <div className="space-y-10">
        <div className="mb-8">
          <div className="h-8 bg-gray-600 rounded w-1/6 mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-6 bg-purple-700 rounded-md w-20"
              ></div>
            ))}
          </div>
        </div>

        {Array.from({ length: 4 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <div className="h-8 bg-gray-600 rounded w-1/6 mb-4"></div>
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <div key={itemIndex} className="mb-4">
                <div className="h-6 bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ResumePreview = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef(null);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDownloadPdf = async () => {
    // console.log("Download button clicked.");
    const element = componentRef.current;

    if (!element) {
      console.error("Component ref is null. Cannot generate PDF.");
      return;
    }

    console.log("Generating PDF from element:", element);

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Increase scale for better resolution
        logging: true, // Enable logging for html2canvas
        useCORS: true, // Use CORS if your images are from other origins

        onclone: (clonedDocument) => {
          const clonedElement = clonedDocument.getElementById("resume-content");
          if (clonedElement) {
            console.log("Applying pdf-capture-styles to cloned element.");
            clonedElement.classList.add("pdf-capture-styles");
          } else {
            console.error("Cloned element with ID 'resume-content' not found.");
          }
        },
      });

      console.log("Canvas generated:", canvas);

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      const tolerance = 5; // Add a small tolerance (e.g., 5mm)
      while (heightLeft > tolerance) {
        position = position - pageHeight;
        pdf.addPage(); // Add a new page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight; // Decrease remaining height
      }

      pdf.save("my_resume.pdf");
      console.log("PDF saved successfully.");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 20mm;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background-color: white !important;
          color: black !important;
        }
        .no-print {
          display: none !important;
        }
        /* This class is for browser print, keep it */
        .print-content {
           background-color: white !important;
           color: black !important;
           /* Ensure padding is set correctly for browser print if needed, or rely on @page margin */
        }
      }

      /* --- Styles specifically for html2canvas capture using onclone --- */
      /* These styles are applied ONLY to the cloned element by the onclone function */
      .pdf-capture-styles {
         background-color: white !important; /* White background */
         color: black !important; /* Black text color */
         width: 210mm !important; /* Set width to A4 width */
         max-width: 210mm !important; /* Prevent overflow */
         padding: 20mm !important; /* Add A4 margins as padding */
         box-sizing: border-box !important; /* Include padding in width */
         /* Add any other overrides needed for the PDF appearance */

         /* Ensure Tailwind colors that are not black/white are overridden */
         /* You might need to adjust these selectors based on your actual compiled CSS */
         .pdf-capture-styles .text-purple-400 { color: #333 !important; }
         .pdf-capture-styles .text-gray-400 { color: #555 !important; }
         .pdf-capture-styles .text-gray-500 { color: #777 !important; }
         .pdf-capture-styles .text-blue-500 { color: blue !important; }
         /* Keep the purple chips */
         .pdf-capture-styles .bg-purple-700 { background-color: #8b5cf6 !important; color: white !important; }

         /* Important: Remove outer padding/margin from body/html if present */
         /* html, body { padding: 0 !important; margin: 0 !important; } */

         /* Break content if necessary - html2canvas doesn't fully support this, but doesn't hurt */
         /* break-inside: avoid; */
      }
      /* --- End NEW styles --- */
    `;
    document.head.appendChild(style);

    const fetchResume = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn("No user logged in");
          setResumeData(null);
          return;
        }
        const token = await user.getIdToken();
        const userId = user.uid;
        const response = await axios.get(
          `${baseURL}/api/user/${userId}/resume`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // console.log("Resume data fetched:", response.data);
        setResumeData(response.data);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setResumeData(null);
      } finally {
        console.log("Loading set to false");
        setLoading(false);
      }
    };

    fetchResume();

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return <ResumeLoader />;
  }

  if (!resumeData) {
    return (
      <div className="text-white text-center mt-10">
        No resume data available or failed to load.
      </div>
    );
  }

  const {
    personalInfo,
    skills,
    education,
    projects,
    achievements,
    experience,
  } = resumeData;

  if (!personalInfo) {
    return (
      <div className="text-white text-center mt-10">
        Resume data is incomplete: Missing personal info.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d081f] text-white px-6 md:px-24 py-10 font-sans">
      <div className="mb-6 flex justify-end no-print">
        <button
          className="bg-purple-600 px-4 py-2 text-white rounded-md mr-4"
          onClick={() => setIsModalOpen(true)}
        >
          🔗 Share Resume for Feedback
        </button>
        <button
          onClick={handleDownloadPdf}
          className="bg-gradient-to-r from-purple-600 to-pink-500 py-2 px-4 rounded-md text-white font-semibold hover:opacity-90 transition"
        >
          Download as PDF
        </button>
      </div>
      <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div
        ref={componentRef}
        id="resume-content"
        className="print-content"
        style={{ width: "100%", height: "fit-content" }}
      >
        <div className="text-center border-b border-purple-700 pb-4 mb-8">
          <h1 className="text-4xl font-bold">
            {personalInfo?.fullName || "N/A"}
          </h1>
          <p className="text-lg text-purple-400">
            {personalInfo?.email || "N/A"}
          </p>
          <p className="text-md text-gray-400">
            {personalInfo?.phone || "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            {personalInfo?.address || "N/A"}
          </p>
        </div>

        <div className="space-y-10">
          {skills && skills.length > 0 && (
            <Section title="Skills">
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <li
                    key={skill.id || index}
                    className="bg-purple-700 px-3 py-1 rounded-md text-sm"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {education && education.length > 0 && (
            <Section title="Education">
              {education.map((edu, index) => (
                <div key={edu.id || index} className="mb-4">
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <p className="text-sm text-purple-300">{edu.institute}</p>
                  <p className="text-sm text-gray-400">
                    {edu.startYear} - {edu.endYear}
                  </p>
                  {edu.score && <p className="text-sm">{edu.score}</p>}
                </div>
              ))}
            </Section>
          )}

          {experience && experience.length > 0 && (
            <Section title="Experience">
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="mb-4">
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  <p className="text-sm text-purple-300">{exp.company}</p>
                  <p className="text-sm text-gray-400">
                    {exp.startDate} to {exp.endDate}
                  </p>
                  {exp.description && (
                    <p className="text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {projects && projects.length > 0 ? (
            <Section title="Projects">
              {projects.map((project, index) => (
                <div key={project.id || index} className="mb-4">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm">{project.description}</p>
                  )}
                  {Array.isArray(project.tech) && project.tech.length > 0 && (
                    <p className="text-sm text-purple-300">
                      Tech: {project.tech.join(", ")}
                    </p>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm"
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </Section>
          ) : (
            <Section title="Projects">
              <p className="text-gray-500 text-sm">No projects available.</p>
            </Section>
          )}

          {achievements && achievements.length > 0 && (
            <Section title="Achievements">
              {achievements.map((ach, index) => (
                <div key={ach.id || index} className="mb-4">
                  <h3 className="text-lg font-semibold">{ach.title}</h3>
                  {ach.description && (
                    <p className="text-sm">{ach.description}</p>
                  )}
                  {ach.date && (
                    <p className="text-sm text-gray-400">{ach.date}</p>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-2xl font-bold text-purple-500 border-b border-purple-700 pb-2 mb-4">
      {title}
    </h2>
    {children}
  </div>
);

export default ResumePreview;
