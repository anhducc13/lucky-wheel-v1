import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { browserRouter } from "./browserRouter";
import { firebaseAuth } from "./firebase";

const App = () => {
  const [initialAuth, setInitialAuth] = useState(false);
  const [user, setUser] = useState<User>();

  const handleLoginGoogle = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      prompt: "select_account",
    });
    signInWithPopup(firebaseAuth, googleAuthProvider).then(() => {
      console.log("Login success");
    });
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      }
      setInitialAuth(true);
    });
  }, []);

  useEffect(() => {
    if (initialAuth && !user) {
      handleLoginGoogle();
    }
  }, [initialAuth, user]);

  if (!user) return null;

  return <RouterProvider router={browserRouter} />;
};

export default App;
