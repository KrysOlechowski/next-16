import { createClient } from "@/utils/supabase/server";
// import { createClient } from "@/utils/supabase/client";
export default async function English() {
  const supabase = await createClient();
  const { data: fishki } = await supabase.from("fishki").select();
  return <pre>{JSON.stringify(fishki, null, 2)}</pre>;
}
