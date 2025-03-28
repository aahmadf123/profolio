const getEnvVar = (name: string): string => {
  if (typeof window !== 'undefined') {
    // Client-side
    return (window as any).__ENV__?.[name] || '';
  }
  // Server-side
  return process.env[name] || '';
}

// Required environment variables
export const SUPABASE_URL = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
export const SUPABASE_ANON_KEY = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Optional Redis configuration (need either Upstash or KV, not both)
export const UPSTASH_REDIS_REST_URL = getEnvVar('UPSTASH_REDIS_REST_URL')
export const UPSTASH_REDIS_REST_TOKEN = getEnvVar('UPSTASH_REDIS_REST_TOKEN')
export const KV_REST_API_URL = getEnvVar('KV_REST_API_URL')
export const KV_REST_API_TOKEN = getEnvVar('KV_REST_API_TOKEN')

// Helper function to check if Redis is configured
export const hasRedisConfig = (): boolean => {
  const hasUpstash = !!(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN)
  const hasKV = !!(KV_REST_API_URL && KV_REST_API_TOKEN)
  return hasUpstash || hasKV
}

// Export environment configuration
export const env = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  hasRedisConfig: hasRedisConfig(),
  redisType: hasRedisConfig() 
    ? (UPSTASH_REDIS_REST_URL ? 'upstash' : 'vercel-kv') 
    : null
} as const 
