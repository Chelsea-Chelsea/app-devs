import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Plus, X, Users, FileText, ArrowLeft } from 'lucide-react';

const CreateProject: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [viewers, setViewers] = useState<string[]>([]);
  const [viewerInput, setViewerInput] = useState('');

  const handleAddViewer = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && viewerInput.trim() !== '') {
      e.preventDefault();
      if (!viewers.includes(viewerInput.trim())) {
        setViewers([...viewers, viewerInput.trim()]);
      }
      setViewerInput('');
    }
  };

  const removeViewer = (viewer: string) => {
    setViewers(viewers.filter(v => v !== viewer));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a backend
    // For now, we'll just navigate back to the projects list
    navigate('/projects');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/projects')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('action.createProject')}</h1>
          <p className="text-sm text-gray-500 mt-1">Set up a new project to manage related contracts.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Project Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              {t('project.title')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Alpha Collaboration Project"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            />
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              {t('project.description')}
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the purpose of this project..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-none"
            />
          </div>

          {/* Invite Viewers */}
          <div>
            <label htmlFor="viewers" className="block text-sm font-medium text-gray-700 mb-1">
              {t('project.viewers')}
            </label>
            <p className="text-xs text-gray-500 mb-2">Type an email address and press Enter to invite viewers.</p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="viewers"
                value={viewerInput}
                onChange={(e) => setViewerInput(e.target.value)}
                onKeyDown={handleAddViewer}
                placeholder="colleague@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>

            {/* Viewer Tags */}
            {viewers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {viewers.map((viewer, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {viewer}
                    <button
                      type="button"
                      onClick={() => removeViewer(viewer)}
                      className="text-indigo-400 hover:text-indigo-600 focus:outline-none"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('action.createProject')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
