<?php

return [
    'url' => env('SUPABASE_URL', 'https://ipszvuhzvaslgrggydno.supabase.co'),
    'jwks_url' => env('SUPABASE_JWKS_URL', 'https://ipszvuhzvaslgrggydno.supabase.co/auth/v1/jwks'),
    'anon_key' => env('SUPABASE_ANON_KEY', 'sb_publishable_KV4ULopUqFbO0Jzz85hg5g_B_9khgBC'),
    // Service role key is optional - only needed for admin operations
    // We use public signup endpoint instead, so this is not required
    'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY', null),
];

