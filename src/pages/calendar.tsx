import React from 'react';
import CalendarScheduler from '@components/pages/calendar/calendar-scheduler';
import { PageHeader } from '@components';
import Head from 'next/head';

const Calendar = () => {
  return (
    <>
      <Head>
        <title>Calendar</title>
      </Head>
      <div className={'overflow-x-hidden'}>
        <PageHeader title="Calendar" />
        <CalendarScheduler />
      </div>
    </>
  );
};

export default Calendar;
