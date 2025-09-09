import { Button, Table, Checkbox, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Minus, Plus, SquarePen, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const elements = [
    {id:1, name: "Black Jacket", description: "A warm black jacket", brand: "Brand A", createdAt: "2023-01-01", price:100},
    {id:2, name: 'White Shirt', description: 'A plain white shirt', brand: 'Brand B', createdAt: '2023-01-02', price:200},
    {id:3, name: 'Blue Jeans', description: 'Comfortable blue jeans', brand: 'Brand C', createdAt: '2023-01-03', price:260},
    {id:4, name: 'Red Dress', description: 'Elegant red dress', brand: 'Brand D', createdAt: '2023-01-04', price:300},
    {id:5, name: 'Green Sweater', description: 'Cozy green sweater', brand: 'Brand E', createdAt: '2023-01-05', price:150},
    {id:6, name: "Black Jacket", description: "A warm black jacket", brand: "Brand A", createdAt: "2023-01-01", price:100},
    {id:7, name: 'White Shirt', description: 'A plain white shirt', brand: 'Brand B', createdAt: '2023-01-02', price:200},
    {id:8, name: 'Blue Jeans', description: 'Comfortable blue jeans', brand: 'Brand C', createdAt: '2023-01-03', price:260},
    {id:9, name: 'Red Dress', description: 'Elegant red dress', brand: 'Brand D', createdAt: '2023-01-04', price:300},
    {id:10, name: 'Green Sweater', description: 'Cozy green sweater', brand: 'Brand E', createdAt: '2023-01-05', price:150},
  ];

  // Calculate total price whenever itemQuantities changes
  useEffect(() => {
    const total = selectedRows.reduce((sum, rowId) => {
      const item = elements.find(el => el.id === rowId);
      const quantity = itemQuantities[rowId] || 1;
      return sum + (item.price * quantity);
    }, 0);
    setTotalPrice(total);
  }, [selectedRows, itemQuantities]);

  // Function to update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  // Function to remove item from cart
  const removeFromCart = (itemId) => {
    setSelectedRows(prev => prev.filter(id => id !== itemId));
    setItemQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[itemId];
      return newQuantities;
    });
  };

  const rows = elements.map((element, i) => (
    <Table.Tr key={i} className={selectedRows.includes(element.id) ? '!bg-purple-300' : undefined}>
      <Table.Td>
        <Checkbox
          color='grape'
          aria-label="Select row"
          checked={selectedRows.includes(element.id)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, element.id]
                : selectedRows.filter((id) => id !== element.id)
            )
          }
        />
      </Table.Td>
      <Table.Td>
        <div className='flex items-center gap-2'>
           <img 
            className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded' 
           src={"https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww"}
            alt={element.name} 
          />
          {element.name}
          </div>
          </Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>{element.brand}</Table.Td>
      <Table.Td>${element.price}</Table.Td>
      <Table.Td>{element.createdAt}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <div className='flex justify-between items-center'>
        <div>
          <p className="font-bold text-purple-500 text-lg">Products</p>
          <p className="text-sm text-gray-500">There are {elements.length} products</p>
        </div>
        
        <Button 
          variant="default" 
          onClick={open}
          disabled={selectedRows.length === 0} 
          className="!bg-purple-500 disabled:!bg-purple-300 !text-white !rounded-lg !mt-3"
          >
          Add to cart ({selectedRows.length})
        </Button> 
      </div>

      <div>
        <Table.ScrollContainer minWidth={500} type="native">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th />
                <Table.Th>Product Name</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Brand</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>CreatedAt</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>

      <Drawer position="right" opened={opened} onClose={close} title="Shopping Cart">
        {selectedRows.length > 0 && selectedRows.map((rowId) => {
          const data = elements.find(el => el.id === rowId);
          return (
            <ProductItem 
              key={rowId} 
              data={data} 
              quantity={itemQuantities[rowId] || 1}
              onQuantityChange={(newQuantity) => updateQuantity(rowId, newQuantity)}
              onRemove={() => removeFromCart(rowId)}
            />
          );
        })}
        
        {selectedRows.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">Total Price:</p>
              <p className="text-lg font-bold text-purple-500">${totalPrice}</p>
            </div>
            <Link to="/dashboard/checkout"   state={{
    selectedItems: selectedRows.map((rowId) => ({
      ...elements.find((el) => el.id === rowId),
      quantity: itemQuantities[rowId] || 1,
    })),
    totalPrice,
  }}>
            <Button className='!bg-purple-500 !text-white !rounded-lg w-full'>
              Checkout (${totalPrice})
            </Button>
            </Link>
          </div>
        )}
        
        {selectedRows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Products;

export const ProductItem = ({ data, quantity, onQuantityChange, onRemove }) => {
  return (
    <div className='flex justify-between items-center border-b border-gray-300 p-3'>
      <div className='flex gap-3 items-center'>
        <Trash 
          size={15} 
          className='text-red-500 cursor-pointer hover:text-red-700' 
          onClick={onRemove}
        />
        <div className='flex gap-3 items-center'>
          <img 
            className='h-14 w-14 aspect-square object-contain bg-slate-200 rounded' 
           src={"https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww"}
            alt={data.name} 
          />
          <div>
            <p className='text-md font-semibold'>{data.name}</p>
            <p className='text-sm text-gray-500'>{data.brand}</p>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-2 bg-slate-200 p-1 rounded-md'>
        <Minus 
          size={15} 
          onClick={() => quantity > 1 && onQuantityChange(quantity - 1)} 
          className='text-white bg-purple-500 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
        />
        <p className="min-w-[20px] text-center">{quantity}</p>
        <Plus 
          size={15} 
          onClick={() => onQuantityChange(quantity + 1)} 
          className='text-white bg-purple-500 w-6 h-6 rounded-md p-1 cursor-pointer hover:bg-purple-600'
        />
      </div>
      <p className="font-semibold">${data.price * quantity}</p>
    </div>
  );
};