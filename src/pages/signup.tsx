import { SignUp } from '@clerk/nextjs';
import { AppRoute } from '@constants/app-routes';

const SignUpPage = () => (
  <div className="flex h-5/6 items-center justify-center">
    <SignUp signInUrl={AppRoute.SIGN_IN} />
  </div>
);

export default SignUpPage;
