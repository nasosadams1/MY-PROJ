import React, { useState } from 'react';
import { FolderOpen, Star, Clock, Users, ExternalLink, Github, Play } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  timeEstimate: string;
  rating: number;
  completions: number;
  image: string;
  status: 'available' | 'completed' | 'in-progress';
}

const Projects: React.FC = () => {
  const { user } = useUser();
  const [filter, setFilter] = useState('All Projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 'todo-app',
      title: 'Todo List App',
      description: 'Build a full-featured todo application with add, edit, delete, and filter functionality.',
      difficulty: 'Beginner',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      timeEstimate: '2-3 hours',
      rating: 4.8,
      completions: 1247,
      image: 'https://images.pexels.com/photos/3584994/pexels-photo-3584994.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'available',
    },
    {
      id: 'weather-app',
      title: 'Weather Dashboard',
      description: 'Create a weather application that fetches real-time weather data from an API.',
      difficulty: 'Intermediate',
      technologies: ['React', 'API', 'CSS'],
      timeEstimate: '4-6 hours',
      rating: 4.6,
      completions: 892,
      image: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'available',
    },
    {
      id: 'portfolio-site',
      title: 'Personal Portfolio',
      description: 'Design and build your own professional portfolio website to showcase your skills.',
      difficulty: 'Beginner',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      timeEstimate: '3-4 hours',
      rating: 4.9,
      completions: 2156,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'completed',
    },
    {
      id: 'chat-app',
      title: 'Real-time Chat App',
      description: 'Build a real-time chat application with user authentication and message history.',
      difficulty: 'Advanced',
      technologies: ['React', 'Node.js', 'Socket.io'],
      timeEstimate: '8-12 hours',
      rating: 4.7,
      completions: 543,
      image: 'https://images.pexels.com/photos/5435261/pexels-photo-5435261.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'available',
    },
    {
      id: 'ecommerce-cart',
      title: 'Shopping Cart',
      description: 'Create a shopping cart system with product listing, cart management, and checkout.',
      difficulty: 'Intermediate',
      technologies: ['React', 'Context API', 'CSS'],
      timeEstimate: '5-7 hours',
      rating: 4.5,
      completions: 734,
      image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'in-progress',
    },
    {
      id: 'calculator',
      title: 'Scientific Calculator',
      description: 'Build a fully functional calculator with basic and advanced mathematical operations.',
      difficulty: 'Beginner',
      technologies: ['JavaScript', 'CSS', 'HTML'],
      timeEstimate: '2-3 hours',
      rating: 4.4,
      completions: 1823,
      image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'available',
    },
  ];

  const filters = ['All Projects', 'Beginner', 'Intermediate', 'Advanced', 'Completed', 'In Progress'];

  const filteredProjects = projects.filter(project => {
    if (filter === 'All Projects') return true;
    if (filter === 'Completed') return project.status === 'completed';
    if (filter === 'In Progress') return project.status === 'in-progress';
    return project.difficulty === filter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">Build real-world applications and strengthen your coding skills</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === filterOption
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status === 'in-progress' ? 'In Progress' : 
                   project.status === 'completed' ? 'Completed' : 'Available'}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{project.rating}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{project.timeEstimate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{project.completions.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                {project.status === 'completed' ? (
                  <button className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center justify-center space-x-1">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Project</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <Play className="w-4 h-4" />
                    <span>{project.status === 'in-progress' ? 'Continue' : 'Start Project'}</span>
                  </button>
                )}
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                  <Github className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <p className="text-gray-700 mb-6">{selectedProject.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Difficulty</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedProject.difficulty)}`}>
                    {selectedProject.difficulty}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Time Estimate</h4>
                  <p className="text-gray-600">{selectedProject.timeEstimate}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                  Start Building
                </button>
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;