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
  Input,
  LoaderButton,
} from '@components';
import { Bot, FileSearch, Settings2 } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';

export enum SearchOption {
  AI = 'AI',
  DEFAULT = 'DEFAULT',
}

const SearchOptions: FC<{
  searchOption: SearchOption;
  setSearchOption: Dispatch<SetStateAction<SearchOption>>;
}> = ({ searchOption, setSearchOption }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Search options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={searchOption}
          onValueChange={(value: string) =>
            setSearchOption(value as SearchOption)
          }
        >
          <DropdownMenuRadioItem
            value={SearchOption.DEFAULT}
            className={'flex flex-row items-center gap-2'}
          >
            <FileSearch className={'h-4 w-4'} />
            Manual search
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value={SearchOption.AI}
            className={'flex flex-row items-center gap-2'}
          >
            <Bot className={'h-4 w-4'} /> AI search
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface KnowledgeBaseSearchProps {
  register: UseFormRegister<{
    search: string;
  }>;
  searchOption: SearchOption;
  setSearchOption: Dispatch<SetStateAction<SearchOption>>;
  handleAISearch: () => void;
  isSearching: boolean;
}

export const KnowledgeBaseSearch: FC<KnowledgeBaseSearchProps> = ({
  register,
  searchOption,
  setSearchOption,
  handleAISearch,
  isSearching,
}) => {
  return (
    <div className={'flex flex-row gap-2'}>
      {searchOption === SearchOption.DEFAULT && (
        <>
          <Input
            placeholder={'What are you looking for?'}
            {...register('search')}
          />
          <SearchOptions
            searchOption={searchOption}
            setSearchOption={setSearchOption}
          />
        </>
      )}

      {searchOption === SearchOption.AI && (
        <>
          <Input
            placeholder={'What are you looking for?'}
            {...register('search')}
          />
          <LoaderButton
            isLoading={isSearching}
            onClick={handleAISearch}
            hideLoadingText
          >
            Ask
          </LoaderButton>
          <SearchOptions
            searchOption={searchOption}
            setSearchOption={setSearchOption}
          />
        </>
      )}
    </div>
  );
};
