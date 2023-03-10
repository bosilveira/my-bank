import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text, Container, Spinner, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

function Wallet() {
    return (<>

<Container maxW='1200px' centerContent>



    <Card w='100%' h='600px'>
  <CardHeader>
    <Heading size='md'>
    <Breadcrumb>
        <BreadcrumbItem>
            <BreadcrumbLink href='#'>Minha Carteira</BreadcrumbLink>
        </BreadcrumbItem>

  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink href='#'>Início  <Spinner /></BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
        
         </Heading>
  </CardHeader>

  <Tabs variant='enclosed-colored'>
    <TabList>
        <Tab>Acesso Rápido</Tab>
        <Tab>Pessoas</Tab>
        <Tab>Contas</Tab>
        <Tab>Transações</Tab>
    </TabList>
  <TabPanels>
    <TabPanel>

  <CardBody>
    <Stack divider={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Summary
        </Heading>
        <Text pt='2' fontSize='sm'>
          View a summary of all your clients over the last month.
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Overview
        </Heading>
        <Text pt='2' fontSize='sm'>
          Check out the overview of your clients.
        </Text>
      </Box>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Analysis
        </Heading>
        <Text pt='2' fontSize='sm'>
          See a detailed analysis of all your business clients.
        </Text>
      </Box>
    </Stack>
  </CardBody>

  </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
  </TabPanels>
</Tabs>


</Card>



</Container>




</>        




)

}

export default Wallet;
