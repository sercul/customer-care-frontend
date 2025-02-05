'use client';

import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewAnalytics from './ReviewAnalytics';

export default function ReviewFormWrapper() {
  const [submittedReview, setSubmittedReview] = useState<any>(null);

  const handleReviewSubmit = (review: any) => {
    setSubmittedReview(review);
  };

  return (
    <>
      <ReviewForm onSuccess={handleReviewSubmit} />

      {submittedReview && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Analysis</h2>
          <ReviewAnalytics review={submittedReview} />
        </div>
      )}
    </>
  );
} 