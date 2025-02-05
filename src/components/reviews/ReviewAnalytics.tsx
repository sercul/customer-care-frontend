'use client';

import { CheckCircleIcon, ChartBarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface ReviewAnalyticsProps {
  review: {
    content: string;
    sentiment: number;
    responses: Array<{
      id: string;
      content: string;
      priority: string;
    }>;
  };
}

function getSentimentEmoji(sentiment: number): string {
  if (sentiment >= 0.5) return '😊';
  if (sentiment <= -0.5) return '😞';
  return '😐';
}

function getSentimentText(sentiment: number): string {
  if (sentiment >= 0.5) return 'Positive';
  if (sentiment <= -0.5) return 'Negative';
  return 'Neutral';
}

function getSentimentColor(sentiment: number): string {
  if (sentiment >= 0.5) return 'text-green-600';
  if (sentiment <= -0.5) return 'text-red-600';
  return 'text-yellow-600';
}

export default function ReviewAnalytics({ review }: ReviewAnalyticsProps) {
  const aiResponse = review.responses[0]?.content || 'AI response pending...';
  const sentimentScore = Math.abs(review.sentiment * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* AI Response Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-medium text-gray-900">AI Customer Service Response</h3>
        </div>
        <div className="prose prose-indigo max-w-none">
          <p className="text-gray-700">{aiResponse}</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <ChartBarIcon className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-medium text-gray-900">Review Analytics</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Sentiment Analysis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Sentiment Analysis</h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getSentimentEmoji(review.sentiment)}</span>
              <span className={`font-medium ${getSentimentColor(review.sentiment)}`}>
                {getSentimentText(review.sentiment)}
              </span>
              <span className="text-gray-500">({sentimentScore}%)</span>
            </div>
          </div>

          {/* Key Points */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Key Points</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">Sentiment score: {sentimentScore}%</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">
                  Response priority: {review.responses[0]?.priority.toLowerCase() || 'pending'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 