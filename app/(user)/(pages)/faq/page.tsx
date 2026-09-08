'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {ChevronDown, ChevronUp, ChevronLeft, Search} from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface FAQSection {
    title: string;
    items: FAQItem[];
}

const FAQPage = () => {
    const router = useRouter();
    const [openItems, setOpenItems] = useState<Set<string>>(new Set(['marketplace-1']));

    const faqData: FAQSection[] = [
        {
            title: 'General Information',
            items: [
                {
                    id: 'marketplace-1',
                    question: "What is a 'marketplace'?",
                    answer: "An online marketplace is a place where people buy from people. It's like a local market, but with one difference: you can buy and sell online without even leaving a room. More than that, here you can also find a job or order services from Nigerians that are close to you. Basically, whatever you need is here. Just type it in search"
                },
                {
                    id: 'stores-1',
                    question: 'Do you have any stores?',
                    answer: "We operate as an online marketplace platform, connecting buyers and sellers directly. We don't have physical stores, but our verified sellers across Nigeria can serve you locally."
                },
                {
                    id: 'delivery-1',
                    question: 'Do you have a delivery?',
                    answer: 'Delivery options depend on individual sellers. Many of our sellers offer delivery services, and you can filter search results to find sellers who deliver to your area.'
                },
                {
                    id: 'marketplace-2',
                    question: "What is a 'marketplace'?",
                    answer: "An online marketplace is a place where people buy from people. It's like a local market, but with one difference: you can buy and sell online without even leaving a room. More than that, here you can also find a job or order services from Nigerians that are close to you. Basically, whatever you need is here. Just type it in search"
                }
            ]
        },
        {
            title: 'For Sellers',
            items: [
                {
                    id: 'ad-not-found',
                    question: "I've posted my ad but I can't find it on Flipit. Why?",
                    answer: 'Your ad might be under review for quality and safety. This usually takes 24-48 hours. Make sure your ad follows our posting guidelines and includes clear photos and descriptions.'
                },
                {
                    id: 'sell-better',
                    question: 'What can I do to sell better?',
                    answer: 'To improve your sales: use high-quality photos, write detailed descriptions, price competitively, respond quickly to messages, and maintain good customer service. Getting verified also helps build trust.'
                },
                {
                    id: 'verified-badge-seller',
                    question: "What does a 'Verified ID' badge mean, and how can I get it?",
                    answer: 'A Verified ID badge shows that a seller has confirmed their identity with us, building trust with buyers. To get verified, go to your profile settings and submit a valid government-issued ID for verification.'
                }
            ]
        },
        {
            title: 'For Buyers',
            items: [
                {
                    id: 'ad-not-found-buyer',
                    question: "I've posted my ad but I can't find it on Flipit. Why?",
                    answer: "If you're looking for an item you want to buy, use our search function instead of posting an ad. If you posted a 'wanted' ad, it might be under review or in a different category than expected."
                },
                {
                    id: 'sell-better-buyer',
                    question: 'What can I do to sell better?',
                    answer: 'As a buyer, focus on clear communication with sellers, ask relevant questions about products, and check seller ratings before making purchases. Leave honest reviews to help the community.'
                },
                {
                    id: 'verified-badge-buyer',
                    question: "What does a 'Verified ID' badge mean, and how can I get it?",
                    answer: 'A Verified ID badge indicates trusted users who have confirmed their identity. As a buyer, look for this badge when choosing sellers. You can get your own badge by verifying your ID in profile settings.'
                }
            ]
        }
    ];

    const toggleItem = (itemId: string) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(itemId)) {
            newOpenItems.delete(itemId);
        } else {
            newOpenItems.add(itemId);
        }
        setOpenItems(newOpenItems);
    };

    return (
        <div className='w-full max-w-[672px] mx-auto p-6 xs:px-0 xs:py-0 bg-gray-50 xs:bg-[#FFFFF0] min-h-screen xs:pb-24'>
            {/* Mobile Header */}
            <div className='hidden xs:flex items-center gap-3 mb-4 px-4 pt-4'>
                <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h1 className='font-poppins typo-heading-md-semibold text-text_one'>FAQ</h1>
            </div>

            {/* Desktop heading */}
            <h1 className='typo-heading-lg-bold text-text_one text-center mb-6 xs:hidden'>Frequently Asked Questions</h1>

            {/* Search bar */}
            <div className='max-w-[500px] mx-auto mb-8 xs:hidden'>
                <div className='relative'>
                    <input type='text' placeholder='Search FAQs' className='w-full h-[48px] px-4 pr-10 border border-border-DEFAULT rounded-lg font-poppins typo-body-md-regular outline-none focus:border-primary' />
                    <Search size={20} className='absolute right-3 top-1/2 -translate-y-1/2 text-text_four' />
                </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm xs:shadow-none xs:bg-transparent'>
                {faqData.map((section, sectionIndex) => (
                    <div key={section.title} className={sectionIndex > 0 ? 'mt-8 xs:mt-6' : ''}>
                        <div className='px-6 xs:px-4 py-4 xs:py-3 border-b border-gray-100 xs:border-b-0'>
                            <h2 className='typo-heading-md-semibold xs:typo-heading_ss text-gray-800'>{section.title}</h2>
                        </div>

                        <div className='divide-y divide-gray-100 xs:space-y-3 xs:divide-y-0 xs:px-4'>
                            {section.items.map((item) => {
                                const isOpen = openItems.has(item.id);

                                return (
                                    <div key={item.id} className='px-6 xs:px-4 py-4 xs:py-3 xs:border xs:border-gray-200 xs:rounded-xl xs:bg-white'>
                                        <button
                                            onClick={() => toggleItem(item.id)}
                                            className='w-full flex items-center justify-between text-left focus:outline-none rounded-lg p-2 -m-2 transition-colors hover:bg-gray-50 active:bg-gray-100'
                                        >
                                            <span className='text-gray-700 typo-body-md-medium xs:typo-body_mr pr-4'>{item.question}</span>
                                            {isOpen ? (
                                                <ChevronUp className='w-5 h-5 xs:w-4 xs:h-4 text-gray-400 flex-shrink-0' />
                                            ) : (
                                                <ChevronDown className='w-5 h-5 xs:w-4 xs:h-4 text-gray-400 flex-shrink-0' />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className='mt-3 xs:mt-2 pl-2'>
                                                <p className='text-gray-600 typo-body-md-regular xs:typo-body_sr leading-relaxed'>{item.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile "Ask a Question" button */}
            <div className='hidden xs:block px-4 mt-6'>
                <Link
                    href='/support'
                    className='block w-full py-3 bg-primary text-white text-center rounded-xl font-poppins typo-body_lm hover:bg-primary/90 transition-colors'
                >
                    Ask a Question
                </Link>
            </div>
        </div>
    );
};

export default FAQPage;
