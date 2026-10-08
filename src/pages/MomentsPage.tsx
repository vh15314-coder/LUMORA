import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CurrentNeed, SavedMoment } from '../types';
import {
  BookmarkPlus,
  Trash2,
  Calendar,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export const MomentsPage: React.FC = () => {
  const { moments, addMoment, deleteMoment, clearAllMoments, setActivePage, currentNeed } = useApp();
  const [newMomentText, setNewMomentText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMomentText.trim()) return;
    addMoment(newMomentText.trim(), 'Personal Reflection');
    setNewMomentText('');
    setIsAdding(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6 relative z-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('my-world')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My World</span>
        </button>

        <span className="text-xs text-indigo-400 font-medium">Saved Moments</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Your Saved Moments</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gentle reflections, quotes, and thoughts you wanted to remember.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Moment</span>
          </button>

          {moments.length > 0 && (
            <button
              onClick={() => setConfirmClearOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Add new moment modal/drawer */}
      {isAdding && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-3"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Write a gentle reflection
          </h3>
          <textarea
            value={newMomentText}
            onChange={(e) => setNewMomentText(e.target.value)}
            placeholder="A calm thought, something you noticed, or a feeling to keep..."
            rows={3}
            className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newMomentText.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white"
            >
              Save Moment
            </button>
          </div>
        </form>
      )}

      {/* Confirmation Dialog for Clear All */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center text-center">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Clear all saved moments?</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              This will remove all {moments.length} reflections from your local sanctuary. This cannot be undone.
            </p>
            <div className="flex gap-2.5 w-full">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700"
              >
                Keep Moments
              </button>
              <button
                onClick={() => {
                  clearAllMoments();
                  setConfirmClearOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moments List */}
      <div className="flex flex-col gap-3">
        {moments.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/60">
            <BookmarkPlus className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No moments saved yet.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Whenever you share a thought in Hear Me or feel a calm moment, tap "Save as Moment" to keep it here.
            </p>
          </div>
        ) : (
          moments.map((moment) => (
            <div
              key={moment.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 shadow-sm flex flex-col justify-between transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(moment.createdAt).toLocaleDateString()}</span>
                  {moment.needTag && (
                    <>
                      <span>·</span>
                      <span className="text-indigo-400 font-medium">{moment.needTag}</span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => deleteMoment(moment.id)}
                  aria-label="Delete this moment"
                  className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-200 mt-3 font-sans leading-relaxed">
                {moment.text}
              </p>

              {moment.authorNote && (
                <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 italic">
                  {moment.authorNote}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
