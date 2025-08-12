import MainChats from '~/ui/wrappers/MainChats';
import {Chat} from '~/utils/interface';

const page = async () => {
    // Always provide empty data to server-side rendering
    // Client-side components will decide whether to use API data or dummy data based on debug mode
    const data: {buyer: Chat[]; seller: Chat[]} = {buyer: [], seller: []};
    
    return <MainChats chatData={data} />;
};

export default page;
