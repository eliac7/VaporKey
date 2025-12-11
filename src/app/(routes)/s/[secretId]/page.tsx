import SecretReveal from "@/features/secret/components/secret-reveal";
import { redis } from "@/lib/redis";
import { notFound } from "next/navigation";

export default async function SecretPage({
  params,
}: {
  params: Promise<{ secretId: string }>;
}) {
  const { secretId } = await params;
  const exists = await redis.exists(`secret:${secretId}`);

  if (!exists) {
    return notFound();
  }

  return <SecretReveal secretId={secretId} />;
}
