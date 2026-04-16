import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { AboutUsAPI } from '@admin/src/api/aboutUs';
import { CategoryManagementModal } from './-CategoryManagementModal';
import type { Static } from 'elysia';
import type { AboutUsAdmin } from '@backend/src/controllers/admin/aboutUs/model';

export function CategoryPick({
  register,
  errors,
}: {
  register: UseFormRegister<Static<typeof AboutUsAdmin.Model.postBody>>;
  errors: FieldErrors<Static<typeof AboutUsAdmin.Model.postBody>>;
}) {
  const { data, isPending, error } = useQuery({
    queryKey: ['all-aboutUs-category'],
    queryFn: () => AboutUsAPI.getCategoryAll(),
  });

  return (
    <>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Kategori</legend>
        <div className="flex gap-2">
          <select
            className="select w-full"
            {...register('categoryId', {
              required: true,
              setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
            })}
          >
            {error ? (
              <option disabled>
                Gagal mengambil data, silahkan coba lagi nanti
              </option>
            ) : isPending ? (
              <option disabled>Loading...</option>
            ) : (
              <option disabled selected value={''}>
                Pilih satu
              </option>
            )}
            {data?.map((item) => (
              <option key={item.id + '_category-item'} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <CategoryManagementModal />
        </div>

        {errors.categoryId?.type === 'required' && (
          <p className="label" role="alert">
            Kategori tidak boleh kosong
          </p>
        )}
      </fieldset>
    </>
  );
}
