import React from 'react';
import { Send, Eye, MessageSquare, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const CustomerQuotationTimeline = ({ quotation }) => {
  if (!quotation) return null;

  const events = [];

  // 1. Initial creation/sent
  events.push({
    id: 'evt_published',
    title: `Commercial Quotation ${quotation.quotationNumber} Received`,
    description: 'Initial commercial proposal published and delivered to your portal.',
    timestamp: quotation.publishedAt,
    icon: Send,
    color: 'bg-blue-500 text-white',
  });

  // 2. Change Request / Negotiation
  if (quotation.status === 'NEGOTIATION' || quotation.lastRequestedMessage) {
    events.push({
      id: 'evt_negotiation',
      title: 'Commercial Changes Requested',
      description: quotation.lastRequestedMessage || 'You submitted a change request for this quotation.',
      timestamp: quotation.negotiationRequestedAt || quotation.updatedAt,
      icon: MessageSquare,
      color: 'bg-amber-500 text-white',
    });
  }

  // 3. Version revisions
  if (quotation.version > 1) {
    events.push({
      id: 'evt_revision',
      title: `Revised Quotation Proposal (Version ${quotation.version})`,
      description: 'Your sales executive published a revised commercial proposal incorporating negotiated terms.',
      timestamp: quotation.updatedAt,
      icon: RefreshCw,
      color: 'bg-purple-500 text-white',
    });
  }

  // 4. Accepted
  if (quotation.status === 'ACCEPTED') {
    events.push({
      id: 'evt_accepted',
      title: 'Proposal Accepted',
      description: `Formally accepted by ${quotation.acceptedBy || 'Customer'}.`,
      timestamp: quotation.acceptedAt,
      icon: CheckCircle2,
      color: 'bg-emerald-500 text-white',
    });
  }

  // 5. Rejected
  if (quotation.status === 'REJECTED') {
    events.push({
      id: 'evt_rejected',
      title: 'Proposal Rejected',
      description: quotation.rejectionReason ? `Reason: "${quotation.rejectionReason}"` : 'Formally declined by customer.',
      timestamp: quotation.rejectedAt,
      icon: XCircle,
      color: 'bg-rose-500 text-white',
    });
  }

  // 6. Expired
  if (quotation.status === 'EXPIRED') {
    events.push({
      id: 'evt_expired',
      title: 'Quotation Expired',
      description: 'Proposal expired past validity date window.',
      timestamp: quotation.validUntil,
      icon: Clock,
      color: 'bg-slate-500 text-white',
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
        Customer Lifecycle Timeline
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {events.map((evt) => {
          const Icon = evt.icon;
          return (
            <div key={evt.id} className="relative flex items-start gap-4">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${evt.color} ring-4 ring-white dark:ring-slate-800 shadow-xs`}
              >
                <Icon className="w-3 h-3" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</h4>
                  {evt.timestamp && (
                    <span className="text-[10px] text-slate-400">
                      {new Date(evt.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{evt.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
