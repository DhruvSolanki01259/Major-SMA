import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";

import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { fetchProtectedData } from "../utils/api";

const Home = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProtectedData(getToken);
      console.log(data);
    };

    loadData();
  }, []);

  return (
    <>
      <header>
        <UserButton />
      </header>

      <SignedOut>
        <SignIn />
        <SignUp />
      </SignedOut>

      <SignedIn>
        <h1>Welcome to Dashboard 🚀</h1>
      </SignedIn>
    </>
  );
};

export default Home;
