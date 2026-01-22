outputSchema: z.object({
  headlines: z.array(
    z.object({
      title: z.string(),
      date: z.string(),
      url: z.string(),
      summary: z.string().optional(),
    })
  ),
  note: z.string().optional(),
}),


.map((a: any) => ({
  title: a.headline,
  date: new Date(a.datetime * 1000).toISOString().split("T")[0],
  url: a.url,
  summary: a.summary,
}))
