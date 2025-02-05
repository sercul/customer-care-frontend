'use client';

import { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';

const GET_AI_SUGGESTION = gql`
  query GetAISuggestion($reviewId: ID!) {
    getAISuggestion(reviewId: $reviewId) {
      suggestion
    }
  }
`;

const CREATE_RESPONSE = gql`
  mutation CreateResponse($input: CreateResponseInput!) {
    createResponse(input: $input) {
      id
      content
      priority
      status
      createdAt
      agent {
        name
      }
    }
  }
`;

interface ResponseFormProps {
  reviewId: string;
}

export default function ResponseForm({ reviewId }: ResponseFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const [createResponse, { loading }] = useMutation(CREATE_RESPONSE, {
    onCompleted: () => {
      setContent('');
      setError('');
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: ['GetReview'],
  });

  const [getAISuggestion] = useLazyQuery(GET_AI_SUGGESTION, {
    onCompleted: (data) => {
      setContent(data.getAISuggestion.suggestion);
      setIsLoadingSuggestion(false);
    },
    onError: (error) => {
      setError('Failed to get AI suggestion: ' + error.message);
      setIsLoadingSuggestion(false);
    },
  });

  const handleGetSuggestion = async () => {
    setIsLoadingSuggestion(true);
    getAISuggestion({ variables: { reviewId } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Response content is required');
      return;
    }

    try {
      await createResponse({
        variables: {
          input: {
            reviewId,
            content: content.trim(),
            priority: 'NORMAL'
          },
        },
      });
    } catch (err) {
      // Error is handled by onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Response</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Your Response
            </label>
            <button
              type="button"
              onClick={handleGetSuggestion}
              disabled={isLoadingSuggestion}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isLoadingSuggestion ? 'Getting suggestion...' : 'Get AI suggestion'}
            </button>
          </div>
          <textarea
            id="content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Write your response here..."
          />
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Response'}
          </button>
        </div>
      </div>
    </form>
  );
} 