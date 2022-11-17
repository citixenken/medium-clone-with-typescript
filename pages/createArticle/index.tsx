import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Text, Textarea, Grid, Button } from "@nextui-org/react";
// import { withPageAuth } from "@supabase/auth-helpers-nextjs"; //deprecated
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";

const CreateArticle: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const initialState = {
    title: "",
    content: "",
  };

  const [articleData, setArticleData] = useState(initialState);

  const handleChange = (e: any) => {
    setArticleData({ ...articleData, [e.target.name]: e.target.value });
  };

  const createArticle = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("articles")
        .insert([
          {
            title: articleData.title,
            content: articleData.content,
            user_email: user?.email?.toLowerCase(),
            user_id: user?.id,
          },
        ])
        .single(); //Return data as a single object instead of an array of objects.
      if (error) throw error;
      setArticleData(initialState);
      router.push("/mainFeed");
    } catch (err: any) {
      alert(err.message);
    }
  };

  console.log(articleData);

  return (
    <Grid.Container gap={1}>
      <Text h3>Title</Text>
      <Grid xs={12}>
        <Textarea
          name="title"
          aria-label="title"
          placeholder="Article Title"
          fullWidth={true}
          rows={1}
          size="xl"
          onChange={handleChange}
        />
      </Grid>

      <Text h3>Text</Text>
      <Grid xs={12}>
        <Textarea
          name="content"
          aria-label="content"
          placeholder="Article Text"
          fullWidth={true}
          rows={6}
          size="xl"
          onChange={handleChange}
        />
      </Grid>
      <Grid xs={12}>Posting as {user?.email}</Grid>
      <Button onPress={createArticle}>Create Article</Button>
    </Grid.Container>
  );
};

export default CreateArticle;

// HANDLING IF USER LOGGED IN
// ==========================

// export const getServerSideProps = withPageAuth({ redirectTo: "/login" }); //deprecated
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
