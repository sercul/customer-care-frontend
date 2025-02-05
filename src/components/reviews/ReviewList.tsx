'use client';

import { gql, useQuery } from '@apollo/client';
import { StarIcon, ChatBubbleLeftIcon } from '@heroicons/react/20/solid';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Loading from '../ui/Loading';

const GET_REVIEWS = gql`
  query GetReviews {
    reviews {
      id
      rating
      content
      sentiment
      status
      createdAt
      user {
        name
      }
      product {
        id
        name
      }
      responses {
        id
      }
    }
  }
`;

interface Review {
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
  };
  responses: {
    id: string;
  }[];
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

function formatDate(dateString: string): string {
  try {
    if (!dateString) return 'No date';
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

export default function ReviewList() {
  const { data, loading, error } = useQuery(GET_REVIEWS, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading && !data) return <Loading />;
  if (error) return <div>Error loading reviews: {error.message}</div>;
  if (!data?.reviews) return <div>No reviews found</div>;

  return (
    <div className="space-y-6">
      {data.reviews.map((review: Review) => (
        <Link
          key={review.id}
          href={`/reviews/${review.id}`}
          className="block bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {review.product.name}
                  </h3>
                  <div className={`text-sm font-medium ${getSentimentColor(review.sentiment)}`}>
                    {getSentimentText(review.sentiment)}
                  </div>
                </div>
                <div className="mt-1 flex items-center">
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
                  <p className="ml-2 text-sm text-gray-500">{review.rating} out of 5 stars</p>
                </div>
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">{review.content}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <p>By {review.user.name}</p>
                  <span className="mx-2">•</span>
                  <p>{formatDate(review.createdAt)}</p>
                  {review.responses.length > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        <span>{review.responses.length} response{review.responses.length !== 1 ? 's' : ''}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 