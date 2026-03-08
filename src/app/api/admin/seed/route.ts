import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const secret = process.env.ADMIN_SEED_TOKEN;

    // 1. Güvenlik Kontrolü: TOKEN eşleşmiyorsa hata ver
    if (!secret || token !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Arka Planda Scripti Başlat (Yanıtı beklemeden!)
    const scriptPath = path.resolve(process.cwd(), 'scripts/seed-all.ts');

    // exec asenkron çalışır, response hemen döner ama script arkada devam eder.
    const child = exec(`npx tsx ${scriptPath}`, (error, stdout, stderr) => {
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

    // Hemen yanıt dön: "İşlem başladı, arkada çalışıyor!"
    return NextResponse.json({
        message: 'Generation started in background!',
        status: 'Triggered',
        timestamp: new Date().toISOString()
    });
}
