'use client';
import ErrorPage from '~/ui/common/error-page';

function Error() {
    return <ErrorPage />;
}
//@ts-ignore
Error.getInitialProps = ({res, err}) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return {statusCode};
};

export default Error;
