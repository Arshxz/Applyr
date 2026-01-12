"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from '@/components/Header';

interface Profile {
  id: string;
  resume_data: string | null;
  resume_name: string | null;
  resume_type: string | null;
  skills: string[];
  experience: Experience[] | null;
  education: Education[] | null;
  location: string | null;
}

interface Experience {
  id?: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
}

interface Education {
  id?: string;
  institution: string;
  qualification: string;
  startDate: string;
  endDate: string;
}

const QUALIFICATIONS = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Professional Certificate",
  "Other",
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [location, setLocation] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  // Modal states
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );

  // Form states for modals
  const [expForm, setExpForm] = useState({
    company: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  });

  const [eduForm, setEduForm] = useState({
    institution: "",
    qualification: QUALIFICATIONS[2], // Default to Bachelor's
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);
      setSkills(data.skills || []);
      setLocation(data.location || "");
      setExperiences(data.experience || []);
      setEducations(data.education || []);
      if (data.resume_data) {
        setResumeBase64(data.resume_data);
        setResumeFileName(data.resume_name || "resume.pdf");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data:application/pdf;base64, prefix
      const base64Data = base64String.split(",")[1];
      setResumeBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const openExperienceModal = (exp?: Experience) => {
    if (exp) {
      setEditingExperience(exp);
      setExpForm({
        company: exp.company,
        description: exp.description,
        startDate: exp.startDate,
        endDate: exp.endDate,
        location: exp.location,
      });
    } else {
      setEditingExperience(null);
      setExpForm({
        company: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
      });
    }
    setShowExperienceModal(true);
  };

  const closeExperienceModal = () => {
    setShowExperienceModal(false);
    setEditingExperience(null);
    setExpForm({
      company: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
    });
  };

  const saveExperience = () => {
    if (
      !expForm.company ||
      !expForm.description ||
      !expForm.startDate ||
      !expForm.endDate ||
      !expForm.location
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (editingExperience) {
      // Update existing
      setExperiences(
        experiences.map((exp) =>
          exp.id === editingExperience.id ? { ...expForm, id: exp.id } : exp
        )
      );
    } else {
      // Add new
      setExperiences([
        ...experiences,
        { ...expForm, id: Date.now().toString() },
      ]);
    }
    closeExperienceModal();
  };

  const deleteExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const openEducationModal = (edu?: Education) => {
    if (edu) {
      setEditingEducation(edu);
      setEduForm({
        institution: edu.institution,
        qualification: edu.qualification,
        startDate: edu.startDate,
        endDate: edu.endDate,
      });
    } else {
      setEditingEducation(null);
      setEduForm({
        institution: "",
        qualification: QUALIFICATIONS[2],
        startDate: "",
        endDate: "",
      });
    }
    setShowEducationModal(true);
  };

  const closeEducationModal = () => {
    setShowEducationModal(false);
    setEditingEducation(null);
    setEduForm({
      institution: "",
      qualification: QUALIFICATIONS[2],
      startDate: "",
      endDate: "",
    });
  };

  const saveEducation = () => {
    if (
      !eduForm.institution ||
      !eduForm.qualification ||
      !eduForm.startDate ||
      !eduForm.endDate
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (editingEducation) {
      // Update existing
      setEducations(
        educations.map((edu) =>
          edu.id === editingEducation.id ? { ...eduForm, id: edu.id } : edu
        )
      );
    } else {
      // Add new
      setEducations([...educations, { ...eduForm, id: Date.now().toString() }]);
    }
    closeEducationModal();
  };

  const deleteEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        skills,
        experience: experiences.length > 0 ? experiences : null,
        education: educations.length > 0 ? educations : null,
        location: location.trim() || null,
      };

      // Only include resume if a new one was uploaded
      if (resumeBase64 && resumeFileName) {
        payload.resume_data = resumeBase64;
        payload.resume_name = resumeFileName;
        payload.resume_type = "application/pdf";
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to save profile");
        return;
      }

      const data = await res.json();
      setProfile(data);
      // Update resume state from server response
      if (data.resume_data) {
        setResumeBase64(data.resume_data);
        setResumeFileName(data.resume_name || "resume.pdf");
      }
      setResumeFile(null);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600">
            Manage your profile information for job applications
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume (PDF only, max 5MB)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {resumeFileName && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {resumeFileName}
                {resumeBase64 && (
                  <span className="ml-2 text-green-600">✓ Ready to save</span>
                )}
              </p>
            )}
            {profile?.resume_name && !resumeFileName && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">
                  Current resume: {profile.resume_name}
                </p>
                <a
                  href="/api/profile/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                >
                  View/Download Resume ↗
                </a>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, CA or Remote"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add a skill (e.g., JavaScript, React, Python)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {skills.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No skills added yet</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Experience
              </label>
              <button
                onClick={() => openExperienceModal()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                + Add Experience
              </button>
            </div>
            {experiences.length === 0 ? (
              <p className="text-sm text-gray-500">No experience added yet</p>
            ) : (
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {exp.company}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {exp.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {exp.startDate} - {exp.endDate} • {exp.location}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openExperienceModal(exp)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteExperience(exp.id!)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Education
              </label>
              <button
                onClick={() => openEducationModal()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                + Add Education
              </button>
            </div>
            {educations.length === 0 ? (
              <p className="text-sm text-gray-500">No education added yet</p>
            ) : (
              <div className="space-y-3">
                {educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {edu.institution}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {edu.qualification}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openEducationModal(edu)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEducation(edu.id!)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link
              href="/dashboard"
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </main>

      {/* Experience Modal */}
      {showExperienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingExperience ? "Edit Experience" : "Add Experience"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={expForm.company}
                  onChange={(e) =>
                    setExpForm({ ...expForm, company: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={expForm.description}
                  onChange={(e) =>
                    setExpForm({ ...expForm, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Job description and responsibilities"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={expForm.startDate}
                    onChange={(e) =>
                      setExpForm({ ...expForm, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={expForm.endDate}
                    onChange={(e) =>
                      setExpForm({ ...expForm, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={expForm.location}
                  onChange={(e) =>
                    setExpForm({ ...expForm, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="City, State or Remote"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closeExperienceModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveExperience}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {showEducationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingEducation ? "Edit Education" : "Add Education"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University/College Name *
                </label>
                <input
                  type="text"
                  value={eduForm.institution}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, institution: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="University or college name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification *
                </label>
                <select
                  value={eduForm.qualification}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, qualification: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {QUALIFICATIONS.map((qual) => (
                    <option key={qual} value={qual}>
                      {qual}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={eduForm.startDate}
                    onChange={(e) =>
                      setEduForm({ ...eduForm, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={eduForm.endDate}
                    onChange={(e) =>
                      setEduForm({ ...eduForm, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closeEducationModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEducation}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
