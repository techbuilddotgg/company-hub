import { adminProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const companyRouter = t.router({
  get: adminProcedure.query(async ({ ctx }) => {
    const company = await ctx.prisma.company.findUnique({
      where: { id: ctx.companyId },
    });
    if (!company)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Company not found',
      });
    return {
      id: company.id,
      name: company.name,
      logo: company.logo,
    };
  }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        logo: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log('input', input);
      const updatedCompany = await ctx.prisma.company.update({
        where: { id: input.id },
        data: {
          name: input.name,
          logo: input.logo || null,
        },
      });
      return {
        message: {
          title: 'Company updated',
          description: `Company ${updatedCompany.name} was updated successfully`,
        },
        data: {
          ...updatedCompany,
          logo: updatedCompany.logo?.toString().substring(0, 50),
        },
      };
    }),
});
