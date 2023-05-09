import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className='flex items-center justify-center h-5/6'>
    <SignIn appearance={
      {
        elements: {
          footer: 'hidden',
        }
      }
    }  path="/signin" routing="path" />
  </div>
);

export default SignInPage;