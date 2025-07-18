import LoginForm from '../features/user/components/LoginForm';
import UserSignupForm from '../features/user/components/UserSignupForm';
import LoginSuccessPage from '../features/user/components/LoginSuccessPage';
import ClubLoginForm from '../features/club/components/ClubLoginForm';
import ClubSignupForm from '../features/club/components/ClubSignupForm';
import ClubDashboard from '../features/club/components/ClubDashboard';
import BindPartner from '../features/user/components/BindPartner';
import SlotBooking from '../features/user/components/SlotBooking';

export const getRoutes = (user, setUser, admin, setAdmin) => {
  console.log("getRoutes called with setUser type:", typeof setUser);
  const LoginFormWrapper = ({ setUser }) => {
  return <LoginForm setUser={setUser} />;
};

  return [
    {
  path: '/',
  element: <LoginFormWrapper setUser={setUser} />
}
,
    {
      path: '/userSignup',
      element: <UserSignupForm />,
    },
    {
      path: '/userSuccess',
      element: <LoginSuccessPage user={user} />,
    },
    {
      path: '/clubSignup',
      element: <ClubSignupForm />,
    },
    {
      path: '/club',
      element: <ClubLoginForm setAdmin={setAdmin} />,
    },
    {
      path: '/clubSuccess',
      element: <ClubDashboard admin={admin} />,
    },
    {
      path: '/bindPartner',
      element: <BindPartner user={user} />,
    },
    {
      path: '/slotBooking',
      element: <SlotBooking user={user} />,
    }
  ];
};
