const FROM_ENV = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export const GA_TRACKING_ID =
  process.env.NODE_ENV === 'production' && FROM_ENV ? FROM_ENV : undefined
