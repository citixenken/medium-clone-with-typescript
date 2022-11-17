import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Text } from "@nextui-org/react";
// import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
// import { GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";
import ArticleCard from "../../components/ArticleCard";

const MainFeed: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  //   const user = useUser();
  //   const router = useRouter();

  const [articles, setArticles] = useState<string[]>([]);

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .limit(10); //get top 10 rows from supabase client
      console.log(data);
      if (data != null) {
        setArticles(data);
      }
      if (error) throw error;
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <Text h2>Main Feed</Text>
      <Text size="$lg" css={{ my: "$8" }}>
        Check out articles from users here
      </Text>
      {/* Article Card */}
      {articles.map((article) => (
        <ArticleCard article={article} />
      ))}
    </>
  );
};

export default MainFeed;

// HANDLING IF USER LOGGED IN
// ==========================

// export const getServerSideProps = withPageAuth({ redirectTo: "/login" }); //deprecated
// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   // Create authenticated Supabase Client
//   const supabase = createServerSupabaseClient(ctx);
//   // Check if we have a session
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session)
//     return {
//       redirect: {
//         destination: "/mainFeed",
//         permanent: false,
//       },
//     };

//   return {
//     props: {
//       initialSession: session,
//       user: session.user,
//     },
//   };
// };
