import React from 'react';
import Link from 'next/link';
import { AppRoute } from '@constants/app-routes';
import { trpc } from '@utils/trpc';

const Logo = () => {
  const { data: company } = trpc.company.get.useQuery();

  if (!company) return null;

  return (
    <Link href={AppRoute.HOME}>
      <a>
        {company?.logo ? (
          <img
            alt="Company logo"
            className="aspect-auto h-[60px] w-auto max-w-[180px] overflow-x-hidden"
            src={company.logo}
          />
        ) : (
          <h1 className="mb-0.5 ml-1 mr-2 text-3xl">{company.name}</h1>
        )}
      </a>
    </Link>
  );
};

export { Logo };
