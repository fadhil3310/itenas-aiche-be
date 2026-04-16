import { Edit } from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';

const acceptedFileTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
];

export function ImagePick({
  value,
  onChange,
}: {
  value: File | null;
  onChange: (value: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileUrl = useMemo(() => {
    if (value == null) return '';
    return URL.createObjectURL(value);
  }, [value]);

  const handlePickFile = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleFileInput = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      const file = ev.target.files?.[0];
      if (file == null || !acceptedFileTypes.includes(file.type)) {
        return toast.error('Tipe gambar wajib PNG, JPG, WEBP, atau AVIF');
      }
      onChange(file);
    },
    [onChange],
  );

  return (
    <div className="w-full h-[300px] relative border border-neutral rounded-lg">
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

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInput}
        accept="image/png, image/jpeg, image/webp, image/avif"
      />
    </div>
  );
}
