import { SignUp } from "@clerk/nextjs";
import { AppRoute } from "@constants/app-routes";

const SignUpPage = () => (
  <div className='flex items-center justify-center h-5/6'>
    <SignUp signInUrl={AppRoute.SIGN_IN}/>
  </div>
);

export default SignUpPage;