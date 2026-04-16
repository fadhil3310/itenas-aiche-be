import { Edit } from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';
import { Controller, type Control } from 'react-hook-form';
import type { Static } from 'elysia';
import type { NewsAdminModel } from '@backend/src/controllers/admin/news/model';

export function ImagePick({
  control,
  value,
}: {
  control: Control<Static<typeof NewsAdminModel.Model.postBody>>;
  value: File;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileUrl = useMemo(() => {
    if (value == null) return '';
    return URL.createObjectURL(value);
  }, [value]);

  const handlePickFile = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  return (
    <div className="w-full h-75 relative border border-neutral rounded-lg">
      {value == null ? (
        <div className="w-full h-full grid place-items-center">
          <p className="opacity-50 cursor-default">Pilih gambar</p>
        </div>
      ) : (
        <>
          <img className="w-full h-full object-cover" src={fileUrl} />
          <p className="absolute left-2 bottom-2 px-1.5 mr-20 bg-warning/90 text-black text-xs rounded-md">
            Ukuran foto tidak tetap, dapat berubah sesuai ukuran perangkat
          </p>
        </>
      )}

      <button
        type="button"
        className="absolute right-0 bottom-0 btn btn-accent"
        onClick={handlePickFile}
      >
        <Edit width={16} />
      </button>

      <Controller
        name="image"
        control={control}
        render={({ field: { onChange, value, ref, ...field } }) => (
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp, image/avif"
            ref={(e) => {
              ref(e);
              fileInputRef.current = e;
            }}
            {...field}
            onChange={(e) => onChange(e.target.files?.[0])}
          />
        )}
      />
    </div>
  );
}
