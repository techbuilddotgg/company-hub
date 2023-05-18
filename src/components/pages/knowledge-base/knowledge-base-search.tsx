import React, { ChangeEvent, useState } from 'react';
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
import { Search, SearchIcon, Settings2 } from 'lucide-react';

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
          <DropdownMenuRadioItem value={'default'}>
            Manual search
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={'ai'}>AI search</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const KnowledgeBaseSearch = () => {
  return (
    <div className={'flex flex-row gap-2'}>
      <Input placeholder={'Search...'} />
      <SearchOptions />
    </div>
  );
};
