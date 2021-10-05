import { DefaultLayout } from '../components/Layouts';

// eslint-disable-next-line react/prop-types
const PageTemplate = (props) => <DefaultLayout>{props.children}</DefaultLayout>;

export default PageTemplate;