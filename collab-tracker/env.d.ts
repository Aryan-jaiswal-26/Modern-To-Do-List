declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    EMAIL_SERVER_USER?: string;
    EMAIL_SERVER_PASSWORD?: string;
    EMAIL_SERVER_HOST?: string;
    EMAIL_SERVER_PORT?: string;
    MAIL_USERNAME?: string;
    MAIL_PASSWORD?: string;
    SECRET_KEY?: string;
  }
}
