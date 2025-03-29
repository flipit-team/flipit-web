interface Props {
    isActive: boolean;
}
export const HomeIcon = ({isActive}: Props) => {
    return (
        <svg
            width='33'
            height='32'
            viewBox='0 0 33 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={isActive ? 'fill-tab-bar-active' : 'fill-tab-bar-default'}
        >
            <path
                d='M25.2653 14.4768L17.7653 7.40059C17.7616 7.39739 17.7582 7.39395 17.755 7.39028C17.4789 7.13916 17.119 7 16.7458 7C16.3725 7 16.0127 7.13916 15.7366 7.39028L15.7263 7.40059L8.23469 14.4768C8.08187 14.6174 7.95989 14.7881 7.87646 14.9782C7.79303 15.1683 7.74997 15.3736 7.75 15.5812V24.2484C7.75 24.6462 7.90804 25.0278 8.18934 25.3091C8.47064 25.5904 8.85218 25.7484 9.25 25.7484H13.75C14.1478 25.7484 14.5294 25.5904 14.8107 25.3091C15.092 25.0278 15.25 24.6462 15.25 24.2484V19.7484H18.25V24.2484C18.25 24.6462 18.408 25.0278 18.6893 25.3091C18.9706 25.5904 19.3522 25.7484 19.75 25.7484H24.25C24.6478 25.7484 25.0294 25.5904 25.3107 25.3091C25.592 25.0278 25.75 24.6462 25.75 24.2484V15.5812C25.75 15.3736 25.707 15.1683 25.6235 14.9782C25.5401 14.7881 25.4181 14.6174 25.2653 14.4768ZM24.25 24.2484H19.75V19.7484C19.75 19.3506 19.592 18.969 19.3107 18.6877C19.0294 18.4064 18.6478 18.2484 18.25 18.2484H15.25C14.8522 18.2484 14.4706 18.4064 14.1893 18.6877C13.908 18.969 13.75 19.3506 13.75 19.7484V24.2484H9.25V15.5812L9.26031 15.5718L16.75 8.49841L24.2406 15.57L24.2509 15.5793L24.25 24.2484Z'
                fill='#005F73'
                className={isActive ? 'fill-tab-bar-active' : 'fill-tab-bar-default'}
            />
        </svg>
    );
};
