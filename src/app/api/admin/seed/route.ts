import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    // Read token from Authorization header instead of query string
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const secret = process.env.ADMIN_SEED_TOKEN;

    // Security: Token must match
    if (!secret || token !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run seed script in background (response returns immediately)
    const scriptPath = path.resolve(process.cwd(), 'scripts/seed-all.ts');

    exec(`npx tsx ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`[Admin Seed API] EXEC ERROR: ${error.message}`);
            return;
        }
        if (stderr) {
            console.warn(`[Admin Seed API] STDERR: ${stderr}`);
        }
        console.log(`[Admin Seed API] STDOUT: ${stdout}`);
    });

    console.log(`🚀 Admin Seed API triggered at ${new Date().toISOString()}`);

    return NextResponse.json({
        message: 'Generation started in background!',
        status: 'Triggered',
        timestamp: new Date().toISOString()
    });
}

// Keep GET for backward compatibility (e.g. browser-based manual triggers)
// but also require proper auth
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const secret = process.env.ADMIN_SEED_TOKEN;

    if (!secret || token !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scriptPath = path.resolve(process.cwd(), 'scripts/seed-all.ts');

    exec(`npx tsx ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`[Admin Seed API] EXEC ERROR: ${error.message}`);
            return;
        }
        if (stderr) {
            console.warn(`[Admin Seed API] STDERR: ${stderr}`);
        }
        console.log(`[Admin Seed API] STDOUT: ${stdout}`);
    });

    console.log(`🚀 Admin Seed API triggered (GET) at ${new Date().toISOString()}`);

    return NextResponse.json({
        message: 'Generation started in background!',
        status: 'Triggered',
        timestamp: new Date().toISOString()
    });
}
