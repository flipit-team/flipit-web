import {HandCoins} from 'lucide-react';

interface Props {
    isActive: boolean;
}
export const OffersIcon = ({isActive}: Props) => {
    return (
        <HandCoins
            size={28}
            className={isActive ? 'text-tab-bar-active' : 'text-tab-bar-default'}
        />
    );
};
