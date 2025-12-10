export default async function SecretPage({
    params,
}: {
    params: Promise<{ secretId: string }>;
}) {
    const { secretId } = await params;
    return <div>Secret Page {secretId}</div>;
}
