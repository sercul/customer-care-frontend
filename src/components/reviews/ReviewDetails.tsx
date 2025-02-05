'use client';

import { StarIcon } from '@heroicons/react/20/solid';
import { format, parseISO } from 'date-fns';

interface Response {
  id: string;
  content: string;
  priority: string;
  status: string;
  createdAt: string;
  agent: {
    name: string;
  };
}

interface ReviewDetailsProps {
  review: {
    id: string;
    rating: number;
    content: string;
    sentiment: number;
    status: string;
    createdAt: string;
    user: {
      name: string;
    };
    product: {
      id: string;
      name: string;
      image: string | null;
    };
    responses: Response[];
  };
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getSentimentColor(sentiment: number): string {
  if (sentiment >= 0.5) return 'text-green-600';
  if (sentiment <= -0.5) return 'text-red-600';
  return 'text-yellow-600';
}

function getSentimentText(sentiment: number): string {
  if (sentiment >= 0.5) return 'Positive';
  if (sentiment <= -0.5) return 'Negative';
  return 'Neutral';
}

function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-red-600';
    case 'normal':
      return 'text-blue-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

function formatDate(dateString: string, includeTime: boolean = false): string {
  try {
    if (!dateString) return 'No date';
    const date = parseISO(dateString);
    return format(date, includeTime ? 'MMM d, yyyy h:mm a' : 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

export default function ReviewDetails({ review }: ReviewDetailsProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      {/* Product and Review Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{review.product.name}</h2>
          <p className="text-sm text-gray-500">Reviewed by {review.user.name}</p>
          <p className="text-sm text-gray-500">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      {/* Rating and Sentiment */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={classNames(
                    review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                    'h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-700">{review.rating} out of 5 stars</p>
          </div>
          <div className={`text-sm font-medium ${getSentimentColor(review.sentiment)}`}>
            {getSentimentText(review.sentiment)}
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="px-6 py-4 border-b border-gray-200">
        <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>
      </div>

      {/* Responses */}
      {review.responses.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Care Responses</h3>
          <div className="space-y-4">
            {review.responses.map((response) => (
              <div
                key={response.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Response from {response.agent.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(response.createdAt, true)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${getPriorityColor(response.priority)}`}>
                      {response.priority}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{response.status}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{response.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 