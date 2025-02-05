'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql, useApolloClient, useMutation } from '@apollo/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
}

interface AuthResponse {
  token: string;
  user: User;
}

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const client = useApolloClient();

  const [loginMutation] = useMutation<{ login: AuthResponse }>(LOGIN_MUTATION);
  const [registerMutation] = useMutation<{ register: AuthResponse }>(REGISTER_MUTATION);

  useEffect(() => {
    // Check for token and user data in localStorage on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const { data } = await loginMutation({
          variables: { email, password },
        });

        if (data?.login) {
          const { token, user } = data.login;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          
          // Wait for state to update before redirecting
          setTimeout(() => {
            router.push('/');
          }, 100);
          
          return { success: true };
        }
        return { success: false, error: 'Login failed' };
      } catch (error: any) {
        console.error('Login error:', error);
        return { 
          success: false, 
          error: error.message || 'Invalid credentials'
        };
      } finally {
        setIsLoading(false);
      }
    },
    [loginMutation, router]
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        setIsLoading(true);
        const { data } = await registerMutation({
          variables: { email, password, name },
        });

        if (data?.register) {
          const { token, user } = data.register;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          
          // Wait for state to update before redirecting
          setTimeout(() => {
            router.push('/');
          }, 100);
          
          return { success: true };
        }
        return { success: false, error: 'Registration failed' };
      } catch (error: any) {
        console.error('Registration error:', error);
        return { 
          success: false, 
          error: error.message || 'Email already exists'
        };
      } finally {
        setIsLoading(false);
      }
    },
    [registerMutation, router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    client.resetStore();
    router.push('/login');
  }, [client, router]);

  return {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };
} 