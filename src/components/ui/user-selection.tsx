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
  author: string;
}

const UserSelection: FC<UserSelectionProps> = ({
  selected,
  handleCheckedChange,
  author,
}) => {
  const { data: users } = trpc.users.findAll.useQuery();
  const [list, setList] = React.useState<User[] | undefined>([]);
  const filtered = users?.filter((user: { id: string }) => user.id !== author);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const search = (searchQuery: string) => {
    console.log(filtered);
    if (searchQuery === '') return setList(filtered);
    const result = filtered?.filter((user: User) =>
      user?.emailAddresses[0]?.emailAddress
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
    setList(result);
  };

  useEffect(() => {
    setList(filtered);
  }, [users]);

  return (
    <div onChange={handleSubmit((data) => search(data.search))}>
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
              placeholder="Search for user"
            />
            <ScrollArea className="h-44 rounded-md border">
              {list ? (
                list.map((user, index) => (
                  <div key={index}>
                    {user.id && (
                      <div className="overflow-auto px-2 py-1">
                        <div className="items-top my-2 flex space-x-2">
                          <Checkbox
                            id={user?.emailAddresses[0]?.emailAddress}
                            checked={selected.includes(user.id)}
                            onCheckedChange={(checked) =>
                              handleCheckedChange(checked as boolean, user.id)
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
    </div>
  );
};

export { UserSelection };
