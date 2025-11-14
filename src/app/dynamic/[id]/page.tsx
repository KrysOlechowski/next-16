export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h3>{id}</h3>
      <div>Dynamic</div>
    </div>
  );
}
