import { AboutUsAPI } from '@admin/src/api/aboutUs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';

function CreatePage({ requestList }: { requestList: () => void }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      return await AboutUsAPI.createCategory({ name });
    },
    onError: (err) => {
      toast.error(`Gagal menyimpan (${err.message})`);
      queryClient.invalidateQueries({ queryKey: ['all-aboutUs-category'] });
    },
    onSuccess: () => {
      toast.success('Kategori berhasil disimpan');
      queryClient.invalidateQueries({ queryKey: ['all-aboutUs-category'] });
      requestList();
    },
  });

  const [name, setName] = useState('');

  const handleSubmit = useCallback(() => {
    mutation.mutate({ name });
  }, [mutation.mutate, name]);

  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{ ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={requestList}
          className="btn p-0 w-10 h-7.5"
        >
          <ArrowLeft width={20} />
        </button>
        <h3 className="font-bold text-lg">Buat Kategori</h3>
      </div>

      <div className="w-full mt-4 space-y-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Nama</legend>
          <input
            type="text"
            className="input w-full"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
        </fieldset>

        <button
          type="button"
          className="w-full btn btn-primary"
          onClick={handleSubmit}
        >
          Buat
        </button>
      </div>
    </motion.div>
  );
}

function ListPage({ requestCreate }: { requestCreate: () => void }) {
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ['all-aboutUs-category'],
    queryFn: () => AboutUsAPI.getCategoryAll(),
  });

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return await AboutUsAPI.deleteCategoryById(id);
    },
    onError: (err) => {
      toast.error(`Gagal menghapus (${err.message})`);
      queryClient.invalidateQueries({ queryKey: ['all-aboutUs-category'] });
    },
    onSuccess: () => {
      toast.success('Kategori berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['all-aboutUs-category'] });
    },
  });

  const handleDeleteClick = useCallback(
    (id: number) => mutation.mutate({ id }),
    [mutation.mutate],
  );

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ ease: 'easeOut' }}
    >
      <h3 className="font-bold text-lg">Daftar Semua Kategori</h3>

      <div>
        {isPending ? (
          <p className="text-base font-medium text-center mt-4 py-8">
            Loading...
          </p>
        ) : error ? (
          <p className="text-base font-medium text-center mt-4 py-8">
            Gagal mengambil data, silahkan coba lagi nanti
          </p>
        ) : data == null || data.length == 0 ? (
          <p className="text-base font-medium text-center mt-4 py-8">
            Tidak ada kategori, silahkan buat dulu
          </p>
        ) : (
          <div className="mt-3 bg-base-200 px-4 py-1 rounded-lg">
            <AnimatePresence>
              {data?.map((item) => (
                <motion.div
                  key={item.id + '_category-list-item'}
                  className="py-2 flex items-center border-b last:border-b-0 border-neutral"
                  initial={false}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ ease: 'easeOut' }}
                  layout
                >
                  <p className="w-full text-base">{item.name}</p>
                  <button
                    type="button"
                    className="shrink-0 btn btn-error"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    Hapus
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="modal-action">
        <form method="dialog" className="w-full flex gap-2">
          {/* if there is a button in form, it will close the modal */}
          <button
            type="button"
            className="w-full shrink btn btn-accent"
            onClick={requestCreate}
          >
            Buat baru
          </button>
          <button className="w-full shrink btn">Tutup</button>
        </form>
      </div>
    </motion.div>
  );
}

export function CategoryManagementModal({}: {}) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [page, setPage] = useState('list');

  const handleOpenClick = useCallback(() => {
    modalRef?.current?.showModal();
  }, [modalRef]);

  const handleRequestCreate = useCallback(() => setPage('create'), [setPage]);
  const handleRequestList = useCallback(() => setPage('list'), [setPage]);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleOpenClick}
      >
        Kelola Kategori
      </button>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box overflow-x-hidden">
          <AnimatePresence mode="wait">
            {page == 'list' && (
              <ListPage key="listPage" requestCreate={handleRequestCreate} />
            )}
            {page == 'create' && (
              <CreatePage key="createPage" requestList={handleRequestList} />
            )}
          </AnimatePresence>
        </div>
      </dialog>
    </>
  );
}
