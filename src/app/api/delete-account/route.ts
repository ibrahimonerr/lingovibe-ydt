import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    try {
        const { accessToken } = await req.json();

        if (!accessToken || typeof accessToken !== 'string') {
            return NextResponse.json({ error: 'Access token is required.' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json(
                { error: 'Server configuration error. Contact support.' },
                { status: 500 }
            );
        }

        // Create admin client with service role key
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        // Verify the user's access token to get their user ID
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(accessToken);

        if (userError || !user) {
            return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
        }

        // Delete the user from Supabase Auth (this will cascade if DB policies are set up)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

        if (deleteError) {
            console.error('[Delete Account] Error deleting user:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete account. Please try again or contact support.' },
                { status: 500 }
            );
        }

        console.log(`[Delete Account] Successfully deleted user: ${user.id}`);
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[Delete Account] Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
