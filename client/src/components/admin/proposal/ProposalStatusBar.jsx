import React from 'react';
import {
  Download,
  Share2,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
} from 'lucide-react';

const ProposalStatusBar = ({ status, onExport, onShare }) => {
  const statusStyles = {
    draft: {
      icon: Clock,
      color: 'text-neutral-text-secondary',
      bg: 'bg-neutral-bg',
      label: 'Draft',
    },
    sent: {
      icon: Send,
      color: 'text-primary',
      bg: 'bg-primary/10',
      label: 'Sent',
    },
    accepted: {
      icon: CheckCircle2,
      color: 'text-status-success',
      bg: 'bg-status-success/10',
      label: 'Accepted',
    },
    declined: {
      icon: XCircle,
      color: 'text-status-error',
      bg: 'bg-status-error/10',
      label: 'Declined',
    },
  };

  const StatusIcon = statusStyles[status].icon;

  return (
    <div className="w-64 border-l border-neutral-border bg-neutral-surface p-4">
      <div className="space-y-6">
        {/* Status */}
        <div>
          <h3 className="text-sm font-medium text-neutral-text-secondary mb-3">
            Status
          </h3>
          <div className={`flex items-center px-3 py-2 rounded-lg ${statusStyles[status].bg}`}>
            <StatusIcon className={`h-5 w-5 mr-2 ${statusStyles[status].color}`} />
            <span className={`text-sm font-medium ${statusStyles[status].color}`}>
              {statusStyles[status].label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div>
          <h3 className="text-sm font-medium text-neutral-text-secondary mb-3">
            Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => onExport('pdf')}
              className="w-full flex items-center px-3 py-2 rounded-lg text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary transition-colors"
            >
              <Download className="h-5 w-5 mr-3" />
              Export as PDF
            </button>
            <button
              onClick={() => onShare('whatsapp')}
              className="w-full flex items-center px-3 py-2 rounded-lg text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary transition-colors"
            >
              <Share2 className="h-5 w-5 mr-3" />
              Share via WhatsApp
            </button>
            <button
              onClick={() => onShare('email')}
              className="w-full flex items-center px-3 py-2 rounded-lg text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary transition-colors"
            >
              <Send className="h-5 w-5 mr-3" />
              Send via Email
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-medium text-neutral-text-secondary mb-3">
            Notes
          </h3>
          <textarea
            placeholder="Add notes about this proposal..."
            className="w-full h-32 px-3 py-2 rounded-lg border border-neutral-border bg-neutral-bg placeholder-neutral-text-secondary focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalStatusBar;