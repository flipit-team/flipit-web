import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import TransactionHubV2 from '~/ui/wrappers/TransactionHubV2';
import {TransactionDTO} from '~/types/transaction';
import {API_BASE_PATH} from '~/lib/config';

interface PageProps {
    params: Promise<{id: string}>;
}

async function getTransactionData(transactionId: string, token: string): Promise<TransactionDTO | null> {
    try {
        const response = await fetch(`${API_BASE_PATH}/transactions/${transactionId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Failed to fetch transaction:', response.status, response.statusText);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching transaction:', error);
        return null;
    }
}

export default async function TransactionPage({params}: PageProps) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const transactionData = await getTransactionData(id, token);

    if (!transactionData) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <h2 className='font-poppins typo-heading-md-semibold text-text_one mb-2'>
                        Transaction Not Found
                    </h2>
                    <p className='font-poppins typo-body-md-regular text-text_four'>
                        The transaction you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <TransactionHubV2 transaction={transactionData} />
        </div>
    );
}
