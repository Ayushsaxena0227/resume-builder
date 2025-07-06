import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { auth } from "../../Firebase/firebase";

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
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "My_Resume",
    onBeforeGetContent: () =>
      new Promise((resolve) => setTimeout(resolve, 500)),
    onPrintError: (error) => console.log("Print failed:", error),
  });

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
        }

        .no-print {
          display: none !important;
        }

        .print-content {
          background-color: white !important;
          color: black !important;
        }
      }
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
          `http://localhost:5000/api/user/${userId}/resume`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResumeData(response.data);
      } catch (err) {
        console.error("Error fetching resume:", err);
      } finally {
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
        No resume data available.
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

  return (
    <div className="min-h-screen bg-[#0d081f] text-white px-6 md:px-24 py-10 font-sans">
      <div className="mb-6 flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-purple-600 to-pink-500 py-2 px-4 rounded-md text-white font-semibold hover:opacity-90 transition"
        >
          Download as PDF
        </button>
      </div>

      <div
        ref={componentRef}
        className="print-content"
        style={{ width: "100%", height: "fit-content" }}
      >
        <div className="text-center border-b border-purple-700 pb-4 mb-8">
          <h1 className="text-4xl font-bold">{personalInfo.fullName}</h1>
          <p className="text-lg text-purple-400">{personalInfo.email}</p>
          <p className="text-md text-gray-400">{personalInfo.phone}</p>
          <p className="text-sm text-gray-500">{personalInfo.address}</p>
        </div>

        <div className="space-y-10">
          <Section title="Skills">
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="bg-purple-700 px-3 py-1 rounded-md text-sm"
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Education">
            {education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                <p className="text-sm text-purple-300">{edu.institute}</p>
                <p className="text-sm text-gray-400">
                  {edu.startYear} - {edu.endYear}
                </p>
                <p className="text-sm">{edu.score}</p>
              </div>
            ))}
          </Section>

          <Section title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <h3 className="text-xl font-semibold">{exp.role}</h3>
                <p className="text-sm text-purple-300">{exp.company}</p>
                <p className="text-sm text-gray-400">
                  {exp.startDate} to {exp.endDate}
                </p>
                <p className="text-sm">{exp.description}</p>
              </div>
            ))}
          </Section>

          <Section title="Projects">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="mb-4">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-sm">{project.description}</p>
                  {Array.isArray(project.tech) && (
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
              ))
            ) : (
              <p className="text-gray-500 text-sm">No projects available.</p>
            )}
          </Section>

          <Section title="Achievements">
            {achievements.map((ach) => (
              <div key={ach.id} className="mb-4">
                <h3 className="text-lg font-semibold">{ach.title}</h3>
                <p className="text-sm">{ach.description}</p>
                <p className="text-sm text-gray-400">{ach.date}</p>
              </div>
            ))}
          </Section>
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
