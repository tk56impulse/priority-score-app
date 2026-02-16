type Task = { name: string; score: number };

export async function POST(req: Request) {
  const body = await req.json();
  const tasks: Task[] = body.tasks || [];

  // スコアでソート（降順）
  const sorted = tasks.sort((a: Task, b: Task) => b.score - a.score);

  return Response.json({ sorted });
}