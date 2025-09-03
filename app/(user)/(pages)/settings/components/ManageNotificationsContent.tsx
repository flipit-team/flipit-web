'use client';
import { useState } from 'react';
import ToggleSwitch from '~/ui/common/toggle-switch/ToggleSwitch';

const ManageNotificationsContent = () => {
    const [notifications, setNotifications] = useState({
        pauseAll: false,
        emailNotifications: true,
        feedbackEmails: true,
        reminderEmails: true,
        newsletterEmails: false,
        smsNotifications: true,
        flipitWebNotifications: true
    });

    const handleToggleChange = (key: keyof typeof notifications, value: boolean) => {
        setNotifications(prev => {
            const newNotifications = { ...prev };
            
            if (key === 'emailNotifications') {
                // When email notifications is toggled
                newNotifications.emailNotifications = value;
                if (!value) {
                    // Turn off all email subcategories
                    newNotifications.feedbackEmails = false;
                    newNotifications.reminderEmails = false;
                    newNotifications.newsletterEmails = false;
                }
                // If turning on, restore previous states (they stay as they were)
            } else if (key === 'smsNotifications') {
                // When SMS notifications is toggled
                newNotifications.smsNotifications = value;
                if (!value) {
                    // Turn off all SMS subcategories
                    newNotifications.flipitWebNotifications = false;
                }
                // If turning on, restore previous states (they stay as they were)
            } else if (['feedbackEmails', 'reminderEmails', 'newsletterEmails'].includes(key)) {
                // When any email subcategory is toggled on
                newNotifications[key] = value;
                if (value && !newNotifications.emailNotifications) {
                    // Turn on main email notifications if any subcategory is turned on
                    newNotifications.emailNotifications = true;
                }
            } else if (key === 'flipitWebNotifications') {
                // When SMS subcategory is toggled on
                newNotifications[key] = value;
                if (value && !newNotifications.smsNotifications) {
                    // Turn on main SMS notifications if subcategory is turned on
                    newNotifications.smsNotifications = true;
                }
            } else {
                // For other toggles like pauseAll
                newNotifications[key] = value;
            }
            
            return newNotifications;
        });
    };

    return (
        <div>
            <h2 className='typo-heading-md-medium md:typo-heading-md-medium text-gray-900 mb-4'>Manage Notifications</h2>
            <div className='h-px bg-border_gray mb-6 md:mb-8 w-full'></div>
            
            <div className='space-y-6'>
                {/* Pause All */}
                <div className='flex items-center justify-between'>
                    <span className='typo-body-lg-medium text-gray-900'>Pause all</span>
                    <ToggleSwitch
                        id='pause-all'
                        checked={notifications.pauseAll}
                        onChange={(checked) => handleToggleChange('pauseAll', checked)}
                    />
                </div>

                {/* Email Notifications Section */}
                <div className='space-y-4'>
                    {/* Email Notifications Title with toggle */}
                    <div className='flex items-center justify-between'>
                        <span className='typo-body-lg-medium text-gray-900'>Email notifications</span>
                        <ToggleSwitch
                            id='email-notifications'
                            checked={notifications.emailNotifications}
                            onChange={(checked) => handleToggleChange('emailNotifications', checked)}
                        />
                    </div>
                    
                    {/* Email Notification Subcategories */}
                    <div className='space-y-3 ml-4'>
                        {/* Feedback emails */}
                        <div className='flex items-center justify-between'>
                            <span className='typo-body-lg-regular text-gray-900'>Feedback emails</span>
                            <ToggleSwitch
                                id='feedback-emails'
                                checked={notifications.feedbackEmails}
                                onChange={(checked) => handleToggleChange('feedbackEmails', checked)}
                            />
                        </div>

                        {/* Reminder emails */}
                        <div className='flex items-center justify-between'>
                            <span className='typo-body-lg-regular text-gray-900'>Reminder emails</span>
                            <ToggleSwitch
                                id='reminder-emails'
                                checked={notifications.reminderEmails}
                                onChange={(checked) => handleToggleChange('reminderEmails', checked)}
                            />
                        </div>

                        {/* Newsletter emails */}
                        <div className='flex items-center justify-between'>
                            <span className='typo-body-lg-regular text-gray-900'>Newsletter emails</span>
                            <ToggleSwitch
                                id='newsletter-emails'
                                checked={notifications.newsletterEmails}
                                onChange={(checked) => handleToggleChange('newsletterEmails', checked)}
                            />
                        </div>
                    </div>
                </div>

                {/* SMS Notifications Section */}
                <div className='space-y-4'>
                    {/* SMS Notifications Title with toggle */}
                    <div className='flex items-center justify-between'>
                        <span className='typo-body-lg-medium text-gray-900'>SMS notifications</span>
                        <ToggleSwitch
                            id='sms-notifications'
                            checked={notifications.smsNotifications}
                            onChange={(checked) => handleToggleChange('smsNotifications', checked)}
                        />
                    </div>
                    
                    {/* SMS Notification Subcategories */}
                    <div className='space-y-3 ml-4'>
                        {/* Flipit web notifications */}
                        <div className='flex items-center justify-between'>
                            <span className='typo-body-lg-regular text-gray-900'>Flipit web notifications</span>
                            <ToggleSwitch
                                id='flipit-web-notifications'
                                checked={notifications.flipitWebNotifications}
                                onChange={(checked) => handleToggleChange('flipitWebNotifications', checked)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageNotificationsContent;