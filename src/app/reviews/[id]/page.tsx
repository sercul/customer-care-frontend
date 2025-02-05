'use client';

import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Loading from '@/components/ui/Loading';
import ReviewDetails from '@/components/reviews/ReviewDetails';
import ReviewAnalytics from '@/components/reviews/ReviewAnalytics';
import ResponseForm from '@/components/reviews/ResponseForm';
import { useAuth } from '@/hooks/useAuth';

const GET_REVIEW = gql`
  query GetReview($id: ID!) {
    review(id: $id) {
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
        content
        priority
        status
        createdAt
        agent {
          name
        }
      }
    }
  }
`;

export default function ReviewPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { data, loading, error } = useQuery(GET_REVIEW, {
    variables: { id },
  });

  if (loading) return <Loading />;
  if (error) return <div>Error loading review</div>;
  if (!data?.review) return <div>Review not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <ReviewDetails review={data.review} />
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Analysis</h2>
              <ReviewAnalytics review={data.review} />
            </div>
            
            {isAuthenticated ? (
              <div className="mt-8">
                <ResponseForm reviewId={data.review.id} />
              </div>
            ) : (
              <div className="mt-8 bg-white shadow rounded-lg p-6">
                <p className="text-center text-gray-600">
                  Please <a href="/login" className="text-indigo-600 hover:text-indigo-500">sign in</a> to respond to this review.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 