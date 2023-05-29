import {
  Button,
  DataView,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  LoaderButton,
} from '@components';
import React, { useEffect } from 'react';
import { SettingsIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveCompanySchema } from '@shared/validators/company.schemes';
import { SaveCompanyType } from '@shared/types/company.types';
import { RouterOutput, trpc } from '@utils/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

type CompanyType = RouterOutput['company']['get'];

const SettingsDialog = () => {
  const queryClient = useQueryClient();
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const { register, setValue, handleSubmit, formState, setError, clearErrors } =
    useForm({
      resolver: zodResolver(SaveCompanySchema),
      defaultValues: {
        name: '',
        logo: null as any,
      },
    });
  const { data: company, isLoading: isCompanyLoading } =
    trpc.company.get.useQuery();

  const { mutate: updateCompany, isLoading: isUpdateCompanyLoading } =
    trpc.company.update.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries(getQueryKey(trpc.company.get));
        setDialogOpened(false);
      },
    });

  const [fileAsDataUrl, setFileAsDataUrl] = React.useState<string>();

  useEffect(() => {
    if (company) {
      setValue('name', company.name);
    }
  }, [company]);

  const onChangeLogoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearErrors('logo');
    if (e.target.files?.length !== 0 && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 15000) {
        setError('logo', {
          type: 'field',
          message: 'File size is too big',
        });
        setFileAsDataUrl(undefined);
        return;
      }
      setValue('logo', file);

      const reader = new FileReader();
      reader.onloadend = (e) => {
        setFileAsDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (updatedCompanyData: SaveCompanyType) => {
    if (company) {
      updateCompany({
        id: company.id,
        name: updatedCompanyData.name,
        logo: fileAsDataUrl,
      });
    }
  };
  return (
    <DataView<CompanyType> isLoading={isCompanyLoading} data={company}>
      {() => (
        <Dialog open={dialogOpened}>
          <SettingsIcon
            className={'h-6 w-6 cursor-pointer'}
            onClick={() => setDialogOpened(true)}
          />
          <DialogContent setDialogOpen={setDialogOpened}>
            <DialogHeader>
              <DialogTitle>Company settings</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={'flex flex-col gap-2'}
            >
              <Input
                label="Company name"
                type="text"
                {...register('name')}
                error={formState.errors.name}
              />
              <Input
                label="Company logo"
                type="file"
                error={{ ...formState.errors.logo, type: 'field' }}
                onChange={onChangeLogoInput}
              />
              {fileAsDataUrl && (
                <img className="h-[50px]  self-start" src={fileAsDataUrl} />
              )}
              <div className="mt-4 flex flex-row justify-between">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpened(false)}
                >
                  Cancel
                </Button>
                <LoaderButton isLoading={isUpdateCompanyLoading} type="submit">
                  Update
                </LoaderButton>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </DataView>
  );
};
export default SettingsDialog;
