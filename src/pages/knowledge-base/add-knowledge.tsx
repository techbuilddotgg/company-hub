import React from 'react';
import {
  KnowledgeForm,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  UploadKnowledgeForm,
} from '@components';
import Head from 'next/head';

const AddKnowledge = () => {
  return (
    <>
      <Head>
        <title>Add knowledge</title>
      </Head>
      <div className={'mb-8 flex w-full flex-col gap-8'}>
        <PageHeader
          title={'Add knowledge'}
          description={
            'Add data or upload files to the knowledge base. This will help other users to find the information they need.'
          }
        />
        <div className={'flex w-full flex-col'}>
          <Tabs
            defaultValue="add"
            className="w-full sm:w-full md:w-full lg:w-2/3"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add">Add</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>Add knowledge</CardTitle>
                  <CardDescription>
                    Add data this will help other users to find the information
                    they need.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KnowledgeForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Add knowledge</CardTitle>
                  <CardDescription>
                    Add upload files to the knowledge base. This will help other
                    users to find the information they need.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadKnowledgeForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AddKnowledge;
