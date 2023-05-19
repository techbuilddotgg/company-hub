import React, { FC, useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from '@components';
import { Settings2 } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';

enum SearchOption {
  AI = 'AI',
  DEFAULT = 'DEFAULT',
}

const SearchOptions = () => {
  const [position, setPosition] = useState<SearchOption>(SearchOption.DEFAULT);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel>Search options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={(value: string) => setPosition(value as SearchOption)}
        >
          <DropdownMenuRadioItem value={SearchOption.DEFAULT}>
            Manual search
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SearchOption.AI}>
            AI search
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface KnowledgeBaseSearchProps {
  register: UseFormRegister<{ search: string }>;
}

export const KnowledgeBaseSearch: FC<KnowledgeBaseSearchProps> = ({
  register,
}) => {
  return (
    <div className={'flex flex-row gap-2'}>
      <Input
        placeholder={'What are you looking for?'}
        {...register('search')}
      />
      <SearchOptions />
    </div>
  );
};
