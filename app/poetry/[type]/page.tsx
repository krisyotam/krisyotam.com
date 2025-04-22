import poemsData from "@/data/poems.json";
import type { Poem } from "@/utils/poems";
import PoetryTypeClient from "./PoetryTypeClient";

export async function generateStaticParams() {
  const poems = poemsData as Poem[];
  const types = Array.from(new Set(poems.map((p) => p.type)));
  return types.map((t) => ({
    type: t.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default function PoetryTypePage({ params }: { params: { type: string } }) {
  return <PoetryTypeClient type={params.type} />;
}
