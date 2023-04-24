import { checkUnauthorizedOrEmailNotVerifiedThen } from "@/util/check-unauthorized-or-email-not-verified-then";
import { getEmailName } from "@/util/get-email-name";
import { getUserProps } from "@/util/get-user-props";
import { InferGetServerSidePropsType } from "next";
import { useMemo } from "react";

export const getServerSideProps = checkUnauthorizedOrEmailNotVerifiedThen(getUserProps);

interface ShadowedBoxProps {
  children?: React.ReactNode;
}

const ShadowedBox: React.FC<ShadowedBoxProps> = ({ children }) => {
  return (
    <div
      className="
        shadow-black
        shadow-md
        p-8
        rounded-md
        w-[20vw]
        h-[20vh]
        text-2xl
        m-8
        bg-red-400
        flex
        justify-center
        items-center
        text-center
        cursor-pointer
        active:scale-90
      "
    >
      { children }
    </div>
  );
};

export default function HomePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const emailName = useMemo(() => user.email ? getEmailName(user.email) : null, [user.email]);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <div className="">
        <h1 className="text-3xl m-4">
          Welcome Home, {emailName ?? 'you'}!
        </h1>

        <h2 className="text-lg text-center text-black text-opacity-40">
          What do you feel like doing?
        </h2>
      </div>

      <div className="flex flex-row">
        <ShadowedBox>
          Add a new show
        </ShadowedBox>

        <ShadowedBox>
          Visualize or edit an existing show
        </ShadowedBox>
      </div>
    </div>
  );
}
