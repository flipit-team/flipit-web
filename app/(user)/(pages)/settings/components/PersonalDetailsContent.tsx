'use client';
import {useState, useEffect} from 'react';
import {Camera} from 'lucide-react';
import Image from 'next/image';
import InputBox from '~/ui/common/input-box';
import RegularButton from '~/ui/common/buttons/RegularButton';
import {UserService} from '~/services/user.service';
import {useAuth} from '~/hooks/useAuth';
import {useToast} from '~/contexts/ToastContext';
import {UpdateProfileRequest} from '~/types/api';
import Loading from '~/ui/common/loading/Loading';

const PersonalDetailsContent = () => {
    const {user} = useAuth();
    const {showSuccess, showError} = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                console.log('Fetching user profile...');

                // Always fetch from API to get the most up-to-date data
                const result = await UserService.getProfile();
                console.log('Profile API result:', result);

                if (result.data) {
                    // Handle both wrapped and unwrapped response formats
                    const userData = (result.data as any).user || result.data;
                    console.log('User data received:', userData);
                    setFirstName(userData.firstName || '');
                    setLastName(userData.lastName || '');
                    setEmail(userData.email || '');
                    setPhoneNumber(userData.phoneNumber || userData.phone || '');
                    setProfileImage(userData.avatar || null);
                    console.log('Form fields set:', {
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        phoneNumber: userData.phoneNumber || userData.phone,
                        avatar: userData.avatar
                    });
                } else if (user) {
                    // Fallback to auth user data if API call fails but we have user context
                    console.log('Falling back to auth user data:', user);
                    setFirstName(user.firstName || '');
                    setLastName(user.lastName || '');
                    setEmail(user.email || '');
                    setPhoneNumber(user.phoneNumber || user.phone || '');
                    setProfileImage(user.avatar || null);
                } else {
                    console.error('No data in profile result:', result.error);
                    showError(result.error || 'Failed to load profile data');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);

                // Try to use auth user data as fallback
                if (user) {
                    console.log('Error fetching profile, using auth user data:', user);
                    setFirstName(user.firstName || '');
                    setLastName(user.lastName || '');
                    setEmail(user.email || '');
                    setPhoneNumber(user.phoneNumber || user.phone || '');
                    setProfileImage(user.avatar || null);
                } else {
                    showError('An error occurred while loading your profile');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [showError]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Set preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);


        // Upload the image immediately
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const result = await response.json();
            console.log('Upload response:', result);
            
            if (result.key) {
                console.log('Setting uploadedImageUrl to:', result.key);
                setUploadedImageUrl(result.key);
                showSuccess('Profile image uploaded successfully!');
            } else {
                throw new Error('No key returned from upload');
            }
        } catch (error) {
            showError('Failed to upload profile image. Please try again.');
            console.error('Image upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldType: string) => {
        const value = e.target.value;
        switch (fieldType) {
            case 'firstname':
                setFirstName(value);
                break;
            case 'lastname':
                setLastName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'phonenumber':
                setPhoneNumber(value);
                break;
        }
    };

    const handleSaveChanges = async () => {
        if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
            showError('Please fill in all required fields');
            return;
        }

        try {
            setSaving(true);
            console.log('uploadedImageUrl before saving:', uploadedImageUrl);
            
            const updateData: UpdateProfileRequest = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phoneNumber.trim(),
            };

            // Add avatar URL if an image was uploaded
            if (uploadedImageUrl) {
                updateData.avatar = uploadedImageUrl;
                console.log('Adding avatar to payload:', uploadedImageUrl);
            } else {
                console.log('No uploadedImageUrl found, not adding avatar to payload');
            }
            
            console.log('Final update payload:', updateData);

            const result = await UserService.updateProfile(updateData);
            
            if (result.data) {
                showSuccess('Profile updated successfully!');
            } else {
                showError(result.error || 'Failed to update profile');
            }
        } catch (error) {
            showError('An error occurred while updating your profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h2 className='typo-heading-md-medium md:typo-heading-md-medium text-gray-900 mb-4'>Personal Details</h2>
                <div className='h-px bg-border_gray mb-6 md:mb-8 w-full'></div>
                <div className='flex items-center justify-center h-64'>
                    <Loading size='lg' text='Loading profile data...' />
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className='typo-heading-md-medium md:typo-heading-md-medium text-gray-900 mb-4'>Personal Details</h2>
            <div className='h-px bg-border_gray mb-6 md:mb-8 w-full'></div>

            <div className='flex flex-col lg:flex-row gap-8 lg:gap-16'>
                {/* Profile Image - Shows first on mobile, right side on desktop */}
                <div className='flex flex-col items-center lg:order-2'>
                    <div className='relative w-[180px] h-[180px] lg:w-[224px] lg:h-[224px] bg-background-secondary rounded-full flex items-center justify-center overflow-hidden mb-4'>
                        {profileImage ? (
                            <Image src={profileImage} alt='Profile' fill className='object-cover' />
                        ) : (
                            <Camera className='w-12 h-12 text-gray-400' />
                        )}
                    </div>

                    <div className='flex justify-center'>
                        <label htmlFor='profile-image-upload' className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className='bg-transparent border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 h-[31px] px-[40px] py-[16px] typo-button-sm flex items-center justify-center rounded-[8px]'>
                                {uploading ? 'Uploading...' : 'Select Image'}
                            </div>
                            <input
                                id='profile-image-upload'
                                type='file'
                                accept='image/*'
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className='hidden'
                            />
                        </label>
                    </div>
                </div>

                {/* Form - Shows second on mobile, left side on desktop */}
                <div className='flex-1 space-y-6 lg:order-1'>
                    <InputBox
                        label='First name'
                        name='firstname'
                        placeholder='Enter first name'
                        type='text'
                        value={firstName}
                        setValue={(e) => handleInputChange(e, 'firstname')}
                    />

                    <InputBox
                        label='Last Name'
                        name='lastname'
                        placeholder='Enter last name'
                        type='text'
                        value={lastName}
                        setValue={(e) => handleInputChange(e, 'lastname')}
                    />

                    <InputBox
                        label='Email'
                        name='email'
                        placeholder='Enter email address'
                        type='email'
                        value={email}
                        disabled={true}
                        setValue={(e) => handleInputChange(e, 'email')}
                    />

                    <InputBox
                        label='Phone Number'
                        name='phonenumber'
                        placeholder='Enter phone number'
                        type='tel'
                        value={phoneNumber}
                        setValue={(e) => handleInputChange(e, 'phonenumber')}
                    />
                    <div className='w-[167px]'>
                        <RegularButton
                            text={saving ? 'Saving...' : 'Save Changes'}
                            action={handleSaveChanges}
                            isLoading={saving}
                            disabled={saving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsContent;
