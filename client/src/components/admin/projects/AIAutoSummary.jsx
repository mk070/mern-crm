import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const mockSummary = {
  lastUpdated: new Date(),
  content: `Project is progressing well and is currently at 75% completion. Key achievements this week:

1. Completed user authentication system
2. Implemented new product catalog design
3. Optimized checkout flow

Upcoming tasks:
- Integration testing (scheduled for next week)
- Performance optimization
- Final UI polish

No major blockers identified. Team velocity remains consistent.`,
  metrics: {
    tasksCompleted: 24,
    tasksRemaining: 8,
    hoursLogged: 120,
    commitsMade: 156
  }
};

export default function AIAutoSummary({ projectId }) {
  const [summary, setSummary] = useState(mockSummary);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(mockSummary.content);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGenerateNewSummary = async () => {
    setIsGenerating(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSummary({
        ...mockSummary,
        lastUpdated: new Date()
      });
      showNotification('Summary generated successfully');
    } catch (error) {
      showNotification('Failed to generate summary', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(summary.content);
    showNotification('Summary copied to clipboard');
  };

  const handleSaveEdit = () => {
    setSummary({
      ...summary,
      content: editContent,
      lastUpdated: new Date()
    });
    setIsEditing(false);
    showNotification('Summary updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Last updated {format(summary.lastUpdated, 'MMM d, yyyy h:mm a')}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateNewSummary}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate New Summary
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Weekly Progress Summary
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyToClipboard}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Copy className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap">{summary.content}</div>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {summary.metrics.tasksCompleted}
            </div>
            <div className="text-sm text-gray-500">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {summary.metrics.tasksRemaining}
            </div>
            <div className="text-sm text-gray-500">Tasks Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {summary.metrics.hoursLogged}
            </div>
            <div className="text-sm text-gray-500">Hours Logged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary">
              {summary.metrics.commitsMade}
            </div>
            <div className="text-sm text-gray-500">Commits Made</div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={clsx(
            "fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2",
            notification.type === 'error' ? "bg-red-500 text-white" : "bg-green-500 text-white"
          )}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
          {notification.message}
        </div>
      )}
    </div>
  );
}