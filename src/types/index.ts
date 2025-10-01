export interface MemberResponse {
  id: number;
  email: string;
}

export interface ReviewResponse {
  id: number;
  company: string;
  certificates: string[];
  age: number;
  seekPeriod: string;
  tip: string;
}

export interface UpdateReviewRequest {
  certificates: string[];
  age: number;
  seekPeriod: string;
  tip: string;
}

export interface CreateReviewRequest {
  company: string;
  certificates: string[];
  age: number;
  seekPeriod: string;
  tip: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginJoinRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthContextType {
  user: MemberResponse | null;
  token: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: LoginJoinRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PagedReviewResponse {
  content: ReviewResponse[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  number: number;
  sort: Sort;
  size: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
