import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import TransactionHubV2 from '~/ui/wrappers/TransactionHubV2';
import {API_BASE_PATH} from '~/lib/config';
import {USE_MOCK, getTransaction} from '~/lib/mock-store';
import {fetchTransaction} from '~/lib/fetch-transaction';

interface PageProps {
    params: Promise<{id: string}>;
}

export default async function OrderSummaryPage({params}: PageProps) {
    const {id} = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) redirect('/login');

    const transactionData = USE_MOCK
        ? getTransaction(Number(id))
        : await fetchTransaction(id, token);

    if (!transactionData) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <h2 className='font-poppins typo-heading-md-semibold text-text_one mb-2'>Order Not Found</h2>
                    <p className='font-poppins typo-body-md-regular text-text_four'>
                        This order doesn&apos;t exist or you don&apos;t have access to it.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 xs:bg-[#FFFFF0]'>
            <TransactionHubV2 transaction={transactionData} forceCheckoutMode />
        </div>
    );
}
