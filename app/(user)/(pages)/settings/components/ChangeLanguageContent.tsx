'use client';
import { useState } from 'react';

const ChangeLanguageContent = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('english');

    const languages = [
        { id: 'english', name: 'English' },
        { id: 'yoruba', name: 'Yoruba' },
        { id: 'igbo', name: 'Igbo' },
        { id: 'hausa', name: 'Hausa' }
    ];

    const handleLanguageSelect = (languageId: string) => {
        setSelectedLanguage(languageId);
    };

    return (
        <div>
            <h2 className='text-lg md:text-xl font-medium text-gray-900 mb-4'>Change Language</h2>
            <div className='h-px bg-border_gray mb-6 md:mb-8 w-full'></div>
            
            <div className='space-y-4'>
                {languages.map((language) => (
                    <label 
                        key={language.id}
                        className='flex items-center justify-between w-full max-w-[398px] h-[53px] px-4 border border-border_gray rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
                    >
                        <span className='text-base font-medium text-gray-900'>
                            {language.name}
                        </span>
                        
                        <div className='relative'>
                            <input
                                type='radio'
                                name='language'
                                value={language.id}
                                checked={selectedLanguage === language.id}
                                onChange={() => handleLanguageSelect(language.id)}
                                className='hidden'
                            />
                            <div
                                className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-colors ${
                                    selectedLanguage === language.id 
                                        ? 'border-primary bg-primary' 
                                        : 'border-gray-400 bg-white'
                                }`}
                            >
                                {selectedLanguage === language.id && (
                                    <div className='w-2 h-2 bg-white rounded-full'></div>
                                )}
                            </div>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ChangeLanguageContent;