import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isProjectDetail = location.pathname.includes('/projects/') && location.pathname !== '/projects';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Flame" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Campfire Projects</h1>
            </div>

            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() => navigate('/')}
                className="hover:text-primary-600 transition-colors duration-150"
              >
                Projects
              </button>
              {isProjectDetail && (
                <>
                  <ApperIcon name="ChevronRight" className="w-4 h-4" />
                  <span className="text-gray-900">Project Details</span>
                </>
              )}
            </nav>
          </div>

          {/* Back Button for Mobile */}
          {isProjectDetail && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="sm:hidden"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;