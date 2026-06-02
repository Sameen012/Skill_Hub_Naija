import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import api from '../../api/axios';

const API_BASE_URL = api.defaults.baseURL || 'http://localhost:5000/api';

const Resources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const { data } = await api.get('/resources');
        setResources(data);
      } catch {
        setResources([]);
      }
    };

    loadResources();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <Link
            to="/"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to Home
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resources</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Admin uploads appear here as PDF resources. Use the button above to return to the previous page.
              </p>
            </div>
          </div>

          {resources.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {resources.map((resource) => (
                <article key={resource.id} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{resource.title}</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {resource.fileName} {resource.fileSize ? `• ${Math.max(1, Math.round(resource.fileSize / 1024))} KB` : ''}
                      </p>
                    </div>
                    <a
                      href={`${API_BASE_URL}${resource.downloadUrl}`}
                      download={resource.fileName}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>

                  {resource.description && (
                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {resource.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-800">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <FileText size={28} />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">No resources uploaded yet</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Admin can upload PDF resources from the dashboard, and they will show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;