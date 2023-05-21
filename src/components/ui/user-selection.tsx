import React, { FC, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Checkbox,
  Input,
  LoadingSpinner,
  ScrollArea,
} from '@components';
import { trpc } from '@utils/trpc';
import { useForm } from 'react-hook-form';
import { User } from '@clerk/backend';

interface UserSelectionProps {
  selected: string[];
  handleCheckedChange: (checked: boolean, user: string) => void;
}

const UserSelection: FC<UserSelectionProps> = ({
  selected,
  handleCheckedChange,
}) => {
  const { data: users } = trpc.users.findAll.useQuery();
  const [list, setList] = React.useState<User[] | undefined>([]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const search = (searchQuery: string) => {
    if (searchQuery === '') return setList(users);
    const result = users?.filter((user) =>
      user?.emailAddresses[0]?.emailAddress
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
    setList(result);
  };

  useEffect(() => {
    setList(users);
  }, [users]);

  return (
    <form onChange={handleSubmit((data) => search(data.search))}>
      <Accordion type="single" collapsible>
        <AccordionItem value={'item-2'}>
          <AccordionTrigger className={'text-base font-semibold'}>
            Add users
          </AccordionTrigger>
          <AccordionContent className={'px-1'}>
            <Input
              info={'Search for user'}
              className={'mb-2'}
              {...register('search')}
            />
            <ScrollArea className="h-44 rounded-md border">
              {list ? (
                list.map((user, index) => (
                  <div key={index}>
                    {user?.emailAddresses[0]?.emailAddress && (
                      <div className="overflow-auto px-2 py-1">
                        <div className="items-top my-2 flex space-x-2">
                          <Checkbox
                            id={user?.emailAddresses[0]?.emailAddress}
                            checked={selected.includes(
                              user?.emailAddresses[0]?.emailAddress,
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckedChange(
                                checked as boolean,
                                user?.emailAddresses[0]?.emailAddress as string,
                              )
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {user?.emailAddresses[0]?.emailAddress}
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={'flex h-44 items-center justify-center'}>
                  <LoadingSpinner />
                </div>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </form>
  );
};

export { UserSelection };
