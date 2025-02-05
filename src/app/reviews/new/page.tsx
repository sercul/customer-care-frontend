import { Suspense } from 'react';
import ReviewFormWrapper from '@/components/reviews/ReviewFormWrapper';
import Header from '@/components/layout/Header';
import Loading from '@/components/ui/Loading';

export default function NewReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Write a Review</h1>
              <p className="mt-2 text-sm text-gray-600">
                Share your experience and get AI-powered insights and customer service response.
              </p>
            </div>

            <div className="space-y-8">
              <Suspense fallback={<Loading />}>
                <ReviewFormWrapper />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 