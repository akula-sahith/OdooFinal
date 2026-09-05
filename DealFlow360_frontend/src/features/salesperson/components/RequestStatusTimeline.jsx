import React from 'react';
import { CheckCircle2, Clock, MessageSquare, Play, Send } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';

/**
 * RequestStatusTimeline Component
 * Visual milestone timeline showing real lifecycle state transitions.
 */
export const RequestStatusTimeline = ({ request }) => {
  if (!request) return null;

  const events = [];

  if (request.createdAt) {
    events.push({
      id: 'submitted',
      title: 'Request Submitted',
      description: 'Customer created and submitted procurement requirements.',
      timestamp: request.createdAt,
      icon: Send,
      variant: 'info',
    });
  }

  if (request.status === 'UNDER_REVIEW' || request.status === 'REQUIREMENT_CLARIFICATION' || request.status === 'REQUIREMENT_CONFIRMED') {
    events.push({
      id: 'review',
      title: 'Sales Review Started',
      description: `Salesperson ${request.assignedSalespersonName || 'assigned lead'} initiated requirement analysis.`,
      timestamp: request.updatedAt || request.createdAt,
      icon: Play,
      variant: 'warning',
    });
  }

  if (request.status === 'REQUIREMENT_CLARIFICATION') {
    events.push({
      id: 'clarification',
      title: 'Clarification Requested',
      description: 'Salesperson requested additional technical or commercial details from customer.',
      timestamp: request.updatedAt,
      icon: MessageSquare,
      variant: 'amber',
    });
  }

  if (request.status === 'REQUIREMENT_CONFIRMED') {
    events.push({
      id: 'confirmed',
      title: 'Requirement Confirmed',
      description: 'Specifications verified and locked. Ready for quotation creation.',
      timestamp: request.confirmedAt || request.updatedAt,
      icon: CheckCircle2,
      variant: 'success',
    });
  }

  if (request.status === 'CANCELLED') {
    events.push({
      id: 'cancelled',
      title: 'Request Cancelled',
      description: 'Requirement request was cancelled.',
      timestamp: request.updatedAt,
      icon: Clock,
      variant: 'danger',
    });
  }

  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'warning':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'danger':
        return 'bg-rose-100 text-rose-700 border-rose-300';
      default:
        return 'bg-purple-100 text-[#714B67] border-purple-300';
    }
  };

  return (
    <Card variant="default" padding="lg" className="text-left space-y-4">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#714B67]" />
        Requirement Lifecycle Timeline
      </h3>

      <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 my-2">
        {events.map((event, idx) => {
          const IconComp = event.icon;
          return (
            <div key={event.id || idx} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border shadow-2xs ${getVariantStyles(
                  event.variant
                )}`}
              >
                <IconComp className="w-3.5 h-3.5" />
              </div>

              {/* Event Details */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-slate-900">{event.title}</h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(event.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RequestStatusTimeline;
