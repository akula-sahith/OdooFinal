import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Send,
  UserCheck,
  Play,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { Skeleton } from '../../../components/feedback/Skeleton/Skeleton';
import { requestEventService } from '../services/requestEventService';
import { REQUEST_EVENT_METADATA } from '../types/requestEventTypes';

/**
 * Reusable RequestTimeline Component
 * Displays real request lifecycle audit events for Customer or Salesperson interface.
 */
export const RequestTimeline = ({ requestId, isCustomer = false, refreshTrigger = 0 }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await requestEventService.getRequestEvents(requestId, isCustomer);
      setEvents(data);
    } catch (err) {
      console.error(`[RequestTimeline] Error fetching events for ${requestId}:`, err);
      setError('Unable to load timeline events.');
    } finally {
      setLoading(false);
    }
  }, [requestId, isCustomer]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, refreshTrigger]);

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'REQUEST_SUBMITTED':
        return Send;
      case 'REQUEST_ASSIGNED':
        return UserCheck;
      case 'REVIEW_STARTED':
        return Play;
      case 'CLARIFICATION_REQUESTED':
        return HelpCircle;
      case 'CUSTOMER_RESPONDED':
      case 'SALESPERSON_RESPONDED':
        return MessageSquare;
      case 'REQUIREMENT_CONFIRMED':
        return CheckCircle2;
      case 'REQUEST_CANCELLED':
      case 'REQUEST_CLOSED':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'warning':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'purple':
        return 'bg-purple-100 text-[#714B67] border-purple-300';
      case 'danger':
        return 'bg-rose-100 text-rose-700 border-rose-300';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (loading) {
    return (
      <Card variant="default" padding="lg" className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg" className="text-left space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#714B67]" />
          Request Lifecycle Timeline
        </h3>
        <span className="text-[10px] font-mono text-slate-400">ID: {requestId}</span>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-slate-400 font-medium py-4 text-center">
          No audit timeline events logged yet.
        </p>
      ) : (
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 my-2">
          {events.map((evt) => {
            const meta = REQUEST_EVENT_METADATA[evt.eventType] || {};
            const IconComp = getEventIcon(evt.eventType);
            return (
              <div key={evt.eventId} className="relative group">
                {/* Dot Icon */}
                <div
                  className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border shadow-2xs ${getVariantStyles(
                    meta.variant
                  )}`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                </div>

                {/* Event Details */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-extrabold text-slate-900">
                      {meta.label || evt.eventType}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(evt.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium">
                    Actor: <span className="font-semibold text-slate-700">{evt.actorName}</span> ({evt.actorRole})
                  </p>

                  {evt.metadata?.description && (
                    <p className="text-xs text-slate-600 font-normal leading-relaxed mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                      {evt.metadata.description}
                    </p>
                  )}
                  {evt.metadata?.question && (
                    <p className="text-xs text-amber-900 font-normal leading-relaxed mt-1 bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                      Q: {evt.metadata.question}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RequestTimeline;
