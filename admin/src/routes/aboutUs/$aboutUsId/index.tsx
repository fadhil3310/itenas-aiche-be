import { AboutUsAPI } from '@admin/src/api/aboutUs'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'
import { OrbitProgress } from 'react-loading-indicators'

export const Route = createFileRoute('/aboutUs/$aboutUsId/')({
  component: RouteComponent,
})


function RouteComponent() {
  const router = useRouter()
  const { aboutUsId } = Route.useParams()

  const mutation = useMutation({
    mutationFn: async () => {
      return await AboutUsAPI.deleteById(Number.parseInt(aboutUsId))
    },
    onError: (err) => {
      toast.error(`Gagal menghapus (${err.message})`);
    },
    onSuccess: () => {
      toast.success('About Us berhasil dihapus')
      router.history.back()
    },
  })

  return (
    <motion.div
      initial={{ y: 200, scale: 0.95, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'circOut' }}
    >
      {/* Loading */}
      {mutation.isPending && (
        <div className="fixed left-0 top-0 z-50 w-screen h-screen bg-base-100/50 grid place-items-center">
          <OrbitProgress
            variant="spokes"
            color="#747474"
            size="medium"
            text=""
            textColor=""
          />
        </div>
      )}

      <header className="flex items-center gap-3 px-2 py-1 bg-base-200">
        <button className="btn" onClick={() => router.history.back()}>
          <ArrowLeft width={20} />
        </button>

        <h1 className="w-full">About Us</h1>
      </header>
      <div className="w-full flex justify-center p-2 md:p-8">
        <main className="w-full max-w-[800px] space-y-2 flex justify-center">
          <button className="btn btn-error" onClick={() => mutation.mutate()}>
            Hapus About Us
          </button>
        </main>
      </div>
    </motion.div>
  )
}
