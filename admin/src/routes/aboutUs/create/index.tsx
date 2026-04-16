import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { ImagePick } from './-ImagePick';
import { useMutation } from '@tanstack/react-query';
import { OrbitProgress } from 'react-loading-indicators';
import toast from 'react-hot-toast';
import { AboutUsAPI } from '@admin/src/api/aboutUs';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { CategoryPick } from './-CategoryPick';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { AboutUsAdmin } from '@backend/src/controllers/admin/aboutUs/model';
import type { Static } from 'elysia';
import { t } from 'elysia';

export const Route = createFileRoute('/aboutUs/create/')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: Static<typeof AboutUsAdmin.Model.postBody>) => {
      return await AboutUsAPI.create(data);
    },
    onError: (err) => {
      toast.error(`Gagal menyimpan (${err.message})`);
    },
    onSuccess: () => {
      toast.success('About Us berhasil disimpan');
      router.history.back();
    },
  });

  // Unfortunately because Typebox (in which the schema validation used by Elysia) doesn't natively support File,
  // and react-hook-form would simply coughing to death if given a TUnsafe (t.File() under the hood) type, we have to omit "image" field.
  // One more criticism for Elysia, why the dev uses an inferior Schema Validation library when we have the majestic Zod?
  // oh its because of performance of course: https://github.com/elysiajs/elysia/issues/11
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Static<typeof AboutUsAdmin.Model.postBody>>({
    resolver: (() => {
      const FormSchema = t.Composite([
        t.Omit(AboutUsAdmin.Model.postBody, ['image']),
        t.Object({ image: t.Any() }),
      ]);
      typeboxResolver(FormSchema);
    })(),
  });
  const onSubmit: SubmitHandler<Static<typeof AboutUsAdmin.Model.postBody>> = (
    data,
  ) => {
    // Validate image manually as our schema validation can't do it.
    if (data.image == null) return toast.error('Foto tidak boleh kosong');
    mutation.mutate({ ...data });
  };

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

        <h1 className="w-full">Buat About Us</h1>

        <button
          className="btn btn-primary"
          disabled={mutation.isPending}
          onClick={handleSubmit(onSubmit)}
        >
          Simpan
        </button>
      </header>
      <div className="w-full flex justify-center p-2 md:p-8">
        <main className="w-full max-w-200 space-y-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ImagePick control={control} value={watch('image')} />

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Judul</legend>
              <input
                type="text"
                className="input w-full"
                {...register('title', { required: true })}
              />
              {errors.title && (
                <p className="label" role="alert">
                  Judul tidak boleh kosong
                </p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Isi</legend>
              <textarea
                className="w-full textarea"
                {...register('content', { required: true })}
              />
              {errors.content && (
                <p className="label" role="alert">
                  Isi tidak boleh kosong
                </p>
              )}
            </fieldset>

            <CategoryPick register={register} errors={errors} />
          </form>
        </main>
      </div>
    </motion.div>
  );
}
