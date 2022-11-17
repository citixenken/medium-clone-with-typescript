import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Text, Spacer, User, Button } from "@nextui-org/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";

const Article: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const [article, setArticle] = useState<any>({});

  const { id } = router.query; //allows us to access the id param in localhost:3000/article?id=2

  useEffect(() => {
    if (typeof id !== "undefined") {
      getArticle();
    }
  }, [id]); //re-run whenever id changes

  const getArticle = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .filter("id", "eq", id)
        .single();
      console.log(data);
      if (data != null) {
        setArticle(data);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const deleteArticle = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("articles")
        .delete()
        .eq("id", id);
      if (error) throw error;
      router.push("/mainFeed");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <Text h2>{article.title}</Text>
      <Spacer y={0.5} />
      <User name={article.user_email} size="xl" />
      <Spacer y={1} />
      <Text size="$xl">{article.content}</Text>
      {user && article.user_id === user.id ? ( //current owner of the article
        <>
          <Spacer y={0.5} />
          <Button
            size="md"
            color="warning"
            onPress={() => router.push("/editArticle?id=" + id)}
          >
            Edit Article
          </Button>
          <Spacer y={0.5} />
          <Button size="md" color="error" onPress={() => deleteArticle()}>
            Delete Article
          </Button>
        </>
      ) : null}
    </>
  );
};

export default Article;

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
//         destination: "/login",
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
