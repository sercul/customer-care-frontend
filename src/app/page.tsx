import { Suspense } from 'react';
import ReviewList from '@/components/reviews/ReviewList';
import Header from '@/components/layout/Header';
import Loading from '@/components/ui/Loading';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Product Reviews
          </h1>
          <Suspense fallback={<Loading />}>
            <ReviewList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
