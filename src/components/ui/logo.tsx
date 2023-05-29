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
            className="h-[60px] w-auto max-w-[180px] overflow-x-hidden "
            src={company.logo}
          />
        ) : (
          <h1 className="text-3xl">{company.name}</h1>
        )}
      </a>
    </Link>
  );
};

export { Logo };
