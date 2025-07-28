import React from "react";
import ProjectsList from "@/components/organisms/ProjectsList";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectsList />
      </div>
    </div>
  );
};

export default ProjectsPage;