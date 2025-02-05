'use client';

import { gql, useQuery } from '@apollo/client';
import Header from '@/components/layout/Header';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';
import { StarIcon, ChatBubbleLeftIcon } from '@heroicons/react/20/solid';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      category
      reviews {
        id
        sentiment
        rating
      }
    }
  }
`;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  reviews: Array<{
    id: string;
    sentiment: number;
    rating: number;
  }>;
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

function getAverageRating(reviews: Product['reviews']): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
}

export default function ProductsPage() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return <Loading />;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.products.map((product: Product) => {
              const reviewCount = product.reviews.length;
              const avgRating = getAverageRating(product.reviews);
              const avgSentiment = reviewCount > 0
                ? product.reviews.reduce((acc, review) => acc + (review.sentiment || 0), 0) / reviewCount
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                      </div>
                      <p className="text-lg font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                          <span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
                        </div>
                        {reviewCount > 0 && (
                          <>
                            <div className="flex items-center">
                              <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                              <span className="text-sm text-gray-500">{avgRating.toFixed(1)}</span>
                            </div>
                            <div className={`text-sm font-medium ${getSentimentColor(avgSentiment)}`}>
                              {getSentimentText(avgSentiment)}
                            </div>
                          </>
                        )}
                      </div>
                      <Link
                        href={`/reviews/new?productId=${product.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Write a Review
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 