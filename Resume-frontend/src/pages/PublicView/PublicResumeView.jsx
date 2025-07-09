import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FeedbackForm from "./FeedbackForm";

const PublicResumeView = () => {
  const { userId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/resume/shared/${userId}`
        );
        setResumeData(response.data);
      } catch (error) {
        console.error("Failed to fetch resume:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [userId]);

  if (loading) return <div className="text-white p-10">Loading resume...</div>;

  if (!resumeData)
    return <div className="text-red-400 p-10">Resume not found.</div>;

  const {
    personalInfo,
    skills,
    education,
    experience,
    projects,
    achievements,
  } = resumeData;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center">
        👤 Public Resume View
      </h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow mb-10">
        <h2 className="text-2xl font-bold mb-2">{personalInfo?.fullName}</h2>
        <p className="text-purple-300">{personalInfo?.email}</p>
        <p className="text-sm text-gray-400">{personalInfo?.phone}</p>
        <p className="text-sm text-gray-500">{personalInfo?.address}</p>
      </div>

      {skills?.length > 0 && (
        <Section title="Skills">
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <li key={i} className="bg-purple-700 px-3 py-1 rounded text-sm">
                {skill.name}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {education?.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-xl font-semibold">{edu.degree}</h3>
              <p className="text-purple-300">{edu.institute}</p>
              <p className="text-sm text-gray-400">
                {edu.startYear} - {edu.endYear}
              </p>
              {edu.score && <p className="text-sm">{edu.score}</p>}
            </div>
          ))}
        </Section>
      )}

      {experience?.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-xl font-semibold">{exp.role}</h3>
              <p className="text-purple-300">{exp.company}</p>
              <p className="text-sm text-gray-400">
                {exp.startDate} to {exp.endDate}
              </p>
              {exp.description && <p className="text-sm">{exp.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {projects?.length > 0 && (
        <Section title="Projects">
          {projects.map((project, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm">{project.description}</p>
              {Array.isArray(project.tech) && project.tech.length > 0 && (
                <p className="text-sm text-purple-200">
                  Tech: {project.tech.join(", ")}
                </p>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline text-sm"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </Section>
      )}

      {achievements?.length > 0 && (
        <Section title="Achievements">
          {achievements.map((ach, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-lg font-semibold">{ach.title}</h3>
              {ach.description && <p className="text-sm">{ach.description}</p>}
              {ach.date && <p className="text-sm text-gray-400">{ach.date}</p>}
            </div>
          ))}
        </Section>
      )}

      <div className="mt-12">
        <FeedbackForm userId={userId} />
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-purple-500 border-b border-purple-700 pb-2 mb-4">
      {title}
    </h2>
    {children}
  </div>
);

export default PublicResumeView;
