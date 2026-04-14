import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { ImagePick } from './ImagePick'
import { useCallback, useRef, useState } from 'react'
import { ArticleEditor, type ArticleEditorRef } from './ArticleEditor'
import { NewsAPI } from '@admin/src/api/news'
import { useMutation } from '@tanstack/react-query'
import { OrbitProgress } from 'react-loading-indicators'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/news/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async ({
      title,
      image,
      article,
    }: {
      title: string
      image: File
      article: string
    }) => {
      return await NewsAPI.createNews({
        title,
        image,
        content: article,
        status: 'PUBLISHED',
      })
    },
    onError: (err) => {
      toast.error('Gagal menyimpan berita')
    },
    onSuccess: () => {
      toast.success("Berita berhasil disimpan")
      router.history.back()
    }
  })

  const articleEditorRef = useRef<ArticleEditorRef>(null)

  const [title, setTitle] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleSaveClick = useCallback(() => {
    if (title == '' || imageFile == null)
      return toast.error('Judul dan foto tidak boleh kosong')
    const articleValue = articleEditorRef.current!.getValue()

    mutation.mutate({ title, image: imageFile, article: articleValue })
  }, [title, imageFile, articleEditorRef])

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

        <h1 className="w-full">Buat Berita</h1>

        <button
          className="btn btn-primary"
          disabled={mutation.isPending}
          onClick={handleSaveClick}
        >
          Simpan
        </button>
      </header>
      <div className="w-full flex justify-center p-2 md:p-8">
        <main className="w-full max-w-[800px] space-y-2">
          <ImagePick value={imageFile} onChange={setImageFile} />

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Judul</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="..."
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Artikel</legend>
            <ArticleEditor ref={articleEditorRef} />
          </fieldset>
        </main>
      </div>
    </motion.div>
  )
}
