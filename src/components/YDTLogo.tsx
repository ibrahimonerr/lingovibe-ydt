import { Lobster } from 'next/font/google';

const lobster = Lobster({ subsets: ['latin'], weight: '400' });

interface YDTLogoProps {
    size?: 'sm' | 'md' | 'lg';
    /** 'light' for dark backgrounds, 'dark' for light backgrounds */
    theme?: 'light' | 'dark';
    showSlogan?: boolean;
}

export default function YDTLogo({ size = 'md', theme = 'dark', showSlogan = false }: YDTLogoProps) {
    const sizes = {
        sm: { main: 'text-xl', slogan: 'text-[8px]' },
        md: { main: 'text-3xl', slogan: 'text-[9px]' },
        lg: { main: 'text-5xl', slogan: 'text-[11px]' },
    };

    const sloganColor = theme === 'dark' ? 'text-slate-500' : 'text-slate-400';

    const ydtColor = theme === 'dark' ? '#312e81' : '#ffffff';

    return (
        <div className="flex flex-col items-center gap-0.5 select-none">
            <span className={`${lobster.className} ${sizes[size].main} leading-none tracking-tight`}>
                <span style={{ color: ydtColor }}>YDT</span>
                <span
                    style={{
                        background: 'linear-gradient(90deg, #f43f5e, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Hub
                </span>
            </span>
            {showSlogan && (
                <span className={`${sizes[size].slogan} font-semibold uppercase tracking-[0.18em] ${sloganColor}`}>
                    Learn Smarter. Score Higher.
                </span>
            )}
        </div>
    );
}
