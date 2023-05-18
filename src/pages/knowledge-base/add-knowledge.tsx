import React from 'react';
import {
  AddKnowledgeForm,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  UploadKnowledgeForm,
} from '@components';

const AddKnowledge = () => {
  return (
    <div className={'flex w-full flex-col gap-8'}>
      <PageHeader
        title={'Add knowledge'}
        description={
          'Add data or upload files to the knowledge base. This will help other users to find the information they need.'
        }
      />
      <div className={'flex w-full flex-col items-center'}>
        <Tabs defaultValue="account" className="w-2/3">
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
                <AddKnowledgeForm />
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
  );
};

export default AddKnowledge;
