'use client';

import Image from 'next/image';
import {ArrowRightLeft, DollarSign, Gavel, CheckCircle} from 'lucide-react';
import CountdownTimer from '~/ui/landing/CountdownTimer';

const TARGET_DATE = new Date('2026-06-27T00:00:00');

const NAV_LINKS = [
    {label: 'How It Works', href: '#how-it-works'},
    {label: 'Features', href: '#features'},
    {label: 'Community', href: '#'}
];

const FEATURES = [
    {
        icons: [<ArrowRightLeft key='swap' size={24} />],
        title: 'Pure Swap',
        description: 'Swap items directly, no cash needed; just value for value in our secure exchange system.'
    },
    {
        icons: [<DollarSign key='cash' size={24} />],
        title: 'Cash Only',
        description:
            'Traditional marketplace feel with a cutting-edge security. Buy or sell items instantly with easy to use payment systems.'
    },
    {
        icons: [<ArrowRightLeft key='swap' size={24} />, <DollarSign key='cash' size={24} />],
        title: 'Cash + Swap',
        description: 'Swap your items for some cash and an additional item. Get the best value.'
    },
    {
        icons: [<Gavel key='auction' size={24} />],
        title: 'Auction',
        description: 'Host exciting live auctions for rare items and get the best value on the market.'
    }
];

const STEPS = [
    {
        title: 'List your item',
        description: 'Post your item, whether it is a fairly used bag, brand new camera.'
    },
    {
        title: 'Choose your mode of trade',
        description:
            'Decide if you want to swap, trade for some cash only or for some cash and another item, or put it up for auction.'
    },
    {
        title: 'Secure Exchange',
        description: 'Our escrow systems and verified user tags ensure every trade is secure within the app.'
    }
];

export default function LandingPage() {
    const scrollToEmail = () => {
        document.getElementById('email-section')?.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <div
            className='min-h-screen flex flex-col'
            style={{
                background:
                    'linear-gradient(196.73deg, #FFFFFF 26.38%, #C9EBF4 50.43%, #D6F0F7 57.55%, #EBEFD6 66.02%, #FFEDB5 74.49%)'
            }}
        >
            {/* Header */}
            <header className='sticky top-0 z-50 bg-primary'>
                <div className='grid-sizes flex items-center justify-between h-16'>
                    <Image
                        src='/logos/logo-transparent-cropped.png'
                        alt='Flipit'
                        width={89}
                        height={35}
                        className='h-[35px] w-[89px] xs:h-[28px] xs:w-[71px]'
                        priority
                    />
                    <nav className='hidden md:flex items-center gap-8'>
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className='font-poppins text-sm font-semibold text-white/90 hover:text-white transition-colors'
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <button
                        onClick={scrollToEmail}
                        className='bg-secondary text-white font-poppins text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-secondary/90 transition-colors'
                    >
                        Join Waitlist
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className='grid-sizes pt-12 md:pt-20 pb-10'>
                <div className='max-w-xl'>
                    <span className='inline-flex items-center border border-[#025F73] rounded-full px-4 h-[50px] font-poppins text-xl font-bold text-[#025F73] mb-6'>
                        COMING SOON 2026
                    </span>

                    <h1 className='font-poppins text-5xl font-bold text-accent-navy leading-tight mb-6'>
                        The Future Of An <span className='text-primary'>Online Marketplace</span> Is Coming.
                    </h1>

                    <p className='font-poppins text-base text-text-secondary leading-relaxed mb-8 max-w-md'>
                        A hybrid market place designed for the modern economy. Seamlessly blend Barter, Swaps and
                        Auctions in one place to get what you want and how you want it.
                    </p>

                    <div className='mb-8'>
                        <CountdownTimer targetDate={TARGET_DATE} />
                    </div>

                    <div
                        id='email-section'
                        className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg'
                    >
                        <input
                            type='email'
                            placeholder='Enter your email  address'
                            className='w-[520px] px-4 h-[86px] rounded-xl border border-[#A49E9E] bg-transparent font-poppins text-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'
                        />
                        <button className='bg-[#025F73] text-white font-poppins text-xl font-semibold px-6 h-[86px] rounded-xl hover:bg-[#025F73]/90 transition-colors whitespace-nowrap'>
                            Get Early Access
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id='features' className='grid-sizes py-16 md:py-24'>
                <div className='text-center mb-12'>
                    <h2 className='font-poppins text-4xl font-bold text-accent-navy mb-3'>
                        One Platform, Four Ways To Trade.
                    </h2>
                    <p className='font-poppins text-xl text-text-secondary'>
                        <span className='font-semibold'>Flipit</span> redefines e-commerce by giving you more than one
                        ways to trade
                    </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.title}
                            className='bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/80 card-hover-subtle'
                        >
                            <div className='flex items-center gap-2 mb-4'>
                                {feature.icons.map((icon, i) => {
                                    return (
                                        <div key={i} className='flex items-center gap-2'>
                                            {i > 0 && (
                                                <span className='font-poppins text-lg font-semibold text-primary'>
                                                    +
                                                </span>
                                            )}
                                            <div className='w-[50px] h-[50px] rounded-lg bg-[#C9EBF4] flex items-center justify-center text-primary'>
                                                {icon}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <h3 className='font-poppins text-lg font-bold text-accent-navy mb-2'>{feature.title}</h3>
                            <p className='font-poppins text-sm text-text-tertiary leading-relaxed'>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section id='how-it-works' className='grid-sizes py-16 md:py-24'>
                <div className='max-w-lg ml-auto flex flex-col gap-8'>
                    <h2 className='font-poppins text-2xl md:text-3xl font-bold text-accent-navy mb-4'>How it Works</h2>
                    {STEPS.map((step) => (
                        <div key={step.title} className='flex items-start gap-4'>
                            <div className='flex-shrink-0 mt-0.5'>
                                <CheckCircle size={24} className='text-primary-light fill-primary-light stroke-white' />
                            </div>
                            <div>
                                <h3 className='font-poppins text-base font-bold text-accent-navy mb-1'>{step.title}</h3>
                                <p className='font-poppins text-sm text-text-tertiary leading-relaxed'>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Spacer to push footer down */}
            <div className='flex-1' />

            {/* Footer */}
            <footer className='bg-primary'>
                <div className='grid-sizes flex items-center justify-between h-16'>
                    <Image
                        src='/logos/logo-transparent-cropped.png'
                        alt='Flipit'
                        width={89}
                        height={35}
                        className='h-[35px] w-[89px]'
                    />
                    <nav className='flex items-center gap-6'>
                        <a
                            href='#'
                            className='font-poppins text-lg font-medium text-white/80 hover:text-white transition-colors'
                        >
                            Privacy policy
                        </a>
                        <a
                            href='#'
                            className='font-poppins text-lg font-medium text-white/80 hover:text-white transition-colors'
                        >
                            Terms of Service
                        </a>
                        <a
                            href='#'
                            className='font-poppins text-lg font-medium text-white/80 hover:text-white transition-colors'
                        >
                            Contact
                        </a>
                    </nav>
                    <div className='flex items-center gap-4'>
                        <a
                            href='#'
                            className='text-white/80 hover:text-white transition-colors'
                            aria-label='X (Twitter)'
                        >
                            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                                <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                            </svg>
                        </a>
                        <a href='#' className='text-white/80 hover:text-white transition-colors' aria-label='Facebook'>
                            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                                <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                            </svg>
                        </a>
                        <a href='#' className='text-white/80 hover:text-white transition-colors' aria-label='Instagram'>
                            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
