import { useSelector } from 'react-redux';

const useUser = () => {
  const user = useSelector(state => state.login.user);

  return user;
};

export default useUser;
