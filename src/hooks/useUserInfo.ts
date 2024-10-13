import { useState, useEffect } from 'react';

export function useUserInfo() {
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkUserInfo = () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      if (!cookies.userId) {
        setShowSignupModal(true);
      } else {
        setUserInfo({
          userId: cookies.userId,
          userFirstName: cookies.userFirstName,
          userLastName: cookies.userLastName,
          userEmail: cookies.userEmail
        });
      }
    };


    checkUserInfo();
  }, []);

 
  const handleSignupClose = (newUserInfo?: Record<string, string>) => {
    if (newUserInfo) {
      setUserInfo(newUserInfo)
    }
    setShowSignupModal(false)
  }

  return { showSignupModal, userInfo, handleSignupClose };
}