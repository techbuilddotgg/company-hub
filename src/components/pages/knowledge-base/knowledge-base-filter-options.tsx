import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components';
import {
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  ListFilter,
} from 'lucide-react';

export enum FilterOption {
  CREATED_AT_ASC = 'asc',
  CREATED_AT_DESC = 'desc',
}

export const KnowledgeBaseFilterOptions: FC<{
  filterOption: FilterOption;
  setFilterOption: Dispatch<SetStateAction<FilterOption>>;
}> = ({ filterOption, setFilterOption }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ListFilter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Filter options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={filterOption}
          onValueChange={(value: string) =>
            setFilterOption(value as FilterOption)
          }
        >
          <DropdownMenuRadioItem
            value={FilterOption.CREATED_AT_DESC}
            className={'flex flex-row items-center gap-2'}
          >
            <ArrowDownNarrowWide className={'h-4 w-4'} /> Newest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value={FilterOption.CREATED_AT_ASC}
            className={'flex flex-row items-center gap-2'}
          >
            <ArrowUpWideNarrow className={'h-4 w-4'} />
            Oldest first
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
