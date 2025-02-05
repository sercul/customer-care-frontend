'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StarIcon } from '@heroicons/react/20/solid';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      category
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      role
    }
  }
`;

const SUBMIT_REVIEW = gql`
  mutation SubmitReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      content
      sentiment
      status
      product {
        name
      }
      responses {
        id
        content
        priority
      }
    }
  }
`;

interface ReviewFormData {
  productId: string;
  rating: number;
  content: string;
}

interface ReviewFormProps {
  onSuccess?: (data: any) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ReviewFormData>();
  const searchParams = useSearchParams();

  const [submitReview, { loading: submitLoading, error: submitError }] = useMutation(SUBMIT_REVIEW);
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(GET_PRODUCTS);
  const { data: userData, loading: userLoading, error: userError } = useQuery(ME_QUERY);

  // Set the pre-selected product from URL
  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      setValue('productId', productId);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ReviewFormData) => {
    try {
      console.log('Current user:', userData?.me);
      console.log('Submitting review with data:', {
        ...data,
        rating,
      });
      
      const response = await submitReview({
        variables: {
          input: {
            ...data,
            rating,
          },
        },
      });

      if (response.data) {
        reset();
        setRating(0);
        if (onSuccess) {
          onSuccess(response.data.createReview);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  if (productsLoading || userLoading) return <div className="text-center">Loading...</div>;
  if (productsError) return <div className="text-red-500">Error loading products: {productsError.message}</div>;
  if (userError) return <div className="text-red-500">Error loading user: {userError.message}</div>;

  console.log('Available products:', productsData?.products);
  console.log('Current user:', userData?.me);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700">
          Product
        </label>
        <select
          id="product"
          {...register('productId', { required: 'Please select a product' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a product</option>
          {productsData?.products.map((product: any) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.category})
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="flex items-center mt-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <StarIcon
              key={value}
              className={classNames(
                'h-8 w-8 flex-shrink-0 cursor-pointer transition-colors',
                (hoveredRating || rating) >= value
                  ? 'text-yellow-400'
                  : 'text-gray-200 hover:text-yellow-400'
              )}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(value)}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Review
        </label>
        <textarea
          id="content"
          rows={4}
          {...register('content', {
            required: 'Please enter your review',
            minLength: { value: 10, message: 'Review must be at least 10 characters' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Write your review here..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {submitError && (
        <div className="text-red-500">Error submitting review: {submitError.message}</div>
      )}

      <button
        type="submit"
        disabled={submitLoading}
        className={classNames(
          'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
          submitLoading
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        )}
      >
        {submitLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
} 