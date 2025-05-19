import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";

// Define the RootState type
interface RootState {
  auth: {
    token: string;
    user: string;
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  credentials: "include",
});

// Create a custom baseQuery with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If the request failed with status 401 (Unauthorized) or has an error message about token expiration
  if (result.error) {
    const status = result.error.status;
    const errorData = result.error.data as { message?: string } | undefined;
    
    if (
      status === 401 || 
      (errorData?.message && 
       (errorData.message.includes('token') || 
        errorData.message.includes('login')))
    ) {
      // Try to get a new token
      const refreshResult = await baseQuery('/refresh', api, extraOptions);
      
      if (refreshResult.data) {
        const data = refreshResult.data as { accessToken: string };
        // Store the new token
        api.dispatch(
          userLoggedIn({
            accessToken: data.accessToken,
            user: (api.getState() as RootState).auth.user,
          })
        );
        
        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
