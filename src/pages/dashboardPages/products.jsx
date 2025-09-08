import { Table } from '@mantine/core';

const Products = () => {
    const elements = [
    { name: "Black Jacket", description: "A warm black jacket", brand: "Brand A", createdAt: "2023-01-01" },
    { name: 'White Shirt', description: 'A plain white shirt', brand: 'Brand B', createdAt: '2023-01-02' },
    { name: 'Blue Jeans', description: 'Comfortable blue jeans', brand: 'Brand C', createdAt: '2023-01-03' },
    { name: 'Red Dress', description: 'Elegant red dress', brand: 'Brand D', createdAt: '2023-01-04' },
    { name: 'Green Sweater', description: 'Cozy green sweater', brand: 'Brand E', createdAt: '2023-01-05' },
    { name: "Black Jacket", description: "A warm black jacket", brand: "Brand A", createdAt: "2023-01-01" },
    { name: 'White Shirt', description: 'A plain white shirt', brand: 'Brand B', createdAt: '2023-01-02' },
    { name: 'Blue Jeans', description: 'Comfortable blue jeans', brand: 'Brand C', createdAt: '2023-01-03' },
    { name: 'Red Dress', description: 'Elegant red dress', brand: 'Brand D', createdAt: '2023-01-04' },
    { name: 'Green Sweater', description: 'Cozy green sweater', brand: 'Brand E', createdAt: '2023-01-05' },
  
]

     const rows = elements.map((element,i) => (
    <Table.Tr key={i}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>{element.brand}</Table.Td>
      <Table.Td>{element.createdAt}</Table.Td>
      
    </Table.Tr>
  ));
  return(
    <div className="p-5 bg-white rounded-lg shadow-md">
        <div><p className="font-bold text-purple-500 text-lg">Products</p>
        <p className="text-sm text-gray-500">There are 2 products</p></div>

        <div>
             <Table.ScrollContainer minWidth={500} type="native">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Brand</Table.Th>
            <Table.Th>CreatedAt</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
        </div>
    </div>

  );
};

export default Products;