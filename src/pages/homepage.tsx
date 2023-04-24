import { checkUnauthorizedOrEmailNotVerifiedThen } from "@/util/check-unauthorized-or-email-not-verified-then";
import { getEmailName } from "@/util/get-email-name";
import { getUserProps } from "@/util/get-user-props";
import { InferGetServerSidePropsType } from "next";
import { useMemo } from "react";

export const getServerSideProps = checkUnauthorizedOrEmailNotVerifiedThen(getUserProps);

export default function HomePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const emailName = useMemo(() => user.email ? getEmailName(user.email) : null, [user.email]);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-3xl">
        Welcome Home, {emailName ?? 'you'}!
      </h1>
    </div>
  );
}
