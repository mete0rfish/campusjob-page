import { LoginRequest, LoginJoinRequest, CreateReviewRequest, UpdateReviewRequest, ReviewResponse, PagedReviewResponse } from './types';

const API_BASE_URL = 'http://localhost:8080';

const loginAndGetToken = async (data: LoginRequest): Promise<string | null> => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Server error');
    throw new Error(errorData || 'Something went wrong');
  }

  const authHeader = response.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
};

const getAuthToken = () => localStorage.getItem('campusJob_token');

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Server error');
    throw new Error(errorData || 'Something went wrong');
  }
  
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response.text();
  }
};

// Auth
export const login = (data: LoginRequest): Promise<string | null> => loginAndGetToken(data);

export const createMember = (data: LoginJoinRequest) => request('/api/join', {
  method: 'POST',
  body: JSON.stringify(data),
});

// Reviews
export const getReviews = (): Promise<PagedReviewResponse> => request('/api/reviews');

export const getReview = (reviewId: number): Promise<ReviewResponse> => request(`/api/reviews/${reviewId}`);

export const createReview = async (data: CreateReviewRequest): Promise<{ data: ReviewResponse, location: string | null }> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Server error');
    throw new Error(errorData || 'Something went wrong');
  }

  const location = response.headers.get('Location');
  const responseData = await response.json();

  return { data: responseData, location };
};

export const updateReview = (reviewId: number, data: UpdateReviewRequest) => request(`/api/reviews/${reviewId}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

export const deleteReview = (reviewId: number) => request(`/api/reviews/${reviewId}`, {
  method: 'DELETE',
});
