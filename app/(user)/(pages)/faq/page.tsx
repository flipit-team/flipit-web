'use client';
import {useState} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';

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
        <div className='w-[672px] mx-auto p-6 bg-gray-50 min-h-screen'>
            <div className='bg-white rounded-lg shadow-sm min-w-full'>
                {faqData.map((section, sectionIndex) => (
                    <div key={section.title} className={sectionIndex > 0 ? 'mt-8' : ''}>
                        <div className='px-6 py-4 border-b border-gray-100'>
                            <h2 className='text-lg font-semibold text-gray-800'>{section.title}</h2>
                        </div>

                        <div className='divide-y divide-gray-100'>
                            {section.items.map((item) => {
                                const isOpen = openItems.has(item.id);

                                return (
                                    <div key={item.id} className='px-6 py-4'>
                                        <button
                                            onClick={() => toggleItem(item.id)}
                                            className='w-full flex items-center justify-between text-left focus:outline-none rounded-lg p-2 -m-2 transition-colors hover:bg-gray-50'
                                        >
                                            <span className='text-gray-700 font-medium text-sm'>{item.question}</span>
                                            {isOpen ? (
                                                <ChevronUp className='w-5 h-5 text-gray-400 flex-shrink-0 ml-4' />
                                            ) : (
                                                <ChevronDown className='w-5 h-5 text-gray-400 flex-shrink-0 ml-4' />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className='mt-3 pl-2'>
                                                <p className='text-gray-600 text-sm leading-relaxed'>{item.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;
