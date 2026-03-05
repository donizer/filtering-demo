import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const Route = createFileRoute('/')({ component: App })

const schema = z.object({
  name: z.string(),
})

const getServerData = createServerFn({
  method: 'POST',
})
  .inputValidator(schema)
  .handler(async ({ data }) => {
    return `Hello, ${data.name}!`
  })

function App() {
  const getData = useServerFn(getServerData)

  const dataQuery = useQuery({
    queryKey: ['data'],
    queryFn: () => getData({ data: { name: 'TanStack' } }),
  })

  return <main className="">{dataQuery.data}</main>
}
